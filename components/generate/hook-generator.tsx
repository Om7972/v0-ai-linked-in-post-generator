"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, RefreshCw, Copy, Check, Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface HookGeneratorProps {
  topic: string
  tone: string
  onSelectHook: (hook: string) => void
}

export function HookGenerator({ topic, tone, onSelectHook }: HookGeneratorProps) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [hooks, setHooks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchHooks = async () => {
    if (!topic) {
      toast({ title: "Enter a topic", description: "Please enter a topic first to generate hooks.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/generate-hooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, tone }),
      })

      if (res.ok) {
        const data = await res.json()
        setHooks(data.hooks || [])
      } else {
        throw new Error("Failed to generate hooks")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate hooks. Try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (hook: string, index: number) => {
    navigator.clipboard.writeText(hook)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
    toast({ title: "Copied!", description: "Hook copied to clipboard" })
  }

  const handleSelect = (hook: string) => {
    onSelectHook(hook)
    setIsOpen(false)
    toast({ title: "Hook Applied!", description: "Opening hook has been added to your post." })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" data-command-hooks>
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Hook Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Hook Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {topic ? `Generating hooks for: "${topic}"` : "Enter a topic in the form first"}
            </p>
            <Button
              size="sm"
              onClick={fetchHooks}
              disabled={isLoading || !topic}
              className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : hooks.length > 0 ? (
                <RefreshCw className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {hooks.length > 0 ? "Regenerate" : "Generate Hooks"}
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                <p className="text-sm text-muted-foreground">Crafting attention-grabbing hooks...</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {!isLoading && hooks.length > 0 && (
              <div className="space-y-2">
                {hooks.map((hook, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="group flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all cursor-pointer"
                    onClick={() => handleSelect(hook)}
                  >
                    <Badge variant="secondary" className="mt-0.5 shrink-0 text-[10px] w-6 h-6 flex items-center justify-center rounded-full">
                      {i + 1}
                    </Badge>
                    <p className="text-sm flex-1 leading-relaxed">{hook}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); handleCopy(hook, i) }}
                      >
                        {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {!isLoading && hooks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-yellow-500/30" />
              <p className="text-sm">Click "Generate Hooks" to get AI-powered opening lines</p>
              <p className="text-xs mt-1">Great hooks increase engagement by up to 300%</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
