/**
 * Mock Gemini AI Functions
 * Simulates AI-generated LinkedIn posts with realistic outputs
 */

export interface GeneratePostOptions {
  topic: string
  audience: string
  tone: "professional" | "founder" | "influencer" | "casual"
  length: "short" | "medium" | "long"
  includeEmoji: boolean
  includeCTA: boolean
  cta?: string
}

// Mock post templates based on tone and topic
const postTemplates: Record<string, string[]> = {
  professional: [
    `Excited to share insights on {topic}! 

Working across multiple teams has taught me that {insight1}. In today's dynamic landscape, {insight2}.

Key takeaways:
• {point1}
• {point2}
• {point3}

How do you approach {topic}? {cta}`,

    `Reflecting on {topic} and its impact on our industry.

The reality is: {insight1}. This shift has fundamentally changed how we {insight2}.

What I've learned:
→ {point1}
→ {point2}
→ {point3}

{cta}`,
  ],
  founder: [
    `Building with {topic} in mind. 🚀

When we started, everyone said {challenge}. Today, we've learned that {insight1}.

The path to {goal}:
1. {step1}
2. {step2}
3. {step3}

The lesson? {insight2}

{cta}`,

    `We're obsessed with {topic}. Here's why:

{insight1} That's when we realized {insight2}.

What worked:
✓ {point1}
✓ {point2}
✓ {point3}

The journey continues. What's your take on {topic}? {cta}`,
  ],
  influencer: [
    `Real talk about {topic} 💭

I used to think {misconception}. Then I learned {insight1}.

Here's the actual breakdown:
📌 {point1}
📌 {point2}
📌 {point3}

Changed my entire perspective on {topic}. {cta}`,

    `Hot take: {topic} is about to shift 🔥

Most people focus on {wrong_thing}. But here's what really matters: {insight1}.

The future belongs to those who understand:
• {point1}
• {point2}
• {point3}

What's your perspective? {cta}`,
  ],
  casual: [
    `Just been thinking about {topic}... 🤔

You know that feeling when {relatable_moment}? Yeah, that's {topic} in a nutshell.

Real talk:
→ {point1}
→ {point2}
→ {point3}

So what do you think? {cta}`,

    `{topic} hit different this time 😅

Here's my honest take: {insight1}

What I realized:
✨ {point1}
✨ {point2}
✨ {point3}

Drop a comment if you vibe with this. {cta}`,
  ],
}

const insights: Record<string, string[]> = {
  professional: [
    "consistency beats perfection",
    "communication is everything",
    "data-driven decisions yield results",
    "collaboration amplifies impact",
    "continuous learning is non-negotiable",
  ],
  founder: [
    "constraints breed creativity",
    "your team is everything",
    "failure is data",
    "speed matters more than perfection",
    "listen to your users obsessively",
  ],
  influencer: [
    "authenticity is currency",
    "vulnerability builds connection",
    "consistency compounds",
    "your unique perspective is your asset",
    "show behind-the-scenes",
  ],
  casual: [
    "we're all figuring it out",
    "vibes over everything",
    "keep it real",
    "show up as yourself",
    "that's just how it is",
  ],
}

const audiences: Record<string, string> = {
  "Tech Leaders":
    "decision-makers who value innovation and strategic thinking",
  "Young Professionals": "early-career individuals seeking mentorship",
  "Entrepreneurs":
    "business owners and startup founders building something new",
  "Creatives": "artists and designers pushing boundaries",
  "Marketers":
    "growth-focused professionals in digital and content marketing",
  "Managers": "team leaders and people managers",
  "Job Seekers": "individuals exploring new career opportunities",
}

function generateMockPost(options: GeneratePostOptions): string {
  const templates = postTemplates[options.tone]
  const template = templates[Math.floor(Math.random() * templates.length)]

  const audience =
    audiences[
      Object.keys(audiences)[
        Math.floor(Math.random() * Object.keys(audiences).length)
      ]
    ]
  const relevantInsights = insights[options.tone]
  const insight1 = relevantInsights[Math.floor(Math.random() * relevantInsights.length)]
  const insight2 = relevantInsights[Math.floor(Math.random() * relevantInsights.length)]

  let post = template
    .replace("{topic}", options.topic)
    .replace(/{insight1}/g, insight1)
    .replace(/{insight2}/g, insight2)
    .replace(/{point1}/g, `Understanding ${options.topic} in context`)
    .replace(/{point2}/g, `Building genuine connections with ${audience}`)
    .replace(/{point3}/g, `Creating lasting impact through authenticity`)
    .replace(/{goal}/g, `excellence in ${options.topic}`)
    .replace(/{step1}/g, `Started with clear vision for ${options.topic}`)
    .replace(/{step2}/g, `Iterated based on real-world feedback`)
    .replace(/{step3}/g, `Scaled what worked, learned from what didn't`)
    .replace(/{challenge}/g, `${options.topic} was impossible`)
    .replace(/{wrong_thing}/g, `the surface level of ${options.topic}`)
    .replace(/{relatable_moment}/g, `you're navigating ${options.topic}`)
    .replace(/{misconception}/g, `${options.topic} was straightforward`)

  // Add emoji if enabled
  if (options.includeEmoji && !post.includes("🚀")) {
    const emojis = [
      "💡",
      "🎯",
      "📈",
      "✨",
      "🔥",
      "💪",
      "🌟",
      "⚡",
      "🎨",
      "🚀",
    ]
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    post = post.replace("\n\n", `\n\n${randomEmoji} `)
  }

  // Replace CTA
  const ctas: Record<string, string> = {
    professional: `What's your experience with ${options.topic}? Share in the comments below.`,
    founder: `What would you build differently? Let's discuss!`,
    influencer: `What's YOUR take? Drop it below! 👇`,
    casual: `What do you think? Honestly curious.`,
  }

  post = post.replace(
    "{cta}",
    options.cta || ctas[options.tone]
  )

  return post
}

