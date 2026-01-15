"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Sparkles,
  Zap,
  Hash,
  Calendar,
  History,
  Users,
  Settings,
  HelpCircle,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandPaletteProps {
  onAction?: (action: string, data?: any) => void
}

interface Command {
  id: string
  label: string
  icon: React.ReactNode
  category: string
  shortcut?: string
  action: () => void
}

export function CommandPalette({ onAction }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const commands: Command[] = [
    {
      id: "templates",
      label: "Browse Templates",
      icon: <FileText className="h-4 w-4" />,
      category: "Generator",
      shortcut: "⌘T",
      action: () => {
        onAction?.("open-templates")
        setOpen(false)
      },
    },
    {
      id: "viral",
      label: "Analyze for Viral Potential",
      icon: <Sparkles className="h-4 w-4" />,
      category: "Analysis",
      shortcut: "⌘V",
      action: () => {
        onAction?.("open-viral-analyzer")
        setOpen(false)
      },
    },
    {
      id: "hashtags",
      label: "Smart Hashtag Suggestions",
      icon: <Hash className="h-4 w-4" />,
      category: "Optimization",
      shortcut: "⌘H",
      action: () => {
        onAction?.("open-hashtag-intelligence")
        setOpen(false)
      },
    },
    {
      id: "schedule",
      label: "Schedule Post",
      icon: <Calendar className="h-4 w-4" />,
      category: "Publishing",
      shortcut: "⌘S",
      action: () => {
        onAction?.("open-scheduler")
        setOpen(false)
      },
    },
    {
      id: "history",
      label: "View Version History",
      icon: <History className="h-4 w-4" />,
      category: "Drafts",
      action: () => {
        onAction?.("open-history")
        setOpen(false)
      },
    },
    {
      id: "team",
      label: "Team Collaboration",
      icon: <Users className="h-4 w-4" />,
      category: "Collaboration",
      action: () => {
        onAction?.("open-team")
        setOpen(false)
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      category: "App",
      shortcut: "⌘,",
      action: () => {
        onAction?.("open-settings")
        setOpen(false)
      },
    },
    {
      id: "help",
      label: "Help & Shortcuts",
      icon: <HelpCircle className="h-4 w-4" />,
      category: "App",
      shortcut: "⌘?",
      action: () => {
        onAction?.("open-help")
        setOpen(false)
      },
    },
  ]

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Filter commands based on search
  const filteredCommands = searchQuery
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commands

  const categories = Array.from(new Set(filteredCommands.map((cmd) => cmd.category)))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg border-border/50 max-w-lg">
        <div className="flex flex-col h-full max-h-[80vh]">
          {/* Search input */}
          <div className="flex items-center border-b border-border/50 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search commands or features..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Commands list */}
          <ScrollArea className="flex-1">
            <div className="p-1.5">
              {filteredCommands.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No commands found.
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category} className="mb-2">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {category}
                    </div>
                    {filteredCommands
                      .filter((cmd) => cmd.category === category)
                      .map((cmd) => (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          className={cn(
                            "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-secondary data-[selected]:bg-secondary data-[selected]:text-secondary-foreground gap-2 transition-colors"
                          )}
                        >
                          {cmd.icon}
                          <span className="flex-1 text-left">{cmd.label}</span>
                          {cmd.shortcut && (
                            <Badge variant="secondary" className="text-xs">
                              {cmd.shortcut}
                            </Badge>
                          )}
                        </button>
                      ))}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer with shortcut hint */}
          <div className="border-t border-border/50 px-2 py-2 text-center">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="rounded bg-secondary px-1.5 py-0.5 text-xs font-semibold">⌘K</kbd> to toggle
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
