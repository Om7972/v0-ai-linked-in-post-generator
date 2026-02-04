'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Hash, Clock } from 'lucide-react';

export function LiveDemoSection() {
    const [activeDemo, setActiveDemo] = useState<'generation' | 'scoring' | 'hashtags' | 'versions'>('generation');

    const demoContent = {
        generation: {
            title: 'AI Post Generation',
            description: 'Watch how AI creates engaging content in seconds',
            example: {
                input: {
                    topic: 'AI in SaaS',
                    audience: 'Tech Founders',
                    tone: 'Founder',
                },
                output: `🚀 We just crossed 10,000 users!

Here's what I learned building an AI-powered SaaS from scratch:

1. Ship fast, iterate faster
2. Listen to your users obsessively
3. AI is a tool, not a replacement for strategy

The biggest surprise? Our users wanted simplicity over features.

What's your biggest lesson from building in public?`,
            },
        },
        scoring: {
            title: 'Engagement Scoring',
            description: '8-factor algorithm predicts post performance',
            score: 87,
            factors: [
                { name: 'Content Length', score: 90, color: 'emerald' },
                { name: 'Readability', score: 85, color: 'blue' },
                { name: 'Structure', score: 92, color: 'purple' },
                { name: 'CTA Strength', score: 88, color: 'pink' },
            ],
        },
        hashtags: {
            title: 'Smart Hashtags',
            description: 'AI categorizes hashtags for maximum reach',
            hashtags: [
                { tag: '#AI', category: 'trending', reach: 'high', relevance: 95 },
                { tag: '#SaaS', category: 'broad', reach: 'high', relevance: 88 },
                { tag: '#TechFounders', category: 'niche', reach: 'medium', relevance: 92 },
            ],
        },
        versions: {
            title: 'Version History',
            description: 'Track every change and rollback anytime',
            versions: [
                { number: 3, type: 'regenerate', date: '2 min ago' },
                { number: 2, type: 'refine', date: '5 min ago' },
                { number: 1, type: 'initial', date: '10 min ago' },
            ],
        },
    };

    return (
        <section id="demo" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            See It In Action
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Experience the power of AI-driven content creation
                    </p>
                </div>

                {/* Demo Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { id: 'generation', icon: Sparkles, label: 'Generation' },
                        { id: 'scoring', icon: TrendingUp, label: 'Scoring' },
                        { id: 'hashtags', icon: Hash, label: 'Hashtags' },
                        { id: 'versions', icon: Clock, label: 'Versions' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveDemo(tab.id as any)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeDemo === tab.id
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Demo Content */}
                <div className="max-w-4xl mx-auto">
                    {activeDemo === 'generation' && (
                        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                            <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                                <h3 className="text-lg font-semibold mb-4 text-white">Input</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-slate-400">Topic:</span>
                                        <div className="text-white">{demoContent.generation.example.input.topic}</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-400">Audience:</span>
                                        <div className="text-white">{demoContent.generation.example.input.audience}</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-400">Tone:</span>
                                        <div className="text-white">{demoContent.generation.example.input.tone}</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                                <h3 className="text-lg font-semibold mb-4 text-white">Generated Post</h3>
                                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                                    {demoContent.generation.example.output}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeDemo === 'scoring' && (
                        <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 animate-fade-in">
                            <div className="text-center mb-8">
                                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    {demoContent.scoring.score}
                                </div>
                                <div className="text-slate-400">Engagement Score</div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {demoContent.scoring.factors.map((factor, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{factor.name}</span>
                                            <span className="text-slate-400">{factor.score}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r from-${factor.color}-400 to-${factor.color}-600 transition-all duration-1000`}
                                                style={{ width: `${factor.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeDemo === 'hashtags' && (
                        <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 animate-fade-in">
                            <div className="space-y-4">
                                {demoContent.hashtags.hashtags.map((hashtag, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xl font-semibold text-indigo-400">{hashtag.tag}</span>
                                            <Badge className="bg-indigo-500">{hashtag.category}</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-slate-400">Reach:</span>
                                                <span className="text-white ml-2 capitalize">{hashtag.reach}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400">Relevance:</span>
                                                <span className="text-white ml-2">{hashtag.relevance}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeDemo === 'versions' && (
                        <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 animate-fade-in">
                            <div className="space-y-3">
                                {demoContent.versions.versions.map((version, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                    v{version.number}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium capitalize">{version.type}</div>
                                                    <div className="text-sm text-slate-400">{version.date}</div>
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <Badge className="bg-emerald-500">Current</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    );
}
