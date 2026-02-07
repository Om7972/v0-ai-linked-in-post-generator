/**
 * Usage Service
 * Handles usage tracking and limit enforcement
 */

import { createServerSupabaseClient } from '../supabase';
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
            // Get usage data (safe fetch)
            const { data: usage, error: usageError } = await supabase
                .from('usage')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (usageError) throw usageError;

            // Get profile plan (safe fetch)
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .maybeSingle();

            if (profileError) throw profileError;

            // Default values if records are missing
            const planId = profile?.plan || 'free';
            const currentUsage = usage || {
                posts_generated_today: 0,
                posts_generated_this_month: 0,
                total_posts_generated: 0
            };

            // Get plan limits (safe fetch)
            let { data: plan, error: planError } = await supabase
                .from('plans')
                .select('daily_post_limit, monthly_post_limit')
                .eq('id', planId)
                .maybeSingle();

            if (planError && planError.code !== 'PGRST116') throw planError;

            // Fallback limits for free plan if plan not found
            if (!plan) {
                plan = {
                    daily_post_limit: 5,
                    monthly_post_limit: 15
                };
            }

            return {
                daily: {
                    used: currentUsage.posts_generated_today || 0,
                    limit: plan.daily_post_limit,
                    remaining: Math.max(0, plan.daily_post_limit - (currentUsage.posts_generated_today || 0)),
                },
                monthly: {
                    used: currentUsage.posts_generated_this_month || 0,
                    limit: plan.monthly_post_limit,
                    remaining: Math.max(0, plan.monthly_post_limit - (currentUsage.posts_generated_this_month || 0)),
                },
                total: currentUsage.total_posts_generated || 0,
            };
        } catch (error) {
            console.error('Error getting usage stats:', error);
            // Return safe default structure instead of crashing
            return {
                daily: { used: 0, limit: 5, remaining: 5 },
                monthly: { used: 0, limit: 15, remaining: 15 },
                total: 0
            };
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
                .maybeSingle();

            if (profileError) throw profileError;

            const planId = profile?.plan || 'free';

            let { data: plan, error: planError } = await supabase
                .from('plans')
                .select('*')
                .eq('id', planId)
                .maybeSingle();

            if (planError && planError.code !== 'PGRST116') throw planError;

            if (!plan) {
                // Return default free plan structure if missing
                return {
                    id: 'free',
                    name: 'Free',
                    daily_post_limit: 5,
                    monthly_post_limit: 15,
                    price: 0
                };
            }

            return plan;
        } catch (error) {
            console.error('Error getting plan limits:', error);
            // Return safe default
            return {
                id: 'free',
                name: 'Free',
                daily_post_limit: 5,
                monthly_post_limit: 15,
                price: 0
            };
        }
    }
}
