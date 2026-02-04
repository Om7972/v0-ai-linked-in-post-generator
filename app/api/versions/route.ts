import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { VersionService } from "@/lib/services/version-service";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams;
        const postId = searchParams.get('postId');

        if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

        const versions = await VersionService.getVersions(postId, user.id);

        return NextResponse.json({ versions });
    } catch (error) {
        console.error("Versions API Error:", error);
        return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { postId, versionNumber } = body;

        if (!postId || !versionNumber) {
            return NextResponse.json({ error: "Post ID and Version Number required" }, { status: 400 });
        }

        await VersionService.rollbackToVersion(postId, versionNumber, user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Rollback API Error:", error);
        return NextResponse.json({ error: "Failed to rollback" }, { status: 500 });
    }
}
