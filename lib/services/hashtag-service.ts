/**
 * Hashtag Intelligence Service
 * Analyzes and categorizes hashtags with engagement insights
 */

import { createServerSupabaseClient } from '../supabase';
import type { HashtagCategory, HashtagIntelligence } from '@/types/database';

export interface HashtagAnalysis {
    tag: string;
    category: HashtagCategory;
    relevanceScore: number;
    estimatedReach: string;
    competitionLevel: string;
}

export class HashtagService {
    /**
     * Analyze and categorize hashtags
     */
    static analyzeHashtags(
        hashtags: string,
        postContent: string,
        planLimit: number
    ): HashtagAnalysis[] {
        // Extract hashtags
        const tags = hashtags.match(/#[\w]+/g) || [];
        const analyzed: HashtagAnalysis[] = [];

        for (const tag of tags.slice(0, planLimit)) {
            const cleanTag = tag.replace('#', '').toLowerCase();
            const category = this.categorizeHashtag(cleanTag, postContent);
            const relevanceScore = this.calculateRelevance(cleanTag, postContent);
            const estimatedReach = this.estimateReach(cleanTag);
            const competitionLevel = this.estimateCompetition(cleanTag);

            analyzed.push({
                tag,
                category,
                relevanceScore,
                estimatedReach,
                competitionLevel,
            });
        }

        return analyzed;
    }

    /**
     * Categorize hashtag
     */
    private static categorizeHashtag(tag: string, content: string): HashtagCategory {
        const contentLower = content.toLowerCase();
        const tagLower = tag.toLowerCase();

        // Branded hashtags (company names, personal brands)
        if (this.isBrandedHashtag(tagLower)) {
            return 'branded';
        }

        // Trending hashtags (common trending topics)
        if (this.isTrendingHashtag(tagLower)) {
            return 'trending';
        }

        // Niche hashtags (specific, technical, industry-specific)
        if (this.isNicheHashtag(tagLower, contentLower)) {
            return 'niche';
        }

        // Broad hashtags (general topics)
        return 'broad';
    }

    /**
     * Check if hashtag is branded
     */
    private static isBrandedHashtag(tag: string): boolean {
        // Simple heuristic: contains numbers, camelCase, or is very specific
        return /\d/.test(tag) || /[A-Z]/.test(tag) || tag.length > 20;
    }

    /**
     * Check if hashtag is trending
     */
    private static isTrendingHashtag(tag: string): boolean {
        const trendingKeywords = [
            'ai', 'chatgpt', 'tech', 'startup', 'innovation', 'future',
            'leadership', 'growth', 'success', 'motivation', 'productivity',
            'remote', 'wfh', 'digital', 'saas', 'b2b', 'marketing'
        ];

        return trendingKeywords.some(keyword => tag.includes(keyword));
    }

    /**
     * Check if hashtag is niche
     */
    private static isNicheHashtag(tag: string, content: string): boolean {
        // If the tag appears in the content or is very specific (long)
        return content.includes(tag) || tag.length > 15;
    }

    /**
     * Calculate relevance score
     */
    private static calculateRelevance(tag: string, content: string): number {
        const contentLower = content.toLowerCase();
        const tagLower = tag.toLowerCase();

        let score = 50; // Base score

        // Boost if tag appears in content
        if (contentLower.includes(tagLower)) {
            score += 30;
        }

        // Boost if tag words appear in content
        const tagWords = tagLower.split(/(?=[A-Z])/); // Split camelCase
        const matchingWords = tagWords.filter(word =>
            contentLower.includes(word.toLowerCase())
        );
        score += matchingWords.length * 5;

        // Penalize very long tags
        if (tagLower.length > 20) {
            score -= 10;
        }

        return Math.min(100, Math.max(0, score));
    }

    /**
     * Estimate reach
     */
    private static estimateReach(tag: string): string {
        const length = tag.length;

        // Shorter, more general tags = higher reach
        if (length <= 10) return 'high';
        if (length <= 15) return 'medium';
        return 'low';
    }

    /**
     * Estimate competition
     */
    private static estimateCompetition(tag: string): string {
        const length = tag.length;

        // Shorter tags = higher competition
        if (length <= 10) return 'high';
        if (length <= 15) return 'medium';
        return 'low';
    }

    /**
     * Store hashtag intelligence in database
     */
    static async storeHashtagIntelligence(
        postId: string,
        analyses: HashtagAnalysis[]
    ): Promise<void> {
        const supabase = createServerSupabaseClient();

        try {
            const records = analyses.map(analysis => ({
                post_id: postId,
                hashtag: analysis.tag,
                category: analysis.category,
                relevance_score: analysis.relevanceScore,
                estimated_reach: analysis.estimatedReach,
                competition_level: analysis.competitionLevel,
            }));

            const { error } = await supabase
                .from('hashtag_intelligence')
                .insert(records);

            if (error) throw error;
        } catch (error) {
            console.error('Error storing hashtag intelligence:', error);
            // Don't throw - this is optional metadata
        }
    }

    /**
     * Get hashtag intelligence for a post
     */
    static async getHashtagIntelligence(postId: string): Promise<HashtagIntelligence[]> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('hashtag_intelligence')
                .select('*')
                .eq('post_id', postId)
                .order('relevance_score', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error getting hashtag intelligence:', error);
            return [];
        }
    }

    /**
     * Get hashtag summary
     */
    static async getHashtagSummary(postId: string) {
        const intelligence = await this.getHashtagIntelligence(postId);

        const summary = {
            niche: 0,
            broad: 0,
            trending: 0,
            branded: 0,
            avgRelevance: 0,
            highReach: 0,
            mediumReach: 0,
            lowReach: 0,
        };

        intelligence.forEach(item => {
            summary[item.category]++;
            summary.avgRelevance += item.relevance_score || 0;

            if (item.estimated_reach === 'high') summary.highReach++;
            else if (item.estimated_reach === 'medium') summary.mediumReach++;
            else summary.lowReach++;
        });

        if (intelligence.length > 0) {
            summary.avgRelevance = Math.round(summary.avgRelevance / intelligence.length);
        }

        return summary;
    }

    /**
     * Generate optimized hashtags based on content and plan
     */
    static generateOptimizedHashtags(
        content: string,
        planLimit: number
    ): string[] {
        // Extract key topics from content
        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 4);

        // Count word frequency
        const frequency: Record<string, number> = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        // Sort by frequency
        const sorted = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .map(([word]) => word);

        // Mix of niche (specific) and broad (general) hashtags
        const hashtags: string[] = [];

        // Add top specific keywords (niche)
        hashtags.push(...sorted.slice(0, Math.ceil(planLimit / 2)));

        // Add some broad industry hashtags
        const broadHashtags = [
            'linkedin', 'professional', 'career', 'business',
            'leadership', 'growth', 'innovation', 'success'
        ];

        hashtags.push(...broadHashtags.slice(0, Math.floor(planLimit / 2)));

        return hashtags
            .slice(0, planLimit)
            .map(tag => `#${tag.charAt(0).toUpperCase() + tag.slice(1)}`);
    }
}
