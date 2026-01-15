"use client"

import { useOnboarding } from "@/hooks/use-onboarding"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"

export function OnboardingSettings() {
  const { resetOnboarding } = useOnboarding()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Help & Onboarding</CardTitle>
              <CardDescription>Get help or restart the product tour</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            New to LinkedIn Post Generator? Restart the interactive product tour to learn all the features and get the most out of the tool.
          </p>

          <Button
            onClick={resetOnboarding}
            variant="outline"
            className="gap-2 w-full"
          >
            <RotateCcw className="h-4 w-4" />
            Restart Onboarding Tour
          </Button>

          <div className="space-y-3 pt-4 border-t border-border/50">
            <h4 className="font-medium text-sm">Quick Tips</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Use different tones to match your voice and audience</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Engagement score predicts post performance (0-100)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Edit all generated posts to add your personal touch</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Check the Dashboard to track your post analytics</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
