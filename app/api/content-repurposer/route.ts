export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { repurposeContent } from "@/lib/services/content-repurposer-service";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { getCurrentUserFromRequest } = await import("@/lib/auth");
    const { createServerSupabaseClient } = await import("@/lib/supabase");

    const user = await getCurrentUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const body = await req.json();
    const { topic, existingPost } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const result = await repurposeContent({
      topic,
      existingPost
    });

    // Save to database
    const { data, error } = await supabase
      .from('content_assets')
      .insert({
        user_id: user.id,
        source_content: { topic, existingPost },
        generated_assets: result
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      ...result,
      createdAt: data.created_at
    });

  } catch (error) {
    console.error("Content Repurposer API Error:", error);
    return NextResponse.json(
      { error: "Failed to repurpose content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { getCurrentUserFromRequest } = await import("@/lib/auth");
    const { createServerSupabaseClient } = await import("@/lib/supabase");

    const user = await getCurrentUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('content_assets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error) {
    console.error("Content Repurposer API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content assets", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}