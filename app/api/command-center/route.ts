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
    const { count: postsCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Try to get content pillars, if not exist, use default
    let contentPillars = [
      { id: "1", pillar_name: "Thought Leadership", percentage: 30 },
      { id: "2", pillar_name: "Behind the Scenes", percentage: 20 },
      { id: "3", pillar_name: "Industry Insights", percentage: 25 },
      { id: "4", pillar_name: "Personal Brand", percentage: 25 },
    ];
    try {
      const { data: pillarsData } = await supabase
        .from("content_pillars")
        .select("*")
        .eq("user_id", user.id);
      if (pillarsData && pillarsData.length > 0) {
        contentPillars = pillarsData;
      }
    } catch (e) {
      // Silently ignore if content_pillars table doesn't exist
    }

    // Try to get brand metrics, if not exist, use default
    let brandMetrics = {
      brand_score: 78.5,
      consistency_score: 65.2,
      authority_score: 72.8,
    };
    try {
      const { data: metricsData } = await supabase
        .from("brand_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (metricsData) {
        brandMetrics = metricsData;
      }
    } catch (e) {
      // Silently ignore if brand_metrics table doesn't exist
    }

    // Try to get recommendations, if not exist, use default
    let recommendations = [
      {
        id: "1",
        recommendation: "Post about your recent project - it would position you as a thought leader!",
        priority: "high" as const,
        is_read: false,
      },
      {
        id: "2",
        recommendation: "Share a behind-the-scenes look at your work process",
        priority: "medium" as const,
        is_read: false,
      },
      {
        id: "3",
        recommendation: "Create a carousel about industry trends for 2025",
        priority: "medium" as const,
        is_read: false,
      },
    ];
    try {
      const { data: recData } = await supabase
        .from("content_recommendations")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: false })
        .limit(5);
      if (recData && recData.length > 0) {
        recommendations = recData;
      }
    } catch (e) {
      // Silently ignore if content_recommendations table doesn't exist
    }

    // Weekly goals
    let weeklyGoals = { posts_goal: 3, posts_completed: postsCount ? Math.min(postsCount, 3) : 1 };
    try {
      const { data: goalsData } = await supabase
        .from("weekly_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (goalsData) {
        weeklyGoals = goalsData;
      }
    } catch (e) {
      // Silently ignore if weekly_goals table doesn't exist
    }

    // Content queue
    let contentQueue: any[] = [];
    try {
      const { data: queueData } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_for", { ascending: true });
      if (queueData) {
        contentQueue = queueData;
      }
    } catch (e) {
      // Silently ignore if content_queue table doesn't exist
    }

    return NextResponse.json({
      postsCount,
      contentPillars,
      brandMetrics,
      recommendations,
      weeklyGoals,
      contentQueue,
    });
  } catch (error) {
    console.error("Command Center API Error:", error);
    return NextResponse.json(
      { error: "Failed to get command center data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
