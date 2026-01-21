import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Create user with Supabase Auth
    const supabase = createServerSupabaseClient()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (authError) {
      // Handle specific Supabase errors
      if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        )
      }

      console.error("Supabase signup error:", authError)
      return NextResponse.json(
        { error: authError.message || "Failed to create account" },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Get user profile (created by trigger)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single()

    // Return user data
    // Note: Supabase requires email confirmation by default
    // If email confirmation is enabled, the user won't be able to sign in until they confirm
    return NextResponse.json(
      {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: name,
        },
        session: authData.session,
        // Include this flag so frontend knows if email confirmation is needed
        requiresEmailConfirmation: !authData.session,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account", message: error.message },
      { status: 500 }
    )
  }
}

