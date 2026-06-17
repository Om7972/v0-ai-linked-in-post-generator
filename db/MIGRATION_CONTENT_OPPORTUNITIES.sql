-- ============================================
-- MIGRATION: AI Content Opportunity Engine
-- ============================================
-- Run this in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.content_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'saved', 'dismissed', 'generated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_opportunities_user_id
  ON public.content_opportunities(user_id);

CREATE INDEX IF NOT EXISTS idx_content_opportunities_created_at
  ON public.content_opportunities(created_at DESC);

CREATE TABLE IF NOT EXISTS public.opportunity_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.content_opportunities(id) ON DELETE CASCADE,
  action_taken TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunity_history_user_id
  ON public.opportunity_history(user_id);

CREATE INDEX IF NOT EXISTS idx_opportunity_history_opportunity_id
  ON public.opportunity_history(opportunity_id);

ALTER TABLE public.content_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own content opportunities" ON public.content_opportunities;
CREATE POLICY "Users can view their own content opportunities"
  ON public.content_opportunities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own content opportunities" ON public.content_opportunities;
CREATE POLICY "Users can insert their own content opportunities"
  ON public.content_opportunities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own content opportunities" ON public.content_opportunities;
CREATE POLICY "Users can update their own content opportunities"
  ON public.content_opportunities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own content opportunities" ON public.content_opportunities;
CREATE POLICY "Users can delete their own content opportunities"
  ON public.content_opportunities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own opportunity history" ON public.opportunity_history;
CREATE POLICY "Users can view their own opportunity history"
  ON public.opportunity_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own opportunity history" ON public.opportunity_history;
CREATE POLICY "Users can insert their own opportunity history"
  ON public.opportunity_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
