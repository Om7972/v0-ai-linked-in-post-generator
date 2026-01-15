"use client"

import { motion } from "framer-motion"
import { Lightbulb, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "./progress-indicator"
import { onboardingSteps } from "@/lib/onboarding-data"

interface OnboardingTourProps {
  currentStep: number
  step: (typeof onboardingSteps)[number]
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  isLastStep: boolean
}

export function OnboardingTour({
  currentStep,
  step,
  onNext,
  onPrevious,
  onSkip,
  isLastStep,
}: OnboardingTourProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main content */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <motion.div
            className="flex-shrink-0 mt-1"
            animate={{ bounce: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{step.title}</h2>
            <p className="text-muted-foreground mt-2">{step.description}</p>
          </div>
        </div>

        {/* Tip box */}
        {step.tip && (
          <motion.div
            className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <span className="font-semibold">💡 Tip:</span> {step.tip}
            </p>
          </motion.div>
        )}
      </div>

      {/* Progress */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={onboardingSteps.length}
        steps={onboardingSteps}
        className="pt-2"
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {currentStep > 0 && (
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2"
        >
          {isLastStep ? "Let's Get Started" : "Next Step"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {currentStep > 0 && !isLastStep && (
          <Button
            onClick={onSkip}
            variant="ghost"
            className="text-xs"
          >
            Skip
          </Button>
        )}
      </div>
    </motion.div>
  )
}
