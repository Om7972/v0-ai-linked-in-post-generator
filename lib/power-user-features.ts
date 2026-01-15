export interface PostTemplate {
  id: string
  name: string
  category: "announcements" | "thought-leadership" | "engagement" | "storytelling" | "industry-news"
  description: string
  content: string
  suggestedTone: "Professional" | "Founder" | "Influencer" | "Casual"
  emoji: string
  popularity: number // 0-100
}

export const postTemplates: PostTemplate[] = [
  {
    id: "achievement-announce",
    name: "Achievement Announcement",
    category: "announcements",
    description: "Celebrate a win or milestone",
    content: `Excited to share that [ACHIEVEMENT]! 🎉

This has been a journey of [TIME/EFFORT], and I'm proud of what the team accomplished. Key wins:
✓ [Win 1]
✓ [Win 2]
✓ [Win 3]

Special thanks to [PEOPLE/TEAM] for making this possible.

What's next? [FUTURE_PLAN]

#[Hashtag1] #[Hashtag2]`,
    suggestedTone: "Professional",
    emoji: "🏆",
    popularity: 87,
  },
  {
    id: "insight-share",
    name: "Industry Insight",
    category: "thought-leadership",
    description: "Share valuable insights and observations",
    content: `I've been thinking about [TOPIC] lately.

Most people get it wrong because [MISCONCEPTION]. Here's what I've learned:

1️⃣ [Insight 1]
Explanation: [Detail about insight 1]

2️⃣ [Insight 2]
Explanation: [Detail about insight 2]

3️⃣ [Insight 3]
Explanation: [Detail about insight 3]

The key takeaway? [Summary]

What's your take? Drop your thoughts below. 👇

#[Hashtag1] #[Hashtag2]`,
    suggestedTone: "Founder",
    emoji: "💡",
    popularity: 92,
  },
  {
    id: "engagement-question",
    name: "Engagement Question",
    category: "engagement",
    description: "Spark conversation with an interesting question",
    content: `Here's a hot take: [HOT_TAKE]

I get a lot of pushback on this, but here's why I believe it:
[Reason 1]
[Reason 2]
[Reason 3]

Now I'm curious what you think...

[QUESTION]

Reply in the comments 👇 I read every single one.

#[Hashtag1] #[Hashtag2]`,
    suggestedTone: "Influencer",
    emoji: "🤔",
    popularity: 85,
  },
  {
    id: "lesson-share",
    name: "Lesson Learned",
    category: "storytelling",
    description: "Share a personal lesson or growth moment",
    content: `I made a huge mistake [TIME AGO], and I learned something valuable.

The situation:
[Setup the story]

What went wrong:
[What happened]

The lesson:
[What I learned]

How it changed me:
[Impact on my approach]

If you're [SITUATION], here's what I'd do differently...

[Actionable advice]

Hope this saves you the pain of learning the hard way.

#[Hashtag1] #[Hashtag2]`,
    suggestedTone: "Casual",
    emoji: "📚",
    popularity: 88,
  },
  {
    id: "trend-commentary",
    name: "Trend Commentary",
    category: "industry-news",
    description: "Comment on current industry trends",
    content: `The [TREND/NEWS] is a game-changer for [INDUSTRY].

Here's what everyone's missing:

Everyone's talking about: [General take]
What actually matters: [Your unique perspective]

For [AUDIENCE_TYPE], this means:
→ [Impact 1]
→ [Impact 2]
→ [Impact 3]

The companies moving fast right now are the ones who [ACTION].

Are you ready for this shift? 

#[Hashtag1] #[Hashtag2] #[Hashtag3]`,
    suggestedTone: "Professional",
    emoji: "📊",
    popularity: 79,
  },
  {
    id: "mentorship-offer",
    name: "Mentorship/Help Offer",
    category: "engagement",
    description: "Offer help or mentorship to your audience",
    content: `I've been fortunate to [EXPERIENCE/ACHIEVE] in [FIELD].

If you're trying to [GOAL], here's what I know:
[Insight 1]
[Insight 2]
[Insight 3]

I'm planning to [INITIATIVE] to help more people with this.

In the meantime, if you have questions about [TOPIC], drop them below. I'll do my best to help.

Let's grow together. 🚀

#[Hashtag1] #[Hashtag2]`,
    suggestedTone: "Founder",
    emoji: "🤝",
    popularity: 83,
  },
]

export interface ViralAnalysis {
  score: number
  factors: {
    name: string
    score: number
    impact: "positive" | "negative" | "neutral"
    tip: string
  }[]
  viralPotential: "High" | "Good" | "Fair" | "Low"
  strengths: string[]
  improvements: string[]
}

