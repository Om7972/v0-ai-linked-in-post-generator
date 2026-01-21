/**
 * GET /api/posts - Get user's posts
 * POST /api/posts - Create a new post (manual save)
 * DELETE /api/posts?id=... - Delete a post
 * 
 * All operations require authentication and respect RLS
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getCurrentUserProfile } from "@/lib/auth"
import { createSupabaseClientFromToken, createServerSupabaseClient } from "@/lib/supabase"

// GET - Fetch user's posts with pagination
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Get auth token from header
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null
    
    // Use service role client for admin operations, or user token for RLS
    const supabase = token 
      ? createSupabaseClientFromToken(token)
      : createServerSupabaseClient()

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit
    const tone = searchParams.get("tone")
    const search = searchParams.get("search")

    // Build query
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (tone) {
      query = query.eq("tone", tone)
    }

    if (search) {
      query = query.or(`topic.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: posts, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    return NextResponse.json({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching posts:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch posts", message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create a new post (manual save)
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Get auth token from header
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null
    
    // Use service role client for admin operations, or user token for RLS
    const supabase = token 
      ? createSupabaseClientFromToken(token)
      : createServerSupabaseClient()

    const body = await req.json()
    const { topic, tone, audience, length, content, hashtags } = body

    // Validation
    if (!content || !topic) {
      return NextResponse.json(
        { error: "Topic and content are required" },
        { status: 400 }
      )
    }

    // Calculate engagement score
    const engagementScore = calculateEngagementScore(content, hashtags || "")

    // Insert post
    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        topic,
        tone: tone || "professional",
        audience: audience || null,
        length: length || null,
        content,
        hashtags: hashtags || null,
        engagement_score: engagementScore,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save post: ${error.message}`)
    }

    return NextResponse.json(
      { success: true, post },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating post:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create post", message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a post
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Get auth token from header
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null
    
    // Use service role client for admin operations, or user token for RLS
    const supabase = token 
      ? createSupabaseClientFromToken(token)
      : createServerSupabaseClient()

    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("id")

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      )
    }

    // Delete post (RLS ensures user can only delete their own posts)
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", user.id) // Extra safety check

    if (error) {
      throw new Error(`Failed to delete post: ${error.message}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting post:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to delete post", message: error.message },
      { status: 500 }
    )
  }
}

/**
 * Calculate engagement score (same as in generate route)
 */
function calculateEngagementScore(content: string, hashtags: string): number {
  let score = 50
  const wordCount = content.split(/\s+/).length
  if (wordCount >= 150 && wordCount <= 300) score += 20
  else if (wordCount >= 100 && wordCount <= 400) score += 10

  const charCount = content.length
  if (charCount <= 3000) score += 10

  const lineBreaks = (content.match(/\n/g) || []).length
  if (lineBreaks >= 3) score += 10
  else if (lineBreaks >= 1) score += 5

  const hashtagCount = (hashtags.match(/#\w+/g) || []).length
  if (hashtagCount >= 3 && hashtagCount <= 5) score += 10

  const questionMarks = (content.match(/\?/g) || []).length
  if (questionMarks >= 1) score += 5

  const ctaWords = ["comment", "share", "thoughts", "experience", "opinion", "agree", "disagree", "let me know"]
  const hasCTA = ctaWords.some((word) => content.toLowerCase().includes(word))
  if (hasCTA) score += 5

  return Math.min(score, 100)
}
