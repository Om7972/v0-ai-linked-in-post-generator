/**
 * Groq AI Integration
 * 
 * Server-only Groq client for generating LinkedIn posts.
 * API key is never exposed to the client.
 */

import Groq from "groq-sdk";
import { getPromptTemplate } from "./promptTemplates";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not set. Using fallback service.");
}

// Initialize Groq client if API key exists
const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-70b-8192";
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

export interface GeneratePostParams {
  topic: string;
  audience: string;
  tone: "professional" | "founder" | "influencer" | "casual";
  length: "short" | "medium" | "long";
  cta: string;
  grounding?: boolean; // Not applicable for Groq
}

export interface GeneratedPost {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Generate a LinkedIn post using Groq AI
 */
export async function generateLinkedInPost(
  params: GeneratePostParams
): Promise<GeneratedPost> {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  try {
    // Get prompt template based on tone
    const promptTemplate = getPromptTemplate(params.tone);
    
    // Build the full prompt
    const prompt = promptTemplate
      .replace("{{TOPIC}}", params.topic)
      .replace("{{AUDIENCE}}", params.audience)
      .replace("{{LENGTH}}", params.length)
      .replace("{{CTA}}", params.cta);

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: GROQ_MODEL, // Updated model name that works
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
    });

    const content = chatCompletion.choices[0]?.message?.content || "";
    
    // Extract usage information
    const usage = chatCompletion.usage ? {
      promptTokens: chatCompletion.usage.prompt_tokens,
      completionTokens: chatCompletion.usage.completion_tokens,
      totalTokens: chatCompletion.usage.total_tokens,
    } : undefined;

    return {
      content: content.trim(),
      usage,
    };
  } catch (error: any) {
    console.error("Groq API error:", error);
    
    // Handle specific error types
    if (error.message?.includes("API key")) {
      throw new Error("Invalid Groq API key");
    }
    
    if (error.message?.includes("quota") || error.status === 429) {
      throw new Error("Groq API quota exceeded");
    }
    
    if (error.status === 401) {
      throw new Error("Unauthorized: Invalid Groq API key");
    }
    
    if (error.status === 403) {
      throw new Error("Access forbidden: Check your Groq account permissions");
    }
    
    throw new Error(`Failed to generate post: ${error.message || "Unknown error"}`);
  }
}

/**
 * Generate hashtags for a LinkedIn post using Groq
 */
export async function generateHashtags(postContent: string): Promise<string> {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  try {
    const prompt = `Analyze the following LinkedIn post and provide exactly 5 highly relevant and trending hashtags.
    
Return ONLY the hashtags separated by spaces, with no other text or explanation.
Each hashtag should start with # and be relevant to the post content.

Post content:
${postContent}

Hashtags:`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: GROQ_MODEL, // Currently available model
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1,
      stream: false,
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    // Clean up and extract hashtags
    const hashtags = text
      .trim()
      .split(/\s+/)
      .filter((tag: string) => tag.startsWith("#"))
      .slice(0, 5)
      .join(" ");

    return hashtags || "";
  } catch (error: any) {
    console.error("Error generating hashtags:", error);
    throw new Error(`Failed to generate hashtags: ${error.message || "Unknown error"}`);
  }
}

/**
 * Refine an existing LinkedIn post using Groq
 */
export async function refineLinkedInPost(
  currentPost: string,
  refinementType: string,
  customInstruction?: string
): Promise<string> {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  try {
    let refinementPrompt = "";

    switch (refinementType) {
      case "urgent":
        refinementPrompt =
          "Make this LinkedIn post sound more urgent and compelling. Maintain the same core message but add urgency and immediacy to the tone.";
        break;
      case "example":
        refinementPrompt =
          "Add another concrete example or case study to this LinkedIn post to make it more engaging and relatable.";
        break;
      case "shorten":
        refinementPrompt =
          "Shorten this LinkedIn post by approximately 50 words while maintaining all key points and the call to action.";
        break;
      case "custom":
        refinementPrompt = customInstruction || "Improve this LinkedIn post";
        break;
      default:
        refinementPrompt = "Improve this LinkedIn post to make it more engaging and professional.";
    }

    const prompt = `${refinementPrompt}

Current post:
${currentPost}

Please provide the refined version:`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: GROQ_MODEL, // Currently available model
      temperature: 0.6,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
    });

    const refinedPost = chatCompletion.choices[0]?.message?.content || "";

    return refinedPost.trim();
  } catch (error: any) {
    console.error("Error refining post:", error);
    throw new Error(`Failed to refine post: ${error.message || "Unknown error"}`);
  }
}