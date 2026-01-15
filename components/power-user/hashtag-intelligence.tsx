"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSmartHashtags } from "@/lib/power-user-features"
import { Hash, Copy, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HashtagIntelligenceProps {
  topic: string
  tone: string
  content: string
  onAddHashtags?: (hashtags: string[]) => void
}

export function HashtagIntelligence({
  topic,
  tone,
  content,
  onAddHashtags,
}: HashtagIntelligenceProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const suggestions = getSmartHashtags(topic, tone, content)

  const handleCopyHashtags = () => {
    const hashtagString = suggestions.map((h) => `#${h.hashtag}`).join(" ")
    navigator.clipboard.writeText(hashtagString)
    toast({
      title: "Copied!",
      description: `${suggestions.length} hashtags copied to clipboard`,
    })
  }

  const handleAddHashtags = () => {
    const hashtags = suggestions.map((h) => `#${h.hashtag}`)
    onAddHashtags?.(hashtags)
    setOpen(false)
    toast({
      title: "Hashtags added",
      description: "Smart hashtags have been added to your post",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={!topic}>
          <Hash className="h-4 w-4" />
          Hashtag AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Smart Hashtag Suggestions</DialogTitle>
          <DialogDescription>
            AI-powered hashtags optimized for your topic and tone
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Suggested hashtags */}
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.hashtag}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">#{suggestion.hashtag}</span>
                      {suggestion.trend === "rising" && (
                        <Badge variant="secondary" className="text-xs gap-1 bg-green-500/20 text-green-700 dark:text-green-400 border-0">
                          <TrendingUp className="h-2.5 w-2.5" />
                          Rising
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.category} • {suggestion.popularity}% popularity
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info box */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <span className="font-semibold">💡 Tip:</span> Use 3-5 hashtags for optimal engagement. Mix popular and niche tags.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleAddHashtags}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Add to Post
            </Button>
            <Button onClick={handleCopyHashtags} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
