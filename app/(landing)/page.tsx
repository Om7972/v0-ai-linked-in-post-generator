/**
 * Animated Landing Page
 * Features: Liquid morphing background, gradient animations, glassmorphism
 */

import Link from 'next/link';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ContentSuggestionsSection } from '@/components/landing/content-suggestions-section';
import { LiveDemoSection } from '@/components/landing/live-demo-section';
import { AnalyticsPreviewSection } from '@/components/landing/analytics-preview-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FAQSection } from '@/components/landing/faq-section';
import { CTASection } from '@/components/landing/cta-section';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export default function LandingPage() {
    return (
        <div className="relative min-h-screen bg-slate-950 overflow-hidden">
            <ScrollProgress />
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Liquid Morphing Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift" />

                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <nav className="border-b border-white/10 backdrop-blur-xl bg-slate-950/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">✨</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    AI Post Generator
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/auth/login"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <HeroSection />

                {/* Features Grid */}
                <FeaturesGrid />

                {/* How It Works */}
                <HowItWorks />

                {/* Content Suggestions */}
                <ContentSuggestionsSection />

                {/* Live Demo */}
                <LiveDemoSection />

                {/* Analytics Preview */}
                <AnalyticsPreviewSection />

                {/* Pricing */}
                <PricingSection />

                {/* Testimonials */}
                <TestimonialsSection />

                {/* FAQ */}
                <FAQSection />

                {/* Final CTA */}
                <CTASection />

                {/* Footer */}
                <footer className="border-t border-white/10 backdrop-blur-xl bg-slate-950/50 mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">✨</span>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                        AI Post Generator
                                    </span>
                                </div>
                                <p className="text-slate-400 max-w-md">
                                    Generate viral LinkedIn posts in seconds with AI-powered content creation, engagement scoring, and intelligent hashtags.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-4">Product</h3>
                                <ul className="space-y-2 text-slate-400">
                                    <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                                    <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                    <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-4">Company</h3>
                                <ul className="space-y-2 text-slate-400">
                                    <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                                    <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-400">
                            <p>&copy; 2026 AI Post Generator. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
