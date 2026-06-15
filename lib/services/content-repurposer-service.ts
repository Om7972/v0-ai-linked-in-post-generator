/**
 * Content Repurposer AI Service
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not set.")
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

interface RepurposeInput {
  topic: string
  existingPost?: string
}

interface GeneratedAssets {
  linkedInPost: string
  carouselScript: string
  twitterThread: string
  blogOutline: string
  newsletterDraft: string
}

export async function repurposeContent(input: RepurposeInput): Promise<GeneratedAssets> {
  if (!genAI) {
    throw new Error("Gemini API key not configured")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `
You are a content repurposing expert. Take the following content and repurpose it into 5 formats.

Input:
Topic: ${input.topic}
${input.existingPost ? `Existing LinkedIn Post:\n${input.existingPost}` : ""}

Return your response in this JSON format ONLY:
{
  "linkedInPost": "LinkedIn post content...",
  "carouselScript": "Carousel script with slides separated by ---\\nSlide 1 Title\\nSlide 1 Content\\n---\\nSlide 2 Title\\nSlide 2 Content...",
  "twitterThread": "1/ First tweet...\\n\\n2/ Second tweet...\\n\\n3/ Third tweet...",
  "blogOutline": "# Blog Title\\n\\n## Section 1\\n- Point 1\\n- Point 2\\n\\n## Section 2\\n- Point 1\\n- Point 2...",
  "newsletterDraft": "Subject: [Newsletter Subject]\\n\\nHi [Name],\\n\\n...newsletter content..."
}

Important: Do not include any other text besides the JSON!
  `.trim()

  const result = await model.generateContent(prompt)
  const responseText = result.response.text().trim()

  // Extract JSON from response (in case there's extra text)
  let jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Could not parse AI response")
  }

  const data = JSON.parse(jsonMatch[0])
  return data
}