/**
 * Brand Coach Service
 * 
 * Analyzes post history, identifies content pillars, determines category distribution,
 * calculates authority score, and generates weekly content plans and monthly reports.
 * Falls back to high-fidelity mock calculations/local caching if brand_profiles/brand_reports
 * tables have not been created yet in Supabase.
 */

import { createServerSupabaseClient } from '../supabase';
import { generateLinkedInPost } from '../ai-service';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface BrandProfile {
    id?: string;
    user_id: string;
    niche: string;
    primary_topics: string[];
    content_distribution: Record<string, number>;
    authority_score: number;
    created_at?: string;
    updated_at?: string;
}

export interface BrandReport {
    id?: string;
    user_id: string;
    report_json: any;
    created_at?: string;
}

// In-memory fallbacks if tables do not exist
const brandProfileCache: Record<string, BrandProfile> = {};
const brandReportsCache: Record<string, BrandReport[]> = {};

export class BrandCoachService {
    /**
     * Get or create a brand profile for a user
     */
    static async getBrandProfile(userId: string): Promise<BrandProfile> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('brand_profiles')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) {
                console.warn('[Brand Coach] Failed to query brand_profiles table (table may not exist yet):', error.message);
                throw error;
            }

            if (data) return data as BrandProfile;

            // Create initial default profile if table exists but no record
            const defaultProfile: Omit<BrandProfile, 'id'> = {
                user_id: userId,
                niche: 'General Technology & Growth',
                primary_topics: ['Software Development', 'Artificial Intelligence', 'Productivity'],
                content_distribution: {
                    'Industry Insights': 40,
                    'Actionable Tips': 30,
                    'Personal Stories': 20,
                    'Career Advice': 10
                },
                authority_score: 55
            };

            const { data: inserted, error: insertError } = await supabase
                .from('brand_profiles')
                .insert(defaultProfile)
                .select()
                .single();

            if (insertError) throw insertError;
            return inserted as BrandProfile;

        } catch (error) {
            // Fallback cache
            if (!brandProfileCache[userId]) {
                brandProfileCache[userId] = {
                    user_id: userId,
                    niche: 'General Technology & Growth',
                    primary_topics: ['Software Development', 'Artificial Intelligence', 'Productivity'],
                    content_distribution: {
                        'Industry Insights': 40,
                        'Actionable Tips': 30,
                        'Personal Stories': 20,
                        'Career Advice': 10
                    },
                    authority_score: 55
                };
            }
            return brandProfileCache[userId];
        }
    }

    /**
     * Update a brand profile
     */
    static async updateBrandProfile(userId: string, updates: Partial<BrandProfile>): Promise<BrandProfile> {
        const supabase = createServerSupabaseClient();

        try {
            const currentProfile = await this.getBrandProfile(userId);
            
            const { data, error } = await supabase
                .from('brand_profiles')
                .upsert({
                    ...currentProfile,
                    ...updates,
                    user_id: userId,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data as BrandProfile;
        } catch (error) {
            console.warn('[Brand Coach] Update brand_profile DB error, updating in-memory cache:', error);
            if (!brandProfileCache[userId]) {
                brandProfileCache[userId] = {
                    user_id: userId,
                    niche: updates.niche || 'General Technology & Growth',
                    primary_topics: updates.primary_topics || ['Software Development', 'Artificial Intelligence', 'Productivity'],
                    content_distribution: updates.content_distribution || {
                        'Industry Insights': 40,
                        'Actionable Tips': 30,
                        'Personal Stories': 20,
                        'Career Advice': 10
                    },
                    authority_score: updates.authority_score || 55
                };
            } else {
                brandProfileCache[userId] = {
                    ...brandProfileCache[userId],
                    ...updates
                };
            }
            return brandProfileCache[userId];
        }
    }

    /**
     * Analyze user's generated post history and update profile
     */
    static async analyzePostHistory(userId: string, customNiche?: string, customTopics?: string[]): Promise<BrandProfile> {
        const supabase = createServerSupabaseClient();
        
        // Fetch up to 50 posts
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('topic, tone, content, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (postsError) {
            console.error('[Brand Coach] Failed to fetch posts:', postsError);
        }

        const postList = posts || [];
        const hasHistory = postList.length > 0;

        // If AI is configured, let's analyze topics and categories using Gemini
        let distribution = {
            'Industry Insights': 40,
            'Actionable Tips': 30,
            'Personal Stories': 20,
            'Career Advice': 10
        };
        let missingPillars = ['Leadership Skills', 'Customer Testimonials', 'Case Studies'];
        let score = 55;
        let finalNiche = customNiche || 'Technology & Professional Development';
        let finalTopics = customTopics || ['Software Engineering', 'Artificial Intelligence', 'Career Growth'];

        if (hasHistory) {
            try {
                const { generateContentWithFallback } = await import('../gemini');
                const postSummaryText = postList.map((p, idx) => `Post ${idx+1}: Topic: ${p.topic}, Tone: ${p.tone}\nContent Summary: ${p.content.substring(0, 150)}...`).join('\n\n');

                const prompt = `
You are a top-tier LinkedIn Brand Strategist and Personal Coach. Analyze this user's generated post history and identify content themes, categories, and pillars.

POST HISTORY:
${postSummaryText}

NICHE PREFERENCE: ${customNiche || 'Not specified'}
TOPICS PREFERENCE: ${customTopics?.join(', ') || 'Not specified'}

Perform the following:
1. Identify the core professional niche and primary topics.
2. Group the posts into 4 main content categories (e.g., "Industry Insights", "Actionable Tips", "Personal Stories", "Career Advice", "Thought Leadership", "Case Studies") and assign percentages (summing to 100).
3. Suggest 3 missing content pillars that could expand their brand presence.
4. Calculate an Authority Score (1-100) based on posting depth, clarity, and consistency.

Return ONLY a JSON response matching this exact structure:
{
  "niche": "string",
  "primary_topics": ["topic1", "topic2", "topic3"],
  "content_distribution": {
    "Category A": 40,
    "Category B": 30,
    "Category C": 20,
    "Category D": 10
  },
  "authority_score": 75,
  "missing_pillars": ["pillar1", "pillar2", "pillar3"]
}
`;

                const result = await generateContentWithFallback({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
                const responseText = result.response.text();
                // Extract JSON block
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    finalNiche = parsed.niche || finalNiche;
                    finalTopics = parsed.primary_topics || finalTopics;
                    distribution = parsed.content_distribution || distribution;
                    score = parsed.authority_score || score;
                    missingPillars = parsed.missing_pillars || missingPillars;
                }
            } catch (err) {
                console.error('[Brand Coach] Gemini analysis failed, using fallback calculations:', err);
            }
        }

        // Calculate consistency score based on posts frequency
        if (hasHistory) {
            const uniqueDays = new Set(postList.map(p => new Date(p.created_at || '').toDateString())).size;
            // Add premium points to Authority Score for consistent creation
            score = Math.min(100, score + Math.min(15, uniqueDays * 3));
        }

        const updated = await this.updateBrandProfile(userId, {
            niche: finalNiche,
            primary_topics: finalTopics,
            content_distribution: distribution,
            authority_score: score
        });

        return {
            ...updated,
            // Keep missing pillars transiently in the return for the UI
            id: (updated as any).id || 'temp-id',
            niche: finalNiche,
            primary_topics: finalTopics,
            content_distribution: distribution,
            authority_score: score,
            // Add custom details for UI rendering
            ...( { missing_pillars: missingPillars } as any )
        };
    }

    /**
     * Generate weekly content plan
     */
    static async generateWeeklyPlan(userId: string): Promise<any> {
        const profile = await this.getBrandProfile(userId);
        
        if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return this.getMockWeeklyPlan(profile);
        }

        try {
            const { generateContentWithFallback } = await import('../gemini');
            const prompt = `
You are a LinkedIn Growth Expert. Generate a comprehensive Weekly Content Plan (5 days, Monday to Friday) for a user with the following brand profile:

NICHE: ${profile.niche}
PRIMARY TOPICS: ${profile.primary_topics.join(', ')}
CONTENT DISTRIBUTION: ${JSON.stringify(profile.content_distribution)}

Create 5 detailed post ideas. For each day, provide:
1. Day (e.g. "Monday")
2. Post Topic Category (e.g. "Industry Insights")
3. Suggested Title / Theme
4. Hook Strategy (how to grab attention in the first 2 lines)
5. Actionable Outline (3 bullet points of what to write)
6. Suggested Call to Action (CTA)

Format the output strictly as a JSON array of objects:
[
  {
    "day": "Monday",
    "category": "Industry Insights",
    "title": "The Future of AI in SaaS Development",
    "hook": "90% of developers are using AI wrong. Here is the framework they are missing...",
    "outline": [
      "AI is a leverage tool, not a replacement",
      "How prompt context dictates code quality",
      "Step-by-step example of setting up a coding agent"
    ],
    "cta": "Are you using AI code assistants? Share your thoughts below."
  },
  ...
]
`;
            const result = await generateContentWithFallback({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
            const responseText = result.response.text();
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Invalid JSON array returned from Gemini");
        } catch (error) {
            console.error('[Brand Coach] Gemini weekly plan generation failed, using mock plan:', error);
            return this.getMockWeeklyPlan(profile);
        }
    }

    /**
     * Generate monthly strategy report
     */
    static async generateMonthlyReport(userId: string): Promise<BrandReport> {
        const supabase = createServerSupabaseClient();
        const profile = await this.getBrandProfile(userId);

        let reportData: any = null;

        if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            try {
                const { generateContentWithFallback } = await import('../gemini');
                const prompt = `
You are a LinkedIn Brand Consultant. Write a monthly Personal Brand Strategy Report for a user with this brand profile:
Niche: ${profile.niche}
Primary Topics: ${profile.primary_topics.join(', ')}
Current Authority Score: ${profile.authority_score}/100

Generate a detailed report with:
1. Executive Summary: Overall assessment and direction.
2. Authority Score Analysis: Strengths and areas to improve.
3. Competitor & Market Positioning: How to stand out in their niche.
4. Content Pillars Strategy: Recommended 4 content pillars with details.
5. Growth Action Plan: 5 steps to implement over the next 30 days.

Return ONLY a JSON response structured like this:
{
  "executive_summary": "string",
  "score_analysis": "string",
  "positioning_strategy": "string",
  "pillars": [
    { "name": "Pillar name", "description": "How to execute this pillar" }
  ],
  "action_plan": [
    "Step 1", "Step 2", "Step 3", "Step 4", "Step 5"
  ]
}
`;
                const result = await generateContentWithFallback({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7 } });
                const responseText = result.response.text();
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    reportData = JSON.parse(jsonMatch[0]);
                }
            } catch (err) {
                console.error('[Brand Coach] Gemini report generation failed, using mock report:', err);
            }
        }

        if (!reportData) {
            reportData = this.getMockMonthlyReport(profile);
        }

        // Save to database if table exists
        try {
            const { data, error } = await supabase
                .from('brand_reports')
                .insert({
                    user_id: userId,
                    report_json: reportData
                })
                .select()
                .single();

            if (error) throw error;
            return data as BrandReport;
        } catch (error) {
            console.warn('[Brand Coach] Failed to save brand report to DB, caching in-memory:', error);
            const report: BrandReport = {
                id: 'report-' + Math.random().toString(36).substring(2, 9),
                user_id: userId,
                report_json: reportData,
                created_at: new Date().toISOString()
            };
            if (!brandReportsCache[userId]) {
                brandReportsCache[userId] = [];
            }
            brandReportsCache[userId].unshift(report);
            return report;
        }
    }

    /**
     * Get recent reports
     */
    static async getRecentReports(userId: string): Promise<BrandReport[]> {
        const supabase = createServerSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('brand_reports')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as BrandReport[];
        } catch (error) {
            console.warn('[Brand Coach] Failed to read brand reports from DB, reading in-memory cache:', error);
            return brandReportsCache[userId] || [];
        }
    }

    // ============================================
    // FALLBACK MOCK DATA GENERATORS
    // ============================================
    private static getMockWeeklyPlan(profile: BrandProfile) {
        return [
            {
                day: "Monday",
                category: "Industry Insights",
                title: `Demystifying ${profile.primary_topics[0] || 'your niche'}`,
                hook: `Most people think ${profile.primary_topics[0] || 'this topic'} is complicated. But it's actually just 3 simple principles.`,
                outline: [
                    "Define the primary challenge people face",
                    "Explain the simple three-step solution framework",
                    "Share a mini-case study of it working in real life"
                ],
                cta: "Which of these principles do you struggle with the most?"
            },
            {
                day: "Tuesday",
                category: "Actionable Tips",
                title: `3 tools to accelerate ${profile.primary_topics[1] || 'your productivity'}`,
                hook: `If you're not using these 3 tools to manage your ${profile.primary_topics[1] || 'focus'}, you're leaving hours on the table.`,
                outline: [
                    "Tool #1 and how to configure it in under 5 minutes",
                    "Tool #2 to automate the manual workload",
                    "Tool #3 for visual tracking of results"
                ],
                cta: "Save this post for your next work session. What tool did I miss?"
            },
            {
                day: "Wednesday",
                category: "Personal Stories",
                title: "The lesson I learned from a major failure",
                hook: "Two years ago, I made a mistake that cost me days of progress. Here is what happened.",
                outline: [
                    "Set the scene: what went wrong and why",
                    "The breakthrough moment when the resolution clicked",
                    "The permanent system I built to prevent it from ever happening again"
                ],
                cta: "Have you ever turned a setback into a setup? Let me know."
            },
            {
                day: "Thursday",
                category: "Career Advice",
                title: `How to build authority in ${profile.niche}`,
                hook: `You don't need 10 years of experience to be seen as an expert in ${profile.niche}. You just need to follow this approach.`,
                outline: [
                    "Document your learning path in public daily",
                    "Engage thoughtfully in comments of industry leaders",
                    "Write clear case-studies on small successes"
                ],
                cta: "What is your biggest roadblock to posting consistently?"
            },
            {
                day: "Friday",
                category: "Thought Leadership",
                title: `The future of ${profile.primary_topics[2] || 'automation'} in 2026`,
                hook: `The landscape of ${profile.primary_topics[2] || 'automation'} is shifting faster than ever. Here is my prediction for the next 12 months.`,
                outline: [
                    "Key technological changes driving the shift",
                    "Who stands to gain the most and who will be left behind",
                    "How you can position yourself today to capitalize"
                ],
                cta: "Agree or disagree? Drop your predictions in the comments!"
            }
        ];
    }

    private static getMockMonthlyReport(profile: BrandProfile) {
        return {
            executive_summary: `Your brand presence in the "${profile.niche}" niche is showing solid foundation with a current Authority Score of ${profile.authority_score}/100. To maximize growth, we recommend standardizing the templates, using emojis strategically to capture scrolling eyeballs, and sharing direct metrics in your case studies.`,
            score_analysis: `An Authority Score of ${profile.authority_score} places you in the upper tier of emerging voices. To cross into the 'Thought Leader' category (>75), focus on building content loops: referencing older posts, creating downloadable cheat sheets, and posting at least 3-4 times a week.`,
            positioning_strategy: `Within "${profile.niche}", most creators write generic listicles. Your positioning opportunity lies in 'Hard-Earned Experience'. Use real anecdotes from your day-to-day work in "${profile.primary_topics.join(', ')}" to create high-friction, high-value posts.`,
            pillars: [
                { name: "Tactical Execution", description: "Sharing code, workflows, or frameworks that the reader can clone immediately." },
                { name: "Industry Commentary", description: "Synthesizing newsletters and corporate announcements into bite-sized actionable insights." },
                { name: "Behind-the-Scenes Stories", description: "Authentic founder/creator content highlighting failures, sprints, and team celebrations." },
                { name: "Skill Acceleration", description: "Helping juniors and peers bridge the gap from theory to execution." }
            ],
            action_plan: [
                "Implement the 5-day Weekly Content Plan generated by PostGenius.",
                "Dedicate Tuesdays to sharing code or direct actionable screenshots.",
                "Connect with 5 other creators in your niche and write authentic comments on their posts.",
                "Audit your profile description to ensure it mentions your core niche clearly.",
                "Review analytics next month to identify the highest performing category."
            ]
        };
    }
}
