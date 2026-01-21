-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- These policies ensure users can only access their own data
-- Run this in your Supabase SQL Editor after schema.sql

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: profiles
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but allow explicit inserts)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POLICIES: posts
-- ============================================
-- Users can read their own posts
CREATE POLICY "Users can read own posts"
  ON public.posts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own posts
CREATE POLICY "Users can insert own posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: drafts
-- ============================================
-- Users can read their own drafts
CREATE POLICY "Users can read own drafts"
  ON public.drafts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own drafts
CREATE POLICY "Users can insert own drafts"
  ON public.drafts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own drafts
CREATE POLICY "Users can update own drafts"
  ON public.drafts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own drafts
CREATE POLICY "Users can delete own drafts"
  ON public.drafts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: usage
-- ============================================
-- Users can read their own usage
CREATE POLICY "Users can read own usage"
  ON public.usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own usage (for incrementing counters)
CREATE POLICY "Users can update own usage"
  ON public.usage
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own usage (handled by trigger, but allow explicit inserts)
CREATE POLICY "Users can insert own usage"
  ON public.usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

