"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Linkedin, Wand2 } from "lucide-react"
import { PostReview } from "@/components/post-review"

interface PostFormData {
  topic: string
  audience: string
  tone: string
  length: string
  cta: string
  grounding: boolean
}

interface GeneratedPost {
  post: string
  hashtags?: string
  usage?: any
  grounded?: boolean
}

export default function LinkedInPostGenerator() {
  const [formData, setFormData] = useState<PostFormData>({
    topic: "",
    audience: "",
    tone: "",
    length: "",
    cta: "",
    grounding: false,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate post")
      }

      const result = await response.json()

      // Generate hashtags for the post
      const hashtagResponse = await fetch("/api/generate-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postContent: result.post }),
      })

      let hashtags = ""
      if (hashtagResponse.ok) {
        const hashtagResult = await hashtagResponse.json()
        hashtags = hashtagResult.hashtags
      }

      setGeneratedPost({
        post: result.post,
        hashtags,
        usage: result.usage,
        grounded: result.grounded,
      })
    } catch (error) {
      console.error("Error generating post:", error)
      // TODO: Add proper error handling UI
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefinePost = async (refinementType: string, customInstruction?: string) => {
    if (!generatedPost) return

    setIsRefining(true)

    try {
      const response = await fetch("/api/refine-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPost: generatedPost.post,
          refinementType,
          customInstruction,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to refine post")
      }

      const result = await response.json()

      // Generate new hashtags for the refined post
      const hashtagResponse = await fetch("/api/generate-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postContent: result.refinedPost }),
      })

      let hashtags = generatedPost.hashtags
      if (hashtagResponse.ok) {
        const hashtagResult = await hashtagResponse.json()
        hashtags = hashtagResult.hashtags
      }

      setGeneratedPost({
        ...generatedPost,
        post: result.refinedPost,
        hashtags,
      })
    } catch (error) {
      console.error("Error refining post:", error)
    } finally {
      setIsRefining(false)
    }
  }

  const handleNewPost = () => {
    setGeneratedPost(null)
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Linkedin className="h-8 w-8 text-primary" />
            </div>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">AI LinkedIn Post Generator</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Create engaging, professional LinkedIn posts tailored to your audience using the power of Gemini AI
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {!generatedPost ? (
            /* Form */
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Post Configuration
                </CardTitle>
                <CardDescription>Provide the details below to generate a highly tailored LinkedIn post</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Topic */}
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-sm font-medium">
                        Topic / Key Message *
                      </Label>
                      <Textarea
                        id="topic"
                        placeholder="e.g., The importance of soft skills in remote teams"
                        value={formData.topic}
                        onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                        className="min-h-[100px] resize-none"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        The main subject or core idea your post should convey
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-sm font-medium">
                        Target Audience *
                      </Label>
                      <Input
                        id="audience"
                        placeholder="e.g., Junior Developers, Marketing Managers, CEOs"
                        value={formData.audience}
                        onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Who is this post for? Be specific about your target audience
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Tone of Voice */}
                    <div className="space-y-2">
                      <Label htmlFor="tone" className="text-sm font-medium">
                        Tone of Voice *
                      </Label>
                      <Select
                        value={formData.tone}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, tone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="thought-provoking">Thought-Provoking</SelectItem>
                          <SelectItem value="data-driven">Data-Driven</SelectItem>
                          <SelectItem value="personal-story">Personal Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Desired Length */}
                    <div className="space-y-2">
                      <Label htmlFor="length" className="text-sm font-medium">
                        Desired Length *
                      </Label>
                      <Select
                        value={formData.length}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, length: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (1-3 paragraphs)</SelectItem>
                          <SelectItem value="medium">Medium (4-6 paragraphs)</SelectItem>
                          <SelectItem value="long">Long (Article summary)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Call to Action */}
                    <div className="space-y-2">
                      <Label htmlFor="cta" className="text-sm font-medium">
                        Call to Action *
                      </Label>
                      <Input
                        id="cta"
                        placeholder="e.g., Drop a comment, Share your experience"
                        value={formData.cta}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cta: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Grounding Requirement */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grounding"
                      checked={formData.grounding}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, grounding: checked as boolean }))}
                    />
                    <Label htmlFor="grounding" className="text-sm font-medium">
                      Include recent news or live data (Google Search grounding)
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={
                        isGenerating ||
                        !formData.topic ||
                        !formData.audience ||
                        !formData.tone ||
                        !formData.length ||
                        !formData.cta
                      }
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Generating Post...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate LinkedIn Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Post Review Interface */
            <PostReview
              generatedPost={generatedPost}
              onNewPost={handleNewPost}
              onRefinePost={handleRefinePost}
              isRefining={isRefining}
            />
          )}

          {/* Loading overlay for refinement */}
          {isRefining && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  <span className="text-lg font-medium">Refining your post...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
