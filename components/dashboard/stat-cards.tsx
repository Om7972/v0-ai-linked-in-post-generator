"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, Zap, Star } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardsProps {
  postsGenerated: number
  avgEngagementScore: number
  savedDrafts: number
  totalEngagements: number
}

export function StatCards({
  postsGenerated,
  avgEngagementScore,
  savedDrafts,
  totalEngagements,
}: StatCardsProps) {
  const stats = [
    {
      label: "Posts Generated",
      value: postsGenerated.toString(),
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      description: "All time",
      trend: "+12% from last month",
    },
    {
      label: "Avg Engagement Score",
      value: `${avgEngagementScore}%`,
      icon: Star,
      color: "from-purple-500 to-purple-600",
      description: "Quality metric",
      trend: "+5% improvement",
    },
    {
      label: "Saved Drafts",
      value: savedDrafts.toString(),
      icon: Zap,
      color: "from-pink-500 to-pink-600",
      description: "Ready to publish",
      trend: "3 new today",
    },
    {
      label: "Total Engagements",
      value: totalEngagements.toLocaleString(),
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      description: "Across all posts",
      trend: "+8.5K this week",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <motion.div key={stat.label} variants={cardVariants}>
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg hover:border-border transition-all duration-300 group overflow-hidden">
              <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {stat.description}
                    </CardDescription>
                  </div>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
