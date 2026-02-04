-- ============================================
-- AI LinkedIn Post Generator - ENHANCED SCHEMA
-- Production-Ready SaaS Features
-- ============================================
-- Run this AFTER the base schema.sql
-- This adds new tables and features for scalability

-- ============================================
-- TABLE: plans
-- ============================================
-- Define subscription plans with limits
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Limits
  daily_post_limit INTEGER NOT NULL DEFAULT 3,
  monthly_post_limit INTEGER NOT NULL DEFAULT 100,
  version_history_limit INTEGER NOT NULL DEFAULT 5,
  hashtag_limit INTEGER NOT NULL DEFAULT 5,
  team_members_limit INTEGER NOT NULL DEFAULT 1,
  
  -- Features
  can_use_templates BOOLEAN NOT NULL DEFAULT false,
  can_access_analytics BOOLEAN NOT NULL DEFAULT false,
  can_use_ai_cache BOOLEAN NOT NULL DEFAULT false,
  can_create_teams BOOLEAN NOT NULL DEFAULT false,
  priority_support BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default plans
INSERT INTO public.plans (id, name, display_name, description, price_monthly, price_yearly, 
  daily_post_limit, monthly_post_limit, version_history_limit, hashtag_limit, team_members_limit,
  can_use_templates, can_access_analytics, can_use_ai_cache, can_create_teams, priority_support)
VALUES
  ('free', 'free', 'Free', 'Perfect for getting started', 0, 0, 3, 30, 3, 3, 1, false, false, false, false, false),
  ('pro', 'pro', 'Pro', 'For professionals', 19, 190, 20, 500, 10, 10, 3, true, true, true, false, false),
  ('creator', 'creator', 'Creator', 'For content creators', 49, 490, 100, 2000, 50, 30, 10, true, true, true, true, true),
  ('enterprise', 'enterprise', 'Enterprise', 'For teams and agencies', 199, 1990, 999, 99999, 999, 99, 999, true, true, true, true, true)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  daily_post_limit = EXCLUDED.daily_post_limit,
  monthly_post_limit = EXCLUDED.monthly_post_limit,
  version_history_limit = EXCLUDED.version_history_limit,
  hashtag_limit = EXCLUDED.hashtag_limit,
  team_members_limit = EXCLUDED.team_members_limit,
  can_use_templates = EXCLUDED.can_use_templates,
  can_access_analytics = EXCLUDED.can_access_analytics,
  can_use_ai_cache = EXCLUDED.can_use_ai_cache,
  can_create_teams = EXCLUDED.can_create_teams,
  priority_support = EXCLUDED.priority_support;

-- ============================================
-- TABLE: prompt_templates
-- ============================================
-- Store AI prompt templates by role
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('founder', 'recruiter', 'influencer', 'marketer', 'professional', 'custom')),
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prompt_templates_role ON public.prompt_templates(role);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active ON public.prompt_templates(is_active);

-- Insert default templates
INSERT INTO public.prompt_templates (role, name, description, system_prompt, user_prompt_template, is_default)
VALUES
  ('founder', 'Founder Voice', 'Authentic founder storytelling', 
   'You are a successful startup founder sharing authentic insights. Write with vulnerability, vision, and lessons learned.',
   'Write a LinkedIn post about {{topic}} for {{audience}}. Tone: {{tone}}. Length: {{length}}. Include: {{cta}}'),
  
  ('recruiter', 'Recruiter Engagement', 'Engaging talent acquisition posts',
   'You are a professional recruiter building employer brand. Write engaging, inclusive posts that attract top talent.',
   'Write a LinkedIn post about {{topic}} for {{audience}}. Tone: {{tone}}. Length: {{length}}. Include: {{cta}}'),
  
  ('influencer', 'Influencer Style', 'High-engagement influencer content',
   'You are a LinkedIn influencer with 100K+ followers. Write viral-worthy content with hooks, stories, and strong CTAs.',
   'Write a LinkedIn post about {{topic}} for {{audience}}. Tone: {{tone}}. Length: {{length}}. Include: {{cta}}'),
  
  ('marketer', 'Marketing Pro', 'Data-driven marketing insights',
   'You are a marketing expert sharing data-driven insights. Write actionable, metric-focused content with clear value.',
   'Write a LinkedIn post about {{topic}} for {{audience}}. Tone: {{tone}}. Length: {{length}}. Include: {{cta}}'),
  
  ('professional', 'Professional Standard', 'Standard professional voice',
   'You are a professional sharing industry insights. Write clear, credible, and valuable content.',
   'Write a LinkedIn post about {{topic}} for {{audience}}. Tone: {{tone}}. Length: {{length}}. Include: {{cta}}')
