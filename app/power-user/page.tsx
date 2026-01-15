"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Users, BookOpen, BarChart3 } from "lucide-react"

export default function PowerUserPage() {
  const [activeTab, setActiveTab] = useState("templates")

  const templates = [
    {
      id: 1,
      name: "Industry Insight",
      description: "Share deep expertise and industry observations",
      emoji: "🔍",
      uses: 1240,
    },
    {
      id: 2,
      name: "Personal Story",
      description: "Narrative-driven posts for authentic connection",
      emoji: "📖",
      uses: 856,
    },
    {
      id: 3,
      name: "Quick Tip",
      description: "Short, actionable advice for quick engagement",
      emoji: "⚡",
      uses: 2103,
    },
    {
      id: 4,
      name: "Thought Leadership",
      description: "Forward-thinking perspectives on future trends",
      emoji: "🚀",
      uses: 945,
    },
  ]

  const viralFactors = [
    { name: "Hook Strength", score: 85, impact: "↑" },
    { name: "Call-to-Action", score: 78, impact: "↑" },
    { name: "Engagement Potential", score: 82, impact: "↑" },
    { name: "Shareability", score: 75, impact: "→" },
    { name: "Authenticity", score: 88, impact: "↑" },
  ]

  const smartHashtags = {
    trending: ["#ProductManagement", "#CareerGrowth", "#LinkedInTips"],
    niche: ["#SaaS", "#Startup", "#TechLeadership"],
    engagement: ["#AMA", "#ShareYourStory", "#Community"],
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-0">
              Power-User Features
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Unlock Advanced Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Master the art of viral LinkedIn posts with AI-powered insights
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8 bg-white dark:bg-gray-900 p-1 border border-gray-200 dark:border-gray-800 rounded-lg">
            <TabsTrigger value="templates" className="text-xs sm:text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analyzer</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="text-xs sm:text-sm">
              <Zap className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Hashtags</span>
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="text-xs sm:text-sm">
              ⏰
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="text-xs sm:text-sm">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {templates.map((template) => (
                <motion.div key={template.id} variants={item}>
                  <Card className="h-full border-0 shadow-lg dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-4xl mb-2">{template.emoji}</div>
                          <CardTitle>{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Use Template
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                        Used {template.uses.toLocaleString()} times
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Analyzer Tab */}
          <TabsContent value="analyzer">
            <Card className="border-0 shadow-lg dark:shadow-xl">
              <CardHeader>
                <CardTitle>Viral Potential Analyzer</CardTitle>
                <CardDescription>Real-time scoring of your post's viral potential</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {viralFactors.map((factor) => (
                    <motion.div key={factor.name} variants={item} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{factor.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{factor.score}/100</span>
                          <span className={`text-lg ${factor.impact === "↑" ? "text-green-500" : "text-yellow-500"}`}>
                            {factor.impact}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hashtags Tab */}
          <TabsContent value="hashtags">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Trending", tags: smartHashtags.trending, color: "from-blue-600 to-blue-400" },
                { title: "Niche", tags: smartHashtags.niche, color: "from-purple-600 to-purple-400" },
                { title: "Engagement", tags: smartHashtags.engagement, color: "from-pink-600 to-pink-400" },
              ].map((category) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg dark:shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">{tag}</span>
                          <Button variant="ghost" size="sm">
                            Copy
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Scheduling Tab */}
          <TabsContent value="scheduling">
            <Card className="border-0 shadow-lg dark:shadow-xl">
              <CardHeader>
                <CardTitle>Post Scheduling</CardTitle>
                <CardDescription>Schedule posts for optimal engagement times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { day: "Tuesday", time: "9:00 AM", engagement: "42% higher" },
                      { day: "Wednesday", time: "2:00 PM", engagement: "38% higher" },
                      { day: "Thursday", time: "10:00 AM", engagement: "45% higher" },
                    ].map((slot) => (
                      <motion.div
                        key={slot.day}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">{slot.day}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{slot.time}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">{slot.engagement}</p>
                      </motion.div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Schedule Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration">
            <Card className="border-0 shadow-lg dark:shadow-xl">
              <CardHeader>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>Work together with your team on content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    Invite Team Members
                  </Button>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      Share drafts, get feedback, and collaborate on posts with your team in real-time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
