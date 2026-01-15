"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { StatCards } from "@/components/dashboard/stat-cards"
import { EngagementChart } from "@/components/dashboard/engagement-chart"
import { ToneChart } from "@/components/dashboard/tone-chart"
import { RecentPostsTable } from "@/components/dashboard/recent-posts-table"
import { EmptyPostsState, AnimatedEmptyState } from "@/components/dashboard/empty-states"
import {
  mockStats,
  mockEngagementData,
  mockToneDistribution,
  mockPostHistory,
  type PostHistory,
} from "@/lib/dashboard-data"
import { useToast } from "@/hooks/use-toast"
import { StaggerContainer, StaggerItem } from "@/components/ui/page-transition"
import { usePerformanceMonitoring } from "@/hooks/use-performance"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<PostHistory[]>(mockPostHistory)
  
  // Monitor performance metrics
  usePerformanceMonitoring()

  const handleViewPost = (post: PostHistory) => {
    toast({
      title: "Viewing post",
      description: `${post.topic.substring(0, 30)}...`,
    })
  }

  const handleDuplicatePost = (post: PostHistory) => {
    toast({
      title: "Post duplicated",
      description: "Opening editor with this post content",
    })
    router.push("/generate")
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    toast({
      title: "Post deleted",
      description: "This action cannot be undone",
    })
  }

  return (
    <StaggerContainer staggerDelay={0.1}>
      {/* Header */}
      <StaggerItem>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's your performance overview.
            </p>
          </div>
          <Link href="/generate">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full md:w-auto">
              <Sparkles className="h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>
      </StaggerItem>

      {/* Stat Cards */}
      <StaggerItem>
        <StatCards
          postsGenerated={mockStats.postsGenerated}
          avgEngagementScore={mockStats.avgEngagementScore}
          savedDrafts={mockStats.savedDrafts}
          totalEngagements={mockStats.totalEngagements}
        />
      </StaggerItem>

      {/* Charts Grid */}
      <StaggerItem>
        <div className="grid lg:grid-cols-2 gap-6">
          <EngagementChart data={mockEngagementData} />
          <ToneChart data={mockToneDistribution} />
        </div>
      </StaggerItem>

      {/* Recent Posts Table */}
      <StaggerItem>
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          {posts.length > 0 ? (
            <RecentPostsTable
              posts={posts}
              onView={handleViewPost}
              onDelete={handleDeletePost}
              onDuplicate={handleDuplicatePost}
            />
          ) : (
            <AnimatedEmptyState
              title="No posts yet"
              description="Create your first post to get started with AI-powered content generation"
              action={
                <Link href="/generate">
                  <Button>Create Your First Post</Button>
                </Link>
              }
            />
          )}
        </div>
      </StaggerItem>

      {/* Quick Actions */}
      <StaggerItem>
        <Card className="border-gradient bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Growth Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                className="p-4 rounded-lg bg-background/50 border border-border/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="font-semibold text-sm mb-1">📈 Trending Tone</p>
                <p className="text-sm text-muted-foreground">
                  Professional tone generates {mockStats.avgEngagementScore}% engagement
                </p>
              </motion.div>
              <motion.div
                className="p-4 rounded-lg bg-background/50 border border-border/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="font-semibold text-sm mb-1">⏰ Best Time</p>
                <p className="text-sm text-muted-foreground">
                  Posts generated on Tue-Thu get 15% more views
                </p>
              </motion.div>
              <motion.div
                className="p-4 rounded-lg bg-background/50 border border-border/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="font-semibold text-sm mb-1">🎯 Quick Wins</p>
                <p className="text-sm text-muted-foreground">
                  Add 3+ hashtags to boost reach by 40%
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  )
}
