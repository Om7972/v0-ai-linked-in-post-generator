import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { TemplateService } from "@/lib/services/template-service";
import { TemplateRole } from "@/types/database";

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
        const role = searchParams.get('role');

        let templates = [];
        if (role) {
            templates = await TemplateService.getTemplatesByRole(role as TemplateRole);
        } else {
            templates = await TemplateService.getActiveTemplates();
        }

        // Also fetch user's custom templates
        const customTemplates = await TemplateService.getUserTemplates(user.id);

        return NextResponse.json({ templates: [...templates, ...customTemplates] });
    } catch (error) {
        console.error("Templates API Error:", error);
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
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
        const { name, systemPrompt, userPromptTemplate, description } = body;

        const template = await TemplateService.createCustomTemplate(user.id, {
            name,
            systemPrompt: systemPrompt || "You are a professional assistant.",
            userPromptTemplate: userPromptTemplate, // Map structure to userPromptTemplate
            description
        });

        return NextResponse.json({ template });
    } catch (error) {
        console.error("Create Template API Error:", error);
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
