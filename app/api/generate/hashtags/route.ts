/**
 * POST /api/generate/hashtags
 * 
 * Generate hashtags for a given post content
 * Requires authentication
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth"
import { generateHashtags } from "@/lib/gemini"

const hashtagRequestSchema = z.object({
  postContent: z.string().min(10, "Post content must be at least 10 characters"),
})

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    await requireAuth()

    // Parse and validate
    const body = await req.json()
    const validationResult = hashtagRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { postContent } = validationResult.data

    // Generate hashtags
    const hashtags = await generateHashtags(postContent)

    return NextResponse.json({
      success: true,
      hashtags,
    })
  } catch (error: any) {
    console.error("Error generating hashtags:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate hashtags",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

