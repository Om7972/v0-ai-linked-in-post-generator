import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * GET /api/user/profile - Get current user's full profile
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    // Get usage stats
    const { data: usage } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Get post count
    const { count: postCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: profile?.name || user.user_metadata?.name || "User",
        email: user.email,
        plan: profile?.plan || "free",
        bio: profile?.bio || "",
        linkedin_url: profile?.linkedin_url || "",
        company: profile?.company || "",
        job_title: profile?.job_title || "",
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || "",
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at,
      },
      usage: {
        posts_generated_today: usage?.posts_generated_today || 0,
        total_posts_generated: usage?.total_posts_generated || 0,
        last_reset: usage?.last_reset,
      },
      postCount: postCount || 0,
    });
  } catch (error) {
    console.error("Error in GET /api/user/profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/user/profile - Update user profile
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, linkedin_url, company, job_title, avatar_url } = body;

    const supabase = createServerSupabaseClient();

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (company !== undefined) updateData.company = company;
    if (job_title !== undefined) updateData.job_title = job_title;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Also update auth metadata if name changed
    if (name) {
      await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, name },
      });
    }

    return NextResponse.json({
      user: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in PATCH /api/user/profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
