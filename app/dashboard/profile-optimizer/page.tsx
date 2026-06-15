"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Sparkles, Copy, Check, ArrowUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Scores {
  clarityScore: number
  recruiterScore: number
  keywordOptimization: number
  authorityScore: number
}

interface OptimizedProfile {
  headline: string
  aboutSection: string
  suggestedKeywords: string[]
  actionableRecommendations: string[]
}

export default function ProfileOptimizerPage() {
  const [headline, setHeadline] = useState("")
  const [aboutSection, setAboutSection] = useState("")
  const [experienceSummary, setExperienceSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ scores: Scores; optimized: OptimizedProfile } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const handleOptimize = async () => {
    if (!headline && !aboutSection && !experienceSummary) {
      toast({
        title: "Missing fields",
        description: "Please fill at least one profile field",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/profile-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, aboutSection, experienceSummary })
      })

      if (!response.ok) {
        throw new Error("Failed to optimize profile")
      }

      const data = await response.json()
      setResult(data)
      toast({
        title: "Profile optimized!",
        description: "Check your optimized profile below"
      })
    } catch (error) {
      console.error("Error optimizing profile:", error)
      toast({
        title: "Error",
        description: "Failed to optimize profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <UserCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Profile Optimizer</h1>
          <p className="text-muted-foreground">Optimize your LinkedIn profile to attract recruiters</p>
        </div>
      </div>

      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter Your LinkedIn Profile</CardTitle>
            <CardDescription>
              Provide your current profile details to get optimization suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Headline</label>
              <Input
                placeholder="e.g. Senior Software Engineer | Full Stack Developer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About Section</label>
              <Textarea
                placeholder="Tell your professional story..."
                value={aboutSection}
                onChange={(e) => setAboutSection(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Summary</label>
              <Textarea
                placeholder="Brief summary of your work experience..."
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={handleOptimize}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Optimizing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Optimize My Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="results">Optimization Results</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Clarity Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-blue-600">{result.scores.clarityScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress value={result.scores.clarityScore} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recruiter Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-purple-600">{result.scores.recruiterScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress value={result.scores.recruiterScore} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Keyword Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-green-600">{result.scores.keywordOptimization}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress value={result.scores.keywordOptimization} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Authority Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-orange-600">{result.scores.authorityScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress value={result.scores.authorityScore} className="h-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Optimized Headline</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(result.optimized.headline, "headline")}
                    >
                      {copied === "headline" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{result.optimized.headline}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Suggested Keywords</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.optimized.suggestedKeywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Optimized About Section</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(result.optimized.aboutSection, "about")}
                    >
                      {copied === "about" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{result.optimized.aboutSection}</p>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Actionable Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.optimized.actionableRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5">
                          <ArrowUp className="h-3.5 w-3.5" />
                        </div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setResult(null)}
              >
                Optimize Another Profile
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-muted-foreground">Original Headline</h3>
                    <p className="text-sm bg-muted p-3 rounded-lg">{headline || "Not provided"}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">Optimized Headline</h3>
                    <p className="text-sm bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      {result.optimized.headline}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-muted-foreground">Original About</h3>
                    <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                      {aboutSection || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">Optimized About</h3>
                    <p className="text-sm bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-200 dark:border-green-800 whitespace-pre-wrap">
                      {result.optimized.aboutSection}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setResult(null)}
              >
                Optimize Another Profile
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}