"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedEmptyState } from "@/components/ui/animated-empty-state"
import { FileText, Sparkles } from "lucide-react"
import Link from "next/link"

export function EmptyPostsState() {
  return (
    <Card className="border-border/50 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-lg bg-secondary/50 mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
          Start creating engaging LinkedIn posts with our AI-powered generator
        </p>
        <Link href="/generate">
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Sparkles className="h-4 w-4" />
            Generate Your First Post
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function EmptyDraftsState() {
  return (
    <Card className="border-border/50 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="p-3 rounded-lg bg-amber-500/10 mb-3">
          <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold mb-1">No saved drafts</h3>
        <p className="text-xs text-muted-foreground text-center">
          Your draft posts will appear here
        </p>
      </CardContent>
    </Card>
  )
}

export function EmptyEngagementState() {
  return (
    <Card className="border-border/50 border-dashed h-96 flex items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-lg bg-secondary/50 mb-4">
          <Sparkles className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No data yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Generate your first post to start tracking engagement metrics
        </p>
      </CardContent>
    </Card>
  )
}

// Re-export the animated empty state component
export { AnimatedEmptyState } from "@/components/ui/animated-empty-state"

