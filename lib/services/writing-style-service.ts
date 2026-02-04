/**
 * Writing Style Service
 * Analyzes user's writing style from sample posts and applies it to generation
 */

import { createServerSupabaseClient } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface StyleProfile {
    id: string;
    user_id: string;
    name: string;
    is_active: boolean;
    is_default: boolean;
    sample_posts: string[];
    tone_profile: Record<string, any>;
    sentence_structure: Record<string, any>;
    emoji_usage: Record<string, any>;
    cta_style: Record<string, any>;
    vocabulary: Record<string, any>;
    formatting_style: Record<string, any>;
    style_summary: string | null;
    ai_prompt_additions: string | null;
    trained_at: string | null;
    sample_count: number;
    created_at: string;
    updated_at: string;
}

export interface StyleAnalysis {
    tone_profile: {
        dominant_tone: string;
        formality_level: number; // 1-10
        enthusiasm_level: number; // 1-10
        confidence_level: number; // 1-10;
    };
    sentence_structure: {
        avg_sentence_length: number;
        avg_words_per_sentence: number;
        complexity_score: number; // 1-10
        uses_short_sentences: boolean;
        uses_long_sentences: boolean;
    };
    emoji_usage: {
        frequency: number; // per post
        types: string[]; // common emojis used
        placement: string; // 'beginning', 'middle', 'end', 'throughout'
    };
    cta_style: {
        has_cta: boolean;
        cta_type: string; // 'question', 'command', 'invitation', 'none'
        cta_examples: string[];
    };
    vocabulary: {
        common_words: string[];
        unique_phrases: string[];
        technical_level: number; // 1-10
    };
    formatting_style: {
        uses_line_breaks: boolean;
        uses_bullets: boolean;
        uses_numbers: boolean;
        paragraph_count: number;
    };
}

