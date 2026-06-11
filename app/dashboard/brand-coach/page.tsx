"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, Flame, Calendar, FileText, RefreshCw, BarChart2, 
  ArrowUpRight, Award, Compass, UserCheck, AlertCircle, Copy, Check 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { StaggerContainer, StaggerItem } from "@/components/ui/page-transition"

interface BrandProfile {
  niche: string;
  primary_topics: string[];
  content_distribution: Record<string, number>;
  authority_score: number;
  missing_pillars?: string[];
}

interface BrandReport {
  id: string;
  created_at: string;
  report_json: {
    executive_summary: string;
    score_analysis: string;
    positioning_strategy: string;
    pillars: Array<{ name: string; description: string }>;
    action_plan: string[];
  };
}

export default function BrandCoachPage() {
  const { token, user } = useAuth()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<BrandProfile | null>(null)
  const [reports, setReports] = useState<BrandReport[]>([])
  const [activeReport, setActiveReport] = useState<BrandReport | null>(null)
  const [weeklyPlan, setWeeklyPlan] = useState<any[] | null>(null)

  const [nicheInput, setNicheInput] = useState("")
  const [topicsInput, setTopicsInput] = useState("")
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (token) {
      fetchCoachData()
    }
  }, [token])

  const fetchCoachData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/brand-coach", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setReports(data.reports || [])
        if (data.profile) {
          setNicheInput(data.profile.niche)
          setTopicsInput(data.profile.primary_topics.join(", "))
        }
        if (data.reports && data.reports.length > 0) {
          setActiveReport(data.reports[0])
        }
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to load brand coach data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      const res = await fetch("/api/brand-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "analyze",
          niche: nicheInput,
          primaryTopics: topicsInput.split(",").map(t => t.trim()).filter(Boolean)
        })
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        toast({
          title: "Analysis Complete",
          description: "Your LinkedIn brand profile has been analyzed and updated!"
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Analysis Failed",
        description: "Could not complete post history analysis.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGeneratePlan = async () => {
    try {
      setIsGeneratingPlan(true)
      const res = await fetch("/api/brand-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: "weekly-plan" })
      })
      if (res.ok) {
        const data = await res.json()
        setWeeklyPlan(data.plan)
        toast({
          title: "Plan Ready",
          description: "Your weekly content plan is ready!"
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true)
      const res = await fetch("/api/brand-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: "monthly-report" })
      })
      if (res.ok) {
        const data = await res.json()
        setReports(prev => [data.report, ...prev])
        setActiveReport(data.report)
        toast({
          title: "Report Generated",
          description: "A new monthly brand strategy report has been compiled."
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
    toast({
      title: "Copied!",
      description: "Content copied to your clipboard."
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground animate-pulse">Initializing Brand Coach...</p>
        </div>
      </div>
    )
  }

  return (
    <StaggerContainer className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Widget */}
      <StaggerItem>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-blue-500/20 p-8 shadow-xl backdrop-blur-sm">
          <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-3 py-1 rounded-full border-0">
                  <Flame className="w-3.5 h-3.5 mr-1" />
                  AI POWER FEATURE
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Personal Brand Coach
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                Audit your LinkedIn posts, optimize your content pillars, track your authority score, and generate strategy reports to double your impressions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-5 rounded-2xl shadow-lg border-0 transition-transform active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Posts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Brand Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Authority Score & Pillars */}
        <div className="lg:col-span-1 space-y-8">
          {/* Authority Score Gauge */}
          <StaggerItem>
            <Card className="rounded-3xl border-border/50 shadow-md relative overflow-hidden bg-card/50 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-purple-500" />
                  Authority Score
                </CardTitle>
                <CardDescription>Estimated influence score on LinkedIn</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-muted" 
                      strokeWidth="8" fill="transparent" 
                    />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-purple-600" 
                      strokeWidth="8" fill="transparent" 
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * (profile?.authority_score || 55)) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-4xl font-extrabold">{profile?.authority_score || 55}</span>
                    <span className="text-muted-foreground text-sm">/100</span>
                  </div>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex justify-between text-xs font-medium border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Level</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {(profile?.authority_score || 55) > 75 ? "Thought Leader" : (profile?.authority_score || 55) > 60 ? "Rising Star" : "Emerging Voice"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Action Needed</span>
                    <span className="text-muted-foreground">Expand Content Pillars</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Settings & Topics */}
          <StaggerItem>
            <Card className="rounded-3xl border-border/50 shadow-md bg-card/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-500" />
                  Niche Settings
                </CardTitle>
                <CardDescription>Refine your core professional focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="niche">My Professional Niche</Label>
                  <Input 
                    id="niche" 
                    value={nicheInput} 
                    onChange={e => setNicheInput(e.target.value)} 
                    placeholder="e.g. AI & Cloud Architecture"
                    className="rounded-xl border-border/50 bg-secondary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="topics">Primary Topics (comma separated)</Label>
                  <Input 
                    id="topics" 
                    value={topicsInput} 
                    onChange={e => setTopicsInput(e.target.value)} 
                    placeholder="e.g. Software, Leadership, SaaS"
                    className="rounded-xl border-border/50 bg-secondary/30"
                  />
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing} 
                  variant="outline" 
                  className="w-full rounded-xl border-border/50"
                >
                  Save & Analyze Topics
                </Button>
              </CardContent>
            </Card>
          </StaggerItem>
        </div>

        {/* Center/Right Column: Distribution & Plan */}
        <div className="lg:col-span-2 space-y-8">
          {/* Content Distribution */}
          <StaggerItem>
            <Card className="rounded-3xl border-border/50 shadow-md bg-card/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-pink-500" />
                  Content Distribution
                </CardTitle>
                <CardDescription>Balance of categories in your generation history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {profile?.content_distribution && Object.entries(profile.content_distribution).map(([category, percentage], idx) => (
                  <div key={category} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{category}</span>
                      <span className="text-muted-foreground">{percentage}%</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2.5 rounded-full`} 
                    />
                  </div>
                ))}

                {profile?.missing_pillars && profile.missing_pillars.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mt-6">
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Missing Pillars Suggestions</h4>
                        <p className="text-xs text-yellow-700/80 dark:text-yellow-400/80 mt-1">
                          You are currently lacking content around:
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {profile.missing_pillars.map(pillar => (
                            <Badge key={pillar} variant="outline" className="border-yellow-500/40 text-yellow-800 dark:text-yellow-300 bg-yellow-500/5">
                              {pillar}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Weekly Content Planner */}
          <StaggerItem>
            <Card className="rounded-3xl border-border/50 shadow-md bg-card/50 backdrop-blur-md overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Weekly Content Plan
                  </CardTitle>
                  <CardDescription>Customized 5-day content strategy builder</CardDescription>
                </div>
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={isGeneratingPlan} 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow border-0"
                >
                  {isGeneratingPlan ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {weeklyPlan ? "Re-generate Plan" : "Generate Plan"}
                </Button>
              </CardHeader>
              <CardContent className="p-0 border-t border-border/50">
                {weeklyPlan ? (
                  <div className="divide-y divide-border/50">
                    {weeklyPlan.map((post, idx) => (
                      <div key={post.day} className="p-6 hover:bg-secondary/25 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">{post.day.toUpperCase()}</span>
                          <Badge className="bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-0">
                            {post.category}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-base mb-2">{post.title}</h4>
                        <div className="bg-secondary/30 rounded-2xl p-4 mb-3 border border-border/30">
                          <span className="text-xs font-bold text-muted-foreground block mb-1">PROPOSED HOOK</span>
                          <p className="text-sm italic text-foreground">"{post.hook}"</p>
                        </div>
                        <div className="space-y-1.5 mb-4">
                          <span className="text-xs font-bold text-muted-foreground block">OUTLINE SCHEMA</span>
                          {post.outline.map((bullet: string, bIdx: number) => (
                            <div key={bIdx} className="flex gap-2 items-center text-xs">
                              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">{bIdx+1}</span>
                              <span className="text-muted-foreground">{bullet}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">CTA: <span className="font-medium text-foreground">{post.cta}</span></span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(`Topic: ${post.title}\nHook: ${post.hook}\nOutline: ${post.outline.join(", ")}\nCTA: ${post.cta}`, idx)} 
                            className="rounded-xl border border-border/30"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-green-500 mr-1" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 mr-1" />
                            )}
                            Copy Info
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground opacity-50 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No content plan generated yet</p>
                    <Button onClick={handleGeneratePlan} variant="outline" className="mt-4 rounded-xl">
                      Generate 5-Day Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        </div>
      </div>

      {/* Monthly strategy report section */}
      <StaggerItem>
        <Card className="rounded-3xl border-border/50 shadow-lg bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Monthly Brand Strategy Report
              </CardTitle>
              <CardDescription>Deep-dive positioning strategy audits and consulting advice</CardDescription>
            </div>
            
            <div className="flex gap-3">
              {reports.length > 0 && (
                <select 
                  onChange={(e) => {
                    const r = reports.find(item => item.id === e.target.value);
                    if (r) setActiveReport(r);
                  }}
                  className="rounded-xl border border-border/50 bg-secondary/50 px-3 py-1.5 text-sm"
                >
                  {reports.map((item, idx) => (
                    <option key={item.id} value={item.id}>
                      Report - {new Date(item.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              )}
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGeneratingReport} 
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow border-0"
              >
                {isGeneratingReport ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {activeReport ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg mb-2 text-primary flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    Executive Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {activeReport.report_json.executive_summary}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                  <div>
                    <h3 className="font-bold text-base mb-2 text-primary">Authority Score Assessment</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {activeReport.report_json.score_analysis}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 text-primary">Competitor & Niche Positioning</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {activeReport.report_json.positioning_strategy}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/30">
                  <h3 className="font-bold text-base mb-3 text-primary">Target Content Pillars</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {activeReport.report_json.pillars.map((pillar, idx) => (
                      <div key={idx} className="bg-secondary/35 border border-border/40 p-4 rounded-2xl">
                        <span className="font-extrabold text-sm block mb-1 text-blue-600 dark:text-blue-400">{pillar.name}</span>
                        <p className="text-xs text-muted-foreground">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/30">
                  <h3 className="font-bold text-base mb-3 text-primary">30-Day Brand Growth Actions</h3>
                  <div className="space-y-2">
                    {activeReport.report_json.action_plan.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-sm">
                        <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground opacity-50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No strategy reports compiled yet</p>
                <Button onClick={handleGenerateReport} variant="outline" className="mt-4 rounded-xl">
                  Build First Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  )
}
