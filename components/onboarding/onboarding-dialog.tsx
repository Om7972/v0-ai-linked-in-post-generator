"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"
import { onboardingSteps } from "@/lib/onboarding-data"
import { OnboardingWelcome } from "./onboarding-welcome"
import { OnboardingTour } from "./onboarding-tour"
import { OnboardingSamplePost } from "./onboarding-sample"

type TourTone = "Professional" | "Founder" | "Influencer" | "Casual"

export function OnboardingDialog() {
  const onboarding = useOnboarding()
  const [selectedTone, setSelectedTone] = useState<TourTone>("Professional")

  if (!onboarding.isLoaded) {
    return null
  }

  // Don't show if user has already completed onboarding
  if (onboarding.hasSeenOnboarding) {
    return null
  }

  // Safety check: ensure currentStep is within bounds
  if (onboarding.currentStep < 0 || onboarding.currentStep >= onboardingSteps.length) {
    return null
  }

  const isWelcomeStep = onboarding.currentStep === 0
  const currentStep = onboardingSteps[onboarding.currentStep]
  const isLastStep = onboarding.currentStep === onboardingSteps.length - 1

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isWelcomeStep ? "Getting Started" : `Step ${onboarding.currentStep} of ${onboardingSteps.length}`}
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={onboarding.skipOnboarding}
            className="h-8 w-8 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isWelcomeStep ? (
            <OnboardingWelcome
              key="welcome"
              onNext={onboarding.nextStep}
              onSkip={onboarding.skipOnboarding}
            />
          ) : (
            <motion.div key={`step-${onboarding.currentStep}`} className="space-y-6">
              <OnboardingTour
                currentStep={onboarding.currentStep}
                step={currentStep}
                onNext={onboarding.nextStep}
                onPrevious={onboarding.previousStep}
                onSkip={onboarding.skipOnboarding}
                isLastStep={isLastStep}
              />

              {/* Show sample post in certain steps */}
              {onboarding.currentStep >= 4 && onboarding.currentStep <= 5 && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">Try different tones:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["Professional", "Founder", "Influencer", "Casual"] as TourTone[]).map((tone) => (
                        <Button
                          key={tone}
                          variant={selectedTone === tone ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTone(tone)}
                          className="text-xs"
                        >
                          {tone}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <OnboardingSamplePost tone={selectedTone} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
