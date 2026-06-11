-- ============================================
-- AI LinkedIn Post Generator - BRAND COACH SCHEMA
-- ============================================

-- ============================================
-- TABLE: brand_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  niche TEXT NOT NULL DEFAULT 'Technology & AI',
  primary_topics TEXT[] NOT NULL DEFAULT ARRAY['Software Engineering', 'Artificial Intelligence', 'Product Management'],
  content_distribution JSONB NOT NULL DEFAULT '{"Industry Insights": 40, "Personal Stories": 25, "Actionable Tips": 20, "Career Advice": 15}'::jsonb,
  authority_score INTEGER NOT NULL DEFAULT 65 CHECK (authority_score >= 0 AND authority_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON public.brand_profiles(user_id);

-- Enable RLS
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own brand profile"
  ON public.brand_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand profile"
  ON public.brand_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand profile"
  ON public.brand_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: brand_reports
-- ============================================
CREATE TABLE IF NOT EXISTS public.brand_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_brand_reports_user_id ON public.brand_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_reports_created_at ON public.brand_reports(created_at DESC);

-- Enable RLS
ALTER TABLE public.brand_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own brand reports"
  ON public.brand_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand reports"
  ON public.brand_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);
