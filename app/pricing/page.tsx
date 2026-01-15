"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

import { BillingToggle } from "@/components/pricing/billing-toggle"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PricingComparison } from "@/components/pricing/pricing-comparison"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { pricingPlans } from "@/lib/pricing-data"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Sparkles className="h-3 w-3 mr-2" />
              Simple, Transparent Pricing
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-balance mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Choose Your Perfect Plan
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start free, upgrade when you need. No credit card required. Cancel
            anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </motion.div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pricingPlans.map((plan, idx) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              index={idx}
            />
          ))}
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <PricingComparison isYearly={isYearly} />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 my-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-border/50 bg-secondary/30 text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">🔒</p>
              <h3 className="font-semibold mt-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enterprise-grade security with data encryption
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-secondary/30 text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">⚡</p>
              <h3 className="font-semibold mt-2">Fast & Reliable</h3>
              <p className="text-sm text-muted-foreground mt-1">
                99.9% uptime SLA for uninterrupted service
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-secondary/30 text-center">
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">✨</p>
              <h3 className="font-semibold mt-2">Always Improving</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Regular updates and new features included
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <PricingFAQ />
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border border-primary/20 rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of content creators and professionals using PostGenius
            to grow their LinkedIn presence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Sparkles className="h-5 w-5" />
                Get Started Free
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                window.location.href = "mailto:sales@postgenius.com"
              }}
            >
              Contact Sales Team
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            ✓ No credit card required • ✓ Cancel anytime • ✓ 30-day money-back guarantee
          </p>
        </motion.div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All prices in USD. Taxes may apply.</p>
        </div>
      </div>
    </div>
  )
}
