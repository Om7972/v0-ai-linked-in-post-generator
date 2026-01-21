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
  throw new Error("GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is required")
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// Model configuration
const MODEL_NAME = "gemini-1.5-pro" // Correct model name that works with the API key

export interface GeneratePostParams {
  topic: string
  audience: string
  tone: "professional" | "founder" | "influencer" | "casual"
  length: "short" | "medium" | "long"
  cta: string
  grounding?: boolean // Use Google Search grounding
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
 * Generate a LinkedIn post using Gemini AI
 */
export async function generateLinkedInPost(
  params: GeneratePostParams
): Promise<GeneratedPost> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      // Temporarily disable safety settings for debugging
      // safetySettings: [
      //   {
      //     category: "HARM_CATEGORY_HARASSMENT",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE",
      //   },
      //   {
      //     category: "HARM_CATEGORY_HATE_SPEECH",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE",
      //   },
      //   {
      //     category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE",
      //   },
      //   {
      //     category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      //     threshold: "BLOCK_MEDIUM_AND_ABOVE",
      //   },
      // ],
    })

    // Get prompt template based on tone
    const promptTemplate = getPromptTemplate(params.tone)
    
    // Build the full prompt
    const prompt = promptTemplate
      .replace("{{TOPIC}}", params.topic)
      .replace("{{AUDIENCE}}", params.audience)
      .replace("{{LENGTH}}", params.length)
      .replace("{{CTA}}", params.cta)

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
    
    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    })
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
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const prompt = `Analyze the following LinkedIn post and provide exactly 5 highly relevant and trending hashtags.
    
Return ONLY the hashtags separated by spaces, with no other text or explanation.
Each hashtag should start with # and be relevant to the post content.

Post content:
${postContent}

Hashtags:`

    const result = await model.generateContent(prompt)
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
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

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

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return text.trim()
  } catch (error: any) {
    console.error("Error refining post:", error)
    throw new Error(`Failed to refine post: ${error.message || "Unknown error"}`)
  }
}

