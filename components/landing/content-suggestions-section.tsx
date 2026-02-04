'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

export function ContentSuggestionsSection() {
    const [activeCategory, setActiveCategory] = useState('trending');

    const categories = [
        {
            id: 'trending',
            name: 'Trending Topics',
            icon: TrendingUp,
            color: 'from-pink-500 to-rose-600',
            suggestions: [
                { topic: 'AI & Machine Learning', engagement: 95, audience: '50K+' },
                { topic: 'Remote Work Culture', engagement: 88, audience: '35K+' },
                { topic: 'Personal Branding', engagement: 92, audience: '45K+' },
                { topic: 'Startup Funding', engagement: 85, audience: '30K+' },
            ],
        },
        {
            id: 'audience',
            name: 'By Audience',
            icon: Users,
            color: 'from-indigo-500 to-purple-600',
            suggestions: [
                { topic: 'Tech Founders', engagement: 90, audience: '40K+' },
                { topic: 'Marketing Professionals', engagement: 87, audience: '38K+' },
                { topic: 'HR Leaders', engagement: 84, audience: '32K+' },
                { topic: 'Sales Teams', engagement: 89, audience: '36K+' },
            ],
        },
        {
            id: 'viral',
            name: 'Viral Formats',
            icon: Zap,
            color: 'from-emerald-500 to-cyan-600',
            suggestions: [
                { topic: 'Lessons Learned', engagement: 93, audience: '48K+' },
                { topic: 'Behind the Scenes', engagement: 91, audience: '42K+' },
                { topic: 'Controversial Takes', engagement: 88, audience: '40K+' },
                { topic: 'Success Stories', engagement: 94, audience: '52K+' },
            ],
        },
    ];

    const activeData = categories.find((c) => c.id === activeCategory) || categories[0];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">
                            AI-Powered Suggestions
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Never Run Out of Ideas
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Get AI-curated content suggestions based on what's trending
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeCategory === category.id
                                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {activeData.suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient Glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${activeData.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

                            <div className="relative z-10">
                                {/* Topic */}
                                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                                    {suggestion.topic}
                                </h3>

                                {/* Stats */}
                                <div className="flex items-center gap-6">
                                    {/* Engagement Score */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-12 h-12">
                                            <svg className="transform -rotate-90 w-12 h-12">
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                    className="text-white/10"
                                                />
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    stroke="url(#gradient)"
                                                    strokeWidth="4"
                                                    fill="none"
                                                    strokeDasharray={`${suggestion.engagement * 1.26} 126`}
                                                    className="transition-all duration-1000"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#10b981" />
                                                        <stop offset="100%" stopColor="#06b6d4" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xs font-bold text-emerald-400">{suggestion.engagement}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">Engagement</div>
                                            <div className="text-sm font-semibold text-white">Score</div>
                                        </div>
                                    </div>

                                    {/* Audience Reach */}
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <div className="text-xs text-slate-400">Potential</div>
                                            <div className="text-sm font-semibold text-white">{suggestion.audience}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button className={`mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r ${activeData.color} text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Generate Post
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 animate-fade-in animation-delay-500">
                    <p className="text-slate-400 mb-4">
                        Get personalized suggestions based on your industry and audience
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105">
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Get Started Free
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
