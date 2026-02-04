'use client';

import Link from 'next/link';

export function PricingSection() {
    return (
        <section id="pricing" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Simple, Transparent Pricing
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Choose the perfect plan for your content creation needs
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Free Plan */}
                    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">$0</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                3 posts/day
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                30 posts/month
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                3 version history
                            </li>
                        </ul>
                        <Link
                            href="/auth/signup"
                            className="block w-full px-6 py-3 bg-white/10 text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/50 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white text-sm font-semibold">
                            Popular
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">$19</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                20 posts/day
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                500 posts/month
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                10 version history
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                AI caching
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Templates
                            </li>
                        </ul>
                        <Link
                            href="/auth/signup"
                            className="block w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
                        >
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Creator Plan */}
                    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2">Creator</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">$49</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                100 posts/day
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                2,000 posts/month
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                50 version history
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Team workspaces
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Personal writing style
                            </li>
                        </ul>
                        <Link
                            href="/auth/signup"
                            className="block w-full px-6 py-3 bg-white/10 text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-all duration-300"
                        >
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">$199</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Unlimited posts
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Unlimited team members
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Priority support
                            </li>
                            <li className="flex items-center text-slate-300">
                                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Custom integrations
                            </li>
                        </ul>
                        <Link
                            href="/contact"
                            className="block w-full px-6 py-3 bg-white/10 text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-all duration-300"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
