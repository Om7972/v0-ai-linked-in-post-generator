export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { getCurrentUserFromRequest } = await import("@/lib/auth");
    const user = await getCurrentUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get posts count
    const { count: postsCount, error: postsError } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (postsError) throw postsError;

    // Get content pillars
    const { data: contentPillars, error: pillarsError } = await supabase
      .from("content_pillars")
      .select("*")
      .eq("user_id", user.id);

    if (pillarsError) throw pillarsError;

    // Get latest brand metrics
    const { data: brandMetrics, error: metricsError } = await supabase
      .from("brand_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (metricsError) throw metricsError;

    // Get content recommendations
    const { data: recommendations, error: recError } = await supabase
      .from("content_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("priority", { ascending: false })
      .limit(5);

    if (recError) throw recError;

    // Get weekly goals
    const { data: weeklyGoals, error: goalsError } = await supabase
      .from("weekly_goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (goalsError) throw goalsError;

    // Get content queue
    const { data: contentQueue, error: queueError } = await supabase
      .from("content_queue")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_for", { ascending: true });

    if (queueError) throw queueError;

    // If no brand metrics, generate mock ones
    let finalMetrics = brandMetrics?.[0];
    if (!finalMetrics) {
      finalMetrics = {
        brand_score: 78.5,
        consistency_score: 65.2,
        authority_score: 72.8,
        created_at: new Date().toISOString(),
      };
    }

    // If no content pillars, generate default ones
    let finalPillars = contentPillars;
    if (!finalPillars || finalPillars.length === 0) {
      finalPillars = [
        { id: "1", pillar_name: "Thought Leadership", percentage: 30 },
        { id: "2", pillar_name: "Behind the Scenes", percentage: 20 },
        { id: "3", pillar_name: "Industry Insights", percentage: 25 },
        { id: "4", pillar_name: "Personal Brand", percentage: 25 },
      ];
    }

    // If no recommendations, generate mock ones
    let finalRecs = recommendations;
    if (!finalRecs || finalRecs.length === 0) {
      finalRecs = [
        {
          id: "1",
          recommendation: "Post about your recent project - it would position you as a thought leader!",
          priority: "high",
          is_read: false,
        },
        {
          id: "2",
          recommendation: "Share a behind-the-scenes look at your work process",
          priority: "medium",
          is_read: false,
        },
        {
          id: "3",
          recommendation: "Create a carousel about industry trends for 2025",
          priority: "medium",
          is_read: false,
        },
      ];
    }

    // If no weekly goals, generate default one
    let finalGoals = weeklyGoals?.[0];
    if (!finalGoals) {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      finalGoals = {
        posts_goal: 3,
        posts_completed: postsCount ? Math.min(postsCount, 3) : 1,
        week_start: startOfWeek.toISOString(),
        week_end: endOfWeek.toISOString(),
      };
    }

    return NextResponse.json({
      postsCount,
      contentPillars: finalPillars,
      brandMetrics: finalMetrics,
      recommendations: finalRecs,
      weeklyGoals: finalGoals,
      contentQueue: contentQueue || [],
    });
  } catch (error) {
    console.error("Command Center API Error:", error);
    return NextResponse.json(
      { error: "Failed to get command center data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
