/**
 * Post Versions API
 * Manage post version history
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { VersionService } from '@/lib/services/version-service';

// GET /api/versions?postId=xxx - Get all versions for a post
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

        // Get versions
        const versions = await VersionService.getVersions(postId, user.id);
        const versionCount = await VersionService.getVersionCount(postId, user.id);
        const latestVersion = await VersionService.getLatestVersion(postId, user.id);

        return NextResponse.json({
            versions,
            currentVersion: latestVersion?.version_number || 1,
            totalVersions: versionCount,
        });

    } catch (error: any) {
        console.error('Error getting versions:', error);
        return NextResponse.json(
            { error: 'Failed to get versions', message: error.message },
            { status: 500 }
        );
    }
}

// POST /api/versions/rollback - Rollback to a specific version
export async function POST(req: NextRequest) {
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

        // Parse request
        const body = await req.json();
        const { postId, versionNumber } = body;

        if (!postId || !versionNumber) {
            return NextResponse.json(
                { error: 'Missing required fields: postId, versionNumber' },
                { status: 400 }
            );
        }

        // Rollback
        await VersionService.rollbackToVersion(postId, versionNumber, user.id);

        return NextResponse.json({
            success: true,
            message: `Rolled back to version ${versionNumber}`,
        });

    } catch (error: any) {
        console.error('Error rolling back version:', error);
        return NextResponse.json(
            { error: 'Failed to rollback version', message: error.message },
            { status: 500 }
        );
    }
}
