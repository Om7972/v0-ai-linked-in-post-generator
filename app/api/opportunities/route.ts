import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { ContentOpportunityService } from "@/lib/services/content-opportunity-service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forceRefresh = req.nextUrl.searchParams.get("refresh") === "true";
    const data = await ContentOpportunityService.getDashboardData(user.id, forceRefresh);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/opportunities error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load opportunities",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (body.action === "refresh") {
      const data = await ContentOpportunityService.getDashboardData(user.id, true);
      return NextResponse.json({ success: true, data });
    }

    if (body.action === "track") {
      await ContentOpportunityService.trackAction(
        user.id,
        body.opportunityId || null,
        body.actionTaken || "viewed"
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/opportunities error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process opportunity action",
      },
      { status: 500 }
    );
  }
}
