/**
 * Pricing Plans Data
 * Conversion-optimized pricing structure
 */

export interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  monthlyBillingPrice?: number // For yearly display
  popular: boolean
  cta: string
  features: Feature[]
  icon: string
}

export interface Feature {
  name: string
  included: boolean
  description?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    cta: "Get Started",
    icon: "🚀",
    features: [
      { name: "5 posts/month", included: true },
      { name: "Basic tone control", included: true },
      { name: "Engagement score", included: true },
      { name: "5 saved drafts", included: true },
      { name: "Post analytics", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Team access", included: false },
      { name: "API access", included: false },
      { name: "Custom branding", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for professionals",
    monthlyPrice: 29,
    yearlyPrice: 290,
    monthlyBillingPrice: 24.17,
    popular: true,
    cta: "Start 7-Day Trial",
    icon: "⚡",
    features: [
      { name: "Unlimited posts", included: true },
      { name: "All tone controls", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Unlimited drafts", included: true },
      { name: "Post analytics", included: true },
      { name: "Engagement trends", included: true },
      { name: "Team access (2 users)", included: true },
      { name: "API access", included: false },
      { name: "Custom branding", included: false },
      { name: "Priority support", included: true },
    ],
  },
  {
    id: "creator",
    name: "Creator",
    description: "For content creators & agencies",
    monthlyPrice: 79,
    yearlyPrice: 790,
    monthlyBillingPrice: 65.83,
    popular: false,
    cta: "Start 7-Day Trial",
    icon: "👑",
    features: [
      { name: "Unlimited posts", included: true },
      { name: "All tone controls", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Unlimited drafts", included: true },
      { name: "Multi-account management", included: true },
      { name: "Engagement trends", included: true },
      { name: "Team access (10 users)", included: true },
      { name: "API access", included: true },
      { name: "Custom branding", included: true },
      { name: "24/7 Priority support", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: null as any,
    yearlyPrice: null as any,
    popular: false,
    cta: "Contact Sales",
    icon: "🏢",
    features: [
      { name: "Unlimited posts", included: true },
      { name: "All tone controls", included: true },
      { name: "Custom analytics", included: true },
      { name: "Unlimited drafts", included: true },
      { name: "Unlimited accounts", included: true },
      { name: "Advanced workflows", included: true },
      { name: "Unlimited team access", included: true },
      { name: "Custom API", included: true },
      { name: "White-label solution", included: true },
      { name: "Dedicated account manager", included: true },
    ],
  },
]

// Comparison table features
export const comparisonFeatures = [
  {
    category: "Core Features",
    items: [
      "Monthly post limit",
      "Tone selection",
      "Engagement scoring",
      "Hashtag generation",
    ],
  },
  {
    category: "Analytics",
    items: [
      "Basic analytics",
      "Advanced analytics",
      "Performance trends",
      "Custom reports",
    ],
  },
  {
    category: "Collaboration",
    items: [
      "Saved drafts",
      "Team access",
      "Multi-account management",
      "Custom roles & permissions",
    ],
  },
  {
    category: "Developer",
    items: ["API access", "Webhooks", "Custom integrations", "Bulk operations"],
  },
  {
    category: "Support",
    items: [
      "Email support",
      "Priority support",
      "24/7 support",
      "Dedicated manager",
    ],
  },
]

// FAQ data
export const faqItems = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for enterprise plans.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "The Free plan is always available. Pro and Creator plans include a 7-day free trial with full access.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Pay yearly and save up to 17% compared to monthly billing. Plus, get an extra month free with annual plans.",
  },
  {
    question: "What about refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your subscription fee, no questions asked.",
  },
  {
    question: "Can I add more team members?",
    answer:
      "Absolutely! Each plan includes a set number of team members, but you can add more for a small fee per user.",
  },
]
