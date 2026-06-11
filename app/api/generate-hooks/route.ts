export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { generateHooks } from "@/lib/ai-service";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, tone } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const hooks = await generateHooks(topic, tone || "professional");

    return NextResponse.json({ hooks });
  } catch (error: any) {
    console.error("Error generating hooks:", error);
    return NextResponse.json(
      { error: "Failed to generate hooks", details: error.message },
      { status: 500 }
    );
  }
}
