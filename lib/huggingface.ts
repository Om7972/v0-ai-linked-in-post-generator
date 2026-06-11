/**
 * HuggingFace AI Integration
 * 
 * Server-only HuggingFace Inference API client for generating LinkedIn posts.
 * Used as a fallback when both GROQ and Gemini are unavailable.
 * API key is never exposed to the client.
 */

import { getPromptTemplate } from "./promptTemplates";

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mixtral-8x7B-Instruct-v0.1";

if (!HF_API_KEY) {
  console.warn("HUGGING_FACE_API_KEY is not set. HuggingFace fallback unavailable.");
}

export interface GeneratePostParams {
  topic: string;
  audience: string;
  tone: "professional" | "founder" | "influencer" | "casual";
  length: "short" | "medium" | "long";
  cta: string;
  personalStylePrompt?: string; // Personal writing style additions
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
 * Call HuggingFace Inference API
 */
async function callHuggingFace(prompt: string, maxTokens: number = 1000, temperature: number = 0.7): Promise<string> {
  if (!HF_API_KEY) {
    throw new Error("HUGGING_FACE_API_KEY is not configured");
  }

  const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("HuggingFace API error:", response.status, errorText);
    
    if (response.status === 401) {
      throw new Error("Invalid HuggingFace API key");
    }
    if (response.status === 429) {
      throw new Error("HuggingFace API rate limit exceeded");
    }
    if (response.status === 503) {
      throw new Error("HuggingFace model is loading, please try again in a moment");
    }
    throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // HuggingFace returns an array of generated texts
  if (Array.isArray(data) && data.length > 0) {
    return data[0].generated_text?.trim() || "";
  }
  
  // Some models return differently
  if (data.generated_text) {
    return data.generated_text.trim();
  }

  throw new Error("Unexpected HuggingFace response format");
}

/**
 * Generate a LinkedIn post using HuggingFace
 */
export async function generateLinkedInPost(params: GeneratePostParams): Promise<GeneratedPost> {
  try {
    const promptTemplate = getPromptTemplate(params.tone);
    
    let prompt = promptTemplate
      .replace("{{TOPIC}}", params.topic)
      .replace("{{AUDIENCE}}", params.audience)
      .replace("{{LENGTH}}", params.length)
      .replace("{{CTA}}", params.cta);

    if (params.personalStylePrompt) {
      prompt += `\n\nWriting Style Instructions:\n${params.personalStylePrompt}`;
    }

    const content = await callHuggingFace(prompt, 1000, 0.7);

    return {
      content: content.trim(),
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  } catch (error: any) {
    console.error("HuggingFace generate error:", error);
    throw new Error(`HuggingFace generation failed: ${error.message || "Unknown error"}`);
  }
}

/**
 * Generate hashtags using HuggingFace
 */
export async function generateHashtags(postContent: string): Promise<string> {
  try {
    const prompt = `Analyze the following LinkedIn post and provide exactly 5 highly relevant and trending hashtags.

Return ONLY the hashtags separated by spaces, with no other text or explanation.
Each hashtag should start with # and be relevant to the post content.

Post content:
${postContent}

Hashtags:`;

    const text = await callHuggingFace(prompt, 100, 0.3);

    const hashtags = text
      .trim()
      .split(/\s+/)
      .filter((tag: string) => tag.startsWith("#"))
      .slice(0, 5)
      .join(" ");

    return hashtags || "";
  } catch (error: any) {
    console.error("HuggingFace hashtag error:", error);
    throw new Error(`HuggingFace hashtag generation failed: ${error.message}`);
  }
}

/**
 * Refine a LinkedIn post using HuggingFace
 */
export async function refineLinkedInPost(
  currentPost: string,
  refinementType: string,
  customInstruction?: string
): Promise<string> {
  try {
    let refinementPrompt = "";

    switch (refinementType) {
      case "urgent":
        refinementPrompt = "Make this LinkedIn post sound more urgent and compelling. Maintain the same core message but add urgency and immediacy to the tone.";
        break;
      case "example":
        refinementPrompt = "Add another concrete example or case study to this LinkedIn post to make it more engaging and relatable.";
        break;
      case "shorten":
        refinementPrompt = "Shorten this LinkedIn post by approximately 50 words while maintaining all key points and the call to action.";
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

    const refinedPost = await callHuggingFace(prompt, 1000, 0.6);
    return refinedPost.trim();
  } catch (error: any) {
    console.error("HuggingFace refine error:", error);
    throw new Error(`HuggingFace refinement failed: ${error.message}`);
  }
}
