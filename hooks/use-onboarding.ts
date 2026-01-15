"use client"

import { useState, useEffect } from "react"

interface OnboardingState {
  hasSeenOnboarding: boolean
  currentStep: number
  completedSteps: string[]
}

const ONBOARDING_KEY = "onboarding-state"

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    hasSeenOnboarding: false,
    currentStep: 0,
    completedSteps: [],
  })

  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY)
    if (stored) {
      try {
        setState(JSON.parse(stored))
      } catch {
        // Fall back to default if parsing fails
      }
    }
    setIsLoaded(true)
  }, [])

  const updateState = (newState: Partial<OnboardingState>) => {
    const updated = { ...state, ...newState }
    setState(updated)
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated))
  }

  const nextStep = () => {
    updateState({
      currentStep: state.currentStep + 1,
      completedSteps: [...state.completedSteps, `step-${state.currentStep}`],
    })
  }

  const previousStep = () => {
    updateState({
      currentStep: Math.max(0, state.currentStep - 1),
    })
  }

  const skipOnboarding = () => {
    updateState({
      hasSeenOnboarding: true,
      currentStep: 0,
    })
  }

  const resetOnboarding = () => {
    updateState({
      hasSeenOnboarding: false,
      currentStep: 0,
      completedSteps: [],
    })
  }

  return {
    ...state,
    isLoaded,
    nextStep,
    previousStep,
    skipOnboarding,
    resetOnboarding,
    updateState,
  }
}
