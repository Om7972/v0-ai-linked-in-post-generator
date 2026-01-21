/**
 * AI Service Abstraction Layer
 * Provides a unified interface for different AI providers (Groq, Gemini, etc.)
 * Falls back to different providers if the primary one fails
 */

import { 
  GeneratePostParams, 
  GeneratedPost,
  generateLinkedInPost as geminiGenerateLinkedInPost,
  generateHashtags as geminiGenerateHashtags,
  refineLinkedInPost as geminiRefineLinkedInPost
} from "./gemini";

// Try to import Groq - if it fails, we'll handle it gracefully
let groqModule: any;
let groqAvailable = false;

try {
  // We'll dynamically import groq when needed
  groqAvailable = !!process.env.GROQ_API_KEY;
} catch (e) {
  console.log("Groq not available, using fallback");
}

// Import the prompt templates
import { getPromptTemplate } from "./promptTemplates";


/**
 * Generate a LinkedIn post using the available AI provider
 * Priority: Groq -> Gemini -> Mock (if needed)
 */
export async function generateLinkedInPost(params: GeneratePostParams): Promise<GeneratedPost> {
  // Try Groq first (now enabled with updated model)
  if (process.env.GROQ_API_KEY) {
    try {
      const { generateLinkedInPost: groqGenerateLinkedInPost } = await import("./groq");
      return await groqGenerateLinkedInPost(params);
    } catch (error) {
      console.warn("Groq failed, falling back to Gemini:", error);
      // Continue to Gemini
    }
  }

  // Try Gemini if available
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      return await geminiGenerateLinkedInPost(params);
    } catch (error) {
      console.warn("Gemini failed, falling back to mock:", error);
      // Continue to mock
    }
  }

  // If both fail, return mock data
  return generateMockPost(params);
}

/**
 * Generate hashtags using the available AI provider
 */
export async function generateHashtags(postContent: string): Promise<string> {
  // Try Groq first for hashtags (now enabled with updated model)
  if (process.env.GROQ_API_KEY) {
    try {
      const { generateHashtags: groqGenerateHashtags } = await import("./groq");
      return await groqGenerateHashtags(postContent);
    } catch (error) {
      console.warn("Groq failed for hashtags, falling back to Gemini:", error);
      // Continue to Gemini
    }
  }

  // Try Gemini if available
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      return await geminiGenerateHashtags(postContent);
    } catch (error) {
      console.warn("Gemini failed for hashtags, falling back to mock:", error);
    }
  }

  // If both fail, return mock hashtags
  return generateMockHashtags(postContent);
}

/**
 * Refine a LinkedIn post using the available AI provider
 */
export async function refineLinkedInPost(
  currentPost: string,
  refinementType: string,
  customInstruction?: string
): Promise<string> {
  // Try Groq first for refinement (now enabled with updated model)
  if (process.env.GROQ_API_KEY) {
    try {
      const { refineLinkedInPost: groqRefineLinkedInPost } = await import("./groq");
      return await groqRefineLinkedInPost(currentPost, refinementType, customInstruction);
    } catch (error) {
      console.warn("Groq failed for refinement, falling back to Gemini:", error);
      // Continue to Gemini
    }
  }

  // Try Gemini if available
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      return await geminiRefineLinkedInPost(currentPost, refinementType, customInstruction);
    } catch (error) {
      console.warn("Gemini failed for refinement, falling back to mock:", error);
    }
  }

  // If both fail, return the original post
  return currentPost;
}

/**
 * Generate mock post for fallback
 */
function generateMockPost(params: GeneratePostParams): GeneratedPost {
  // Simple fallback implementation
  const mockContent = `Here's a thought on ${params.topic} for ${params.audience}:

In today's rapidly evolving landscape, ${params.topic} continues to shape how we approach challenges. As ${params.audience}, we often find that the most impactful strategies involve both innovation and practical application.

Key considerations:
- Understanding the fundamentals of ${params.topic}
- Applying best practices in your specific context
- Engaging authentically with your community

What are your thoughts on this? ${params.cta}`;

  return {
    content: mockContent,
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0
    }
  };
}

/**
 * Generate mock hashtags for fallback
 */
function generateMockHashtags(postContent: string): string {
  // Extract potential topics from the post content
  const words = postContent.split(/\W+/).filter(word => word.length > 4);
  const uniqueWords = [...new Set(words)].slice(0, 5);
  
  return uniqueWords.map(word => `#${word}`).join(' ');
}