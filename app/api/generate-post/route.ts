import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateLinkedInPost, generateHashtags } from "@/lib/ai-service";
import { UsageService } from "@/lib/services/usage-service";
import { CacheService } from "@/lib/services/cache-service";
import { TemplateService } from "@/lib/services/template-service";
import { VersionService } from "@/lib/services/version-service";
import { HashtagService } from "@/lib/services/hashtag-service";
import { EngagementScoreEngine } from "@/lib/services/engagement-service";
import { PlanId } from "@/types/database";

export const maxDuration = 60; // Increased timeout for complex AI operations

interface GenerateRequest {
  topic: string;
  audience: string;
  tone: string;
  length: string;
  cta: string;
  postId?: string; // If provided, this is a regeneration/refinement
  templateId?: string; // Optional template override
  customStyle?: string; // Optional personal style instruction
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate User
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, audience, tone, length, cta, postId, templateId, customStyle }: GenerateRequest = body;

    // Validate Base Input
    if (!topic || !audience || !tone || !length || !cta) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Check Usage Limits
    // UsageService.checkLimit is static and creates its own client
    const usageLimit = await UsageService.checkLimit(user.id);
    if (!usageLimit.can_generate) {
      return NextResponse.json({
        error: usageLimit.reason || "Daily generation limit reached",
        upgrade: true,
        details: usageLimit
      }, { status: 429 });
    }

    // 3. Check Cache (Optimization)
    // Only use cache if we aren't explicitly regenerating an existing post
    if (!postId) {
      const cached = await CacheService.get({
        topic, tone, audience, length, cta, templateId
      });

      if (cached) {
        // Return cached response
        return NextResponse.json({
          content: cached.content,
          hashtags: cached.hashtags,
          engagement: {
            score: cached.engagement_score || 0,
            potential: "Cached result",
            breakdown: {} // Cached result might not have full breakdown unless stored
          },
          isCached: true,
          remainingCredits: usageLimit.daily_limit - usageLimit.daily_used
        });
      }
    }

    // 4. Resolve Template (if strict template ID provided)
    let promptInstruction = "";
    if (templateId) {
      const template = await TemplateService.getTemplateById(templateId);
      if (template) {
        promptInstruction = `Use structure: ${template.user_prompt_template}`;
      }
    }

    // Add custom style if provided
    if (customStyle) {
      promptInstruction += ` ${customStyle}`;
    }

    // 5. Generate Content with AI
    // We combine the base generation logic here
    const generatedPost = await generateLinkedInPost({
      topic,
      audience,
      tone: (promptInstruction ? `${tone} (${promptInstruction})` : tone) as any,
      length: length as any,
      cta
    });

    const postContent = generatedPost.content;

    // 6. Generate Intelligent Hashtags
    // We fetch more hashtags than needed to categorize them
    // Simulate plan limit of 20 hashtags for now (pro plan)
    const rawHashtags = await generateHashtags(postContent);
    // HashtagService expects a string of hashtags, generateHashtags returns string[] or string depending on implementation.
    // Let's check generateHashtags return type via usage. It seems to return string[].
    const analyzedHashtags = HashtagService.analyzeHashtags(
      Array.isArray(rawHashtags) ? rawHashtags.join(' ') : rawHashtags,
      postContent,
      20
    );

    // Select best hashtags based on plan
    const nicheTags = analyzedHashtags.filter(h => h.category === 'niche').map(h => h.tag).slice(0, 5);
    const trendingTags = analyzedHashtags.filter(h => h.category === 'trending').map(h => h.tag).slice(0, 2);
    const broadTags = analyzedHashtags.filter(h => h.category === 'broad').map(h => h.tag).slice(0, 3);

    const optimizedHashtags = [...nicheTags, ...trendingTags, ...broadTags];

    // 7. Calculate Engagement Score
    const engagementResult = EngagementScoreEngine.calculate({
      content: postContent,
      hashtags: optimizedHashtags.join(' '),
      hasCTA: !!cta,
      hasEmojis: (postContent.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length > 0
    });

    // 8. Persist to Database (Version Control)
    let activePostId = postId;
    let versionId: string | undefined;

    if (activePostId) {
      // Update existing post - Trigger will auto-create version
      const { data: updatedPost, error: updateError } = await supabase
        .from('posts')
        .update({
          content: postContent,
          hashtags: optimizedHashtags.join(' '),
          engagement_score: engagementResult.score,
          metadata: {
            score_breakdown: engagementResult.factors,
            prompt_instruction: promptInstruction
          }
        })
        .eq('id', activePostId)
        .select()
        .single();

      if (updateError) throw updateError;

      // We need to fetch the new version ID if we want to return it
      // But for now, returning the postId is main priority.
      // Optionally we could query the latest version.
    } else {
      // Create NEW post
      const { data: newPost, error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: postContent,
          topic,
          tone, // Store original enum
          audience,
          length,
          hashtags: optimizedHashtags.join(' '),
          engagement_score: engagementResult.score,
          metadata: {
            score_breakdown: engagementResult.factors,
            prompt_instruction: promptInstruction
          }
        })
        .select()
        .single();

      if (!insertError && newPost) {
        activePostId = newPost.id;
      }
    }

    // 9. Update Usage & Cache
    await Promise.all([
      UsageService.incrementUsage(user.id),
      !postId && CacheService.set({
        topic, tone, audience, length, cta, templateId
      }, {
        content: postContent,
        hashtags: optimizedHashtags.join(' '),
        engagement_score: engagementResult.score
      })
    ]);

    // 10. Return Response
    return NextResponse.json({
      content: postContent,
      hashtags: optimizedHashtags.join(' '),
      postId: activePostId,
      versionId,
      engagement: {
        score: engagementResult.score,
        potential: engagementResult.potential,
        breakdown: engagementResult.factors
      },
      remainingCredits: usageLimit.daily_limit - usageLimit.daily_used - 1
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate post", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
