-- ============================================
-- MIGRATION: AI Content Command Center
-- ============================================
-- Run this in your Supabase SQL Editor

-- ============================================
-- TABLE: content_pillars
-- Stores user's content pillars for analytics
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pillar_name TEXT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_pillars_user_id ON public.content_pillars(user_id);

-- ============================================
-- TABLE: brand_metrics
-- Stores daily/weekly brand metrics
-- ============================================
CREATE TABLE IF NOT EXISTS public.brand_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_score NUMERIC(5,2) NOT NULL,
  consistency_score NUMERIC(5,2) NOT NULL,
  authority_score NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_metrics_user_id ON public.brand_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_metrics_created_at ON public.brand_metrics(created_at DESC);

-- ============================================
-- TABLE: content_recommendations
-- Stores AI-generated content recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_recommendations_user_id ON public.content_recommendations(user_id);

-- ============================================
-- TABLE: weekly_goals
-- Stores user's weekly goals
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  posts_goal INTEGER NOT NULL DEFAULT 3,
  posts_completed INTEGER NOT NULL DEFAULT 0,
  week_start TIMESTAMPTZ NOT NULL,
  week_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_goals_user_id ON public.weekly_goals(user_id);

-- ============================================
-- TABLE: content_queue
-- Stores upcoming content queue
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  pillar TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'published')),
  scheduled_for TIMESTAMPTZ,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_queue_user_id ON public.content_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_content_queue_scheduled_for ON public.content_queue(scheduled_for);

-- ============================================
-- Add updated_at triggers
-- ============================================
DO $$ BEGIN
  CREATE TRIGGER update_content_pillars_updated_at 
    BEFORE UPDATE ON public.content_pillars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_weekly_goals_updated_at 
    BEFORE UPDATE ON public.weekly_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_content_queue_updated_at 
    BEFORE UPDATE ON public.content_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Enable RLS on new tables
-- ============================================
ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies for new tables
-- ============================================
-- CONTENT_PILLARS
CREATE POLICY IF NOT EXISTS "Users can view their own content pillars"
  ON public.content_pillars FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own content pillars"
  ON public.content_pillars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own content pillars"
  ON public.content_pillars FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own content pillars"
  ON public.content_pillars FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- BRAND_METRICS
CREATE POLICY IF NOT EXISTS "Users can view their own brand metrics"
  ON public.brand_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own brand metrics"
  ON public.brand_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- CONTENT_RECOMMENDATIONS
CREATE POLICY IF NOT EXISTS "Users can view their own content recommendations"
  ON public.content_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own content recommendations"
  ON public.content_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own content recommendations"
  ON public.content_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- WEEKLY_GOALS
CREATE POLICY IF NOT EXISTS "Users can view their own weekly goals"
  ON public.weekly_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own weekly goals"
  ON public.weekly_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own weekly goals"
  ON public.weekly_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- CONTENT_QUEUE
CREATE POLICY IF NOT EXISTS "Users can view their own content queue"
  ON public.content_queue FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own content queue"
  ON public.content_queue FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own content queue"
  ON public.content_queue FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own content queue"
  ON public.content_queue FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
