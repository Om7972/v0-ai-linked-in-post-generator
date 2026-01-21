/**
 * Rate Limiting and Usage Tracking
 * 
 * Manages daily usage limits per subscription plan
 */

import { createServerSupabaseClient } from "./supabase"

export type Plan = "free" | "pro" | "creator" | "enterprise"

// Daily limits per plan
export const PLAN_LIMITS: Record<Plan, number> = {
  free: 5,        // 5 posts per day
  pro: 50,        // 50 posts per day
  creator: 200,   // 200 posts per day
  enterprise: 1000, // 1000 posts per day (unlimited in practice)
}

export interface UsageStatus {
  canGenerate: boolean
  remaining: number
  limit: number
  resetAt: Date
}

/**
 * Check if user can generate a post (within daily limit)
 */
export async function checkUsageLimit(userId: string): Promise<UsageStatus> {
  const supabase = createServerSupabaseClient()

  // Get user's plan
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    throw new Error("User profile not found")
  }

  const plan = profile.plan as Plan
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free

  // Get or create usage record
  const { data: usage, error: usageError } = await supabase
    .from("usage")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (usageError && usageError.code !== "PGRST116") {
    // PGRST116 = no rows returned, which is fine for new users
    throw new Error(`Failed to check usage: ${usageError.message}`)
  }

  // Initialize usage if it doesn't exist
  if (!usage) {
    const { error: insertError } = await supabase
      .from("usage")
      .insert({
        user_id: userId,
        posts_generated_today: 0,
        last_reset: new Date().toISOString(),
      })

    if (insertError) {
      throw new Error(`Failed to initialize usage: ${insertError.message}`)
    }

    return {
      canGenerate: true,
      remaining: limit,
      limit,
      resetAt: new Date(),
    }
  }

  // Check if we need to reset (new day)
  const lastReset = new Date(usage.last_reset)
  const now = new Date()
  const isNewDay = lastReset.toDateString() !== now.toDateString()

  let postsGeneratedToday = usage.posts_generated_today

  // Reset if it's a new day
  if (isNewDay) {
    postsGeneratedToday = 0
    await supabase
      .from("usage")
      .update({
        posts_generated_today: 0,
        last_reset: now.toISOString(),
      })
      .eq("user_id", userId)
  }

  const remaining = Math.max(0, limit - postsGeneratedToday)
  const canGenerate = remaining > 0

  // Calculate next reset time (midnight UTC)
  const resetAt = new Date(now)
  resetAt.setUTCHours(24, 0, 0, 0)

  return {
    canGenerate,
    remaining,
    limit,
    resetAt,
  }
}

/**
 * Increment usage counter after generating a post
 */
export async function incrementUsage(userId: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Get current usage
  const { data: usage, error: fetchError } = await supabase
    .from("usage")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch usage: ${fetchError.message}`)
  }

  // Check if we need to reset (new day)
  const lastReset = new Date(usage.last_reset)
  const now = new Date()
  const isNewDay = lastReset.toDateString() !== now.toDateString()

  // Update usage
  const { error: updateError } = await supabase
    .from("usage")
    .update({
      posts_generated_today: isNewDay ? 1 : usage.posts_generated_today + 1,
      total_posts_generated: usage.total_posts_generated + 1,
      last_reset: isNewDay ? now.toISOString() : usage.last_reset,
      updated_at: now.toISOString(),
    })
    .eq("user_id", userId)

  if (updateError) {
    throw new Error(`Failed to increment usage: ${updateError.message}`)
  }
}

/**
 * Get current usage status for a user
 */
export async function getUsageStatus(userId: string): Promise<UsageStatus> {
  return checkUsageLimit(userId)
}

