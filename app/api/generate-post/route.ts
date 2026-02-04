/**
 * Enhanced Generate Post API
 * Production-ready with all SaaS features:
 * - Usage limits & tracking
 * - AI response caching
 * - Template system
 * - Version history
 * - Hashtag intelligence
 * - Engagement scoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { generateLinkedInPost, generateHashtags } from '@/lib/ai-service';
import { UsageService } from '@/lib/services/usage-service';
import { CacheService } from '@/lib/services/cache-service';
import { TemplateService } from '@/lib/services/template-service';
import { HashtagService } from '@/lib/services/hashtag-service';
import { EngagementScoreEngine } from '@/lib/services/engagement-service';
import { WritingStyleService } from '@/lib/services/writing-style-service';
import type { GeneratePostRequest, GeneratePostResponse } from '@/types/database';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();

  try {
    // 1. AUTHENTICATION
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. PARSE REQUEST
    const body: GeneratePostRequest = await req.json();
    const { topic, audience, tone, length, cta, templateId, teamId } = body;

    // Validate input
    if (!topic || !audience || !tone || !length || !cta) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, audience, tone, length, cta' },
        { status: 400 }
      );
    }

    // 3. CHECK USAGE LIMITS
    const usageCheck = await UsageService.checkLimit(user.id);

    if (!usageCheck.can_generate) {
      return NextResponse.json(
        {
          error: 'Usage limit reached',
          message: usageCheck.reason,
          usage: {
            daily: {
              used: usageCheck.daily_used,
              limit: usageCheck.daily_limit,
            },
            monthly: {
              used: usageCheck.monthly_used,
              limit: usageCheck.monthly_limit,
            },
          },
        },
        { status: 429 }
      );
    }

    // 4. GET PLAN LIMITS
    const planLimits = await UsageService.getPlanLimits(user.id);

    // 5. MAP FRONTEND VALUES TO BACKEND ENUMS
    const toneMap: Record<string, 'professional' | 'founder' | 'influencer' | 'casual'> = {
      'Professional': 'professional',
      'Founder': 'founder',
      'Influencer': 'influencer',
      'Casual': 'casual',
    };

    const lengthMap: Record<string, 'short' | 'medium' | 'long'> = {
      'Short (100-150 words)': 'short',
      'Medium (200-300 words)': 'medium',
      'Long (350-500 words)': 'long',
    };

    const mappedTone = toneMap[tone] || 'professional';
    const mappedLength = lengthMap[length] || 'medium';

    // 6. CHECK CACHE (if plan allows)
    let cachedResponse = null;
    let isCached = false;

    if (planLimits.can_use_ai_cache) {
      cachedResponse = await CacheService.get({
        topic,
        tone: mappedTone,
        audience,
        length: mappedLength,
        cta,
        templateId,
      });

      if (cachedResponse) {
        isCached = true;
        console.log('✅ Cache hit - using cached response');
      }
    }

    let postContent: string;
    let hashtagsText: string;
    let aiUsage: { promptTokens: number; completionTokens: number; totalTokens: number } = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0
    };

    if (isCached && cachedResponse) {
      // Use cached response
      postContent = cachedResponse.content;
      hashtagsText = cachedResponse.hashtags || '';
    } else {
      // 7. GENERATE NEW CONTENT

      // Get template if specified
      let template = null;
      if (templateId && planLimits.can_use_templates) {
        template = await TemplateService.getTemplateById(templateId);
      }

      // Generate post using AI
      const generatedPost = await generateLinkedInPost({
        topic,
        audience,
        tone: mappedTone,
        length: mappedLength,
        cta,
      });

      if (!generatedPost.content) {
        return NextResponse.json(
          { error: 'Failed to generate post content' },
          { status: 500 }
        );
      }

      postContent = generatedPost.content;
      aiUsage = generatedPost.usage || aiUsage;

      // Generate hashtags
      hashtagsText = await generateHashtags(postContent);

      // Cache the response (if plan allows)
      if (planLimits.can_use_ai_cache) {
        await CacheService.set(
          {
            topic,
            tone: mappedTone,
            audience,
            length: mappedLength,
            cta,
            templateId,
          },
          {
            content: postContent,
            hashtags: hashtagsText,
            engagement_score: null, // Will be calculated below
          }
        );
      }
    }

    // 8. ANALYZE HASHTAGS
    const hashtagAnalysis = HashtagService.analyzeHashtags(
      hashtagsText,
      postContent,
      planLimits.hashtag_limit
    );

    // Limit hashtags based on plan
    const limitedHashtags = hashtagAnalysis
      .slice(0, planLimits.hashtag_limit)
      .map(h => h.tag)
      .join(' ');

    // 9. CALCULATE ENGAGEMENT SCORE
    const engagementAnalysis = EngagementScoreEngine.calculate({
      content: postContent,
      hashtags: limitedHashtags,
    });

    // 10. SAVE TO DATABASE
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        topic,
        tone: mappedTone,
        audience,
        length: mappedLength,
        content: postContent,
        hashtags: limitedHashtags,
        engagement_score: engagementAnalysis.score,
        team_id: teamId || null,
        template_id: templateId || null,
        is_cached: isCached,
        cache_hit: isCached,
      })
      .select()
      .single();

    if (postError) {
      console.error('Error saving post:', postError);
      throw postError;
    }

    // 11. STORE HASHTAG INTELLIGENCE
    await HashtagService.storeHashtagIntelligence(post.id, hashtagAnalysis);

    // 12. INCREMENT USAGE (only if not cached)
    if (!isCached) {
      await UsageService.incrementUsage(user.id);
    }

    // 13. RETURN RESPONSE
    const response: GeneratePostResponse = {
      post: postContent,
      hashtags: limitedHashtags,
      engagement: {
        score: engagementAnalysis.score,
        potential: engagementAnalysis.potential,
      },
      usage: aiUsage,
      cached: isCached,
      postId: post.id,
      versionNumber: 1, // First version
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error generating post:', error);

    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API configuration error', message: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate post',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
