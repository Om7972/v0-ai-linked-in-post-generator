-- ============================================
-- MIGRATION: Add Profile Optimizer and Content Repurposer tables
-- ============================================
-- Run this in your Supabase SQL Editor

-- TABLE: profile_reviews
-- Stores LinkedIn profile optimization results
CREATE TABLE IF NOT EXISTS public.profile_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_data JSONB NOT NULL,
  optimized_data JSONB NOT NULL,
  scores JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_reviews_user_id ON public.profile_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_reviews_created_at ON public.profile_reviews(created_at DESC);

-- TABLE: content_assets
-- Stores repurposed content assets
CREATE TABLE IF NOT EXISTS public.content_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_content JSONB NOT NULL,
  generated_assets JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_assets_user_id ON public.content_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_created_at ON public.content_assets(created_at DESC);

-- ============================================
-- Add updated_at triggers for new tables
-- ============================================
-- First, ensure the function exists (it should from complete setup)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at columns
ALTER TABLE public.profile_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.content_assets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Create triggers
DO $$ BEGIN
  CREATE TRIGGER update_profile_reviews_updated_at 
    BEFORE UPDATE ON public.profile_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_content_assets_updated_at 
    BEFORE UPDATE ON public.content_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Enable RLS on new tables
-- ============================================
ALTER TABLE public.profile_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies for new tables
-- ============================================
-- PROFILE_REVIEWS policies
CREATE POLICY IF NOT EXISTS "Users can read own profile reviews"
  ON public.profile_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile reviews"
  ON public.profile_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile reviews"
  ON public.profile_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own profile reviews"
  ON public.profile_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- CONTENT_ASSETS policies
CREATE POLICY IF NOT EXISTS "Users can read own content assets"
  ON public.content_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own content assets"
  ON public.content_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own content assets"
  ON public.content_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own content assets"
  ON public.content_assets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================