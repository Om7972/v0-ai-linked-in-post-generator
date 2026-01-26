/**
 * Engagement Score Engine
 * Calculates engagement potential based on multiple factors
 */

export interface EngagementFactors {
    content: string;
    hashtags: string;
    hasMedia?: boolean;
    hasEmojis?: boolean;
    hasCTA?: boolean;
}

export interface EngagementBreakdown {
    score: number;
    potential: string;
    factors: {
        contentLength: number;
        readability: number;
        structure: number;
        cta: number;
        hashtags: number;
        emojis: number;
        questions: number;
        formatting: number;
    };
    recommendations: string[];
}

export class EngagementScoreEngine {
    /**
     * Calculate comprehensive engagement score (0-100)
     */
    static calculate(factors: EngagementFactors): EngagementBreakdown {
        const scores = {
            contentLength: this.scoreContentLength(factors.content),
            readability: this.scoreReadability(factors.content),
            structure: this.scoreStructure(factors.content),
            cta: this.scoreCTA(factors.content),
            hashtags: this.scoreHashtags(factors.hashtags),
            emojis: this.scoreEmojis(factors.content),
            questions: this.scoreQuestions(factors.content),
            formatting: this.scoreFormatting(factors.content),
        };

        // Weighted average
        const totalScore = Math.round(
            scores.contentLength * 0.15 +
            scores.readability * 0.15 +
            scores.structure * 0.15 +
            scores.cta * 0.15 +
            scores.hashtags * 0.10 +
            scores.emojis * 0.10 +
            scores.questions * 0.10 +
            scores.formatting * 0.10
        );

        const recommendations = this.generateRecommendations(scores, factors);

        return {
            score: Math.min(100, Math.max(0, totalScore)),
            potential: this.getPotentialLabel(totalScore),
            factors: scores,
            recommendations,
        };
    }

    /**
     * Score content length (optimal: 150-300 words)
     */
    private static scoreContentLength(content: string): number {
        const wordCount = content.split(/\s+/).length;

        if (wordCount >= 150 && wordCount <= 300) return 100;
        if (wordCount >= 100 && wordCount <= 400) return 80;
        if (wordCount >= 50 && wordCount <= 500) return 60;
        if (wordCount < 50) return 30;
        return 40; // Too long
    }

    /**
     * Score readability (sentence length, complexity)
     */
    private static scoreReadability(content: string): number {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/);
        const avgWordsPerSentence = words.length / sentences.length;

        let score = 50;

