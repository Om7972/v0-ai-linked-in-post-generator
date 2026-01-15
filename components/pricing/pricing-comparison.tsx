"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { pricingPlans, comparisonFeatures } from "@/lib/pricing-data"

interface PricingComparisonProps {
  isYearly: boolean
}

export function PricingComparison({ isYearly }: PricingComparisonProps) {
  const features = [
    {
      name: "Monthly Posts",
      free: "5",
      pro: "Unlimited",
      creator: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      name: "Tone Control",
      free: "Basic (4 tones)",
      pro: "Advanced (All tones)",
      creator: "Advanced (All tones)",
      enterprise: "Custom tones",
    },
    {
      name: "Engagement Scoring",
      free: "✓",
      pro: "✓",
      creator: "✓",
      enterprise: "✓ Advanced",
    },
    {
      name: "Post Analytics",
      free: "✗",
      pro: "✓ Basic",
      creator: "✓ Advanced",
      enterprise: "✓ Custom",
    },
    {
      name: "Saved Drafts",
      free: "5",
      pro: "Unlimited",
      creator: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      name: "Team Members",
      free: "1",
      pro: "2",
      creator: "10",
      enterprise: "Unlimited",
    },
    {
      name: "API Access",
      free: "✗",
      pro: "✗",
      creator: "✓ Limited",
      enterprise: "✓ Full",
    },
    {
      name: "Custom Branding",
      free: "✗",
      pro: "✗",
      creator: "✓",
      enterprise: "✓",
    },
    {
      name: "Priority Support",
      free: "✗",
      pro: "✓",
      creator: "✓ 24/7",
      enterprise: "✓ Dedicated",
    },
    {
      name: "SLA Guarantee",
      free: "✗",
      pro: "✗",
      creator: "99.5%",
      enterprise: "99.99%",
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Detailed Feature Comparison</CardTitle>
        <CardDescription>
          See exactly what you get with each plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left font-semibold py-4 px-4">Feature</th>
                {pricingPlans.map((plan) => (
                  <th
                    key={plan.id}
                    className="text-center font-semibold py-4 px-4"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{plan.icon}</span>
                      <span>{plan.name}</span>
                    </div>
                    {plan.popular && (
                      <Badge
                        variant="outline"
                        className="mt-2 bg-primary/10 text-primary"
                      >
                        Popular
                      </Badge>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="font-medium py-4 px-4 text-foreground">
                    {feature.name}
                  </td>
                  {pricingPlans.map((plan) => {
                    const value =
                      feature[plan.id as keyof typeof feature] || "—"
                    const isCheck = value === "✓" || value?.includes("✓")
                    const isX = value === "✗" || value?.includes("✗")

                    return (
                      <td
                        key={plan.id}
                        className={`py-4 px-4 text-center ${
                          isX ? "text-muted-foreground opacity-50" : ""
                        }`}
                      >
                        {isCheck ? (
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto" />
                        ) : isX ? (
                          <X className="h-5 w-5 text-gray-400 dark:text-gray-600 mx-auto" />
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
