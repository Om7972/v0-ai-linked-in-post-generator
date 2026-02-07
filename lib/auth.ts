/**
 * Authentication Utilities
 * 
 * This file provides authentication helpers that work with Supabase Auth.
 * For API routes, we extract the token from the Authorization header.
 * For server components, we use cookies.
 */

import { createServerSupabaseClientWithSession, createServerSupabaseClient } from "./supabase"
import { cookies } from "next/headers"
import { headers } from "next/headers"

/**
 * Get the current authenticated user from API request
 * Extracts token from Authorization header
 */
export async function getCurrentUserFromRequest(): Promise<any> {
  try {
    const headersList = await headers()
    const authHeader = headersList.get("authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)

    // Use service role client to verify the token
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user from request:", error)
    return null
  }
}

/**
 * Get the current authenticated user from cookies (server components)
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabaseClientWithSession()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Get the current user's profile (includes plan, name, etc.)
 * Works with both API routes (header auth) and server components (cookie auth)
 */
export async function getCurrentUserProfile() {
  try {
    // Try to get user from request headers first (API routes)
    let user = await getCurrentUserFromRequest()

    // Fallback to cookies (server components)
    if (!user) {
      user = await getCurrentUser()
    }

    if (!user) {
      return null
    }

    const supabase = await createServerSupabaseClientWithSession()

    // Use maybeSingle to avoid error if profile doesn't exist yet
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    // If profile doesn't exist yet (e.g. latent trigger), return a default/temporary profile
    if (!profile) {
      // Return a basic profile object derived from auth user so the app doesn't crash
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        plan: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return profile
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

/**
 * Require authentication - throws error if user is not authenticated
 * For API routes, use getCurrentUserFromRequest
 * For server components, use getCurrentUser
 */
export async function requireAuth() {
  // Try to get user from request headers first (API routes)
  let user = await getCurrentUserFromRequest()

  // Fallback to cookies (server components)
  if (!user) {
    user = await getCurrentUser()
  }

  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

/**
 * Get user ID from request
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.id || null
}
