-- ============================================
-- MIGRATION: AI Content Studio
-- ============================================
-- Run this in your Supabase SQL Editor

-- ============================================
-- TABLE: content_projects
-- Stores main content project ideas
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  tone TEXT,
  audience TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_projects_user_id ON public.content_projects(user_id);

-- ============================================
-- TABLE: content_outputs
-- Stores generated content outputs for projects
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.content_projects(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_outputs_project_id ON public.content_outputs(project_id);
CREATE INDEX IF NOT EXISTS idx_content_outputs_type ON public.content_outputs(output_type);

-- ============================================
-- Add updated_at triggers for new tables
-- ============================================
DO $$ BEGIN
  CREATE TRIGGER update_content_projects_updated_at 
    BEFORE UPDATE ON public.content_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Enable RLS on new tables
-- ============================================
ALTER TABLE public.content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_outputs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies for new tables
-- ============================================
-- CONTENT_PROJECTS
CREATE POLICY IF NOT EXISTS "Users can view their own content projects"
  ON public.content_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own content projects"
  ON public.content_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own content projects"
  ON public.content_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own content projects"
  ON public.content_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- CONTENT_OUTPUTS
CREATE POLICY IF NOT EXISTS "Users can view their own content outputs"
  ON public.content_outputs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.content_projects
    WHERE public.content_projects.id = public.content_outputs.project_id
    AND public.content_projects.user_id = auth.uid()
  ));

CREATE POLICY IF NOT EXISTS "Users can insert their own content outputs"
  ON public.content_outputs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.content_projects
    WHERE public.content_projects.id = public.content_outputs.project_id
    AND public.content_projects.user_id = auth.uid()
  ));

CREATE POLICY IF NOT EXISTS "Users can update their own content outputs"
  ON public.content_outputs FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.content_projects
    WHERE public.content_projects.id = public.content_outputs.project_id
    AND public.content_projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.content_projects
    WHERE public.content_projects.id = public.content_outputs.project_id
    AND public.content_projects.user_id = auth.uid()
  ));

CREATE POLICY IF NOT EXISTS "Users can delete their own content outputs"
  ON public.content_outputs FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.content_projects
    WHERE public.content_projects.id = public.content_outputs.project_id
    AND public.content_projects.user_id = auth.uid()
  ));

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
