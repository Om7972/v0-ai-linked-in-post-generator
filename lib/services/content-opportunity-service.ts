import { createServerSupabaseClient } from "../supabase";
import { generateContentWithFallback } from "../gemini";

export interface OpportunityItem {
  id?: string;
  topic: string;
  category: string;
  confidence_score: number;
  status: "new" | "saved" | "dismissed" | "generated";
  angle: string;
  reason: string;
  trend_match: string;
  quick_prompt: string;
  created_at?: string;
}

export interface OpportunityHistoryItem {
  id?: string;
  user_id: string;
  opportunity_id?: string | null;
  action_taken: string;
  created_at?: string;
}

export interface OpportunityDashboardData {
  niche: string;
  posting_frequency: string;
  opportunity_score: number;
  opportunities: OpportunityItem[];
  weekly_topics: string[];
  ai_recommendations: string[];
  content_gap_alerts: string[];
  suggested_angles: string[];
}

type PostRecord = {
  topic?: string | null;
  content?: string | null;
  created_at?: string | null;
};

type BrandProfileRecord = {
  niche?: string | null;
  primary_topics?: string[] | null;
};

type ContentPillarRecord = {
  pillar_name?: string | null;
  percentage?: number | null;
};

const opportunityCache: Record<string, OpportunityItem[]> = {};
const historyCache: Record<string, OpportunityHistoryItem[]> = {};

export class ContentOpportunityService {
  static async getDashboardData(userId: string, forceRefresh = false): Promise<OpportunityDashboardData> {
    const context = await this.getUserContext(userId);
    let opportunities = forceRefresh ? [] : await this.getStoredOpportunities(userId);

    if (opportunities.length === 0 || forceRefresh) {
      opportunities = await this.generateOpportunities(userId, context);
    }

    const opportunityScore = Math.round(
      opportunities.reduce((sum, item) => sum + item.confidence_score, 0) / Math.max(opportunities.length, 1)
    );

    return {
      niche: context.niche,
      posting_frequency: context.postingFrequencyLabel,
      opportunity_score: opportunityScore,
      opportunities,
      weekly_topics: opportunities.slice(0, 4).map((item) => item.topic),
      ai_recommendations: this.buildRecommendations(context, opportunities),
      content_gap_alerts: context.gapAlerts,
      suggested_angles: opportunities.slice(0, 5).map((item) => item.angle),
    };
  }

