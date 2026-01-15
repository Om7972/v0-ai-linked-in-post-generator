"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { PricingPlan } from "@/lib/pricing-data"

interface PricingCardProps {
  plan: PricingPlan
  isYearly: boolean
  index: number
}

export function PricingCard({ plan, isYearly, index }: PricingCardProps) {
  const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const monthlyBillingPrice = isYearly ? plan.monthlyBillingPrice : undefined

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: index * 0.1 },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={plan.popular ? { y: -8 } : { y: -4 }}
      className={cn(
        "relative rounded-2xl border transition-all duration-300",
        plan.popular
          ? "border-primary/50 bg-gradient-to-br from-primary/10 via-card to-card shadow-xl"
          : "border-border/50 bg-card hover:shadow-lg"
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1.5">
            ⭐ Most Popular
          </Badge>
        </div>
      )}

      {/* Background Glow Effect */}
      {plan.popular && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
      )}

      <div className="relative p-8 space-y-8">
        {/* Header */}
        <div>
          <div className="text-4xl mb-3">{plan.icon}</div>
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {plan.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          {displayPrice !== null ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">
                  ${displayPrice}
                </span>
                <span className="text-muted-foreground">
                  {isYearly ? "/year" : "/month"}
                </span>
              </div>
              {monthlyBillingPrice && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  💰 Equivalent to ${monthlyBillingPrice.toFixed(2)}/month when billed yearly
                </p>
              )}
              {isYearly && plan.monthlyPrice > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  ✨ Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)}/year
                </p>
              )}
            </>
          ) : (
            <p className="text-3xl font-bold">Custom</p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className={cn(
            "w-full group relative overflow-hidden transition-all duration-300",
            plan.popular
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {plan.cta}
            {plan.cta !== "Contact Sales" && (
              <span className="text-lg">→</span>
            )}
          </span>

          {/* Glow Effect on Button */}
          {plan.popular && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30 blur transition-opacity" />
          )}
        </Button>

        {/* Features List */}
        <div className="space-y-3 border-t border-border/50 pt-8">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    feature.included
                      ? "text-foreground"
                      : "text-muted-foreground line-through opacity-60"
                  )}
                >
                  {feature.name}
                </p>
                {feature.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
