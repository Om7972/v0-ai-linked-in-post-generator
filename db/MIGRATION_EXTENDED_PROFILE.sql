-- ============================================
-- MIGRATION: Add Extended Profile Fields
-- ============================================
-- Run this in your Supabase SQL Editor after the COMPLETE_SETUP.sql
-- This adds new columns for the enhanced profile feature

-- Add new profile columns (safe with IF NOT EXISTS pattern)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') THEN
    ALTER TABLE public.profiles ADD COLUMN linkedin_url TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'company') THEN
    ALTER TABLE public.profiles ADD COLUMN company TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'job_title') THEN
    ALTER TABLE public.profiles ADD COLUMN job_title TEXT DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_email') THEN
    ALTER TABLE public.profiles ADD COLUMN notification_email BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_weekly') THEN
    ALTER TABLE public.profiles ADD COLUMN notification_weekly BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'writing_streak') THEN
    ALTER TABLE public.profiles ADD COLUMN writing_streak INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_post_date') THEN
    ALTER TABLE public.profiles ADD COLUMN last_post_date DATE;
  END IF;
END $$;

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================
-- New columns added:
-- ✓ bio - User bio/headline
-- ✓ linkedin_url - LinkedIn profile URL
-- ✓ company - Company name
-- ✓ job_title - Job title
-- ✓ avatar_url - Profile picture URL
-- ✓ onboarding_completed - Track onboarding status
-- ✓ notification_email - Email notification preference
-- ✓ notification_weekly - Weekly report preference
-- ✓ writing_streak - Gamification writing streak
-- ✓ last_post_date - Track last post for streak
