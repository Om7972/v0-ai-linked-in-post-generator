"use client"

import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { LivePreview } from "@/components/landing/live-preview"
import { SocialProof } from "@/components/landing/social-proof"
import { CTABanner } from "@/components/landing/cta-banner"
import { Footer } from "@/components/landing/footer"

export function LandingPage() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <LivePreview />
      <SocialProof />
      <CTABanner />
      <Footer />
    </main>
  )
}
