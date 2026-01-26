/**
 * Cache Stats API
 * Get AI response cache statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { CacheService } from '@/lib/services/cache-service';

export async function GET(req: NextRequest) {
    const supabase = createServerSupabaseClient();

    try {
        // Authentication (admin only for now)
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

        // Get cache stats
        const stats = await CacheService.getStats();

        return NextResponse.json(stats);

    } catch (error: any) {
        console.error('Error getting cache stats:', error);
        return NextResponse.json(
            { error: 'Failed to get cache stats', message: error.message },
            { status: 500 }
        );
    }
}

// POST /api/cache-stats/cleanup - Clean up expired cache
export async function POST(req: NextRequest) {
    const supabase = createServerSupabaseClient();

    try {
        // Authentication (admin only)
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

        // Clean up cache
        const deleted = await CacheService.cleanup();

        return NextResponse.json({
            success: true,
            deleted,
            message: `Cleaned up ${deleted} expired cache entries`,
        });

    } catch (error: any) {
        console.error('Error cleaning up cache:', error);
        return NextResponse.json(
            { error: 'Failed to cleanup cache', message: error.message },
            { status: 500 }
        );
    }
}
