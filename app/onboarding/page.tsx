"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, Zap, Target, Users } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useAuth } from "@/hooks/use-auth"

const steps = [
  {
    icon: Target,
    title: "Define Your Goals",
    description: "Tell us what you want to achieve with your LinkedIn posts",
  },
  {
    icon: Users,
    title: "Know Your Audience",
    description: "Help us understand your target audience better",
  },
  {
    icon: Zap,
    title: "Choose Your Style",
    description: "Select your preferred writing style and tone",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const onboarding = useOnboarding()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    goals: "",
    audience: "",
    style: "professional",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  // Redirect if already completed onboarding
  useEffect(() => {
    if (onboarding.isLoaded && onboarding.hasSeenOnboarding) {
      router.push("/dashboard")
    }
  }, [onboarding.isLoaded, onboarding.hasSeenOnboarding, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Save user preferences
      localStorage.setItem("userPreferences", JSON.stringify(formData))

      // Mark onboarding as complete
      onboarding.skipOnboarding()

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Error completing onboarding:", err)
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    onboarding.skipOnboarding()
    router.push("/dashboard")
  }

  const step = steps[currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 flex-1 rounded-full ${index < currentStep
                  ? "bg-blue-600"
                  : index === currentStep - 1
                    ? "bg-blue-400"
                    : "bg-gray-300 dark:bg-gray-700"
                  }`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-lg dark:shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>

              <CardTitle className="text-2xl">{step.title}</CardTitle>
              <CardDescription className="text-base">{step.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="goals">What are your main goals with LinkedIn?</Label>
                  <Input
                    id="goals"
                    type="text"
                    placeholder="e.g., Build personal brand, Share expertise, Generate leads..."
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-2">
                  <Label htmlFor="audience">Who is your target audience?</Label>
                  <Input
                    id="audience"
                    type="text"
                    placeholder="e.g., Tech professionals, Marketing managers, Entrepreneurs..."
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-2">
                  <Label htmlFor="style">What's your preferred writing style?</Label>
                  <select
                    id="style"
                    title="Choose your writing style"
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional & Formal</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="inspirational">Inspirational & Motivational</option>
                    <option value="educational">Educational & Informative</option>
                    <option value="witty">Witty & Humorous</option>
                  </select>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">You'll get:</p>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    AI-powered post generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Viral analysis & suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Smart hashtag recommendations
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                  className="flex-1"
                >
                  Back
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? "Completing..." : "Get Started"}
                  </Button>
                )}
              </div>

              {currentStep === steps.length && (
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  You can always change these preferences later in settings
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}
