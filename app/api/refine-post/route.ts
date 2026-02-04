import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { refineLinkedInPost } from "@/lib/ai-service";
import { VersionService } from "@/lib/services/version-service";
import { UsageService } from "@/lib/services/usage-service";

export const maxDuration = 60;

interface RefineRequest {
  currentPost: string;
  refinementType: string;
  customInstruction?: string;
  postId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPost, refinementType, customInstruction, postId }: RefineRequest = await req.json();

    if (!currentPost || currentPost.length < 10) {
      return NextResponse.json(
        { error: "Post content must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Check usage limit (refinements might count towards usage or have a separate limit, or be free)
    // For now, let's treat refinement as standard generation or maybe discount it?
    // Let's count it for simplicity and to prevent abuse.
    const usageLimit = await UsageService.checkLimit(user.id);
    if (!usageLimit.can_generate) {
      return NextResponse.json({
        error: usageLimit.reason || "Daily limit reached",
        upgrade: true
      }, { status: 429 });
    }

    // Refine post using AI service abstraction
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

    let versionId: string | undefined;

    if (postId) {
      // Update post - Trigger will auto-create version
      const { error } = await supabase
        .from('posts')
        .update({
          content: refinedPost,
          // engagement_score would ideally be re-calculated here, but keeping it simple
          // Maybe reset it or keep previous?
        })
        .eq('id', postId);

      if (error) throw error;

      // Fetch latest version ID if needed
      const latestVersion = await VersionService.getLatestVersion(postId, user.id);
      if (latestVersion) versionId = latestVersion.id;
    }

    // Increment usage
    await UsageService.incrementUsage(user.id);

    return NextResponse.json({
      success: true,
      refinedPost,
      postId,
      versionId
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
