"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ProgressIndicator } from "./progress-indicator"
import { onboardingSteps } from "@/lib/onboarding-data"

interface OnboardingWelcomeProps {
  onNext: () => void
  onSkip: () => void
}

export function OnboardingWelcome({ onNext, onSkip }: OnboardingWelcomeProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main content */}
      <div className="space-y-4 text-center">
        <motion.div
          className="text-4xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎉
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome to LinkedIn Post Generator!</h2>
          <p className="text-muted-foreground text-sm">
            Create engaging, AI-powered LinkedIn posts in seconds. Let's show you how.
          </p>
        </div>
      </div>

      {/* Features preview */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "✨", label: "AI-Powered" },
          { icon: "⚡", label: "Fast & Easy" },
          { icon: "📊", label: "Smart Analytics" },
          { icon: "🎯", label: "Tone Control" },
        ].map((feature, index) => (
          <motion.div
            key={feature.label}
            className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl mb-1">{feature.icon}</div>
            <div className="text-xs font-medium">{feature.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress */}
      <ProgressIndicator
        currentStep={0}
        totalSteps={onboardingSteps.length}
        steps={onboardingSteps}
        className="pt-4"
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Start Tour
        </Button>
        <Button
          onClick={onSkip}
          variant="outline"
          className="flex-1"
        >
          Skip for Now
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        You can restart this tour anytime from settings.
      </p>
    </motion.div>
  )
}
