/**
 * Version Service
 * Manages post version history and rollback
 */

import { createServerSupabaseClient } from '../supabase';
import type { PostVersion, ChangeType } from '@/types/database';

export class VersionService {
    /**
     * Get all versions for a post
     */
    static async getVersions(postId: string, userId: string): Promise<PostVersion[]> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('post_versions')
                .select('*')
                .eq('post_id', postId)
                .eq('user_id', userId)
                .order('version_number', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting versions:', error);
            throw new Error('Failed to get versions');
        }
    }

    /**
     * Get specific version
     */
    static async getVersion(
        postId: string,
        versionNumber: number,
        userId: string
    ): Promise<PostVersion | null> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('post_versions')
                .select('*')
                .eq('post_id', postId)
                .eq('version_number', versionNumber)
                .eq('user_id', userId)
                .single();

            if (error) return null;

            return data;
        } catch (error) {
            console.error('Error getting version:', error);
            return null;
        }
    }

    /**
     * Get latest version
     */
    static async getLatestVersion(postId: string, userId: string): Promise<PostVersion | null> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('post_versions')
                .select('*')
                .eq('post_id', postId)
                .eq('user_id', userId)
                .order('version_number', { ascending: false })
                .limit(1)
                .single();

            if (error) return null;

            return data;
        } catch (error) {
            console.error('Error getting latest version:', error);
            return null;
        }
    }

    /**
     * Create new version (manual)
     * Note: Versions are auto-created by trigger, but this can be used for manual edits
     */
    static async createVersion(
        postId: string,
        userId: string,
        content: string,
        hashtags: string | null,
        engagementScore: number | null,
        changeType: ChangeType = 'manual_edit',
        changeDescription?: string
    ): Promise<PostVersion> {
        const supabase = createServerSupabaseClient();

        try {
            // Get next version number
            const { data: versions, error: versionError } = await supabase
                .from('post_versions')
                .select('version_number')
                .eq('post_id', postId)
                .order('version_number', { ascending: false })
                .limit(1);

            if (versionError) throw versionError;

            const nextVersion = versions && versions.length > 0
                ? versions[0].version_number + 1
                : 1;

            const { data, error } = await supabase
                .from('post_versions')
                .insert({
                    post_id: postId,
                    user_id: userId,
                    version_number: nextVersion,
                    content,
                    hashtags,
                    engagement_score: engagementScore,
                    change_type: changeType,
                    change_description: changeDescription || null,
                })
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error creating version:', error);
            throw new Error('Failed to create version');
        }
    }

    /**
     * Rollback to a specific version
     */
    static async rollbackToVersion(
        postId: string,
        versionNumber: number,
        userId: string
    ): Promise<void> {
        const supabase = createServerSupabaseClient();

        try {
            // Get the version to rollback to
            const version = await this.getVersion(postId, versionNumber, userId);

            if (!version) {
                throw new Error('Version not found');
            }

            // Update the post with the version's content
            const { error } = await supabase
                .from('posts')
                .update({
                    content: version.content,
                    hashtags: version.hashtags,
                    engagement_score: version.engagement_score,
                })
                .eq('id', postId)
                .eq('user_id', userId);

            if (error) throw error;

            // The trigger will automatically create a new version
        } catch (error) {
            console.error('Error rolling back version:', error);
            throw new Error('Failed to rollback version');
        }
    }

    /**
     * Get version count for a post
     */
    static async getVersionCount(postId: string, userId: string): Promise<number> {
        const supabase = createServerSupabaseClient();

        try {
            const { count, error } = await supabase
                .from('post_versions')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', postId)
                .eq('user_id', userId);

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Error getting version count:', error);
            return 0;
        }
    }

    /**
     * Check if user can create more versions (based on plan limit)
     */
    static async canCreateVersion(postId: string, userId: string): Promise<boolean> {
        const supabase = createServerSupabaseClient();

        try {
            // Get user's plan
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            // Get plan's version limit
            const { data: plan, error: planError } = await supabase
                .from('plans')
                .select('version_history_limit')
                .eq('id', profile.plan)
                .single();

            if (planError) throw planError;

            // Get current version count
            const count = await this.getVersionCount(postId, userId);

            return count < plan.version_history_limit;
        } catch (error) {
            console.error('Error checking version limit:', error);
            return false;
        }
    }

    /**
     * Clean up old versions (keep only the limit)
     */
    static async cleanupOldVersions(postId: string, userId: string): Promise<void> {
        const supabase = createServerSupabaseClient();

        try {
            // Get user's plan limit
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const { data: plan, error: planError } = await supabase
                .from('plans')
                .select('version_history_limit')
                .eq('id', profile.plan)
                .single();

            if (planError) throw planError;

            // Get all versions
            const versions = await this.getVersions(postId, userId);

            // If we have more versions than the limit, delete the oldest ones
            if (versions.length > plan.version_history_limit) {
                const versionsToDelete = versions
                    .slice(plan.version_history_limit)
                    .map(v => v.id);

                const { error } = await supabase
                    .from('post_versions')
                    .delete()
                    .in('id', versionsToDelete);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error cleaning up old versions:', error);
            // Don't throw - this is a cleanup operation
        }
    }
}