ON CONFLICT DO NOTHING;

-- ============================================
-- TABLE: post_versions
-- ============================================
-- Store version history for each post
CREATE TABLE IF NOT EXISTS public.post_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  hashtags TEXT,
  engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
  
  -- Track what changed
  change_type TEXT CHECK (change_type IN ('initial', 'regenerate', 'refine', 'manual_edit')),
  change_description TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_post_versions_post_id ON public.post_versions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_versions_user_id ON public.post_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_versions_created_at ON public.post_versions(created_at DESC);

-- Unique constraint: one version number per post
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_versions_unique ON public.post_versions(post_id, version_number);

-- ============================================
-- TABLE: hashtag_intelligence
-- ============================================
-- Store AI-generated hashtags with categorization
CREATE TABLE IF NOT EXISTS public.hashtag_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  
  hashtag TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('niche', 'broad', 'trending', 'branded')),
  relevance_score INTEGER DEFAULT 50 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  
  -- Metadata
  estimated_reach TEXT, -- 'low', 'medium', 'high'
  competition_level TEXT, -- 'low', 'medium', 'high'
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hashtag_intelligence_post_id ON public.hashtag_intelligence(post_id);
CREATE INDEX IF NOT EXISTS idx_hashtag_intelligence_category ON public.hashtag_intelligence(category);
CREATE INDEX IF NOT EXISTS idx_hashtag_intelligence_hashtag ON public.hashtag_intelligence(hashtag);

-- ============================================
-- TABLE: ai_response_cache
-- ============================================
-- Cache AI responses to reduce API costs
CREATE TABLE IF NOT EXISTS public.ai_response_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Cache key (hash of input parameters)
  cache_key TEXT NOT NULL UNIQUE,
  
  -- Input parameters
  topic TEXT NOT NULL,
  tone TEXT NOT NULL,
  audience TEXT,
  length TEXT NOT NULL,
  cta TEXT,
  template_id UUID REFERENCES public.prompt_templates(id) ON DELETE SET NULL,
  
  -- Cached response
  content TEXT NOT NULL,
  hashtags TEXT,
  engagement_score INTEGER,
  
  -- Cache metadata
  hit_count INTEGER NOT NULL DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON public.ai_response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON public.ai_response_cache(expires_at);

-- ============================================
-- TABLE: teams
-- ============================================
-- Team workspace foundation
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' REFERENCES public.plans(id),
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON public.teams(slug);

-- ============================================
-- TABLE: team_members
-- ============================================
-- Team members with roles
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  
  -- Permissions
  can_create_posts BOOLEAN NOT NULL DEFAULT true,
  can_edit_posts BOOLEAN NOT NULL DEFAULT true,
  can_delete_posts BOOLEAN NOT NULL DEFAULT false,
  can_manage_members BOOLEAN NOT NULL DEFAULT false,
  
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- Unique constraint: one membership per user per team
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_unique ON public.team_members(team_id, user_id);

-- ============================================
-- UPDATE: posts table
-- ============================================
-- Add team_id to posts table
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.prompt_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_cached BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cache_hit BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Index for team posts
CREATE INDEX IF NOT EXISTS idx_posts_team_id ON public.posts(team_id);
CREATE INDEX IF NOT EXISTS idx_posts_template_id ON public.posts(template_id);

-- ============================================
-- UPDATE: usage table
-- ============================================
-- Add monthly tracking
ALTER TABLE public.usage
  ADD COLUMN IF NOT EXISTS posts_generated_this_month INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS month_reset TIMESTAMPTZ NOT NULL DEFAULT DATE_TRUNC('month', NOW());

