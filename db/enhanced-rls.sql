-- ============================================
-- ENHANCED ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Security policies for new tables

-- ============================================
-- TABLE: plans (Public Read)
-- ============================================
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Everyone can read plans
CREATE POLICY "Plans are viewable by everyone"
  ON public.plans FOR SELECT
  USING (true);

-- Only service role can modify plans
CREATE POLICY "Plans can only be modified by service role"
  ON public.plans FOR ALL
  USING (false);

-- ============================================
-- TABLE: prompt_templates
-- ============================================
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- Users can view active templates
CREATE POLICY "Active templates are viewable by authenticated users"
  ON public.prompt_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Users can create custom templates
CREATE POLICY "Users can create their own templates"
  ON public.prompt_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND role = 'custom'
  );

-- Users can update their own custom templates
CREATE POLICY "Users can update their own templates"
  ON public.prompt_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by AND role = 'custom')
  WITH CHECK (auth.uid() = created_by AND role = 'custom');

-- Users can delete their own custom templates
CREATE POLICY "Users can delete their own templates"
  ON public.prompt_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by AND role = 'custom');

-- ============================================
-- TABLE: post_versions
-- ============================================
ALTER TABLE public.post_versions ENABLE ROW LEVEL SECURITY;

-- Users can view their own post versions
CREATE POLICY "Users can view their own post versions"
  ON public.post_versions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create versions for their own posts
CREATE POLICY "Users can create versions for their own posts"
  ON public.post_versions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- No manual updates or deletes (managed by triggers)
CREATE POLICY "Post versions cannot be manually updated"
  ON public.post_versions FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Post versions cannot be manually deleted"
  ON public.post_versions FOR DELETE
  TO authenticated
  USING (false);

-- ============================================
-- TABLE: hashtag_intelligence
-- ============================================
ALTER TABLE public.hashtag_intelligence ENABLE ROW LEVEL SECURITY;

-- Users can view hashtags for their own posts
CREATE POLICY "Users can view hashtags for their own posts"
  ON public.hashtag_intelligence FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = hashtag_intelligence.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- System can insert hashtags
CREATE POLICY "System can insert hashtags"
  ON public.hashtag_intelligence FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = hashtag_intelligence.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- ============================================
-- TABLE: ai_response_cache
-- ============================================
ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

-- Cache is managed by service role only
CREATE POLICY "Cache is managed by service role"
  ON public.ai_response_cache FOR ALL
  USING (false);

-- ============================================
-- TABLE: teams
-- ============================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Users can view teams they're members of
CREATE POLICY "Users can view their teams"
  ON public.teams FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Users can create teams (if plan allows)
CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      JOIN public.plans ON profiles.plan = plans.id
      WHERE profiles.id = auth.uid()
      AND plans.can_create_teams = true
    )
  );

-- Team owners can update their teams
CREATE POLICY "Team owners can update their teams"
  ON public.teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Team owners can delete their teams
CREATE POLICY "Team owners can delete their teams"
  ON public.teams FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- ============================================
-- TABLE: team_members
-- ============================================
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of their teams
CREATE POLICY "Users can view team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

-- Team owners and admins can add members
CREATE POLICY "Team admins can add members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.can_manage_members = true
    )
  );

-- Team owners and admins can update members
CREATE POLICY "Team admins can update members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.can_manage_members = true
    )
  );

-- Team owners and admins can remove members
CREATE POLICY "Team admins can remove members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.can_manage_members = true
    ) OR
    user_id = auth.uid() -- Users can remove themselves
  );

-- ============================================
-- UPDATE: posts table RLS for teams
-- ============================================
-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Users can view team posts" ON public.posts;

-- Users can view posts in their teams
CREATE POLICY "Users can view team posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (
      team_id IS NOT NULL AND
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = posts.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );
