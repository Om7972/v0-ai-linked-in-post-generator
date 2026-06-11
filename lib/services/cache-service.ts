/**
 * Cache Service
 * Handles AI response caching to reduce API costs
 */

import { createServerSupabaseClient } from '../supabase';
import crypto from 'crypto';

export interface CacheParams {
    topic: string;
    tone: string;
    audience?: string;
    length: string;
    cta?: string;
    templateId?: string;
}

export interface CachedResponse {
    content: string;
    hashtags: string | null;
    engagement_score: number | null;
    cached: boolean;
}

export class CacheService {
    /**
     * Generate cache key from parameters
     */
    static generateCacheKey(params: CacheParams): string {
        const normalized = {
            topic: params.topic.toLowerCase().trim(),
            tone: params.tone.toLowerCase().trim(),
            audience: params.audience?.toLowerCase().trim() || '',
            length: params.length.toLowerCase().trim(),
            cta: params.cta?.toLowerCase().trim() || '',
            templateId: params.templateId || '',
        };

        const keyString = JSON.stringify(normalized);
        return crypto.createHash('sha256').update(keyString).digest('hex');
    }

    /**
     * Get cached response if available
     */
    static async get(params: CacheParams): Promise<CachedResponse | null> {
        const supabase = createServerSupabaseClient();
        const cacheKey = this.generateCacheKey(params);

        try {
            const { data, error } = await supabase
                .from('ai_response_cache')
                .select('*')
                .eq('cache_key', cacheKey)
                .gt('expires_at', new Date().toISOString())
                .single();

            if (error || !data) {
                return null;
            }

            // Update hit count and last hit time
            await supabase
                .from('ai_response_cache')
                .update({
                    hit_count: data.hit_count + 1,
                    last_hit_at: new Date().toISOString(),
                })
                .eq('id', data.id);

            return {
                content: data.content,
                hashtags: data.hashtags,
                engagement_score: data.engagement_score,
                cached: true,
            };
        } catch (error) {
            console.error('Error getting cached response:', error);
            return null;
        }
    }

    /**
     * Store response in cache
     */
    static async set(
        params: CacheParams,
        response: {
            content: string;
            hashtags: string | null;
            engagement_score: number | null;
        },
        expiryDays: number = 7
    ): Promise<void> {
        const supabase = createServerSupabaseClient();
        const cacheKey = this.generateCacheKey(params);

        try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + expiryDays);

            await supabase
                .from('ai_response_cache')
                .upsert({
                    cache_key: cacheKey,
                    topic: params.topic,
                    tone: params.tone,
                    audience: params.audience || null,
                    length: params.length,
                    cta: params.cta || null,
                    template_id: params.templateId || null,
                    content: response.content,
                    hashtags: response.hashtags,
                    engagement_score: response.engagement_score,
                    hit_count: 0,
                    expires_at: expiresAt.toISOString(),
                }, {
                    onConflict: 'cache_key',
                });
        } catch (error) {
            console.error('Error caching response:', error);
            // Don't throw - caching is optional
        }
    }

    /**
     * Clean up expired cache entries
     */
    static async cleanup(): Promise<number> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .rpc('cleanup_expired_cache');

            if (error) throw error;

            return data || 0;
        } catch (error) {
            console.error('Error cleaning up cache:', error);
            return 0;
        }
    }

    /**
     * Get cache statistics
     */
    static async getStats() {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('ai_response_cache')
                .select('hit_count, created_at, expires_at');

            if (error) throw error;

            const total = data?.length || 0;
            const totalHits = data?.reduce((sum, item) => sum + item.hit_count, 0) || 0;
            const avgHits = total > 0 ? totalHits / total : 0;

            return {
                total,
                totalHits,
                avgHits: Math.round(avgHits * 100) / 100,
                savingsEstimate: totalHits * 0.01, // Assuming $0.01 per API call
            };
        } catch (error) {
            console.error('Error getting cache stats:', error);
            return {
                total: 0,
                totalHits: 0,
                avgHits: 0,
                savingsEstimate: 0,
            };
        }
    }
}
