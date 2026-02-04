-- ============================================
-- PERSONAL WRITING STYLE FEATURE
-- ============================================
-- Allows users to train the AI on their personal writing style

-- ============================================
-- TABLE: style_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS public.style_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Profile metadata
  name TEXT NOT NULL DEFAULT 'My Writing Style',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  
  -- Sample posts used for training
  sample_posts JSONB NOT NULL DEFAULT '[]', -- Array of post texts
  
  -- Extracted style characteristics
  tone_profile JSONB NOT NULL DEFAULT '{}', -- Tone analysis
  sentence_structure JSONB NOT NULL DEFAULT '{}', -- Sentence length, complexity
  emoji_usage JSONB NOT NULL DEFAULT '{}', -- Emoji patterns
  cta_style JSONB NOT NULL DEFAULT '{}', -- CTA patterns
  vocabulary JSONB NOT NULL DEFAULT '{}', -- Common words, phrases
  formatting_style JSONB NOT NULL DEFAULT '{}', -- Line breaks, bullets, etc.
  
  -- AI-generated style summary
  style_summary TEXT, -- Human-readable summary
  ai_prompt_additions TEXT, -- Additional prompt instructions
  
  -- Metadata
  trained_at TIMESTAMPTZ,
  sample_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_style_profiles_user_id ON public.style_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_style_profiles_active ON public.style_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_style_profiles_default ON public.style_profiles(user_id, is_default);

-- Unique constraint: only one default profile per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_style_profiles_user_default 
  ON public.style_profiles(user_id) 
  WHERE is_default = true;

-- ============================================
-- FUNCTION: analyze_writing_style
-- ============================================
-- Analyzes sample posts and extracts style characteristics
CREATE OR REPLACE FUNCTION public.analyze_writing_style(
  p_sample_posts TEXT[]
)
RETURNS JSONB AS $$
DECLARE
  v_analysis JSONB;
  v_post TEXT;
  v_total_length INTEGER := 0;
  v_total_words INTEGER := 0;
  v_total_sentences INTEGER := 0;
  v_total_emojis INTEGER := 0;
  v_total_hashtags INTEGER := 0;
  v_total_questions INTEGER := 0;
  v_total_line_breaks INTEGER := 0;
  v_has_bullets BOOLEAN := false;
  v_post_count INTEGER;
BEGIN
  v_post_count := array_length(p_sample_posts, 1);
  
  IF v_post_count IS NULL OR v_post_count = 0 THEN
    RETURN '{}'::JSONB;
  END IF;
  
  -- Analyze each post
  FOREACH v_post IN ARRAY p_sample_posts LOOP
    -- Length analysis
    v_total_length := v_total_length + length(v_post);
    v_total_words := v_total_words + array_length(regexp_split_to_array(v_post, '\s+'), 1);
    v_total_sentences := v_total_sentences + array_length(regexp_split_to_array(v_post, '[.!?]+'), 1);
    
    -- Emoji count (simplified - counts common emoji ranges)
    v_total_emojis := v_total_emojis + (length(v_post) - length(regexp_replace(v_post, '[😀-🙏🌀-🗿🚀-🛿]', '', 'g')));
    
    -- Hashtag count
    v_total_hashtags := v_total_hashtags + array_length(regexp_matches(v_post, '#\w+', 'g'), 1);
    
    -- Question count
    v_total_questions := v_total_questions + array_length(regexp_matches(v_post, '\?', 'g'), 1);
    
    -- Line breaks
    v_total_line_breaks := v_total_line_breaks + array_length(regexp_matches(v_post, '\n', 'g'), 1);
    
    -- Bullets
    IF v_post ~ '[•\-\*]\s' OR v_post ~ '\d+\.\s' THEN
      v_has_bullets := true;
    END IF;
  END LOOP;
  
  -- Build analysis JSON
  v_analysis := jsonb_build_object(
    'avg_post_length', v_total_length / v_post_count,
    'avg_word_count', v_total_words / v_post_count,
    'avg_sentence_count', v_total_sentences / v_post_count,
    'avg_words_per_sentence', CASE WHEN v_total_sentences > 0 THEN v_total_words / v_total_sentences ELSE 0 END,
    'avg_emojis_per_post', v_total_emojis / v_post_count,
    'avg_hashtags_per_post', v_total_hashtags / v_post_count,
    'avg_questions_per_post', v_total_questions / v_post_count,
    'avg_line_breaks_per_post', v_total_line_breaks / v_post_count,
    'uses_bullets', v_has_bullets,
    'sample_count', v_post_count
  );
  
  RETURN v_analysis;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Apply updated_at trigger
-- ============================================
CREATE TRIGGER update_style_profiles_updated_at 
  BEFORE UPDATE ON public.style_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- UPDATE: posts table
-- ============================================
-- Add style_profile_id to posts
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS style_profile_id UUID REFERENCES public.style_profiles(id) ON DELETE SET NULL;

-- Index for style profile posts
CREATE INDEX IF NOT EXISTS idx_posts_style_profile_id ON public.posts(style_profile_id);

-- ============================================
-- SAMPLE DATA: Insert example style profile
-- ============================================
-- This will be created via API when user trains their style
