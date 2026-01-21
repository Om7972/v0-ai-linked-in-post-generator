import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Sign in with Supabase Auth
    const supabase = createServerSupabaseClient()
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Handle specific Supabase errors
      if (authError.message.includes("Invalid login credentials") || 
          authError.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      console.error("Supabase login error:", authError)
      return NextResponse.json(
        { error: authError.message || "Failed to login" },
        { status: 401 }
      )
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    // Return user data with session
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || authData.user.user_metadata?.name || authData.user.email?.split("@")[0] || "User",
      },
      session: authData.session,
      // Include access token for API calls
      accessToken: authData.session.access_token,
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Failed to login", message: error.message },
      { status: 500 }
    )
  }
}

