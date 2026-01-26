/**
 * Usage Service
 * Handles usage tracking and limit enforcement
 */

import { createServerSupabaseClient } from './supabase';
import type { UsageLimitCheck, PlanId } from '@/types/database';

export class UsageService {
    /**
     * Check if user can generate more posts
     */
    static async checkLimit(userId: string): Promise<UsageLimitCheck> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .rpc('check_usage_limit', { p_user_id: userId });

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('Failed to check usage limit');
            }

            return data[0];
        } catch (error) {
            console.error('Error checking usage limit:', error);
            throw new Error('Failed to check usage limit');
        }
    }

    /**
     * Increment usage counter
     */
    static async incrementUsage(userId: string): Promise<void> {
        const supabase = createServerSupabaseClient();

        try {
            const { error } = await supabase
                .rpc('increment_usage', { p_user_id: userId });

            if (error) throw error;
        } catch (error) {
            console.error('Error incrementing usage:', error);
            throw new Error('Failed to increment usage');
        }
    }

    /**
     * Get current usage stats
     */
    static async getUsageStats(userId: string) {
        const supabase = createServerSupabaseClient();

        try {
            // Get usage data
            const { data: usage, error: usageError } = await supabase
                .from('usage')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (usageError) throw usageError;

            // Get plan limits
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const { data: plan, error: planError } = await supabase
                .from('plans')
                .select('daily_post_limit, monthly_post_limit')
                .eq('id', profile.plan)
                .single();

            if (planError) throw planError;

            return {
                daily: {
                    used: usage.posts_generated_today,
                    limit: plan.daily_post_limit,
                    remaining: Math.max(0, plan.daily_post_limit - usage.posts_generated_today),
                },
                monthly: {
                    used: usage.posts_generated_this_month,
                    limit: plan.monthly_post_limit,
                    remaining: Math.max(0, plan.monthly_post_limit - usage.posts_generated_this_month),
                },
                total: usage.total_posts_generated,
            };
        } catch (error) {
            console.error('Error getting usage stats:', error);
            throw new Error('Failed to get usage stats');
        }
    }

    /**
     * Get plan limits for a user
     */
    static async getPlanLimits(userId: string) {
        const supabase = createServerSupabaseClient();

        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const { data: plan, error: planError } = await supabase
                .from('plans')
                .select('*')
                .eq('id', profile.plan)
                .single();

            if (planError) throw planError;

            return plan;
        } catch (error) {
            console.error('Error getting plan limits:', error);
            throw new Error('Failed to get plan limits');
        }
    }
}
