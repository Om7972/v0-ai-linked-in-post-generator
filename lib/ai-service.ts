/**
 * AI Service Abstraction Layer
 * 
 * Provides a unified interface for different AI providers with automatic fallback.
 * Fallback Chain: GROQ (primary) → Gemini → HuggingFace → Mock
 * 
 * The upgraded GROQ API key is now primary. If it fails, we fall back to Gemini,
 * then HuggingFace, then a local mock generator.
 */

import { 
  GeneratePostParams, 
  GeneratedPost,
  generateLinkedInPost as geminiGenerateLinkedInPost,
  generateHashtags as geminiGenerateHashtags,
  refineLinkedInPost as geminiRefineLinkedInPost
} from "./gemini";

import { getPromptTemplate } from "./promptTemplates";

// Track which provider was used for logging/debugging
let lastUsedProvider = "none";

export function getLastUsedProvider(): string {
  return lastUsedProvider;
}

/**
 * Generate a LinkedIn post using the available AI provider
 * Priority: GROQ → Gemini → HuggingFace → Mock
 */
export async function generateLinkedInPost(params: GeneratePostParams): Promise<GeneratedPost> {
  const errors: string[] = [];

  // 1. Try GROQ first (primary - upgraded key)
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("[AI Service] Attempting GROQ...");
      const { generateLinkedInPost: groqGenerate } = await import("./groq");
      const result = await groqGenerate(params);
      lastUsedProvider = "groq";
      console.log("[AI Service] ✅ GROQ succeeded");
      return result;
    } catch (error: any) {
      console.warn("[AI Service] ❌ GROQ failed:", error.message);
      errors.push(`GROQ: ${error.message}`);
    }
  }

  // 2. Try Gemini as second fallback
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      console.log("[AI Service] Attempting Gemini...");
      const result = await geminiGenerateLinkedInPost(params);
      lastUsedProvider = "gemini";
      console.log("[AI Service] ✅ Gemini succeeded");
      return result;
    } catch (error: any) {
      console.warn("[AI Service] ❌ Gemini failed:", error.message);
      errors.push(`Gemini: ${error.message}`);
    }
  }

  // 3. Try HuggingFace as third fallback
  if (process.env.HUGGING_FACE_API_KEY) {
    try {
      console.log("[AI Service] Attempting HuggingFace...");
      const { generateLinkedInPost: hfGenerate } = await import("./huggingface");
      const result = await hfGenerate(params);
      lastUsedProvider = "huggingface";
      console.log("[AI Service] ✅ HuggingFace succeeded");
      return result;
    } catch (error: any) {
      console.warn("[AI Service] ❌ HuggingFace failed:", error.message);
      errors.push(`HuggingFace: ${error.message}`);
    }
  }

  // 4. All providers failed - use mock data
  console.warn("[AI Service] All providers failed, using mock data. Errors:", errors);
  lastUsedProvider = "mock";
  return generateMockPost(params);
}

/**
 * Generate hashtags using the available AI provider
 * Priority: GROQ → Gemini → HuggingFace → Mock
 */
export async function generateHashtags(postContent: string): Promise<string> {
  // 1. Try GROQ
  if (process.env.GROQ_API_KEY) {
    try {
      const { generateHashtags: groqHashtags } = await import("./groq");
      return await groqHashtags(postContent);
    } catch (error: any) {
      console.warn("[AI Service] GROQ hashtags failed:", error.message);
    }
  }

  // 2. Try Gemini
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      return await geminiGenerateHashtags(postContent);
    } catch (error: any) {
      console.warn("[AI Service] Gemini hashtags failed:", error.message);
    }
  }

  // 3. Try HuggingFace
  if (process.env.HUGGING_FACE_API_KEY) {
    try {
      const { generateHashtags: hfHashtags } = await import("./huggingface");
      return await hfHashtags(postContent);
    } catch (error: any) {
      console.warn("[AI Service] HuggingFace hashtags failed:", error.message);
    }
  }

  // 4. Mock fallback
  return generateMockHashtags(postContent);
}

/**
 * Refine a LinkedIn post using the available AI provider
 * Priority: GROQ → Gemini → HuggingFace → Original
 */
