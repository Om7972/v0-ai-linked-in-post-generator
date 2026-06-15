"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Sparkles, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GeneratedAssets {
  linkedInPost: string
  carouselScript: string
  twitterThread: string
  blogOutline: string
  newsletterDraft: string
}

export default function ContentRepurposerPage() {
  const [topic, setTopic] = useState("")
  const [existingPost, setExistingPost] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratedAssets | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRepurpose = async () => {
    if (!topic) {
      toast({
        title: "Missing topic",
        description: "Please provide a topic for your content",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/content-repurposer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, existingPost: existingPost || undefined })
      })

      if (!response.ok) {
        throw new Error("Failed to repurpose content")
      }

      const data = await response.json()
      setResult(data)
      toast({
        title: "Content repurposed!",
        description: "Check all your repurposed content formats below"
      })
    } catch (error) {
      console.error("Error repurposing content:", error)
      toast({
        title: "Error",
        description: "Failed to repurpose content",
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
        <div className="p-3 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
          <RefreshCw className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Content Repurposer</h1>
          <p className="text-muted-foreground">Turn one idea into multiple content formats</p>
        </div>
      </div>

      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle>Repurpose Your Content</CardTitle>
            <CardDescription>
              Enter a topic and optionally an existing post to repurpose into multiple formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="e.g. AI in Marketing, Remote Work Best Practices"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Existing LinkedIn Post (Optional)</label>
              <Textarea
                placeholder="If you have an existing post, paste it here to repurpose it..."
                value={existingPost}
                onChange={(e) => setExistingPost(e.target.value)}
                rows={6}
              />
            </div>

            <Button
              onClick={handleRepurpose}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                  Repurposing Content...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Repurpose My Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-6">
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="carousel">Carousel</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          <TabsContent value="linkedin" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>LinkedIn Post</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(result.linkedInPost, "linkedin")}
                  >
                    {copied === "linkedin" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {result.linkedInPost}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carousel" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>LinkedIn Carousel Script</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(result.carouselScript, "carousel")}
                  >
                    {copied === "carousel" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {result.carouselScript}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Twitter Thread</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(result.twitterThread, "twitter")}
                  >
                    {copied === "twitter" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {result.twitterThread}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Blog Outline</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(result.blogOutline, "blog")}
                  >
                    {copied === "blog" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {result.blogOutline}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Newsletter Draft</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(result.newsletterDraft, "newsletter")}
                  >
                    {copied === "newsletter" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {result.newsletterDraft}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setResult(null)}
            >
              Repurpose Another Topic
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  )
}