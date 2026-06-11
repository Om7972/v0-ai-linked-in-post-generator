/**
 * Gemini AI Integration
 * 
 * Server-only Gemini client for generating LinkedIn posts.
 * API key is never exposed to the client.
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getPromptTemplate } from "./promptTemplates"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

console.log('Gemini API Key available:', !!GEMINI_API_KEY)
if (GEMINI_API_KEY) {
  console.log('Gemini API Key length:', GEMINI_API_KEY.length)
}

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not set. Gemini fallback unavailable.")
}

// Initialize Gemini client only if key exists
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// Model configuration
const modelsToTry = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash"
];

export interface GeneratePostParams {
  topic: string
  audience: string
  tone: "professional" | "founder" | "influencer" | "casual"
  length: "short" | "medium" | "long"
  cta: string
  grounding?: boolean // Use Google Search grounding
  personalStylePrompt?: string // Personal writing style additions
}

export interface GeneratedPost {
  content: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

/**
 * Sequential fallback helper for Gemini requests
 */
export async function generateContentWithFallback(request: any): Promise<any> {
  if (!genAI) {
    throw new Error("Gemini API key is not configured");
  }

  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini client] Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(request);
      console.log(`[Gemini client] Model ${modelName} succeeded!`);
      return result;
    } catch (err: any) {
      console.warn(`[Gemini client] Model ${modelName} failed:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content");
}

/**
 * Generate a LinkedIn post using Gemini AI
 */
export async function generateLinkedInPost(
  params: GeneratePostParams
): Promise<GeneratedPost> {
  if (!genAI) {
    throw new Error("Gemini API key is not configured")
  }

  try {
    // Get prompt template based on tone
    const promptTemplate = getPromptTemplate(params.tone)

    // Build the full prompt
    let prompt = promptTemplate
      .replace("{{TOPIC}}", params.topic)
      .replace("{{AUDIENCE}}", params.audience)
      .replace("{{LENGTH}}", params.length)
      .replace("{{CTA}}", params.cta)

    if (params.personalStylePrompt) {
      prompt += `\n\nWriting Style Instructions:\n${params.personalStylePrompt}`;
    }

    // Enhanced generation parameters for better content quality
    const generationConfig = {
      temperature: 0.7, // Balance creativity and coherence
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1000, // Increased token limit for longer content
      stopSequences: []
    }

    console.log("Generating content with parameters:", {
      topic: params.topic,
      tone: params.tone,
      length: params.length,
      promptLength: prompt.length
    })

    const modelParams = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    };

    const result = await generateContentWithFallback(modelParams);

    const response = result.response
    const text = response.text()

    console.log("Generated content length:", text.length, "characters")
    console.log("Generated content word count:", text.split(/\s+/).length, "words")

    // Extract usage information if available
    const usage = response.usageMetadata ? {
      promptTokens: response.usageMetadata.promptTokenCount,
      completionTokens: response.usageMetadata.candidatesTokenCount,
      totalTokens: response.usageMetadata.totalTokenCount,
    } : undefined

    return {
      content: text.trim(),
      usage,
    }
  } catch (error: any) {
    console.error("Gemini API error:", error)
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
      status: error.status
    })

    // Handle specific error types
    if (error.message?.includes("API key") || error.message?.includes("AUTHENTICATION_FAILED")) {
      throw new Error("Invalid Gemini API key")
    }

    if (error.message?.includes("quota") || error.message?.includes("RATE_LIMIT")) {
      throw new Error("Gemini API quota exceeded")
    }

    if (error.message?.includes("safety") || error.message?.includes("SAFETY")) {
      throw new Error("Content was blocked by safety filters")
    }

    if (error.message?.includes("INVALID_ARGUMENT")) {
      throw new Error("Invalid request parameters")
    }

    throw new Error(`Failed to generate post: ${error.message || "Unknown error"}`)
  }
}

/**
 * Generate hashtags for a LinkedIn post
 */
export async function generateHashtags(postContent: string): Promise<string> {
  try {
    if (!genAI) throw new Error("Gemini API key is not configured")

    const prompt = `Analyze the following LinkedIn post and provide exactly 5 highly relevant and trending hashtags.
    
Return ONLY the hashtags separated by spaces, with no other text or explanation.
Each hashtag should start with # and be relevant to the post content.

Post content:
${postContent}

Hashtags:`

    const result = await generateContentWithFallback(prompt)
    const text = result.response.text()

    // Clean up and extract hashtags
    const hashtags = text
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.startsWith("#"))
      .slice(0, 5)
      .join(" ")

    return hashtags || ""
  } catch (error: any) {
    console.error("Error generating hashtags:", error)
    throw new Error(`Failed to generate hashtags: ${error.message || "Unknown error"}`)
  }
}

/**
 * Refine an existing LinkedIn post
 */
export async function refineLinkedInPost(
  currentPost: string,
  refinementType: string,
  customInstruction?: string
): Promise<string> {
  try {
    if (!genAI) throw new Error("Gemini API key is not configured")

    let refinementPrompt = ""

    switch (refinementType) {
      case "urgent":
        refinementPrompt =
          "Make this LinkedIn post sound more urgent and compelling. Maintain the same core message but add urgency and immediacy to the tone."
        break
      case "example":
        refinementPrompt =
          "Add another concrete example or case study to this LinkedIn post to make it more engaging and relatable."
        break
      case "shorten":
        refinementPrompt =
          "Shorten this LinkedIn post by approximately 50 words while maintaining all key points and the call to action."
        break
      case "custom":
        refinementPrompt = customInstruction || "Improve this LinkedIn post"
        break
      default:
        refinementPrompt = "Improve this LinkedIn post to make it more engaging and professional."
    }

    const prompt = `${refinementPrompt}

Current post:
${currentPost}

Please provide the refined version:`

    const result = await generateContentWithFallback(prompt)
    const text = result.response.text()

    return text.trim()
  } catch (error: any) {
    console.error("Error refining post:", error)
    throw new Error(`Failed to refine post: ${error.message || "Unknown error"}`)
  }
}


