export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 120;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const OUTPUT_TYPES = [
  "linkedin_post",
  "linkedin_carousel",
  "poll_ideas",
  "comment_suggestions",
  "newsletter_draft",
  "linkedin_headline",
  "about_section",
  "content_hooks",
] as const;

type OutputType = typeof OUTPUT_TYPES[number];

interface GenerateRequest {
  topic: string;
  tone: string;
  audience: string;
  outputTypes: OutputType[];
}

async function generateSingleOutput(
  type: OutputType,
  params: { topic: string; tone: string; audience: string },
  genAI: GoogleGenerativeAI
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompts: Record<OutputType, string> = {
    linkedin_post: `Generate a professional LinkedIn post about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Make it engaging, include emojis, and end with a call-to-action.`,
    linkedin_carousel: `Generate a LinkedIn carousel script about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Include 5-7 slides separated by "---". Each slide should have a title and content.`,
    poll_ideas: `Generate 5 poll ideas for LinkedIn about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Each poll should have a question and 4 options.`,
    comment_suggestions: `Generate 8 engaging comment suggestions for LinkedIn about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Include a mix of questions, compliments, and insights.`,
    newsletter_draft: `Generate a newsletter draft about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Include a subject line, greeting, main content, and closing.`,
    linkedin_headline: `Generate 3 optimized LinkedIn headlines about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Include relevant keywords.`,
    about_section: `Generate a LinkedIn About section about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Make it personal and professional, tell a story, and include key achievements.`,
    content_hooks: `Generate 10 engaging content hooks about "${params.topic}" in a ${params.tone} tone for ${params.audience}. Include a mix of questions, statements, and facts.`,
  };

  const result = await model.generateContent(prompts[type]);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { getCurrentUserFromRequest } = await import("@/lib/auth");
    const user = await getCurrentUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI API key not configured" }, { status: 500 });
    }

    const supabase = createServerSupabaseClient();
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const body: GenerateRequest = await req.json();
    const { topic, tone, audience, outputTypes } = body;

    if (!topic || !outputTypes || outputTypes.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create content project
    const { data: project, error: projectError } = await supabase
      .from("content_projects")
      .insert({
        user_id: user.id,
        topic,
        tone,
        audience,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Generate outputs
    const outputs: Array<{ type: OutputType; content: string }> = [];
    for (const type of outputTypes) {
      try {
        const content = await generateSingleOutput(type, { topic, tone, audience }, genAI);
        outputs.push({ type, content });
      } catch (error) {
        console.error(`Error generating ${type}:`, error);
        outputs.push({ type, content: `Error generating ${type}` });
      }
    }

    // Save outputs to DB
    const { data: savedOutputs, error: outputsError } = await supabase
      .from("content_outputs")
      .insert(
        outputs.map((o) => ({
          project_id: project.id,
          output_type: o.type,
          content: o.content,
        }))
      )
      .select();

    if (outputsError) throw outputsError;

    return NextResponse.json({
      projectId: project.id,
      outputs: savedOutputs,
    });
  } catch (error) {
    console.error("Content Studio API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Get projects for user
export async function GET(req: NextRequest) {
  try {
    const { getCurrentUserFromRequest } = await import("@/lib/auth");
    const user = await getCurrentUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: projects, error: projectsError } = await supabase
      .from("content_projects")
      .select("*, content_outputs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (projectsError) throw projectsError;

    return NextResponse.json(projects || []);
  } catch (error) {
    console.error("Content Studio API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
