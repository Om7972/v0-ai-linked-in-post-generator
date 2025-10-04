"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Copy,
  Edit3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  MessageSquare,
  Wand2,
  Settings,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PostReviewProps {
  generatedPost: {
    post: string
    hashtags?: string
    usage?: any
    grounded?: boolean
  }
  onNewPost: () => void
  onRefinePost: (refinementType: string, customInstruction?: string) => void
  isRefining?: boolean
}

export function PostReview({ generatedPost, onNewPost, onRefinePost, isRefining = false }: PostReviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState(generatedPost.post)
  const [editedHashtags, setEditedHashtags] = useState(generatedPost.hashtags || "")
  const [customRefinement, setCustomRefinement] = useState("")
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCopyToClipboard = async () => {
    const fullPost = `${editedPost}\n\n${editedHashtags}`
    try {
      await navigator.clipboard.writeText(fullPost)
      toast({
        title: "Copied to clipboard!",
        description: "Your LinkedIn post is ready to share.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try copying manually.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEdits = () => {
    setIsEditing(false)
    toast({
      title: "Changes saved",
      description: "Your edits have been applied to the post.",
    })
  }

  const handleCustomRefinement = () => {
    if (customRefinement.trim()) {
      onRefinePost("custom", customRefinement)
      setCustomRefinement("")
      setIsCustomDialogOpen(false)
    }
  }

  const getPostStats = () => {
    const wordCount = editedPost.split(/\s+/).length
    const charCount = editedPost.length
    const hashtagCount = editedHashtags.split(/\s+/).filter((tag) => tag.startsWith("#")).length
    const lineBreaks = (editedPost.match(/\n/g) || []).length
    const readingTime = Math.ceil(wordCount / 200) // Average reading speed

    return { wordCount, charCount, hashtagCount, lineBreaks, readingTime }
  }

  const { wordCount, charCount, hashtagCount, lineBreaks, readingTime } = getPostStats()

  const getEngagementScore = () => {
    let score = 0

    // Length optimization (ideal 150-300 words)
    if (wordCount >= 150 && wordCount <= 300) score += 25
    else if (wordCount >= 100 && wordCount <= 400) score += 15
    else score += 5

    // Character count (under 3000 is good)
    if (charCount <= 3000) score += 20
    else score += 5

    // Line breaks for readability
    if (lineBreaks >= 3) score += 15
    else if (lineBreaks >= 1) score += 10
    else score += 0

    // Hashtag count (3-5 is optimal)
    if (hashtagCount >= 3 && hashtagCount <= 5) score += 20
    else if (hashtagCount >= 1 && hashtagCount <= 7) score += 10
    else score += 0

    // Question marks (engagement)
    const questionMarks = (editedPost.match(/\?/g) || []).length
    if (questionMarks >= 1) score += 10

    // Call to action detection
    const ctaWords = ["comment", "share", "thoughts", "experience", "opinion", "agree", "disagree"]
    const hasCTA = ctaWords.some((word) => editedPost.toLowerCase().includes(word))
    if (hasCTA) score += 10

    return Math.min(score, 100)
  }

  const engagementScore = getEngagementScore()

  const refinementOptions = [
    {
      type: "urgent",
      label: "Make it more urgent",
      description: "Add urgency and immediacy to the tone",
      icon: AlertCircle,
    },
    {
      type: "example",
      label: "Add another example",
      description: "Include concrete examples or case studies",
      icon: MessageSquare,
    },
    {
      type: "shorten",
      label: "Shorten by 50 words",
      description: "Make the post more concise",
      icon: Edit3,
    },
    {
      type: "professional",
      label: "Make more professional",
      description: "Increase formality and business tone",
      icon: Users,
    },
    {
      type: "engaging",
      label: "Make more engaging",
      description: "Add hooks and interactive elements",
      icon: TrendingUp,
    },
    {
      type: "storytelling",
      label: "Add storytelling",
      description: "Include narrative elements and personal touch",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Post Content Review */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated LinkedIn Post
              </CardTitle>
              <CardDescription>
                Review and edit your AI-generated content before sharing
                {generatedPost.grounded && (
                  <Badge variant="secondary" className="ml-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Real-time data included
                  </Badge>
                )}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isRefining}>
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Post Content */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Post Content</Label>
            {isEditing ? (
              <Textarea
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Edit your post content..."
              />
            ) : (
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{editedPost}</p>
              </div>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Hashtags</Label>
            {isEditing ? (
              <Textarea
                value={editedHashtags}
                onChange={(e) => setEditedHashtags(e.target.value)}
                className="min-h-[60px] resize-none"
                placeholder="Edit hashtags..."
              />
            ) : (
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm text-primary font-medium">{editedHashtags}</p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSaveEdits} size="sm">
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedPost(generatedPost.post)
                  setEditedHashtags(generatedPost.hashtags || "")
                  setIsEditing(false)
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Analytics */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Post Analytics & Engagement Score
          </CardTitle>
          <CardDescription>Comprehensive metrics and optimization insights</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Engagement Score */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Engagement Score</span>
              <span className="text-2xl font-bold text-primary">{engagementScore}/100</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${engagementScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {engagementScore >= 80
                ? "Excellent! This post is optimized for high engagement."
                : engagementScore >= 60
                  ? "Good! Consider minor improvements for better engagement."
                  : "Room for improvement. Try refining your post for better engagement."}
            </p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{wordCount}</div>
              <div className="text-xs text-muted-foreground">Words</div>
              <div className="text-xs text-green-500 mt-1">
                {wordCount >= 150 && wordCount <= 300 ? "Optimal" : wordCount < 150 ? "Too short" : "Too long"}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{charCount}</div>
              <div className="text-xs text-muted-foreground">Characters</div>
              <div className="text-xs text-green-500 mt-1">{charCount <= 3000 ? "Good" : "Too long"}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{hashtagCount}</div>
              <div className="text-xs text-muted-foreground">Hashtags</div>
              <div className="text-xs text-green-500 mt-1">
                {hashtagCount >= 3 && hashtagCount <= 5 ? "Perfect" : "Adjust"}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{lineBreaks}</div>
              <div className="text-xs text-muted-foreground">Line Breaks</div>
              <div className="text-xs text-green-500 mt-1">{lineBreaks >= 3 ? "Great" : "Add more"}</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">{readingTime}m</div>
              <div className="text-xs text-muted-foreground">Read Time</div>
              <div className="text-xs text-green-500 mt-1">{readingTime <= 2 ? "Quick read" : "Long read"}</div>
            </div>
          </div>

          {/* Optimization Suggestions */}
          {engagementScore < 80 && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="font-medium text-yellow-600 mb-2">Optimization Suggestions:</h4>
              <ul className="text-sm text-yellow-600 space-y-1">
                {wordCount < 150 && <li>• Consider adding more detail (aim for 150-300 words)</li>}
                {wordCount > 300 && <li>• Try shortening the post for better engagement</li>}
                {hashtagCount < 3 && <li>• Add more relevant hashtags (3-5 recommended)</li>}
                {hashtagCount > 5 && <li>• Reduce hashtags to avoid looking spammy</li>}
                {lineBreaks < 3 && <li>• Add more line breaks for better mobile readability</li>}
                {!editedPost.includes("?") && <li>• Consider adding a question to encourage engagement</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Refinement Options */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Refinement Options
          </CardTitle>
          <CardDescription>Enhance your post with AI-powered refinements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {refinementOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <Button
                  key={option.type}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col items-start gap-2 bg-transparent hover:bg-muted/50"
                  onClick={() => onRefinePost(option.type)}
                  disabled={isRefining}
                >
                  <div className="flex items-center gap-2 w-full">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">{option.description}</span>
                </Button>
              )
            })}
          </div>

          {/* Custom Refinement */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled={isRefining}>
                  <Settings className="h-4 w-4 mr-2" />
                  Custom Refinement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Custom Refinement</DialogTitle>
                  <DialogDescription>
                    Describe how you'd like to modify your post. Be specific about the changes you want.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="e.g., Make it more conversational, add statistics, focus on benefits for startups..."
                    value={customRefinement}
                    onChange={(e) => setCustomRefinement(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCustomRefinement} disabled={!customRefinement.trim()}>
                      Apply Refinement
                    </Button>
                    <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopyToClipboard} className="flex-1 min-w-[200px]">
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              variant="outline"
              onClick={onNewPost}
              className="flex-1 min-w-[200px] bg-transparent"
              disabled={isRefining}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn Best Practices */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            LinkedIn Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium">Engagement Tips</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Post during business hours (9 AM - 5 PM in your timezone)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Ask questions to encourage comments and discussions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use 3-5 relevant hashtags for optimal reach</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Include a clear call-to-action at the end</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Respond to comments within the first hour</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Content Guidelines</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Keep posts under 3000 characters for better visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use line breaks every 2-3 sentences for mobile readability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Share personal insights and authentic experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Include relevant industry keywords naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Start with a compelling hook in the first line</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
