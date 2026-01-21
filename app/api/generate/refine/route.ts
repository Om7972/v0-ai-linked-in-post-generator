/**
 * POST /api/generate/refine
 * 
 * Refine an existing LinkedIn post
 * Requires authentication
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth"
import { refineLinkedInPost } from "@/lib/gemini"

const refineRequestSchema = z.object({
  currentPost: z.string().min(10, "Post content must be at least 10 characters"),
  refinementType: z.enum(["urgent", "example", "shorten", "custom"]),
  customInstruction: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    await requireAuth()

    // Parse and validate
    const body = await req.json()
    const validationResult = refineRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { currentPost, refinementType, customInstruction } = validationResult.data

    // Refine post
    const refinedPost = await refineLinkedInPost(
      currentPost,
      refinementType,
      customInstruction
    )

    return NextResponse.json({
      success: true,
      refinedPost,
    })
  } catch (error: any) {
    console.error("Error refining post:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to refine post",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

