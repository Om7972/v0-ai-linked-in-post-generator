export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { optimizeProfile } from "@/lib/services/profile-optimizer-service";

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
    const { headline, aboutSection, experienceSummary } = body;

    if (!headline && !aboutSection && !experienceSummary) {
      return NextResponse.json({ error: "At least one profile field is required" }, { status: 400 });
    }

    const result = await optimizeProfile({
      headline: headline || "",
      aboutSection: aboutSection || "",
      experienceSummary: experienceSummary || ""
    });

    // Save to database
    const { data, error } = await supabase
      .from('profile_reviews')
      .insert({
        user_id: user.id,
        original_data: { headline, aboutSection, experienceSummary },
        optimized_data: result.optimized,
        scores: result.scores
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
    console.error("Profile Optimizer API Error:", error);
    return NextResponse.json(
      { error: "Failed to optimize profile", details: error instanceof Error ? error.message : "Unknown error" },
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
      .from('profile_reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error) {
    console.error("Profile Optimizer API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile reviews", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}