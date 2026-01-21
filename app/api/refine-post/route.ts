import { NextRequest, NextResponse } from "next/server";
import { refineLinkedInPost } from "@/lib/ai-service";

export const maxDuration = 30;

interface RefineRequest {
  currentPost: string;
  refinementType: string;
  customInstruction?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { currentPost, refinementType, customInstruction }: RefineRequest = await req.json();

    if (!currentPost || currentPost.length < 10) {
      return NextResponse.json(
        { error: "Post content must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Refine post using AI service abstraction (supports Groq, Gemini, etc.)
    const refinedPost = await refineLinkedInPost(
      currentPost,
      refinementType,
      customInstruction
    );

    if (!refinedPost) {
      return NextResponse.json(
        { error: "Failed to refine post content" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      refinedPost,
    });
  } catch (error: any) {
    console.error("Error refining post:", error);

    return NextResponse.json(
      {
        error: "Failed to refine post",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
