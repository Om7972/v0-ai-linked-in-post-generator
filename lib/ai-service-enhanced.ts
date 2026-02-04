/**
 * Enhanced AI Service with Writing Style Support
 * Wraps Gemini service to add personal writing style
 */

import { generateLinkedInPost as geminiGenerate, generateHashtags as geminiHashtags } from './gemini';
import { WritingStyleService } from './services/writing-style-service';

export interface EnhancedGenerateParams {
    topic: string;
    audience: string;
    tone: "professional" | "founder" | "influencer" | "casual";
    length: "short" | "medium" | "long";
    cta: string;
    userId?: string;
    usePersonalStyle?: boolean;
}

/**
 * Generate LinkedIn post with optional personal writing style
 */
export async function generateLinkedInPostWithStyle(params: EnhancedGenerateParams) {
    let personalStylePrompt: string | undefined;

    // Get personal writing style if requested
    if (params.usePersonalStyle && params.userId) {
        const defaultProfile = await WritingStyleService.getDefaultProfile(params.userId);
        if (defaultProfile && defaultProfile.is_active && defaultProfile.ai_prompt_additions) {
            personalStylePrompt = defaultProfile.ai_prompt_additions;
            console.log('✅ Using personal writing style:', defaultProfile.name);
        }
    }

    // Generate with Gemini
    return await geminiGenerate({
        topic: params.topic,
        audience: params.audience,
        tone: params.tone,
        length: params.length,
        cta: params.cta,
        personalStylePrompt,
    });
}

// Re-export hashtag generation
export { geminiHashtags as generateHashtags };
