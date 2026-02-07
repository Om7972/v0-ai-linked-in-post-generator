import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"

// Get user profile
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()

    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("Profile error:", profileError)
      // Don't error out, just return minimal user info from auth
    }

    // Default values if profile record is missing
    const userProfile = profile || {
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      plan: 'free',
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: userProfile.name,
        email: user.email,
        plan: userProfile.plan,
        createdAt: userProfile.created_at,
      },
    })
  } catch (error: any) {
    console.error("Error fetching profile:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// Update user profile
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth()
    const supabase = createServerSupabaseClient()

    const { name } = await req.json()

    // Update profile in Supabase (upsert to handle missing records)
    const updateData: any = {
      id: user.id, // Ensure ID is present for upsert
      updated_at: new Date().toISOString()
    }
    if (name) updateData.name = name

    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .upsert(updateData)
      .select()
      .single()

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: profile.name,
        email: user.email,
        plan: profile.plan || 'free',
        createdAt: profile.created_at,
      },
    })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

