-- ============================================
-- COMPLETE DATABASE SETUP
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor

-- ============================================
-- STEP 1: Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Drop existing objects (Clean Setup)
-- ============================================
-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS update_drafts_updated_at ON public.drafts;
DROP TRIGGER IF EXISTS update_usage_updated_at ON public.usage;
DROP TRIGGER IF EXISTS reset_usage_before_update ON public.usage;
DROP TRIGGER IF EXISTS update_style_profiles_updated_at ON public.style_profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.initialize_usage() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS reset_daily_usage() CASCADE;
DROP FUNCTION IF EXISTS public.analyze_writing_style(TEXT[]) CASCADE;

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS public.style_profiles CASCADE;
DROP TABLE IF EXISTS public.usage CASCADE;
DROP TABLE IF EXISTS public.drafts CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- STEP 3: Create Tables
-- ============================================

-- TABLE: profiles
-- Extends Supabase auth.users with additional profile data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'creator', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_plan ON public.profiles(plan);

-- TABLE: posts
-- Stores generated LinkedIn posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'founder', 'influencer', 'casual')),
  audience TEXT,
  length TEXT CHECK (length IN ('short', 'medium', 'long')),
  content TEXT NOT NULL,
  hashtags TEXT,
  engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
  style_profile_id UUID,  -- Will add foreign key after style_profiles table
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_tone ON public.posts(tone);

-- TABLE: drafts
-- Stores draft posts (work in progress)
CREATE TABLE public.drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT,
  tone TEXT,
  audience TEXT,
  length TEXT,
  content TEXT,
  hashtags TEXT,
  form_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX idx_drafts_updated_at ON public.drafts(updated_at DESC);

-- TABLE: usage
-- Tracks daily usage limits per user
CREATE TABLE public.usage (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  posts_generated_today INTEGER NOT NULL DEFAULT 0,
  last_reset TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_posts_generated INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_last_reset ON public.usage(last_reset);

-- TABLE: style_profiles
-- Personal writing style feature
CREATE TABLE public.style_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Writing Style',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sample_posts JSONB NOT NULL DEFAULT '[]',
  tone_profile JSONB NOT NULL DEFAULT '{}',
  sentence_structure JSONB NOT NULL DEFAULT '{}',
  emoji_usage JSONB NOT NULL DEFAULT '{}',
  cta_style JSONB NOT NULL DEFAULT '{}',
  vocabulary JSONB NOT NULL DEFAULT '{}',
  formatting_style JSONB NOT NULL DEFAULT '{}',
  style_summary TEXT,
  ai_prompt_additions TEXT,
  trained_at TIMESTAMPTZ,
  sample_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_style_profiles_user_id ON public.style_profiles(user_id);
CREATE INDEX idx_style_profiles_active ON public.style_profiles(is_active);
CREATE INDEX idx_style_profiles_default ON public.style_profiles(user_id, is_default);

-- Add foreign key to posts table for style_profile_id
ALTER TABLE public.posts 
  ADD CONSTRAINT fk_posts_style_profile 
  FOREIGN KEY (style_profile_id) 
  REFERENCES public.style_profiles(id) 
  ON DELETE SET NULL;

CREATE INDEX idx_posts_style_profile_id ON public.posts(style_profile_id);

-- ============================================
-- STEP 4: Create Functions
-- ============================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Reset daily usage
CREATE OR REPLACE FUNCTION reset_daily_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF DATE_TRUNC('day', NEW.last_reset) < DATE_TRUNC('day', NOW()) THEN
    NEW.posts_generated_today = 0;
    NEW.last_reset = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Initialize usage on profile create
CREATE OR REPLACE FUNCTION public.initialize_usage()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usage (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 5: Create Triggers
-- ============================================

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at 
  BEFORE UPDATE ON public.drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_updated_at 
  BEFORE UPDATE ON public.usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_profiles_updated_at 
  BEFORE UPDATE ON public.style_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Usage reset trigger
CREATE TRIGGER reset_usage_before_update 
  BEFORE UPDATE ON public.usage
  FOR EACH ROW EXECUTE FUNCTION reset_daily_usage();

-- Auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-initialize usage on profile create
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_usage();

-- ============================================
-- STEP 6: Enable Row Level Security
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: Create RLS Policies
-- ============================================

-- PROFILES policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- POSTS policies
CREATE POLICY "Users can read own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- DRAFTS policies
CREATE POLICY "Users can read own drafts"
  ON public.drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON public.drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON public.drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON public.drafts FOR DELETE
  USING (auth.uid() = user_id);

-- USAGE policies
CREATE POLICY "Users can read own usage"
  ON public.usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.usage FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON public.usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- STYLE_PROFILES policies
CREATE POLICY "Users can view their own style profiles"
  ON public.style_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own style profiles"
  ON public.style_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own style profiles"
  ON public.style_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own style profiles"
  ON public.style_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- SETUP COMPLETE! ✅
-- ============================================
-- Your database is now fully configured with:
-- ✓ 5 tables: profiles, posts, drafts, usage, style_profiles
-- ✓ Auto-update timestamps
-- ✓ Auto-create profile on signup
-- ✓ Auto-initialize usage tracking
-- ✓ Row Level Security enabled
-- ✓ Daily usage reset functionality
