'use client';

import Link from 'next/link';

export function CTASection() {
    return (
        <section className="py-20 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative p-12 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 overflow-hidden">
                    {/* Animated Background Orbs */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                                Ready to Create Viral Content?
                            </span>
                        </h2>

                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of creators using AI to generate engaging LinkedIn posts in seconds
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/auth/signup"
                                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105"
                            >
                                <span className="relative z-10 flex items-center">
                                    Start Free Today
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <Link
                                href="#pricing"
                                className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                View Pricing
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Free forever plan</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
