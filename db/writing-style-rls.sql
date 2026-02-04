-- ============================================
-- WRITING STYLE RLS POLICIES
-- ============================================

ALTER TABLE public.style_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own style profiles
CREATE POLICY "Users can view their own style profiles"
  ON public.style_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own style profiles
CREATE POLICY "Users can create their own style profiles"
  ON public.style_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own style profiles
CREATE POLICY "Users can update their own style profiles"
  ON public.style_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own style profiles
CREATE POLICY "Users can delete their own style profiles"
  ON public.style_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