  static async trackAction(userId: string, opportunityId: string | null, actionTaken: string): Promise<void> {
    const supabase = createServerSupabaseClient();

    const fallbackRecord: OpportunityHistoryItem = {
      user_id: userId,
      opportunity_id: opportunityId,
      action_taken: actionTaken,
      created_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from("opportunity_history").insert({
        user_id: userId,
        opportunity_id: opportunityId,
        action_taken: actionTaken,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn("[Opportunity Engine] Failed to store opportunity action. Falling back to memory.", error);
      historyCache[userId] = [fallbackRecord, ...(historyCache[userId] || [])].slice(0, 50);
    }
  }

  private static async getUserContext(userId: string) {
    const supabase = createServerSupabaseClient();

    const { data: posts } = await supabase
      .from("posts")
      .select("topic, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    let brandProfile: BrandProfileRecord | null = null;
    try {
      const { data } = await supabase
        .from("brand_profiles")
        .select("niche, primary_topics")
        .eq("user_id", userId)
        .maybeSingle();
      brandProfile = data;
    } catch (error) {
      brandProfile = null;
    }

    let pillars: ContentPillarRecord[] = [];
    try {
      const { data } = await supabase
        .from("content_pillars")
        .select("pillar_name, percentage")
        .eq("user_id", userId);
      pillars = data || [];
    } catch (error) {
      pillars = [];
    }

    const postList = (posts || []) as PostRecord[];
    const recentTopics = postList.map((item) => item.topic).filter(Boolean) as string[];
    const niche =
      brandProfile?.niche ||
      this.detectNicheFromTopics(recentTopics) ||
      "AI, SaaS, and professional branding";
    const pillarNames =
      pillars.length > 0
        ? pillars.map((item) => item.pillar_name).filter(Boolean) as string[]
        : ["Thought Leadership", "Industry Insights", "Personal Story", "How-To Education"];
    const postingFrequencyLabel = this.calculatePostingFrequency(postList);
    const gapAlerts = this.detectContentGaps(recentTopics, pillarNames, niche);

    return {
      niche,
      pillarNames,
      recentTopics,
      postingFrequencyLabel,
      gapAlerts,
      postCount: postList.length,
      primaryTopics: brandProfile?.primary_topics || [],
    };
  }

  private static async getStoredOpportunities(userId: string): Promise<OpportunityItem[]> {
    const supabase = createServerSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("content_opportunities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return opportunityCache[userId] || [];
      }

      return data.map((item, index) => ({
        id: item.id,
        topic: item.topic,
        category: item.category,
        confidence_score: Number(item.confidence_score),
        status: item.status,
        angle: this.defaultAngleForCategory(item.category, item.topic),
        reason: this.defaultReasonForCategory(item.category),
        trend_match: this.defaultTrendMatch(item.topic),
        quick_prompt: `Create a high-authority LinkedIn post about ${item.topic} for ${item.category.toLowerCase()} content.`,
        created_at: item.created_at,
      }));
    } catch (error) {
      console.warn("[Opportunity Engine] Failed to read stored opportunities. Falling back to memory.", error);
      return opportunityCache[userId] || [];
    }
  }

  private static async generateOpportunities(
    userId: string,
    context: {
      niche: string;
      pillarNames: string[];
      recentTopics: string[];
      postingFrequencyLabel: string;
      gapAlerts: string[];
      postCount: number;
      primaryTopics: string[];
    }
  ): Promise<OpportunityItem[]> {
    let opportunities = await this.generateWithAI(context);

    if (opportunities.length === 0) {
      opportunities = this.generateFallbackOpportunities(context);
    }

    const saved = await this.persistGeneratedOpportunities(userId, opportunities);
    opportunityCache[userId] = saved;
    return saved;
  }

  private static async generateWithAI(context: {
    niche: string;
    pillarNames: string[];
    recentTopics: string[];
    postingFrequencyLabel: string;
    gapAlerts: string[];
    postCount: number;
    primaryTopics: string[];
  }): Promise<OpportunityItem[]> {
    try {
      const prompt = `
You are an AI Content Opportunity Engine for a premium personal branding SaaS product.

USER NICHE:
${context.niche}

PRIMARY TOPICS:
${context.primaryTopics.join(", ") || "Not defined"}

RECENT TOPICS:
${context.recentTopics.join(", ") || "No recent topics"}

CONTENT PILLARS:
${context.pillarNames.join(", ")}

POSTING FREQUENCY:
${context.postingFrequencyLabel}

CONTENT GAPS:
${context.gapAlerts.join(" | ")}

Generate exactly 6 content opportunities that are timely, differentiated, and high-value.
Each item must include:
- topic
- category
- confidence_score (0-100)
- status
- angle
- reason
- trend_match
- quick_prompt

Return JSON only in this exact format:
{
  "opportunities": [
    {
      "topic": "string",
      "category": "string",
      "confidence_score": 86,
      "status": "new",
      "angle": "string",
      "reason": "string",
      "trend_match": "string",
      "quick_prompt": "string"
    }
  ]
}
      `.trim();

      const result = await generateContentWithFallback({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 1400,
        },
      });

      const text = result.response.text();
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        return [];
      }

      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed.opportunities)) {
        return [];
      }

