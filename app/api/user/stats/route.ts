import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()

    // Get user profile to check plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)
    }

    // Get usage stats
    const { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // Get posts
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (postsError) {
      console.error("Posts error:", postsError)
    }

    const postsList = posts || []
    
    // Calculate stats
    const stats = {
      postsGenerated: postsList.length,
      avgEngagementScore: postsList.length > 0
        ? Math.round(postsList.reduce((sum, p) => sum + (p.engagement_score || 0), 0) / postsList.length)
        : 0,
      savedDrafts: 0, // TODO: Get from drafts table
      totalEngagements: postsList.length * 150, // Mock data
    }

    // Calculate engagement data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split("T")[0]
      const dayPosts = postsList.filter(
        (p) => p.created_at?.split("T")[0] === dateStr
      )
      return {
        date: dateStr,
        posts: dayPosts.length,
        engagement: dayPosts.length > 0
          ? Math.min(95, Math.max(60, stats.avgEngagementScore + Math.floor(Math.random() * 10) - 5))
          : 0,
      }
    })

    // Calculate tone distribution
    const toneCounts: Record<string, number> = {}
    postsList.forEach((post) => {
      const tone = post.tone || "professional"
      toneCounts[tone] = (toneCounts[tone] || 0) + 1
    })

    const toneDistribution = Object.entries(toneCounts).map(([tone, count]) => ({
      tone,
      count,
      percentage: postsList.length > 0 ? Math.round((count / postsList.length) * 100) : 0,
    }))

    // Transform posts for response
    const recentPosts = postsList.slice(0, 10).map((post) => ({
      id: post.id,
      topic: post.topic,
      tone: post.tone,
      createdAt: post.created_at,
      status: "published",
    }))

    return NextResponse.json({
      stats,
      engagementData: last7Days,
      toneDistribution,
      recentPosts,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

