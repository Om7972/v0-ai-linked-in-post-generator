"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Zap, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface GeneratorFormData {
  topic: string
  audience: string
  tone: "professional" | "founder" | "influencer" | "casual"
  length: "short" | "medium" | "long"
  includeEmoji: boolean
  includeHashtags: boolean
  cta: string
}

interface GeneratorFormProps {
  onGenerate: (data: GeneratorFormData) => void
  isLoading: boolean
  onReset?: () => void
}

const tones = [
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "founder", label: "Founder", icon: "🚀" },
  { value: "influencer", label: "Influencer", icon: "⭐" },
  { value: "casual", label: "Casual", icon: "😊" },
]

const audiences = [
  "Tech Leaders",
  "Young Professionals",
  "Entrepreneurs",
  "Creatives",
  "Marketers",
  "Managers",
  "Job Seekers",
]

export function GeneratorForm({
  onGenerate,
  isLoading,
  onReset,
}: GeneratorFormProps) {
  const [formData, setFormData] = useState<GeneratorFormData>({
    topic: "",
    audience: "",
    tone: "professional",
    length: "medium",
    includeEmoji: true,
    includeHashtags: true,
    cta: "",
  })

  const [selectedTone, setSelectedTone] = useState<string>("professional")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.topic && formData.audience) {
      onGenerate({
        ...formData,
        tone: selectedTone as "professional" | "founder" | "influencer" | "casual",
      })
    }
  }

  const handleReset = () => {
    setFormData({
      topic: "",
      audience: "",
      tone: "professional",
      length: "medium",
      includeEmoji: true,
      includeHashtags: true,
      cta: "",
    })
    setSelectedTone("professional")
    onReset?.()
  }

  const isFormValid = formData.topic.trim().length > 0 && formData.audience.trim().length > 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Post Configuration
        </CardTitle>
        <CardDescription>
          Customize your post parameters for the perfect LinkedIn content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Topic Input */}
          <div className="space-y-3">
            <Label htmlFor="topic" className="text-sm font-semibold">
              Topic / Key Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="topic"
              placeholder="What's the main subject of your post? (e.g., Remote work benefits, AI impact on jobs, Personal growth lessons)"
              value={formData.topic}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, topic: e.target.value }))
              }
              className="min-h-[100px] resize-none"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Be specific and clear about your main idea
            </p>
          </div>

          {/* Audience & Length Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Audience Selection */}
            <div className="space-y-3">
              <Label htmlFor="audience" className="text-sm font-semibold">
                Target Audience <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.audience}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, audience: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((aud) => (
                    <SelectItem key={aud} value={aud}>
                      {aud}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {formData.audience === "custom" && (
                <Input
                  placeholder="Describe your target audience"
                  value={formData.audience}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, audience: e.target.value }))
                  }
                  disabled={isLoading}
                  className="mt-2"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Who do you want to reach with this post?
              </p>
            </div>

            {/* Post Length */}
            <div className="space-y-3">
              <Label htmlFor="length" className="text-sm font-semibold">
                Post Length
              </Label>
              <Select
                value={formData.length}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    length: value as "short" | "medium" | "long",
                  }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">
                    Short (100-200 words)
                  </SelectItem>
                  <SelectItem value="medium">
                    Medium (200-400 words)
                  </SelectItem>
                  <SelectItem value="long">
                    Long (400+ words)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How detailed should the post be?
              </p>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Writing Tone</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => {
                    setSelectedTone(tone.value)
                    setFormData((prev) => ({
                      ...prev,
                      tone: tone.value as "professional" | "founder" | "influencer" | "casual",
                    }))
                  }}
                  disabled={isLoading}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all duration-200 text-center font-medium",
                    selectedTone === tone.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <div className="text-2xl mb-1">{tone.icon}</div>
                  <div className="text-sm">{tone.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Input */}
          <div className="space-y-3">
            <Label htmlFor="cta" className="text-sm font-semibold">
              Call to Action
            </Label>
            <Input
              id="cta"
              placeholder="What do you want readers to do? (e.g., Share your thoughts, Follow for more, Drop a comment)"
              value={formData.cta}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cta: e.target.value }))
              }
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for AI-suggested CTA
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
            <Label className="text-sm font-semibold">Post Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="emoji"
                  checked={formData.includeEmoji}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      includeEmoji: checked as boolean,
                    }))
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="emoji"
                  className="text-sm font-normal cursor-pointer"
                >
                  Include emoji for visual appeal 😊
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hashtags"
                  checked={formData.includeHashtags}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      includeHashtags: checked as boolean,
                    }))
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="hashtags"
                  className="text-sm font-normal cursor-pointer"
                >
                  Include relevant hashtags #
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Generating Post...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Post
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Keyboard Shortcut Info */}
          <p className="text-xs text-muted-foreground text-center">
            💡 Press Cmd/Ctrl + Enter to generate
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
