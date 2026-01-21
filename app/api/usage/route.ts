/**
 * GET /api/usage
 * 
 * Get current usage status for the authenticated user
 * Returns remaining quota, limit, and reset time
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getUsageStatus } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const usageStatus = await getUsageStatus(user.id)

    return NextResponse.json({
      usage: {
        remaining: usageStatus.remaining,
        limit: usageStatus.limit,
        used: usageStatus.limit - usageStatus.remaining,
        resetAt: usageStatus.resetAt.toISOString(),
        canGenerate: usageStatus.canGenerate,
      },
    })
  } catch (error: any) {
    console.error("Error fetching usage:", error)

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch usage", message: error.message },
      { status: 500 }
    )
  }
}

