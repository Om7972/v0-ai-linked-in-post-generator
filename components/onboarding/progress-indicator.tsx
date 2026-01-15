"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: Array<{ id: string; title: string }>
  className?: string
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-secondary/30 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {steps[currentStep]?.title}
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 flex-wrap">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {index <= currentStep ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
