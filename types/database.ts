/**
 * Database Types
 * Auto-generated types for Supabase tables
 */

export type PlanId = 'free' | 'pro' | 'creator' | 'enterprise';

export type ToneType = 'professional' | 'founder' | 'influencer' | 'casual';

export type LengthType = 'short' | 'medium' | 'long';

export type TemplateRole = 'founder' | 'recruiter' | 'influencer' | 'marketer' | 'professional' | 'custom';

export type ChangeType = 'initial' | 'regenerate' | 'refine' | 'manual_edit';

export type HashtagCategory = 'niche' | 'broad' | 'trending' | 'branded';

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';

// ============================================
// TABLE TYPES
// ============================================

export interface Plan {
    id: PlanId;
    name: string;
    display_name: string;
    description: string | null;
    price_monthly: number;
    price_yearly: number;

    // Limits
    daily_post_limit: number;
    monthly_post_limit: number;
    version_history_limit: number;
    hashtag_limit: number;
    team_members_limit: number;

    // Features
    can_use_templates: boolean;
    can_access_analytics: boolean;
    can_use_ai_cache: boolean;
    can_create_teams: boolean;
    priority_support: boolean;

    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    name: string;
    plan: PlanId;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    user_id: string;
    topic: string;
    tone: ToneType;
    audience: string | null;
    length: LengthType | null;
    content: string;
    hashtags: string | null;
    engagement_score: number | null;
    team_id: string | null;
    template_id: string | null;
    is_cached: boolean;
    cache_hit: boolean;
    created_at: string;
    updated_at: string;
}

export interface Draft {
    id: string;
    user_id: string;
    topic: string | null;
    tone: string | null;
    audience: string | null;
    length: string | null;
    content: string | null;
    hashtags: string | null;
    form_data: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface Usage {
    user_id: string;
    posts_generated_today: number;
    last_reset: string;
    posts_generated_this_month: number;
    month_reset: string;
    total_posts_generated: number;
    created_at: string;
    updated_at: string;
}

export interface PromptTemplate {
    id: string;
    role: TemplateRole;
    name: string;
    description: string | null;
    system_prompt: string;
    user_prompt_template: string;
    is_active: boolean;
    is_default: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface PostVersion {
    id: string;
    post_id: string;
    user_id: string;
    version_number: number;
    content: string;
    hashtags: string | null;
    engagement_score: number | null;
    change_type: ChangeType | null;
    change_description: string | null;
    created_at: string;
}

export interface HashtagIntelligence {
    id: string;
    post_id: string;
    hashtag: string;
    category: HashtagCategory;
    relevance_score: number | null;
    estimated_reach: string | null;
    competition_level: string | null;
    created_at: string;
}

export interface AIResponseCache {
    id: string;
    cache_key: string;
    topic: string;
    tone: string;
    audience: string | null;
    length: string;
    cta: string | null;
    template_id: string | null;
    content: string;
    hashtags: string | null;
    engagement_score: number | null;
    hit_count: number;
    last_hit_at: string | null;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface Team {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    owner_id: string;
    plan: PlanId;
    settings: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface TeamMember {
    id: string;
    team_id: string;
    user_id: string;
    role: TeamRole;
    can_create_posts: boolean;
    can_edit_posts: boolean;
    can_delete_posts: boolean;
    can_manage_members: boolean;
    invited_by: string | null;
    invited_at: string;
    joined_at: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// FUNCTION RETURN TYPES
// ============================================

export interface UsageLimitCheck {
    can_generate: boolean;
    daily_used: number;
    daily_limit: number;
    monthly_used: number;
    monthly_limit: number;
    reason: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface GeneratePostRequest {
    topic: string;
    audience: string;
    tone: string;
    length: string;
    cta: string;
    templateId?: string;
    teamId?: string;
}

export interface GeneratePostResponse {
    post: string;
    hashtags: string;
    engagement: {
        score: number;
        potential: string;
    };
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    cached?: boolean;
    postId?: string;
    versionNumber?: number;
}

export interface RefinePostRequest {
    postId: string;
    currentPost: string;
    refinementType: string;
    customInstruction?: string;
}

export interface GetVersionsResponse {
    versions: PostVersion[];
    currentVersion: number;
    totalVersions: number;
}

export interface RollbackVersionRequest {
    postId: string;
    versionNumber: number;
}

export interface GetTemplatesResponse {
    templates: PromptTemplate[];
    userTemplates: PromptTemplate[];
}

export interface CreateTemplateRequest {
    name: string;
    description?: string;
    systemPrompt: string;
    userPromptTemplate: string;
}

export interface GetUsageResponse {
    daily: {
        used: number;
        limit: number;
        remaining: number;
    };
    monthly: {
        used: number;
        limit: number;
        remaining: number;
    };
    total: number;
    canGenerate: boolean;
    reason?: string;
}

export interface HashtagAnalysis {
    hashtags: Array<{
        tag: string;
        category: HashtagCategory;
        relevanceScore: number;
        estimatedReach: string;
        competitionLevel: string;
    }>;
    summary: {
        niche: number;
        broad: number;
        trending: number;
        branded: number;
    };
}

// ============================================
// UTILITY TYPES
// ============================================

export type Database = {
    public: {
        Tables: {
            plans: {
                Row: Plan;
                Insert: Omit<Plan, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>;
            };
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
            };
            posts: {
                Row: Post;
                Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;
            };
            drafts: {
                Row: Draft;
                Insert: Omit<Draft, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Draft, 'id' | 'created_at' | 'updated_at'>>;
            };
            usage: {
                Row: Usage;
                Insert: Omit<Usage, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Usage, 'user_id' | 'created_at' | 'updated_at'>>;
            };
            prompt_templates: {
                Row: PromptTemplate;
                Insert: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>>;
            };
            post_versions: {
                Row: PostVersion;
                Insert: Omit<PostVersion, 'id' | 'created_at'>;
                Update: never; // Versions are immutable
            };
            hashtag_intelligence: {
                Row: HashtagIntelligence;
                Insert: Omit<HashtagIntelligence, 'id' | 'created_at'>;
                Update: Partial<Omit<HashtagIntelligence, 'id' | 'created_at'>>;
            };
            ai_response_cache: {
                Row: AIResponseCache;
                Insert: Omit<AIResponseCache, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<AIResponseCache, 'id' | 'created_at' | 'updated_at'>>;
            };
            teams: {
                Row: Team;
                Insert: Omit<Team, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>;
            };
            team_members: {
                Row: TeamMember;
                Insert: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>;
            };
        };
        Functions: {
            check_usage_limit: {
                Args: { p_user_id: string };
                Returns: UsageLimitCheck[];
            };
            increment_usage: {
                Args: { p_user_id: string };
                Returns: void;
            };
            cleanup_expired_cache: {
                Args: Record<string, never>;
                Returns: number;
            };
        };
    };
};
