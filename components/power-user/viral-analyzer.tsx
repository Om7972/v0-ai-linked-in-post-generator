"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { analyzePostForViral } from "@/lib/power-user-features"
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface ViralAnalyzerProps {
  content: string
  disabled?: boolean
}

export function ViralAnalyzer({ content, disabled = false }: ViralAnalyzerProps) {
  const [open, setOpen] = useState(false)
  const analysis = analyzePostForViral(content)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || content.length < 20}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Viral Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Viral Post Analyzer</DialogTitle>
          <DialogDescription>
            See how well your post is optimized for engagement
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Score display */}
          <div className="flex items-center justify-center gap-8">
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl" />
              <div className="relative h-32 w-32 rounded-full bg-card border-4 border-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-foreground">{analysis.score}</div>
                <div className="text-xs text-muted-foreground">Viral Score</div>
              </div>
            </motion.div>

            <div className="space-y-3">
              <Badge
                className={
                  analysis.viralPotential === "High"
                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                    : analysis.viralPotential === "Good"
                      ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                      : analysis.viralPotential === "Fair"
                        ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                        : "bg-red-500/20 text-red-700 dark:text-red-400"
                }
              >
                {analysis.viralPotential} Potential
              </Badge>
              <p className="text-xs text-muted-foreground max-w-xs">
                {analysis.viralPotential === "High"
                  ? "This post has excellent viral potential! 🚀"
                  : analysis.viralPotential === "Good"
                    ? "This post looks solid. Minor improvements could help."
                    : "There's room for improvement to maximize engagement."}
              </p>
            </div>
          </div>

          {/* Factors */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Key Factors</h3>
            {analysis.factors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-3 border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {factor.impact === "positive" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : factor.impact === "negative" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-yellow-500/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{factor.name}</span>
                        <span className="text-xs font-bold text-foreground">
                          {Math.round(factor.score)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary/30 overflow-hidden mb-1">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.score}%` }}
                          transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{factor.tip}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-green-600 dark:text-green-400">Strengths</h4>
              {analysis.strengths.length > 0 ? (
                analysis.strengths.map((strength, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Keep refining...</p>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400">Improvements</h4>
              {analysis.improvements.length > 0 ? (
                analysis.improvements.map((improvement, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <AlertCircle className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Looking great! ✨</p>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