function generateMockHashtags(
  topic: string,
  tone: string
): string {
  const baseHashtags = [
    topic.toLowerCase().replace(/\s+/g, ""),
    "LinkedIn",
    "Insights",
  ]

  const toneHashtags: Record<string, string[]> = {
    professional: ["Leadership", "CareerGrowth", "BusinessStrategy"],
    founder: ["Startup", "Entrepreneurship", "Growth"],
    influencer: ["Authentic", "RealTalk", "CommunityFirst"],
    casual: ["ThoughtsOnThis", "JustSaying", "RealConversation"],
  }

  const combined = [...baseHashtags, ...(toneHashtags[tone] || [])]
  return (
    "#" + combined.filter((h) => h && h.length > 0).join(" #")
  )
}

function calculateEngagementScore(
  post: string,
  tone: string
): {
  score: number
  potential: string
  breakdown: Record<string, number>
} {
  const length = post.length
  const hasHashtags = post.includes("#")
  const hasCTA = post.includes("?") || post.includes("!")
  const hasEmoji = /\p{Emoji}/u.test(post)
  const paragraphs = post.split("\n\n").length
  const hasLineBreaks = post.includes("\n")

  let score = 50
  const breakdown: Record<string, number> = {
    "Optimal Length": length > 300 && length < 1300 ? 15 : 5,
    "Clear CTA": hasCTA ? 15 : 5,
    "Visual Breaks": hasLineBreaks ? 15 : 5,
    "Hashtag Usage": hasHashtags ? 10 : 0,
    "Emoji Usage": hasEmoji ? 10 : 0,
  }

  score = Object.values(breakdown).reduce((a, b) => a + b, 0)

  // Tone-based adjustments
  if (tone === "founder") score = Math.min(100, score + 5)
  if (tone === "influencer") score = Math.min(100, score + 3)

  const potential =
    score >= 80
      ? "Excellent - High engagement expected"
      : score >= 60
        ? "Good - Solid engagement potential"
        : score >= 40
          ? "Fair - Room for improvement"
          : "Low - Consider refining"

  return { score, potential, breakdown }
}

export async function mockGeneratePost(
  options: GeneratePostOptions
): Promise<{
  post: string
  hashtags: string
  engagement: { score: number; potential: string; breakdown: Record<string, number> }
  metadata: { generatedAt: string; model: string }
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const post = generateMockPost(options)
  const hashtags = generateMockHashtags(options.topic, options.tone)
  const engagement = calculateEngagementScore(post, options.tone)

  return {
    post,
    hashtags,
    engagement,
    metadata: {
      generatedAt: new Date().toISOString(),
      model: "Gemini 2.0 Flash (Mock)",
    },
  }
}

export async function mockRegeneratePost(
  options: GeneratePostOptions
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return generateMockPost(options)
}

export async function mockRefinePost(
  currentPost: string,
  refinementType: "shorter" | "longer" | "more_professional" | "more_casual" | "custom",
  customInstruction?: string
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  let refined = currentPost

  switch (refinementType) {
    case "shorter":
      refined = currentPost.split("\n\n").slice(0, 2).join("\n\n")
      break
    case "longer":
      refined =
        currentPost +
        "\n\n---\n\nHere's a deeper perspective: The challenge isn't just understanding the surface, but genuinely implementing these insights in your daily work. What specific aspect would you like to explore further?"
      break
    case "more_professional":
      refined = refined
        .replace(/🚀|🔥|✨|💡|🎯|💪|🌟|⚡|🎨|😅|🤔|💭|👇/g, "")
        .replace(/Real talk:|Hot take:|Just been thinking|Here's my honest take:|you know/gi, "")
      break
    case "more_casual":
      refined = refined.replace(/^/gm, "")
      if (!refined.includes("🚀")) refined = refined.replace("\n\n", "\n\n🚀 ")
      refined = refined.replace(/\?$/, "? Let me know your thoughts!")
      break
    case "custom":
      refined = currentPost + `\n\n${customInstruction}`
      break
  }

  return refined
}
