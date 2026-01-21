/**
 * TypeScript Types for Posts and Related Data
 */

export type Plan = "free" | "pro" | "creator" | "enterprise"
export type Tone = "professional" | "founder" | "influencer" | "casual"
export type Length = "short" | "medium" | "long"

export interface Profile {
  id: string
  name: string
  plan: Plan
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  topic: string
  tone: Tone
  audience: string | null
  length: Length | null
  content: string
  hashtags: string | null
  engagement_score: number
  created_at: string
  updated_at: string
}

export interface Draft {
  id: string
  user_id: string
  topic: string | null
  tone: Tone | null
  audience: string | null
  length: Length | null
  content: string | null
  hashtags: string | null
  form_data: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface Usage {
  user_id: string
  posts_generated_today: number
  last_reset: string
  total_posts_generated: number
  created_at: string
  updated_at: string
}

export interface GeneratePostRequest {
  topic: string
  audience: string
  tone: Tone
  length: Length
  cta: string
  grounding?: boolean
}

export interface RefinePostRequest {
  currentPost: string
  refinementType: "urgent" | "example" | "shorten" | "custom"
  customInstruction?: string
}

export interface UsageStatus {
  canGenerate: boolean
  remaining: number
  limit: number
  resetAt: Date
}