-- ============================================
-- FUNCTION: check_usage_limit
-- ============================================
-- Check if user can generate more posts
CREATE OR REPLACE FUNCTION public.check_usage_limit(p_user_id UUID)
RETURNS TABLE(
  can_generate BOOLEAN,
  daily_used INTEGER,
  daily_limit INTEGER,
  monthly_used INTEGER,
  monthly_limit INTEGER,
  reason TEXT
) AS $$
DECLARE
  v_plan TEXT;
  v_daily_limit INTEGER;
  v_monthly_limit INTEGER;
  v_daily_used INTEGER;
  v_monthly_used INTEGER;
BEGIN
  -- Get user's plan
  SELECT plan INTO v_plan FROM public.profiles WHERE id = p_user_id;
  
  -- Get plan limits
  SELECT daily_post_limit, monthly_post_limit 
  INTO v_daily_limit, v_monthly_limit
  FROM public.plans WHERE id = v_plan;
  
  -- Get current usage
  SELECT posts_generated_today, posts_generated_this_month
  INTO v_daily_used, v_monthly_used
  FROM public.usage WHERE user_id = p_user_id;
  
  -- Check limits
  IF v_daily_used >= v_daily_limit THEN
    RETURN QUERY SELECT false, v_daily_used, v_daily_limit, v_monthly_used, v_monthly_limit, 
      'Daily limit reached. Upgrade your plan for more posts.'::TEXT;
  ELSIF v_monthly_used >= v_monthly_limit THEN
    RETURN QUERY SELECT false, v_daily_used, v_daily_limit, v_monthly_used, v_monthly_limit,
      'Monthly limit reached. Upgrade your plan for more posts.'::TEXT;
  ELSE
    RETURN QUERY SELECT true, v_daily_used, v_daily_limit, v_monthly_used, v_monthly_limit,
      'OK'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: increment_usage
-- ============================================
-- Increment usage counters
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Reset daily counter if needed
  UPDATE public.usage
  SET 
    posts_generated_today = CASE 
      WHEN DATE_TRUNC('day', last_reset) < DATE_TRUNC('day', NOW()) THEN 1
      ELSE posts_generated_today + 1
    END,
    last_reset = CASE
      WHEN DATE_TRUNC('day', last_reset) < DATE_TRUNC('day', NOW()) THEN NOW()
      ELSE last_reset
    END,
    posts_generated_this_month = CASE
      WHEN DATE_TRUNC('month', month_reset) < DATE_TRUNC('month', NOW()) THEN 1
      ELSE posts_generated_this_month + 1
    END,
    month_reset = CASE
      WHEN DATE_TRUNC('month', month_reset) < DATE_TRUNC('month', NOW()) THEN NOW()
      ELSE month_reset
    END,
    total_posts_generated = total_posts_generated + 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: create_post_version
-- ============================================
-- Automatically create version when post is created/updated
CREATE OR REPLACE FUNCTION public.create_post_version()
RETURNS TRIGGER AS $$
DECLARE
  v_version_number INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO v_version_number
  FROM public.post_versions
  WHERE post_id = NEW.id;
  
  -- Create version
  INSERT INTO public.post_versions (
    post_id, user_id, version_number, content, hashtags, 
    engagement_score, change_type
  ) VALUES (
    NEW.id, NEW.user_id, v_version_number, NEW.content, 
    NEW.hashtags, NEW.engagement_score, 
    CASE WHEN v_version_number = 1 THEN 'initial' ELSE 'regenerate' END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create version on post insert/update
DROP TRIGGER IF EXISTS create_post_version_trigger ON public.posts;
CREATE TRIGGER create_post_version_trigger
  AFTER INSERT OR UPDATE OF content ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.create_post_version();

-- ============================================
-- FUNCTION: cleanup_expired_cache
-- ============================================
-- Clean up expired cache entries
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.ai_response_cache
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Apply updated_at triggers to new tables
-- ============================================
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_templates_updated_at BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_cache_updated_at BEFORE UPDATE ON public.ai_response_cache
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
