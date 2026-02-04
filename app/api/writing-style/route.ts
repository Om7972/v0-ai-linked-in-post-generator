/**
 * Writing Style API
 * Manage personal writing style profiles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { WritingStyleService } from '@/lib/services/writing-style-service';

// GET /api/writing-style - Get all style profiles
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

        // Get user's profiles
        const profiles = await WritingStyleService.getUserProfiles(user.id);
        const defaultProfile = await WritingStyleService.getDefaultProfile(user.id);

        return NextResponse.json({
            profiles,
            defaultProfile,
        });

    } catch (error: any) {
        console.error('Error getting style profiles:', error);
        return NextResponse.json(
            { error: 'Failed to get style profiles', message: error.message },
            { status: 500 }
        );
    }
}

// POST /api/writing-style - Create new style profile
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
        const { name, samplePosts } = body;

        // Validate
        if (!name || !samplePosts || !Array.isArray(samplePosts)) {
            return NextResponse.json(
                { error: 'Missing required fields: name, samplePosts (array)' },
                { status: 400 }
            );
        }

        if (samplePosts.length < 3) {
            return NextResponse.json(
                { error: 'At least 3 sample posts are required' },
                { status: 400 }
            );
        }

        if (samplePosts.length > 10) {
            return NextResponse.json(
                { error: 'Maximum 10 sample posts allowed' },
                { status: 400 }
            );
        }

        // Create profile
        const profile = await WritingStyleService.createStyleProfile(
            user.id,
            name,
            samplePosts
        );

        return NextResponse.json(profile);

    } catch (error: any) {
        console.error('Error creating style profile:', error);
        return NextResponse.json(
            { error: 'Failed to create style profile', message: error.message },
            { status: 500 }
        );
    }
}

// PATCH /api/writing-style - Update style profile
export async function PATCH(req: NextRequest) {
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
        const { profileId, action, value } = body;

        if (!profileId || !action) {
            return NextResponse.json(
                { error: 'Missing required fields: profileId, action' },
                { status: 400 }
            );
        }

        // Handle different actions
        switch (action) {
            case 'setDefault':
                await WritingStyleService.setDefaultProfile(user.id, profileId);
                break;

            case 'toggleActive':
                if (typeof value !== 'boolean') {
                    return NextResponse.json(
                        { error: 'value must be a boolean for toggleActive' },
                        { status: 400 }
                    );
                }
                await WritingStyleService.toggleProfileActive(user.id, profileId, value);
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error updating style profile:', error);
        return NextResponse.json(
            { error: 'Failed to update style profile', message: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/writing-style - Delete style profile
export async function DELETE(req: NextRequest) {
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

        // Get profileId from query params
        const { searchParams } = new URL(req.url);
        const profileId = searchParams.get('profileId');

        if (!profileId) {
            return NextResponse.json(
                { error: 'Missing profileId parameter' },
                { status: 400 }
            );
        }

        // Delete profile
        await WritingStyleService.deleteProfile(user.id, profileId);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error deleting style profile:', error);
        return NextResponse.json(
            { error: 'Failed to delete style profile', message: error.message },
            { status: 500 }
        );
    }
}
