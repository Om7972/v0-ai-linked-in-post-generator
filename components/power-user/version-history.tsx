"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { History, Copy, RotateCcw, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PostVersion {
  id: string
  content: string
  timestamp: Date
  title?: string
}

interface VersionHistoryProps {
  currentContent: string
  onRestore?: (content: string) => void
}

export function VersionHistory({ currentContent, onRestore }: VersionHistoryProps) {
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<PostVersion[]>([
    {
      id: "v1",
      content: "Initial draft",
      timestamp: new Date(Date.now() - 600000),
      title: "First version",
    },
    {
      id: "v2",
      content: "Updated with more details and examples...",
      timestamp: new Date(Date.now() - 300000),
      title: "Added examples",
    },
  ])
  const { toast } = useToast()

  const handleRestore = (version: PostVersion) => {
    onRestore?.(version.content)
    setOpen(false)
    toast({
      title: "Version restored",
      description: `Restored version from ${version.timestamp.toLocaleTimeString()}`,
    })
  }

  const handleDelete = (id: string) => {
    setVersions(versions.filter((v) => v.id !== id))
    toast({
      title: "Version deleted",
      description: "The version has been removed from history",
    })
  }

  const saveNewVersion = (title?: string) => {
    const newVersion: PostVersion = {
      id: `v${versions.length + 1}`,
      content: currentContent,
      timestamp: new Date(),
      title,
    }
    setVersions([newVersion, ...versions])
    toast({
      title: "Version saved",
      description: "Your current post has been saved to history",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Post Version History</DialogTitle>
          <DialogDescription>
            Track changes and restore previous versions
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-3 flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Save current version */}
          <div className="space-y-2 pb-3 border-b border-border/50">
            <p className="text-xs font-medium text-muted-foreground">Save current version</p>
            <div className="flex gap-2">
              <Input placeholder="Version name (optional)" className="text-xs" />
              <Button
                size="sm"
                onClick={() => saveNewVersion()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Versions list */}
          <AnimatePresence mode="wait">
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-3 border-border/50 hover:border-primary/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {version.title || `Version ${version.id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {version.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round((Date.now() - version.timestamp.getTime()) / 60000)}m ago
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {version.content.substring(0, 80)}...
                    </p>

                    <div className="flex gap-1.5 pt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 h-7 gap-1 text-xs"
                        onClick={() => handleRestore(version)}
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => {
                          navigator.clipboard.writeText(version.content)
                          toast({ title: "Copied to clipboard" })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(version.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