export async function refineLinkedInPost(
  currentPost: string,
  refinementType: string,
  customInstruction?: string
): Promise<string> {
  // 1. Try GROQ
  if (process.env.GROQ_API_KEY) {
    try {
      const { refineLinkedInPost: groqRefine } = await import("./groq");
      return await groqRefine(currentPost, refinementType, customInstruction);
    } catch (error: any) {
      console.warn("[AI Service] GROQ refinement failed:", error.message);
    }
  }

  // 2. Try Gemini
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      return await geminiRefineLinkedInPost(currentPost, refinementType, customInstruction);
    } catch (error: any) {
      console.warn("[AI Service] Gemini refinement failed:", error.message);
    }
  }

  // 3. Try HuggingFace
  if (process.env.HUGGING_FACE_API_KEY) {
    try {
      const { refineLinkedInPost: hfRefine } = await import("./huggingface");
      return await hfRefine(currentPost, refinementType, customInstruction);
    } catch (error: any) {
      console.warn("[AI Service] HuggingFace refinement failed:", error.message);
    }
  }

  // 4. Return original if all fail
  return currentPost;
}

/**
 * Generate opening hooks for a topic (new feature)
 * Returns 3-5 attention-grabbing opening lines
 */
export async function generateHooks(topic: string, tone: string): Promise<string[]> {
  const prompt = `Generate 5 attention-grabbing opening hooks for a LinkedIn post about "${topic}" in a ${tone} tone.

Rules:
- Each hook should be 1-2 sentences max
- Make them scroll-stopping and curiosity-inducing
- Use proven copywriting formulas (questions, statistics, bold claims, stories)
- Number each hook 1-5

Return ONLY the hooks, numbered 1-5:`;

  // Try providers in order
  const providers = [
    { name: "groq", check: () => !!process.env.GROQ_API_KEY },
    { name: "gemini", check: () => !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) },
    { name: "huggingface", check: () => !!process.env.HUGGING_FACE_API_KEY },
  ];

  for (const provider of providers) {
    if (!provider.check()) continue;

    try {
      let text = "";
      if (provider.name === "groq") {
        const Groq = (await import("groq-sdk")).default;
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: process.env.GROQ_MODEL || "llama3-70b-8192",
          temperature: 0.8,
          max_tokens: 500,
        });
        text = completion.choices[0]?.message?.content || "";
      } else if (provider.name === "gemini") {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        text = result.response.text();
      } else if (provider.name === "huggingface") {
        const { generateLinkedInPost: hfGenerate } = await import("./huggingface");
        // Use the raw call approach
        const res = await fetch(`https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 500, temperature: 0.8, return_full_text: false } }),
        });
        const data = await res.json();
        text = Array.isArray(data) ? data[0]?.generated_text || "" : data.generated_text || "";
      }

      // Parse hooks from text
      const hooks = text
        .split(/\n/)
        .filter((line: string) => line.match(/^\d+[\.\)]/))
        .map((line: string) => line.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((h: string) => h.length > 10);

      if (hooks.length >= 3) return hooks.slice(0, 5);
    } catch (error: any) {
      console.warn(`[AI Service] ${provider.name} hooks failed:`, error.message);
    }
  }

  // Mock hooks
  return [
    `Did you know that 90% of professionals are missing this about ${topic}?`,
    `I spent 3 years studying ${topic}. Here's what nobody tells you:`,
    `The biggest myth about ${topic} is costing you opportunities.`,
    `If you're not leveraging ${topic} in 2025, you're already behind.`,
    `I was wrong about ${topic}. Here's what changed my mind:`,
  ];
}

/**
 * Generate mock post for fallback
 */
function generateMockPost(params: GeneratePostParams): GeneratedPost {
  const hooks = [
    `🚀 Let's talk about ${params.topic}.`,
    `💡 Here's something most people get wrong about ${params.topic}:`,
    `🎯 I've been thinking deeply about ${params.topic} lately.`,
  ];
  
  const randomHook = hooks[Math.floor(Math.random() * hooks.length)];

  const mockContent = `${randomHook}

In today's rapidly evolving landscape, ${params.topic} continues to shape how we approach challenges. As ${params.audience}, we often find that the most impactful strategies involve both innovation and practical application.

Key takeaways:
→ Understanding the fundamentals of ${params.topic}
→ Applying best practices in your specific context  
→ Engaging authentically with your community
→ Measuring impact and iterating constantly

The professionals who master ${params.topic} will be the ones leading the next wave of innovation.

${params.cta}

What are your thoughts on this? Drop a comment below 👇`;

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
  const words = postContent.split(/\W+/).filter(word => word.length > 4);
  const uniqueWords = [...new Set(words)].slice(0, 5);
  return uniqueWords.map(word => `#${word}`).join(' ');
}