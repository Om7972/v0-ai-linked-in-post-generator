"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { StaggerContainer, StaggerItem } from "@/components/ui/page-transition"
import { usePerformanceMonitoring } from "@/hooks/use-performance"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog"

interface DashboardStats {
  postsGenerated: number
  avgEngagementScore: number
  savedDrafts: number
  totalEngagements: number
}

interface EngagementData {
  date: string
  posts: number
  engagement: number
}

interface ToneData {
  tone: string
  count: number
  percentage: number
}

interface PostHistory {
  id: string
  topic: string
  tone: string
  createdAt: string
  status: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, token, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    postsGenerated: 0,
    avgEngagementScore: 0,
    savedDrafts: 0,
    totalEngagements: 0,
  })
  const [engagementData, setEngagementData] = useState<EngagementData[]>([])
  const [toneDistribution, setToneDistribution] = useState<ToneData[]>([])
  const [posts, setPosts] = useState<PostHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Monitor performance metrics
  usePerformanceMonitoring()

  useEffect(() => {
    if (token && user && !authLoading) {
      fetchDashboardData()
    }
  }, [token, user, authLoading])

  const fetchDashboardData = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/user/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)

        // Transform engagement data to match chart format
        const transformedEngagement = (data.engagementData || []).map((item: any) => ({
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: item.engagement || 0,
          posts: item.posts || 0,
        }))
        setEngagementData(transformedEngagement)

        setToneDistribution(data.toneDistribution || [])

        // Transform posts to match PostHistory interface
        const transformedPosts = (data.recentPosts || []).map((post: any) => ({
          id: post.id,
          topic: post.topic,
          tone: post.tone,
          createdAt: post.createdAt,
          status: "published",
        }))
        setPosts(transformedPosts)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleDeletePost = async (postId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId))
        // Refresh stats
        fetchDashboardData()
        toast({
          title: "Post deleted",
          description: "This action cannot be undone",
        })
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      {/* Onboarding Dialog */}
      <OnboardingDialog />

      <StaggerContainer staggerDelay={0.1}>
        {/* Header */}
        <StaggerItem>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Here's your performance overview.
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
            postsGenerated={stats.postsGenerated}
            avgEngagementScore={stats.avgEngagementScore}
            savedDrafts={stats.savedDrafts}
            totalEngagements={stats.totalEngagements}
          />
        </StaggerItem>

        {/* Charts Grid */}
        <StaggerItem>
          <div className="grid lg:grid-cols-2 gap-6">
            <EngagementChart data={engagementData} />
            <ToneChart data={toneDistribution} />
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
                    {toneDistribution.length > 0
                      ? `${toneDistribution[0].tone} tone generates ${stats.avgEngagementScore}% engagement`
                      : `Professional tone generates ${stats.avgEngagementScore}% engagement`}
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
    </AuthGuard>
  )
}
