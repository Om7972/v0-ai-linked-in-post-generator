/**
 * GET /api/auth/verify
 * POST /api/auth/verify
 * 
 * Verify the current user's authentication status
 * Returns user data if authenticated
 * Supports both GET (with Authorization header) and POST (with token in body)
 */

import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  return handleVerify(req)
}

export async function POST(req: NextRequest) {
  return handleVerify(req)
}

async function handleVerify(req: NextRequest) {
  try {
    let token: string | null = null

    // Try to get token from Authorization header first
    const authHeader = req.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    }
    
    // If no header token and it's a POST request, try to get from body
    if (!token && req.method === "POST") {
      try {
        const body = await req.json()
        token = body.token || null
      } catch {
        // Body might be empty or not JSON, that's okay
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }

    const supabase = createServerSupabaseClient()

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
        plan: profile?.plan || "free",
      },
      authenticated: true,
    })
  } catch (error: any) {
    console.error("Verify error:", error)
    return NextResponse.json(
      { error: "Failed to verify token", message: error.message },
      { status: 500 }
    )
  }
}