export class WritingStyleService {
    /**
     * Analyze sample posts and extract writing style
     */
    static async analyzeSamplePosts(samplePosts: string[]): Promise<StyleAnalysis> {
        if (!genAI) {
            throw new Error('Gemini API not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const prompt = `Analyze the following LinkedIn posts and extract the author's writing style characteristics.

Sample Posts:
${samplePosts.map((post, i) => `\n--- Post ${i + 1} ---\n${post}`).join('\n')}

Analyze and return a JSON object with the following structure:
{
  "tone_profile": {
    "dominant_tone": "professional|casual|enthusiastic|authoritative|friendly",
    "formality_level": 1-10,
    "enthusiasm_level": 1-10,
    "confidence_level": 1-10
  },
  "sentence_structure": {
    "avg_sentence_length": number,
    "avg_words_per_sentence": number,
    "complexity_score": 1-10,
    "uses_short_sentences": boolean,
    "uses_long_sentences": boolean
  },
  "emoji_usage": {
    "frequency": number,
    "types": ["emoji1", "emoji2"],
    "placement": "beginning|middle|end|throughout|none"
  },
  "cta_style": {
    "has_cta": boolean,
    "cta_type": "question|command|invitation|none",
    "cta_examples": ["example1", "example2"]
  },
  "vocabulary": {
    "common_words": ["word1", "word2"],
    "unique_phrases": ["phrase1", "phrase2"],
    "technical_level": 1-10
  },
  "formatting_style": {
    "uses_line_breaks": boolean,
    "uses_bullets": boolean,
    "uses_numbers": boolean,
    "paragraph_count": number
  }
}

Return ONLY the JSON object, no other text.`;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Failed to extract JSON from AI response');
            }

            const analysis: StyleAnalysis = JSON.parse(jsonMatch[0]);
            return analysis;
        } catch (error) {
            console.error('Error analyzing writing style:', error);
            throw new Error('Failed to analyze writing style');
        }
    }

    /**
     * Generate AI prompt additions based on style analysis
     */
    static generatePromptAdditions(analysis: StyleAnalysis): string {
        const additions: string[] = [];

        // Tone
        additions.push(`Write in a ${analysis.tone_profile.dominant_tone} tone.`);

        if (analysis.tone_profile.formality_level > 7) {
            additions.push('Use formal, professional language.');
        } else if (analysis.tone_profile.formality_level < 4) {
            additions.push('Use casual, conversational language.');
        }

        // Sentence structure
        if (analysis.sentence_structure.uses_short_sentences) {
            additions.push('Use short, punchy sentences.');
        }
        if (analysis.sentence_structure.avg_words_per_sentence < 15) {
            additions.push(`Keep sentences concise (average ${Math.round(analysis.sentence_structure.avg_words_per_sentence)} words).`);
        }

        // Emojis
        if (analysis.emoji_usage.frequency > 0) {
            additions.push(`Include approximately ${Math.round(analysis.emoji_usage.frequency)} emojis per post.`);
            if (analysis.emoji_usage.types.length > 0) {
                additions.push(`Prefer emojis like: ${analysis.emoji_usage.types.slice(0, 3).join(', ')}`);
            }
        }

        // CTA
        if (analysis.cta_style.has_cta) {
            additions.push(`Include a ${analysis.cta_style.cta_type}-style call-to-action.`);
        }

        // Formatting
        if (analysis.formatting_style.uses_line_breaks) {
            additions.push('Use line breaks for readability.');
        }
        if (analysis.formatting_style.uses_bullets) {
            additions.push('Use bullet points or numbered lists when appropriate.');
        }

        // Vocabulary
        if (analysis.vocabulary.unique_phrases.length > 0) {
            additions.push(`Consider using phrases like: "${analysis.vocabulary.unique_phrases.slice(0, 2).join('", "')}"`);
        }

        return additions.join(' ');
    }

    /**
     * Generate human-readable style summary
     */
    static generateStyleSummary(analysis: StyleAnalysis): string {
        const parts: string[] = [];

        parts.push(`Your writing style is ${analysis.tone_profile.dominant_tone}`);

        if (analysis.sentence_structure.uses_short_sentences) {
            parts.push('with short, impactful sentences');
        }

        if (analysis.emoji_usage.frequency > 2) {
            parts.push('and frequent emoji usage');
        } else if (analysis.emoji_usage.frequency > 0) {
            parts.push('with occasional emojis');
        }

        if (analysis.cta_style.has_cta) {
            parts.push(`You typically end with ${analysis.cta_style.cta_type}s`);
        }

        if (analysis.formatting_style.uses_bullets) {
            parts.push('and often use bullet points for clarity');
        }

        return parts.join(', ') + '.';
    }

    /**
     * Create a new style profile
     */
    static async createStyleProfile(
        userId: string,
        name: string,
        samplePosts: string[]
    ): Promise<StyleProfile> {
        if (samplePosts.length < 3) {
            throw new Error('At least 3 sample posts are required');
        }

        if (samplePosts.length > 10) {
            throw new Error('Maximum 10 sample posts allowed');
        }

        const supabase = createServerSupabaseClient();

        // Analyze the writing style
        const analysis = await this.analyzeSamplePosts(samplePosts);

        // Generate prompt additions
        const promptAdditions = this.generatePromptAdditions(analysis);

        // Generate style summary
        const styleSummary = this.generateStyleSummary(analysis);

        // Create the profile
        const { data, error } = await supabase
            .from('style_profiles')
            .insert({
                user_id: userId,
                name,
                sample_posts: samplePosts,
                tone_profile: analysis.tone_profile,
                sentence_structure: analysis.sentence_structure,
                emoji_usage: analysis.emoji_usage,
                cta_style: analysis.cta_style,
                vocabulary: analysis.vocabulary,
                formatting_style: analysis.formatting_style,
                style_summary: styleSummary,
                ai_prompt_additions: promptAdditions,
                trained_at: new Date().toISOString(),
                sample_count: samplePosts.length,
                is_active: true,
                is_default: false,
            })
            .select()
            .single();

        if (error) throw error;

        return data;
    }

    /**
     * Get user's style profiles
     */
    static async getUserProfiles(userId: string): Promise<StyleProfile[]> {
        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('style_profiles')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data || [];
    }

    /**
     * Get default style profile for user
     */
    static async getDefaultProfile(userId: string): Promise<StyleProfile | null> {
        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('style_profiles')
            .select('*')
            .eq('user_id', userId)
            .eq('is_default', true)
            .eq('is_active', true)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return data;
    }

    /**
     * Set default style profile
     */
    static async setDefaultProfile(userId: string, profileId: string): Promise<void> {
        const supabase = createServerSupabaseClient();

        // Remove default from all profiles
        await supabase
            .from('style_profiles')
            .update({ is_default: false })
            .eq('user_id', userId);

        // Set new default
        const { error } = await supabase
            .from('style_profiles')
            .update({ is_default: true })
            .eq('id', profileId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Toggle profile active status
     */
    static async toggleProfileActive(
        userId: string,
        profileId: string,
        isActive: boolean
    ): Promise<void> {
        const supabase = createServerSupabaseClient();

        const { error } = await supabase
            .from('style_profiles')
            .update({ is_active: isActive })
            .eq('id', profileId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Delete style profile
     */
    static async deleteProfile(userId: string, profileId: string): Promise<void> {
        const supabase = createServerSupabaseClient();

        const { error } = await supabase
            .from('style_profiles')
            .delete()
            .eq('id', profileId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Get profile by ID
     */
    static async getProfileById(userId: string, profileId: string): Promise<StyleProfile | null> {
        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('style_profiles')
            .select('*')
            .eq('id', profileId)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        return data;
    }
}
