import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { BrandCoachService } from "@/lib/services/brand-coach-service";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow enough time for AI brand calculations

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await BrandCoachService.getBrandProfile(user.id);
    const reports = await BrandCoachService.getRecentReports(user.id);

    return NextResponse.json({ profile, reports });
  } catch (error: any) {
    console.error("GET /api/brand-coach error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch brand coach data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, niche, primaryTopics } = body;

    if (action === "analyze") {
      const profile = await BrandCoachService.analyzePostHistory(user.id, niche, primaryTopics);
      return NextResponse.json({ success: true, profile });
    }

    if (action === "weekly-plan") {
      const plan = await BrandCoachService.generateWeeklyPlan(user.id);
      return NextResponse.json({ success: true, plan });
    }

    if (action === "monthly-report") {
      const report = await BrandCoachService.generateMonthlyReport(user.id);
      return NextResponse.json({ success: true, report });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/brand-coach error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute brand coach action" }, { status: 500 });
  }
}
