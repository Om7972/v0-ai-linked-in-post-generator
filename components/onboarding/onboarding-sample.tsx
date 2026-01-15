"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OnboardingSamplePostProps {
  tone: "Professional" | "Founder" | "Influencer" | "Casual"
}

const samplePosts: Record<string, { post: string; engagement: number; tone: string }> = {
  Professional: {
    tone: "Professional",
    post: `Excited to announce that our team just shipped a major update to our LinkedIn Post Generator! 🎉

After months of research and development, we've built an AI-powered tool that helps professionals craft engaging posts in seconds. Our users are seeing 40% higher engagement on average.

Key features:
✓ AI-powered content generation
✓ Real-time engagement scoring
✓ Multiple tone options
✓ Analytics dashboard

If you're spending hours crafting the perfect post, it's time to work smarter. Try it today and focus on what matters most.

#ProductLaunch #AI #LinkedIn #Productivity`,
    engagement: 82,
  },
  Founder: {
    tone: "Founder",
    post: `We just shipped something I'm really proud of.

For years, I watched founders, creators, and professionals waste hours on LinkedIn. They'd write a post, delete it, rewrite it, and still not feel right about it.

So we built a tool that does the thinking for you.

It's not about replacing your voice—it's about amplifying it. Our AI learns from millions of viral posts and adapts to YOUR tone, YOUR style, YOUR audience.

Your LinkedIn presence is too important to leave to chance.

Let's change that. 🚀

#Startup #BuildInPublic #LinkedIn`,
    engagement: 89,
  },
  Influencer: {
    tone: "Influencer",
    post: `just dropped something that's about to change the game 🔥

ok so i've been testing this linkedin post generator for the last month and honestly? it's a game changer.

here's the thing - most creators spend 2x more time writing than actually creating. and your posts still don't hit like you want them to.

not anymore.

in 10 seconds you get a post that's:
→ optimized for your audience
→ tuned to your voice
→ proven to get engagement

been using it daily and my engagement is UP 60% 📈

link in bio if you want to try it

#CreatorEconomy #ContentCreation #ProductTip`,
    engagement: 76,
  },
  Casual: {
    tone: "Casual",
    post: `just discovered this wild tool and i'm lowkey obsessed 😅

so you know how sometimes you want to post something on linkedin but you just... can't find the right words? yeah that was me every single day

found this generator and holy cow it saves so much time. literally just tell it what you want to talk about and boom - perfect post ready to go

even better? the engagement scores actually help you know if your post is gonna slap or not 📊

not sponsored or anything i'm just genuinely into it lol

anyone else struggling with linkedin content? 🤔

#ProductRecommendation #LinkedIn`,
    engagement: 71,
  },
}

export function OnboardingSamplePost({ tone }: OnboardingSamplePostProps) {
  const sample = samplePosts[tone] || samplePosts.Professional
  const engagementColor = sample.engagement > 80 ? "text-green-600" : sample.engagement > 70 ? "text-blue-600" : "text-yellow-600"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Sample Post ({sample.tone})</h3>
        <Card className="p-6 bg-card border-border/50">
          <div className="space-y-4">
            {/* Post content */}
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {sample.post}
            </p>

            {/* Engagement score */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Engagement Score</span>
              <div className="flex items-center gap-2">
                <motion.div
                  className={`text-lg font-bold ${engagementColor}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {sample.engagement}/100
                </motion.div>
                {sample.engagement > 80 && <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">Excellent</Badge>}
                {sample.engagement <= 80 && sample.engagement > 70 && <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">Great</Badge>}
                {sample.engagement <= 70 && <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">Good</Badge>}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        This is an example of what you can generate. Every post is customized based on your topic, audience, and tone!
      </p>
    </motion.div>
  )
}
