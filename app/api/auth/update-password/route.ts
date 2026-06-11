export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { createServerSupabaseClient, createSupabaseClientFromToken } from "@/lib/supabase";

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

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    let error: any = null;

    if (token) {
      // Try updating via the user-scoped client (does not require service role key)
      const userSupabase = createSupabaseClientFromToken(token);
      const { error: updateError } = await userSupabase.auth.updateUser({
        password: newPassword,
      });
      error = updateError;
    } else {
      // Fallback to service role admin API
      const supabase = createServerSupabaseClient();
      const { error: adminError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });
      error = adminError;
    }

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
