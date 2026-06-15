/**
 * Profile Optimizer AI Service
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not set.")
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

interface ProfileData {
  headline: string
  aboutSection: string
  experienceSummary: string
}

interface ProfileScores {
  clarityScore: number
  recruiterScore: number
  keywordOptimization: number
  authorityScore: number
}

interface OptimizedProfile {
  headline: string
  aboutSection: string
  suggestedKeywords: string[]
  actionableRecommendations: string[]
}

export async function optimizeProfile(profileData: ProfileData): Promise<{
  scores: ProfileScores
  optimized: OptimizedProfile
}> {
  if (!genAI) {
    throw new Error("Gemini API key not configured")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `
You are a LinkedIn optimization expert. Analyze the following LinkedIn profile and provide:
1. Scores (0-100) for Clarity, Recruiter, Keyword Optimization, Authority
2. Optimized headline, about section, suggested keywords, and actionable recommendations

Profile data:
Headline: ${profileData.headline}
About Section: ${profileData.aboutSection}
Experience Summary: ${profileData.experienceSummary}

Return your response in this JSON format ONLY:
{
  "scores": {
    "clarityScore": 85,
    "recruiterScore": 72,
    "keywordOptimization": 68,
    "authorityScore": 75
  },
  "optimized": {
    "headline": "Optimized headline goes here...",
    "aboutSection": "Optimized about section goes here...",
    "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
    "actionableRecommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
  }
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