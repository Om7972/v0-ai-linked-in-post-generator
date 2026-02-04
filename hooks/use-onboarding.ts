"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

interface OnboardingState {
  hasSeenOnboarding: boolean
  currentStep: number
  completedSteps: string[]
  lastShown?: string
  userId?: string
}

const ONBOARDING_KEY_PREFIX = "onboarding-state"

export function useOnboarding() {
  const { user } = useAuth()
  const [state, setState] = useState<OnboardingState>({
    hasSeenOnboarding: false,
    currentStep: 0,
    completedSteps: [],
  })

  const [isLoaded, setIsLoaded] = useState(false)

  // Get user-specific storage key
  const getStorageKey = () => {
    return user?.id ? `${ONBOARDING_KEY_PREFIX}-${user.id}` : ONBOARDING_KEY_PREFIX
  }

  // Load from localStorage on mount
  useEffect(() => {
    if (!user) {
      setIsLoaded(true)
      return
    }

    const storageKey = getStorageKey()
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      try {
        const parsedState = JSON.parse(stored)
        // Check if this is the same user
        if (parsedState.userId === user.id) {
          setState(parsedState)
        } else {
          // Different user, reset onboarding
          setState({
            hasSeenOnboarding: false,
            currentStep: 0,
            completedSteps: [],
            userId: user.id,
          })
        }
      } catch {
        // Fall back to default if parsing fails
        setState({
          hasSeenOnboarding: false,
          currentStep: 0,
          completedSteps: [],
          userId: user.id,
        })
      }
    } else {
      // No stored state, this is a new user or first time
      setState({
        hasSeenOnboarding: false,
        currentStep: 0,
        completedSteps: [],
        userId: user.id,
      })
    }

    setIsLoaded(true)
  }, [user?.id])

  const updateState = (newState: Partial<OnboardingState>) => {
    const updated = { ...state, ...newState, userId: user?.id }
    setState(updated)
    if (user?.id) {
      localStorage.setItem(getStorageKey(), JSON.stringify(updated))
    }
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
      lastShown: new Date().toISOString(),
    })
  }

  const resetOnboarding = () => {
    updateState({
      hasSeenOnboarding: false,
      currentStep: 0,
      completedSteps: [],
    })
  }

  const shouldShowOnboarding = () => {
    // Don't show if user is not loaded
    if (!user || !isLoaded) {
      return false
    }

    // Show if user has never seen it
    if (!state.hasSeenOnboarding) {
      return true
    }

    return false
  }

  return {
    ...state,
    isLoaded,
    nextStep,
    previousStep,
    skipOnboarding,
    resetOnboarding,
    updateState,
    shouldShowOnboarding: shouldShowOnboarding(),
  }
}
