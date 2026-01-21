/**
 * Supabase Client Configuration
 * 
 * This file provides both client-side and server-side Supabase clients.
 * - Client-side: Uses anon key for user-scoped operations
 * - Server-side: Uses service role key for admin operations
 */

import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables")
}

/**
 * Server-side Supabase client with service role key
 * Use this for admin operations that bypass RLS
 */
export function createServerSupabaseClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server operations")
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Server-side Supabase client with user session
 * Use this in API routes to access user-scoped data with RLS
 * 
 * Note: For API routes, we'll use the service role client with user context
 * from the auth token. For server components, use this function.
 */
export async function createServerSupabaseClientWithSession() {
  const cookieStore = await cookies()
  
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting errors (may fail in API routes)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Handle cookie removal errors
        }
      },
    },
  })
}

/**
 * Create Supabase client from Authorization header (for API routes)
 */
export function createSupabaseClientFromToken(authToken: string) {
  // Create a client with the user's token
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })
  return client
}

/**
 * Client-side Supabase client
 * Use this in client components
 */
export function createClientSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  })
}

// Type exports
export type SupabaseClient = ReturnType<typeof createClient>

