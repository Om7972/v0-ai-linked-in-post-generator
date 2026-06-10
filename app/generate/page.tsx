"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Sparkles, Linkedin, Eye, EyeOff, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  GeneratorForm,
  type GeneratorFormData,
} from "@/components/generate/generator-form"
import { PostResult } from "@/components/generate/post-result"
import { PostSkeleton, FormSkeleton } from "@/components/generate/skeleton-loaders"
import { LivePreview } from "@/components/generate/live-preview"
import { HookGenerator } from "@/components/generate/hook-generator"
import {
  TemplateLibrary,
  ViralAnalyzer,
  HashtagIntelligence,
  SchedulingReminder,
  VersionHistory,
  TeamCollaboration,
  CommandPalette,
  PersonalStyle,
} from "@/components/power-user"
import { useDraftAutoSave } from "@/hooks/use-draft-auto-save"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog"
import { motion, AnimatePresence } from "framer-motion"

interface GeneratedContent {
  post: string
  hashtags: string
  engagement: {
    score: number
    potential: string
    breakdown: Record<string, number>
  }
  tone: string
  postId?: string
  versionId?: string
}

export default function GeneratePage() {
  const { isAuthenticated, isLoading: authLoading, user, token } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [formData, setFormData] = useState<GeneratorFormData | null>(null)
  const [customStyle, setCustomStyle] = useState<string>("")
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState("editor")
  const { toast } = useToast()

  // Draft auto-save
  const draftAutoSave = useDraftAutoSave(
    generatedContent?.post || "",
    formData?.topic || "",
    formData?.audience || "",
    (formData?.tone as "Professional" | "Founder" | "Influencer" | "Casual") || "Professional"
  )

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        if (!isLoading && !generatedContent) {
          const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement
          submitBtn?.click()
        }
      }
      if (e.key === "Escape" && generatedContent) {
        e.preventDefault()
        handleNewPost()
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C" && generatedContent) {
        e.preventDefault()
        navigator.clipboard.writeText(`${generatedContent.post}\n\n${generatedContent.hashtags}`)
        toast({ title: "Copied!", description: "Post copied to clipboard" })
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "r" && generatedContent && formData) {
        e.preventDefault()
        handleRegenerate()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLoading, generatedContent, formData, toast])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const handleGenerate = async (data: GeneratorFormData) => {
    setIsLoading(true)
    setFormData(data)
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          topic: data.topic, audience: data.audience, tone: data.tone,
          length: data.length, cta: data.cta, customStyle
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate post")
      }
      const result = await response.json()
      setGeneratedContent({
        post: result.content,
        hashtags: result.hashtags || "",
        engagement: {
          score: result.engagement?.score || 75,
          potential: result.engagement?.potential || "Good",
          breakdown: result.engagement?.breakdown || {},
        },
        tone: data.tone, postId: result.postId, versionId: result.versionId,
      })
      toast({ title: "✨ Post Generated!", description: "Your LinkedIn post is ready." })
    } catch (error: any) {
      if (error.message === "Unauthorized" || error.message.includes("profile not found")) {
        toast({ title: "Auth Required", description: "Please log in.", variant: "destructive" })
        router.push("/auth/login")
        return
      }
      toast({ title: "Error", description: error.message || "Failed to generate post.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!formData || !generatedContent) return
    setIsRegenerating(true)
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          topic: formData.topic, audience: formData.audience, tone: formData.tone,
          length: formData.length, cta: formData.cta, customStyle,
          postId: generatedContent.postId,
        }),
      })
      if (!response.ok) throw new Error((await response.json()).error || "Failed")
      const result = await response.json()
      setGeneratedContent((prev) => prev ? {
        ...prev, post: result.content, hashtags: result.hashtags || prev.hashtags,
        postId: result.postId, versionId: result.versionId,
        engagement: { score: result.engagement?.score || prev.engagement.score, potential: result.engagement?.potential || prev.engagement.potential, breakdown: result.engagement?.breakdown || prev.engagement.breakdown }
      } : null)
      toast({ title: "Regenerated!", description: "New version generated." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleRefinePost = async (refinementType: string, customInstruction?: string) => {
    if (!generatedContent || !token) return
    setIsRegenerating(true)
    try {
      const response = await fetch("/api/refine-post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPost: generatedContent.post, refinementType, customInstruction, postId: generatedContent.postId }),
      })
      if (!response.ok) throw new Error((await response.json()).error || "Failed")
      const result = await response.json()
      setGeneratedContent((prev) => prev ? { ...prev, post: result.refinedPost, postId: result.postId || prev.postId, versionId: result.versionId } : null)
      toast({ title: "Post refined!", description: "Successfully refined." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleNewPost = () => {
    setGeneratedContent(null)
    setFormData(null)
    draftAutoSave.clearDraft()
  }

  const handleLoadTemplate = (template: any) => {
    setFormData((prev) => ({ ...prev, topic: template.name, tone: template.suggestedTone } as GeneratorFormData))
  }

  const handleAddHashtags = (hashtags: string[]) => {
    if (!generatedContent) return
    setGeneratedContent((prev) => prev ? { ...prev, hashtags: `${prev.hashtags}\n${hashtags.join(" ")}` } : null)
    toast({ title: "Hashtags added", description: "Smart hashtags added to your post" })
  }

  const handleHookSelect = (hook: string) => {
    if (generatedContent) {
      setGeneratedContent(prev => prev ? { ...prev, post: `${hook}\n\n${prev.post}` } : null)
    }
  }

  const handleDownload = () => {
    if (!generatedContent) return
    const content = `${generatedContent.post}\n\n${generatedContent.hashtags}`
    const el = document.createElement("a")
    el.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    el.setAttribute("download", "linkedin-post.txt")
    el.style.display = "none"
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
    toast({ title: "Downloaded!", description: "Post saved as TXT file." })
  }

  const handleCommandPaletteAction = (action: string) => {
    const clickElement = (selector: string) => {
      (document.querySelector(selector) as HTMLElement)?.click()
    }
    const actions: Record<string, string> = {
      "open-templates": "[data-command-templates]",
      "open-viral-analyzer": "[data-command-viral]",
      "open-hashtag-intelligence": "[data-command-hashtags]",
      "open-scheduler": "[data-command-schedule]",
      "open-history": "[data-command-history]",
      "open-team": "[data-command-team]",
    }
    if (actions[action]) clickElement(actions[action])
  }

  return (
    <div className="min-h-screen bg-background">
      <OnboardingDialog />
      <CommandPalette onAction={handleCommandPaletteAction} />

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            {draftAutoSave.lastSaved && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Draft saved
              </div>
            )}
            {generatedContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            )}
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
              <Linkedin className="h-8 w-8 text-blue-500" />
            </div>
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Generate LinkedIn Posts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create engaging, AI-powered posts tailored to your audience with real-time preview
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs gap-1"><Wand2 className="h-3 w-3" /> AI-Powered</Badge>
            <Badge variant="secondary" className="text-xs">3 AI Models</Badge>
            <Badge variant="secondary" className="text-xs">Smart Hashtags</Badge>
          </div>

          {/* Keyboard shortcuts */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            {[
              { keys: "⌘K", label: "Commands" },
              { keys: "⌘↵", label: "Generate" },
              { keys: "⌘R", label: "Regenerate" },
            ].map(({ keys, label }) => (
              <div key={label} className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px]">{keys}</kbd>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <FormSkeleton />
              <PostSkeleton />
            </div>
          )}

          {!isLoading && !generatedContent && (
            <div className="max-w-4xl mx-auto">
              <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} onReset={handleNewPost} />
            </div>
          )}

          {!isLoading && generatedContent && (
            <div className="space-y-6">
              {/* Power-user features toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 justify-between items-center bg-secondary/30 p-4 rounded-xl border border-border/50 backdrop-blur-sm"
              >
                <div className="flex flex-wrap gap-2">
                  <TemplateLibrary onSelectTemplate={handleLoadTemplate} />
                  <PersonalStyle onSelectStyle={(style) => {
                    setCustomStyle(style)
                    toast({ title: "Style Applied", description: "Your personal writing style will be used." })
                  }} />
                  <HookGenerator topic={formData?.topic || ""} tone={formData?.tone || "Professional"} onSelectHook={handleHookSelect} />
                  <ViralAnalyzer content={generatedContent.post} />
                  <HashtagIntelligence topic={formData?.topic || ""} tone={formData?.tone || "Professional"} content={generatedContent.post} onAddHashtags={handleAddHashtags} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <SchedulingReminder />
                  <VersionHistory currentContent={generatedContent.post} />
                  <TeamCollaboration />
                </div>
              </motion.div>

              {/* Content: Editor + Preview side-by-side */}
              <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "grid-cols-1 max-w-4xl mx-auto"}`}>
                {/* Editor/Result */}
                <div>
                  <PostResult
                    post={generatedContent.post}
                    hashtags={generatedContent.hashtags}
                    engagement={generatedContent.engagement}
                    tone={generatedContent.tone}
                    onRegenerate={handleRegenerate}
                    onRefine={handleRefinePost}
                    onDownload={handleDownload}
                    onSaveDraft={handleNewPost}
                    isRegenerating={isRegenerating}
                  />
                </div>

                {/* Live Preview */}
                <AnimatePresence>
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="sticky top-24"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
                      </div>
                      <LivePreview
                        content={generatedContent.post}
                        hashtags={generatedContent.hashtags}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* New Post Button */}
              <div className="flex justify-center pt-4">
                <Button onClick={handleNewPost} variant="outline" size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Another Post
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="mt-16 text-center">
          <Card className="border-border/30 bg-secondary/20 backdrop-blur-sm mx-auto max-w-2xl">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Use the Hook Generator to create scroll-stopping opening lines. 
                The AI cycles through GROQ, Gemini, and HuggingFace to ensure you always get results. 
                Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-semibold">⌘K</kbd> for quick access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