      return parsed.opportunities.slice(0, 6).map((item: Partial<OpportunityItem>) => ({
        topic: item.topic || "New content opportunity",
        category: item.category || "Opportunity",
        confidence_score: Math.max(0, Math.min(100, Number(item.confidence_score || 72))),
        status: "new",
        angle: item.angle || "Teach a practical lesson from your direct experience.",
        reason: item.reason || "This fills a strategic gap in your current content mix.",
        trend_match: item.trend_match || "Aligned with current professional interest signals.",
        quick_prompt: item.quick_prompt || `Generate a LinkedIn post about ${item.topic || "this topic"}.`,
      }));
    } catch (error) {
      console.warn("[Opportunity Engine] AI generation failed, using heuristic fallback.", error);
      return [];
    }
  }

  private static generateFallbackOpportunities(context: {
    niche: string;
    pillarNames: string[];
    recentTopics: string[];
    postingFrequencyLabel: string;
    gapAlerts: string[];
    postCount: number;
    primaryTopics: string[];
  }): OpportunityItem[] {
    const anchors = context.primaryTopics.length > 0 ? context.primaryTopics : context.pillarNames;
    const underused = context.gapAlerts.length > 0 ? context.gapAlerts : ["You have room for a stronger point of view series."];
    const recentTopic = context.recentTopics[0] || context.niche;

    return [
      {
        topic: `${context.niche}: the 2026 shift most professionals are still underestimating`,
        category: "Trending Topic Match",
        confidence_score: 90,
        status: "new",
        angle: "Lead with a contrarian prediction and support it with one market signal and one field observation.",
        reason: "Creates authority while aligning your brand with active industry change.",
        trend_match: "Trend-driven and high conversation potential.",
        quick_prompt: `Write a LinkedIn post about the biggest 2026 shift in ${context.niche} and why professionals should adapt now.`,
      },
      {
        topic: `${anchors[0] || "Thought leadership"}: a practical framework your audience can apply this week`,
        category: "Personalized Opportunity",
        confidence_score: 86,
        status: "new",
        angle: "Turn expertise into a 3-step framework with a clear before-and-after outcome.",
        reason: "High save potential because it converts expertise into action.",
        trend_match: "Strong evergreen relevance with repeatability.",
        quick_prompt: `Create a framework-style LinkedIn post about ${anchors[0] || "thought leadership"} with three practical steps.`,
      },
      {
        topic: `${recentTopic}: what most creators miss when they talk about results`,
        category: "Content Angle Generator",
        confidence_score: 82,
        status: "new",
        angle: "Contrast surface-level advice with the deeper system that actually drives outcomes.",
        reason: "Adds nuance to a topic you already touch, without repeating the same message.",
        trend_match: "Useful for re-entering familiar territory with a fresh perspective.",
        quick_prompt: `Generate a nuanced LinkedIn post about ${recentTopic} that challenges shallow advice with a stronger framework.`,
      },
      {
        topic: `${context.pillarNames[1] || "Industry insights"} content gap: the topic your brand has not covered enough`,
        category: "Content Gap Detection",
        confidence_score: 80,
        status: "new",
        angle: "Explain why this pillar matters now, then connect it directly to your niche positioning.",
        reason: underused[0],
        trend_match: "Gap-closing content improves brand balance over time.",
        quick_prompt: `Write a LinkedIn post that fills a content gap around ${context.pillarNames[1] || "industry insights"} for a ${context.niche} audience.`,
      },
      {
        topic: `Weekly audience question: what decision is slowing growth in ${context.niche}?`,
        category: "Weekly AI Topic Suggestion",
        confidence_score: 77,
        status: "new",
        angle: "Use a question-led format to invite stories, objections, and real-world examples.",
        reason: "Conversation starters improve idea discovery and comment quality.",
        trend_match: "Great fit when posting frequency needs a lower-friction format.",
        quick_prompt: `Create a question-led LinkedIn post for ${context.niche} that invites professionals to share decisions that slowed growth.`,
      },
      {
        topic: `${context.niche}: the overlooked lesson from your last ${Math.max(context.postCount, 3)} content experiments`,
        category: "Industry Recommendation",
        confidence_score: 75,
        status: "new",
        angle: "Frame the post as a transparent debrief with one lesson, one mistake, and one next move.",
        reason: `Your current posting frequency is ${context.postingFrequencyLabel.toLowerCase()}, so reflective posts can deepen brand trust.`,
        trend_match: "Reflective transparency is consistently strong for personal branding.",
        quick_prompt: `Write a reflective LinkedIn post about lessons learned from recent content experiments in ${context.niche}.`,
      },
    ];
  }

  private static async persistGeneratedOpportunities(userId: string, items: OpportunityItem[]): Promise<OpportunityItem[]> {
    const supabase = createServerSupabaseClient();

    try {
      const { error: deleteError } = await supabase.from("content_opportunities").delete().eq("user_id", userId);
      if (deleteError) {
        throw deleteError;
      }

      const { data, error } = await supabase
        .from("content_opportunities")
        .insert(
          items.map((item) => ({
            user_id: userId,
            topic: item.topic,
            category: item.category,
            confidence_score: item.confidence_score,
            status: item.status,
          }))
        )
        .select("*");

      if (error) {
        throw error;
      }

      return (data || []).map((row, index) => ({
        ...items[index],
        id: row.id,
        created_at: row.created_at,
      }));
    } catch (error) {
      console.warn("[Opportunity Engine] Failed to persist opportunities. Using in-memory cache.", error);
      return items.map((item, index) => ({
        ...item,
        id: item.id || `memory-${index}`,
        created_at: new Date().toISOString(),
      }));
    }
  }

  private static detectNicheFromTopics(topics: string[]): string | null {
    if (topics.length === 0) {
      return null;
    }

    const joined = topics.join(" ").toLowerCase();
    if (joined.includes("ai") || joined.includes("automation")) {
      return "AI and automation strategy";
    }
    if (joined.includes("sales") || joined.includes("gtm")) {
      return "B2B growth and GTM";
    }
    if (joined.includes("leadership") || joined.includes("career")) {
      return "Leadership and career growth";
    }
    return "Professional growth and market insights";
  }

  private static calculatePostingFrequency(posts: PostRecord[]): string {
    if (posts.length === 0) {
      return "Low";
    }

    const uniqueDays = new Set(
      posts.map((item) => (item.created_at ? new Date(item.created_at).toDateString() : null)).filter(Boolean)
    ).size;

    if (uniqueDays >= 8) {
      return "High";
    }
    if (uniqueDays >= 4) {
      return "Moderate";
    }
    return "Low";
  }

  private static detectContentGaps(topics: string[], pillars: string[], niche: string): string[] {
    const text = topics.join(" ").toLowerCase();
    const alerts: string[] = [];

    if (!text.includes("story") && !text.includes("journey")) {
      alerts.push("Personal storytelling is underrepresented in your recent posts.");
    }

    if (!text.includes("case") && !text.includes("example")) {
      alerts.push("Case-study style proof content is missing from your current mix.");
    }

    if (!text.includes("trend") && !text.includes("future")) {
      alerts.push(`Trend commentary for ${niche} is a strong opportunity gap right now.`);
    }

    if (pillars.every((pillar) => !text.includes(pillar.toLowerCase().split(" ")[0]))) {
      alerts.push("Your recent posts do not clearly cover your defined content pillars.");
    }

    return alerts.slice(0, 3);
  }

  private static buildRecommendations(
    context: {
      niche: string;
      postingFrequencyLabel: string;
      gapAlerts: string[];
    },
    opportunities: OpportunityItem[]
  ): string[] {
    return [
      `Prioritize ${opportunities[0]?.category || "high-confidence"} ideas first to improve publishing confidence.`,
      `Your posting frequency is ${context.postingFrequencyLabel.toLowerCase()}; mix one easy conversation post with one authority post this week.`,
      context.gapAlerts[0] || `Use your next post to reinforce your position in ${context.niche}.`,
    ];
  }

  private static defaultAngleForCategory(category: string, topic: string): string {
    if (category.toLowerCase().includes("trend")) {
      return `Explain why ${topic} matters now and what changes in the next 6 months.`;
    }
    if (category.toLowerCase().includes("gap")) {
      return `Use ${topic} to close a missing pillar in your content mix.`;
    }
    return `Turn ${topic} into an authority-building point of view with a practical takeaway.`;
  }

  private static defaultReasonForCategory(category: string): string {
    if (category.toLowerCase().includes("weekly")) {
      return "Weekly suggestions keep the publishing queue full without generic brainstorming.";
    }
    if (category.toLowerCase().includes("industry")) {
      return "Industry-based recommendations help the brand stay contextually relevant.";
    }
    return "This opportunity balances brand authority, relevance, and engagement potential.";
  }

  private static defaultTrendMatch(topic: string): string {
    return `${topic} aligns with timely professional conversation patterns and niche relevance.`;
  }
}
