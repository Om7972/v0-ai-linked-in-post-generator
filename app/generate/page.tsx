"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Sparkles, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  GeneratorForm,
  type GeneratorFormData,
} from "@/components/generate/generator-form"
import { PostResult } from "@/components/generate/post-result"
import { PostSkeleton, FormSkeleton } from "@/components/generate/skeleton-loaders"
import { mockGeneratePost, mockRegeneratePost } from "@/lib/mock-gemini"
import {
  TemplateLibrary,
  ViralAnalyzer,
  HashtagIntelligence,
  SchedulingReminder,
  VersionHistory,
  TeamCollaboration,
  CommandPalette,
} from "@/components/power-user"
import { useDraftAutoSave } from "@/hooks/use-draft-auto-save"

interface GeneratedContent {
  post: string
  hashtags: string
  engagement: {
    score: number
    potential: string
    breakdown: Record<string, number>
  }
  tone: string
}

export default function GeneratePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(
    null
  )
  const [formData, setFormData] = useState<GeneratorFormData | null>(null)
  const { toast } = useToast()

  // Draft auto-save
  const draftAutoSave = useDraftAutoSave(
    generatedContent?.post || "",
    formData?.topic || "",
    formData?.audience || "",
    (formData?.tone as "Professional" | "Founder" | "Influencer" | "Casual") || "Professional"
  )

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to generate
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        if (!isLoading && !generatedContent) {
          // Focus on form submit if visible
          const submitBtn = document.querySelector(
            'button[type="submit"]'
          ) as HTMLButtonElement
          submitBtn?.click()
        }
      }

      // Escape to clear result
      if (e.key === "Escape" && generatedContent) {
        e.preventDefault()
        handleNewPost()
      }

      // Cmd/Ctrl + C (with generated content) - copy
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C" && generatedContent) {
        e.preventDefault()
        navigator.clipboard.writeText(
          `${generatedContent.post}\n\n${generatedContent.hashtags}`
        )
        toast({
          title: "Copied!",
          description: "Post copied to clipboard",
        })
      }

      // Cmd/Ctrl + R - regenerate
      if ((e.metaKey || e.ctrlKey) && e.key === "r" && generatedContent && formData) {
        e.preventDefault()
        handleRegenerate()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLoading, generatedContent, formData, toast])

  const handleGenerate = async (data: GeneratorFormData) => {
    setIsLoading(true)
    setFormData(data)

    try {
      const result = await mockGeneratePost({
        topic: data.topic,
        audience: data.audience,
        tone: data.tone,
        length: data.length,
        includeEmoji: data.includeEmoji,
        includeCTA: true,
        cta: data.cta,
      })

      setGeneratedContent({
        post: result.post,
        hashtags: result.hashtags,
        engagement: result.engagement,
        tone: data.tone,
      })

      toast({
        title: "Post Generated!",
        description: "Your LinkedIn post is ready. Review and customize it below.",
      })
    } catch (error) {
      console.error("Error generating post:", error)
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!formData || !generatedContent) return

    setIsRegenerating(true)

    try {
      const post = await mockRegeneratePost({
        topic: formData.topic,
        audience: formData.audience,
        tone: formData.tone,
        length: formData.length,
        includeEmoji: formData.includeEmoji,
        includeCTA: true,
        cta: formData.cta,
      })

      setGeneratedContent((prev) =>
        prev
          ? {
              ...prev,
              post,
            }
          : null
      )

      toast({
        title: "Regenerated!",
        description: "New post generated with the same settings.",
      })
    } catch (error) {
      console.error("Error regenerating post:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate post. Please try again.",
        variant: "destructive",
      })
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
    setFormData((prev) => ({
      ...prev,
      topic: template.name,
      tone: template.suggestedTone as GeneratorFormData["tone"],
    } as GeneratorFormData))
  }

  const handleAddHashtags = (hashtags: string[]) => {
    if (!generatedContent) return
    const hashtagString = hashtags.join(" ")
    setGeneratedContent((prev) =>
      prev
        ? {
            ...prev,
            hashtags: `${prev.hashtags}\n${hashtagString}`,
          }
        : null
    )
    toast({
      title: "Hashtags added",
      description: "Smart hashtags have been added to your post",
    })
  }

  const handleCommandPaletteAction = (action: string) => {
    const clickElement = (selector: string) => {
      const element = document.querySelector(selector) as HTMLElement | null
      if (element) {
        element.click()
      }
    }

    switch (action) {
      case "open-templates":
        clickElement('[data-command-templates]')
        break
      case "open-viral-analyzer":
        clickElement('[data-command-viral]')
        break
      case "open-hashtag-intelligence":
        clickElement('[data-command-hashtags]')
        break
      case "open-scheduler":
        clickElement('[data-command-schedule]')
        break
      case "open-history":
        clickElement('[data-command-history]')
        break
      case "open-team":
        clickElement('[data-command-team]')
        break
      default:
        break
    }
  }

  const handleDownload = () => {
    if (!generatedContent) return

    const content = `${generatedContent.post}\n\n${generatedContent.hashtags}`
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
    )
    element.setAttribute("download", "linkedin-post.txt")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Downloaded!",
      description: "Post saved as TXT file.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Command Palette */}
      <CommandPalette onAction={handleCommandPaletteAction} />

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Auto-save indicator */}
          {draftAutoSave.lastSaved && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Draft saved
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group">
              <Linkedin className="h-8 w-8 text-primary group-hover:animate-bounce" />
            </div>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            Generate LinkedIn Posts
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Create engaging, AI-powered LinkedIn posts tailored to your audience.
            Customize every aspect and publish with confidence.
          </p>

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-secondary border border-border">
                ⌘K
              </kbd>
              <span>Commands</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-secondary border border-border">
                ⌘/Ctrl
              </kbd>
              <kbd className="px-2 py-1 rounded bg-secondary border border-border">
                Enter
              </kbd>
              <span>Generate</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-secondary border border-border">
                ⌘/Ctrl
              </kbd>
              <kbd className="px-2 py-1 rounded bg-secondary border border-border">
                R
              </kbd>
              <span>Regenerate</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="space-y-6">
              <FormSkeleton />
              <PostSkeleton />
            </div>
          )}

          {!isLoading && !generatedContent && <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} onReset={handleNewPost} />}

          {!isLoading && generatedContent && (
            <div className="space-y-6">
              {/* Power-user features toolbar */}
              <div className="flex flex-wrap gap-2 justify-between items-center bg-secondary/30 p-4 rounded-lg border border-border/50">
                <div className="flex flex-wrap gap-2">
                  <TemplateLibrary onSelectTemplate={handleLoadTemplate} />
                  <ViralAnalyzer content={generatedContent.post} />
                  <HashtagIntelligence
                    topic={formData?.topic || ""}
                    tone={formData?.tone || "Professional"}
                    content={generatedContent.post}
                    onAddHashtags={handleAddHashtags}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <SchedulingReminder />
                  <VersionHistory currentContent={generatedContent.post} />
                  <TeamCollaboration />
                </div>
              </div>

              <PostResult
                post={generatedContent.post}
                hashtags={generatedContent.hashtags}
                engagement={generatedContent.engagement}
                tone={generatedContent.tone}
                onRegenerate={handleRegenerate}
                onDownload={handleDownload}
                onSaveDraft={handleNewPost}
                isRegenerating={isRegenerating}
              />

              {/* New Post Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleNewPost}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
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
                💡 <strong>Pro Tip:</strong> Use the engagement score as a guide. Try the viral analyzer, hashtag intelligence, and version history to optimize your posts. Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-semibold">⌘K</kbd> for quick access to all power-user features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
