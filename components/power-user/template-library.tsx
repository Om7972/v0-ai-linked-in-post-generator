"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { postTemplates } from "@/lib/power-user-features"
import { Copy, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TemplateLibraryProps {
  onSelectTemplate: (template: (typeof postTemplates)[0]) => void
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const categories = [
    "all",
    ...Array.from(new Set(postTemplates.map((t) => t.category))),
  ]

  const filtered =
    selectedCategory === "all"
      ? postTemplates
      : postTemplates.filter((t) => t.category === selectedCategory)

  const handleSelectTemplate = (template: (typeof postTemplates)[0]) => {
    onSelectTemplate(template)
    setOpen(false)
    toast({
      title: "Template loaded",
      description: `${template.name} ready to customize`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          <Zap className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Post Templates Library</DialogTitle>
          <DialogDescription>
            Choose a template to jumpstart your post. All templates are fully customizable.
          </DialogDescription>
        </DialogHeader>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize whitespace-nowrap"
            >
              {cat === "announcements" ? "Announcements" : cat.replace("-", " ")}
            </Button>
          ))}
        </div>

        {/* Templates grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 gap-3 pr-4">
            <AnimatePresence mode="wait">
              {filtered.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-border/50 hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => handleSelectTemplate(template)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{template.emoji}</span>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {template.popularity}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {template.content.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          {template.suggestedTone}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectTemplate(template)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
