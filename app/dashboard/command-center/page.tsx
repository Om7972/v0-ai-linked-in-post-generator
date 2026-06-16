"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Sparkles,
  Clock,
  CheckCircle,
  Plus,
  ArrowUp,
  BarChart3,
  PieChart,
  Lightbulb,
  ListTodo,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface ContentPillar {
  id: string;
  pillar_name: string;
  percentage: number;
}

interface BrandMetrics {
  brand_score: number;
  consistency_score: number;
  authority_score: number;
}

interface ContentRecommendation {
  id: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
  is_read: boolean;
}

interface WeeklyGoals {
  posts_goal: number;
  posts_completed: number;
}

interface ContentQueueItem {
  id: string;
  title: string;
  pillar?: string;
  status: "draft" | "scheduled" | "published";
  scheduled_for?: string;
}

interface CommandCenterData {
  postsCount: number;
  contentPillars: ContentPillar[];
  brandMetrics: BrandMetrics;
  recommendations: ContentRecommendation[];
  weeklyGoals: WeeklyGoals;
  contentQueue: ContentQueueItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function CommandCenterPage() {
  const [data, setData] = useState<CommandCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("/api/command-center", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching command center data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, authLoading, router]);

  if (loading) {
    return <CommandCenterSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Content Command Center</h1>
          <p className="text-muted-foreground mt-1">Your personal branding headquarters</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Insights
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Top Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Score Card */}
          <Card className="overflow-hidden border-2 border-gradient-to-br from-blue-500/20 to-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Personal Brand Score</CardTitle>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#brandGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * (data?.brandMetrics.brand_score || 0)) / 100}
                    />
                    <defs>
                      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(220, 91%, 56%)" />
                        <stop offset="100%" stopColor="hsl(262, 83%, 58%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {Math.round(data?.brandMetrics.brand_score || 0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Consistency</span>
                    <span className="text-sm font-medium">{Math.round(data?.brandMetrics.consistency_score || 0)}</span>
                  </div>
                  <Progress value={data?.brandMetrics.consistency_score || 0} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Authority</span>
                    <span className="text-sm font-medium">{Math.round(data?.brandMetrics.authority_score || 0)}</span>
                  </div>
                  <Progress value={data?.brandMetrics.authority_score || 0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goal Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Weekly Goals</CardTitle>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <span className="text-5xl font-bold text-green-600">
                  {data?.weeklyGoals.posts_completed || 0}
                </span>
                <span className="text-2xl text-muted-foreground mx-2">/</span>
                <span className="text-2xl">{data?.weeklyGoals.posts_goal || 3}</span>
                <p className="text-sm text-muted-foreground mt-2">posts this week</p>
              </div>
              <Progress
                value={((data?.weeklyGoals.posts_completed || 0) / (data?.weeklyGoals.posts_goal || 3)) * 100}
                className="h-3"
              />
            </CardContent>
          </Card>

          {/* Content Created Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Content Created</CardTitle>
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <span className="text-5xl font-bold text-purple-600">{data?.postsCount || 0}</span>
                <p className="text-sm text-muted-foreground mt-2">total posts</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <ArrowUp className="h-4 w-4" />
                <span>+12% from last week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Pillars */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content Pillars</CardTitle>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Distribution of your content themes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.contentPillars.map((pillar, index) => (
                    <motion.div
                      key={pillar.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{pillar.pillar_name}</span>
                        <span className="text-muted-foreground">{pillar.percentage}%</span>
                      </div>
                      <Progress
                        value={pillar.percentage}
                        className="h-3"
                        style={{
                          "--progress-color": `hsl(${index * 60 + 220}, 91%, 56%)`,
                        } as React.CSSProperties}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Posting Timeline</CardTitle>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Your content activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-10 text-sm text-muted-foreground">{day}</span>
                      <div className="flex-1 h-8 bg-muted rounded-full flex items-center px-2 gap-1">
                        {[...Array(i % 3 + 1)].map((_, j) => (
                          <div
                            key={j}
                            className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Recommendations */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>AI Recommendations</CardTitle>
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </div>
                <CardDescription>Smart suggestions to grow your brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 mt-0.5">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{rec.recommendation}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              rec.priority === "high"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : rec.priority === "medium"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {rec.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Queue */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content Queue</CardTitle>
                  <ListTodo className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>Your upcoming content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.contentQueue && data.contentQueue.length > 0 ? (
                    data.contentQueue.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {item.status === "published" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : item.status === "scheduled" ? (
                            <Clock className="h-5 w-5 text-blue-600" />
                          ) : (
                            <ListTodo className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.pillar && (
                              <p className="text-xs text-muted-foreground">{item.pillar}</p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "published"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : item.status === "scheduled"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">Your content queue is empty</p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Queue
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function CommandCenterSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
