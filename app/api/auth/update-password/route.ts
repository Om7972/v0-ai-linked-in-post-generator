import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Use admin API to update password
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      console.error("Password update error:", error);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