        // Optimal: 10-20 words per sentence
        if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) {
            score += 30;
        } else if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 25) {
            score += 20;
        } else if (avgWordsPerSentence < 8) {
            score += 10; // Too choppy
        }

        // Check for complex words (> 12 characters)
        const complexWords = words.filter(w => w.length > 12).length;
        const complexRatio = complexWords / words.length;

        if (complexRatio < 0.1) score += 20;
        else if (complexRatio < 0.2) score += 10;

        return Math.min(100, score);
    }

    /**
     * Score structure (paragraphs, line breaks, lists)
     */
    private static scoreStructure(content: string): number {
        let score = 50;

        // Line breaks (good for readability)
        const lineBreaks = (content.match(/\n/g) || []).length;
        if (lineBreaks >= 3) score += 20;
        else if (lineBreaks >= 1) score += 10;

        // Bullet points or numbered lists
        const hasBullets = /[•\-\*]\s/.test(content) || /\d+\.\s/.test(content);
        if (hasBullets) score += 15;

        // Opening hook (first sentence is short and punchy)
        const firstSentence = content.split(/[.!?]/)[0];
        if (firstSentence && firstSentence.split(/\s+/).length <= 15) {
            score += 15;
        }

        return Math.min(100, score);
    }

    /**
     * Score CTA strength
     */
    private static scoreCTA(content: string): number {
        const contentLower = content.toLowerCase();

        // Strong CTAs
        const strongCTAs = [
            'comment below', 'share your', 'let me know', 'what do you think',
            'drop a', 'tell me', 'share this', 'tag someone', 'thoughts?'
        ];

        // Medium CTAs
        const mediumCTAs = [
            'comment', 'share', 'thoughts', 'agree', 'disagree',
            'experience', 'opinion', 'feedback'
        ];

        // Check for strong CTAs
        const hasStrongCTA = strongCTAs.some(cta => contentLower.includes(cta));
        if (hasStrongCTA) return 100;

        // Check for medium CTAs
        const hasMediumCTA = mediumCTAs.some(cta => contentLower.includes(cta));
        if (hasMediumCTA) return 70;

        // Check for questions (implicit CTA)
        const hasQuestion = content.includes('?');
        if (hasQuestion) return 50;

        return 30; // No clear CTA
    }

    /**
     * Score hashtags (optimal: 3-5 hashtags)
     */
    private static scoreHashtags(hashtags: string): number {
        const hashtagCount = (hashtags.match(/#/g) || []).length;

        if (hashtagCount >= 3 && hashtagCount <= 5) return 100;
        if (hashtagCount >= 2 && hashtagCount <= 7) return 80;
        if (hashtagCount >= 1 && hashtagCount <= 10) return 60;
        if (hashtagCount === 0) return 20;
        return 40; // Too many hashtags
    }

    /**
     * Score emoji usage (optimal: 2-5 emojis)
     */
    private static scoreEmojis(content: string): number {
        // Simple emoji detection (Unicode ranges)
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        const emojiCount = (content.match(emojiRegex) || []).length;

        if (emojiCount >= 2 && emojiCount <= 5) return 100;
        if (emojiCount >= 1 && emojiCount <= 7) return 80;
        if (emojiCount === 0) return 50; // Neutral - emojis are optional
        return 40; // Too many emojis
    }

    /**
     * Score questions (engagement driver)
     */
    private static scoreQuestions(content: string): number {
        const questionCount = (content.match(/\?/g) || []).length;

        if (questionCount >= 1 && questionCount <= 3) return 100;
        if (questionCount === 0) return 40;
        return 60; // Too many questions
    }

    /**
     * Score formatting (bold, italics, etc.)
     */
    private static scoreFormatting(content: string): number {
        let score = 50;

        // Check for emphasis (caps for key words)
        const capsWords = content.match(/\b[A-Z]{2,}\b/g) || [];
        if (capsWords.length >= 1 && capsWords.length <= 3) {
            score += 25;
        }

        // Check for numbers/stats (engaging)
        const hasNumbers = /\d+%|\d+x|\$\d+|\d+\+/.test(content);
        if (hasNumbers) score += 25;

        return Math.min(100, score);
    }

    /**
     * Get potential label
     */
    private static getPotentialLabel(score: number): string {
        if (score >= 90) return 'Exceptional - Viral potential';
        if (score >= 80) return 'Excellent - High engagement potential';
        if (score >= 70) return 'Very Good - Strong engagement potential';
        if (score >= 60) return 'Good - Solid engagement potential';
        if (score >= 50) return 'Fair - Moderate engagement potential';
        if (score >= 40) return 'Below Average - Needs improvement';
        return 'Poor - Significant improvement needed';
    }

    /**
     * Generate recommendations
     */
    private static generateRecommendations(
        scores: Record<string, number>,
        factors: EngagementFactors
    ): string[] {
        const recommendations: string[] = [];

        if (scores.contentLength < 70) {
            const wordCount = factors.content.split(/\s+/).length;
            if (wordCount < 100) {
                recommendations.push('Add more detail - aim for 150-300 words for optimal engagement');
            } else {
                recommendations.push('Consider shortening your post - keep it under 400 words');
            }
        }

        if (scores.cta < 70) {
            recommendations.push('Add a clear call-to-action - ask a question or invite comments');
        }

        if (scores.hashtags < 70) {
            const hashtagCount = (factors.hashtags.match(/#/g) || []).length;
            if (hashtagCount < 3) {
                recommendations.push('Add more hashtags - aim for 3-5 relevant hashtags');
            } else {
                recommendations.push('Reduce hashtags - stick to 3-5 most relevant ones');
            }
        }

        if (scores.structure < 70) {
            recommendations.push('Improve structure - add line breaks and bullet points for readability');
        }

        if (scores.emojis < 60) {
            recommendations.push('Consider adding 2-3 relevant emojis to increase visual appeal');
        }

        if (scores.questions < 70) {
            recommendations.push('Ask a question to encourage engagement and discussion');
        }

        if (scores.formatting < 70) {
            recommendations.push('Add numbers or stats to make your post more compelling');
        }

        if (recommendations.length === 0) {
            recommendations.push('Great job! Your post is well-optimized for engagement');
        }

        return recommendations;
    }

    /**
     * Quick score (simplified version for API)
     */
    static quickScore(content: string, hashtags: string): number {
        return this.calculate({ content, hashtags }).score;
    }
}