export function analyzePostForViral(content: string): ViralAnalysis {
  const factors = [
    {
      name: "Emotional Appeal",
      score: Math.random() * 30 + 60,
      impact: "positive" as const,
      tip: "Posts with strong emotions (surprising, funny, inspiring) get 2x more engagement",
    },
    {
      name: "Call-to-Action",
      score: content.toLowerCase().includes("?") ? 85 : 45,
      impact: content.toLowerCase().includes("?") ? "positive" : "negative",
      tip: "Questions encourage responses. Try ending with a genuine question",
    },
    {
      name: "Hashtag Usage",
      score: (content.match(/#\w+/g) || []).length > 3 ? 75 : 55,
      impact: "positive" as const,
      tip: "3-5 relevant hashtags is optimal. More doesn't help",
    },
    {
      name: "Length",
      score: content.length > 100 && content.length < 500 ? 85 : content.length > 300 ? 75 : 60,
      impact: (content.length > 100 ? "positive" : "negative") as "positive" | "negative",
      tip: "Posts between 200-400 characters get the best engagement",
    },
    {
      name: "Visual Breaks",
      score: (content.match(/\n/g) || []).length > 3 ? 80 : 55,
      impact: "positive" as const,
      tip: "Use line breaks and emojis to make content scannable",
    },
    {
      name: "Hook Strength",
      score: 85,
      impact: "positive" as const,
      tip: "Your opening immediately captures attention. Great job!",
    },
    {
      name: "Call-to-Action",
      score: 78,
      impact: "positive" as const,
      tip: "Include a specific action for readers to take.",
    },
    {
      name: "Engagement Potential",
      score: 82,
      impact: "positive" as const,
      tip: "Consider asking questions to boost comments.",
    },
    {
      name: "Shareability",
      score: 75,
      impact: "neutral" as const,
      tip: "Add relevant hashtags to increase reach.",
    },
    {
      name: "Authenticity",
      score: 88,
      impact: "positive" as const,
      tip: "Your personal voice shines through. Perfect!",
    },
  ]

  const avgScore = Math.round(factors.reduce((sum, f) => sum + f.score, 0) / factors.length)

  return {
    score: avgScore,
    factors,
    viralPotential:
      avgScore >= 80
        ? "High"
        : avgScore >= 70
          ? "Good"
          : avgScore >= 60
            ? "Fair"
            : "Low",
    strengths: [
      content.includes("?") && "Has engaging questions",
      content.length > 100 && "Good content length",
      (content.match(/#\w+/g) || []).length > 0 && "Uses hashtags",
      content.includes("→") && "Clear formatting",
    ].filter(Boolean) as string[],
    improvements: [
      !content.includes("?") && "Add a question to spark engagement",
      (content.match(/\n/g) || []).length < 3 && "Add more line breaks for readability",
      (content.match(/#\w+/g) || []).length < 3 && "Add more relevant hashtags",
      content.length < 100 && "Expand your content for better context",
    ].filter(Boolean) as string[],
  }
}

export interface HashtagSuggestion {
  hashtag: string
  popularity: number
  category: string
  trend: "rising" | "stable" | "declining"
}

export function getSmartHashtags(topic: string, tone: string, content: string): HashtagSuggestion[] {
  const topicLower = topic.toLowerCase()

  const categoryHashtags: Record<string, HashtagSuggestion[]> = {
    productivity: [
      { hashtag: "ProductivityTips", popularity: 92, category: "productivity", trend: "stable" },
      { hashtag: "WorkSmarter", popularity: 85, category: "productivity", trend: "rising" },
      { hashtag: "Efficiency", popularity: 78, category: "productivity", trend: "stable" },
      { hashtag: "TimeManagement", popularity: 88, category: "productivity", trend: "stable" },
    ],
    ai: [
      { hashtag: "AI", popularity: 95, category: "technology", trend: "rising" },
      { hashtag: "ArtificialIntelligence", popularity: 87, category: "technology", trend: "rising" },
      { hashtag: "MachineLearning", popularity: 82, category: "technology", trend: "stable" },
      { hashtag: "TechTrends", popularity: 81, category: "technology", trend: "rising" },
    ],
    startup: [
      { hashtag: "Startups", popularity: 90, category: "business", trend: "stable" },
      { hashtag: "Entrepreneurship", popularity: 88, category: "business", trend: "stable" },
      { hashtag: "BuildInPublic", popularity: 86, category: "business", trend: "rising" },
      { hashtag: "StartupLife", popularity: 79, category: "business", trend: "stable" },
    ],
    marketing: [
      { hashtag: "Marketing", popularity: 91, category: "marketing", trend: "stable" },
      { hashtag: "ContentMarketing", popularity: 84, category: "marketing", trend: "stable" },
      { hashtag: "DigitalMarketing", popularity: 87, category: "marketing", trend: "stable" },
      { hashtag: "GrowthMarketing", popularity: 83, category: "marketing", trend: "rising" },
    ],
  }

  // Match topic to category
  let matched = categoryHashtags["productivity"]
  for (const [key, tags] of Object.entries(categoryHashtags)) {
    if (topicLower.includes(key)) {
      matched = tags
      break
    }
  }

  // Add tone-based hashtags
  const toneHashtags: Record<string, HashtagSuggestion> = {
    Professional: { hashtag: "Leadership", popularity: 89, category: "professional", trend: "stable" },
    Founder: { hashtag: "FounderLife", popularity: 87, category: "entrepreneurship", trend: "rising" },
    Influencer: { hashtag: "CreatorEconomy", popularity: 85, category: "creators", trend: "rising" },
    Casual: { hashtag: "RealTalk", popularity: 76, category: "lifestyle", trend: "stable" },
  }

  const baseSuggestions = matched.slice(0, 3)
  const toneSuggestion = toneHashtags[tone as keyof typeof toneHashtags]
  if (toneSuggestion) {
    baseSuggestions.push(toneSuggestion)
  }

  return baseSuggestions.slice(0, 5)
}
