import { NextRequest, NextResponse } from "next/server";
import { generateHashtags } from "@/lib/ai-service";

export const maxDuration = 30;

interface HashtagRequest {
  postContent: string;
}

export async function POST(req: NextRequest) {
  try {
    const { postContent }: HashtagRequest = await req.json();

    if (!postContent || postContent.length < 10) {
      return NextResponse.json(
        { error: "Post content must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Generate hashtags using AI service abstraction (supports Groq, Gemini, etc.)
    const hashtags = await generateHashtags(postContent);

    return NextResponse.json({
      success: true,
      hashtags,
    });
  } catch (error: any) {
    console.error("Error generating hashtags:", error);

    return NextResponse.json(
      {
        error: "Failed to generate hashtags",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
