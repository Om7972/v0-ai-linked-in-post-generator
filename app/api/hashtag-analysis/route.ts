/**
 * Hashtag Analysis API
 * Get hashtag intelligence for a post
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { HashtagService } from '@/lib/services/hashtag-service';

export async function GET(req: NextRequest) {
    const supabase = createServerSupabaseClient();

    try {
        // Authentication
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

        // Get postId from query params
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json(
                { error: 'Missing postId parameter' },
                { status: 400 }
            );
        }

        // Get hashtag intelligence
        const intelligence = await HashtagService.getHashtagIntelligence(postId);
        const summary = await HashtagService.getHashtagSummary(postId);

        return NextResponse.json({
            hashtags: intelligence.map(h => ({
                tag: h.hashtag,
                category: h.category,
                relevanceScore: h.relevance_score,
                estimatedReach: h.estimated_reach,
                competitionLevel: h.competition_level,
            })),
            summary,
        });

    } catch (error: any) {
        console.error('Error getting hashtag analysis:', error);
        return NextResponse.json(
            { error: 'Failed to get hashtag analysis', message: error.message },
            { status: 500 }
        );
    }
}
