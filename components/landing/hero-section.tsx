'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export function HeroSection() {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // Animate title on load
        if (titleRef.current) {
            const words = titleRef.current.querySelectorAll('.word');
            words.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.add('animate-fade-in-up');
                }, index * 100);
            });
        }
    }, []);

    return (
        <section className="relative py-20 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-indigo-300 text-sm font-medium">
                            AI-Powered • Real-time • Production-Ready
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1
                        ref={titleRef}
                        className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="word inline-block opacity-0 bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                            Generate{' '}
                        </span>
                        <span className="word inline-block opacity-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                            Viral{' '}
                        </span>
                        <span className="word inline-block opacity-0 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                            LinkedIn Posts
                        </span>
                        <br />
                        <span className="word inline-block opacity-0 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            in{' '}
                        </span>
                        <span className="word inline-block opacity-0 relative">
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Seconds
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0,4 Q25,0 50,4 T100,4" stroke="url(#gradient)" strokeWidth="3" fill="none" className="animate-draw-line" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto animate-fade-in animation-delay-500">
                        AI-powered content creation with{' '}
                        <span className="text-indigo-400 font-semibold">engagement scoring</span>,{' '}
                        <span className="text-purple-400 font-semibold">version history</span>, and{' '}
                        <span className="text-pink-400 font-semibold">intelligent hashtags</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in animation-delay-700">
                        <Link
                            href="/auth/signup"
                            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center">
                                Start Free
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link
                            href="#demo"
                            className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Watch Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in animation-delay-1000">
                        {[
                            { value: '10,000+', label: 'Posts Generated' },
                            { value: '95%', label: 'Engagement Increase' },
                            { value: '500+', label: 'Happy Users' },
                            { value: '4.9/5', label: 'Star Rating' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105"
                            >
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 animate-float">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>

                    <div className="absolute top-40 right-10 animate-float animation-delay-1000">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center">
                            <span className="text-3xl">🚀</span>
                        </div>
                    </div>

                    <div className="absolute bottom-20 left-1/4 animate-float animation-delay-2000">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-indigo-500/20 backdrop-blur-sm border border-pink-500/30 flex items-center justify-center">
                            <span className="text-xl">💡</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
