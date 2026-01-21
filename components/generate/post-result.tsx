"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Save,
  Sparkles,
  Zap,
  Share2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PostResultProps {
  post: string
  hashtags: string
  engagement: {
    score: number
    potential: string
    breakdown: Record<string, number>
  }
  tone: string
  onRegenerate: () => void
  onRefine?: (refinementType: string, customInstruction?: string) => void
  onDownload: () => void
  onSaveDraft: () => void
  isRegenerating?: boolean
}

export function PostResult({
  post,
  hashtags,
  engagement,
  tone,
  onRegenerate,
  onRefine,
  onDownload,
  onSaveDraft,
  isRegenerating = false,
}: PostResultProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState(post)
  const [editedHashtags, setEditedHashtags] = useState(hashtags)
  const [copied, setCopied] = useState(false)
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCopyPost = async () => {
    const fullContent = `${editedPost}\n\n${editedHashtags}`
    await navigator.clipboard.writeText(fullContent)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Post copied to clipboard with hashtags",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (format: "txt" | "markdown") => {
    const fullContent = `${editedPost}\n\n${editedHashtags}`
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(fullContent)}`
    )
    element.setAttribute("download", `linkedin-post.${format === "txt" ? "txt" : "md"}`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setDownloadedFormat(format)
    toast({
      title: "Downloaded!",
      description: `Post saved as ${format.toUpperCase()}`,
    })
    setTimeout(() => setDownloadedFormat(null), 2000)
  }

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem("post-drafts") || "[]")
    const newDraft = {
      id: Date.now(),
      post: editedPost,
      hashtags: editedHashtags,
      tone,
      createdAt: new Date().toISOString(),
    }
    drafts.push(newDraft)
    localStorage.setItem("post-drafts", JSON.stringify(drafts))
    toast({
      title: "Saved!",
      description: "Draft saved to your local storage",
    })
  }

  // Engagement score color
  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-blue-600 dark:text-blue-400"
    if (score >= 40) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with tone badge */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Generated Post</h2>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Generated · {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRegenerate}
          disabled={isRegenerating}
          title="Regenerate with same settings"
        >
          <RefreshCw
            className={cn(
              "h-5 w-5",
              isRegenerating && "animate-spin"
            )}
          />
        </Button>
      </div>

      {/* Engagement Score Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Engagement Score
              </p>
              <p className={cn("text-4xl font-bold", getEngagementColor(engagement.score))}>
                {engagement.score}
              </p>
            </div>
            <div className={cn(
              "relative w-32 h-32 flex items-center justify-center",
              getEngagementColor(engagement.score)
            )}>
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(engagement.score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-center">
                <Zap className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm font-semibold">{engagement.score}%</span>
              </div>
            </div>
          </div>

          <div className="bg-background/50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-foreground mb-2">
              {engagement.potential}
            </p>
            <div className="space-y-2">
              {Object.entries(engagement.breakdown).map(([metric, score]) => (
                <div key={metric} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{metric}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(score / 15) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold w-6 text-right">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Content Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Post Content</CardTitle>
          <CardDescription>
            {isEditing ? "Edit your post before publishing" : "Ready to post to LinkedIn"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <Textarea
              value={editedPost}
              onChange={(e) => setEditedPost(e.target.value)}
              className="min-h-[300px] resize-none"
              placeholder="Edit your post..."
            />
          ) : (
            <div className="p-4 rounded-lg bg-secondary/50 min-h-[300px] whitespace-pre-wrap text-foreground font-mono text-sm leading-relaxed">
              {editedPost}
            </div>
          )}

          {/* Hashtags Section */}
          <div className="pt-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Hashtags
            </p>
            {isEditing ? (
              <Textarea
                value={editedHashtags}
                onChange={(e) => setEditedHashtags(e.target.value)}
                className="min-h-[80px] resize-none font-mono text-sm"
                placeholder="Edit hashtags..."
              />
            ) : (
              <p className="text-sm text-primary font-medium break-words">
                {editedHashtags}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={handleCopyPost}
          size="lg"
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>

        <Button
          onClick={() => {
            if (downloadedFormat) return
            handleDownload("txt")
          }}
          variant="outline"
          size="lg"
          className="gap-2"
          disabled={downloadedFormat === "txt"}
        >
          {downloadedFormat === "txt" ? (
            <>
              <Check className="h-4 w-4" />
              Downloaded
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download TXT
            </>
          )}
        </Button>

        <Button
          onClick={handleSaveDraft}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          {isEditing ? (
            <>
              <Check className="h-4 w-4" />
              Done Editing
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Edit Post
            </>
          )}
        </Button>
      </div>

      {/* Share Button */}
      <Button
        onClick={() => {
          navigator.share?.({
            title: "Check out my LinkedIn post",
            text: editedPost,
          }).catch(() => {
            handleCopyPost()
          })
        }}
        variant="secondary"
        size="lg"
        className="w-full gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  )
}
