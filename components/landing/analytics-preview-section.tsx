'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, BarChart3 } from 'lucide-react';

export function AnalyticsPreviewSection() {
    const [animatedStats, setAnimatedStats] = useState({
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
    });

    const targetStats = {
        views: 12547,
        likes: 1834,
        comments: 342,
        shares: 156,
    };

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setAnimatedStats({
                views: Math.floor(targetStats.views * progress),
                likes: Math.floor(targetStats.likes * progress),
                comments: Math.floor(targetStats.comments * progress),
                shares: Math.floor(targetStats.shares * progress),
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setAnimatedStats(targetStats);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const metrics = [
        {
            icon: Eye,
            label: 'Views',
            value: animatedStats.views.toLocaleString(),
            change: '+245%',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: Heart,
            label: 'Likes',
            value: animatedStats.likes.toLocaleString(),
            change: '+189%',
            color: 'from-pink-500 to-rose-600',
            bgColor: 'bg-pink-500/10',
        },
        {
            icon: MessageCircle,
            label: 'Comments',
            value: animatedStats.comments.toLocaleString(),
            change: '+156%',
            color: 'from-purple-500 to-indigo-600',
            bgColor: 'bg-purple-500/10',
        },
        {
            icon: Share2,
            label: 'Shares',
            value: animatedStats.shares.toLocaleString(),
            change: '+203%',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-500/10',
        },
    ];

    const weeklyData = [
        { day: 'Mon', value: 65 },
        { day: 'Tue', value: 78 },
        { day: 'Wed', value: 90 },
        { day: 'Thu', value: 72 },
        { day: 'Fri', value: 95 },
        { day: 'Sat', value: 58 },
        { day: 'Sun', value: 82 },
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6">
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 text-sm font-medium">
                            Real-Time Analytics
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Track Your Success
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Monitor engagement, analyze performance, and optimize your content strategy
                    </p>
                </div>

                {/* Main Analytics Dashboard */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Left: Stats Cards */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Gradient Glow */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-6 h-6 bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                                        </div>

                                        {/* Value */}
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {metric.value}
                                        </div>

                                        {/* Label & Change */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">{metric.label}</span>
                                            <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                {metric.change}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Weekly Chart */}
                    <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-fade-in animation-delay-500">
                        <h3 className="text-lg font-semibold text-white mb-6">Weekly Engagement</h3>

                        <div className="flex items-end justify-between h-40 gap-2">
                            {weeklyData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="relative w-full bg-white/10 rounded-t-lg overflow-hidden group cursor-pointer">
                                        <div
                                            className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-1000 hover:from-indigo-400 hover:to-purple-500"
                                            style={{
                                                height: `${data.value}%`,
                                                animationDelay: `${index * 100}ms`,
                                            }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {data.value}%
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">{data.day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                            <span>Engagement Rate</span>
                        </div>
                    </div>
                </div>

                {/* Bottom: Insights Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Best Time to Post',
                            value: 'Tuesday, 10 AM',
                            icon: '🕐',
                            description: 'Peak engagement window',
                        },
                        {
                            title: 'Top Performing Topic',
                            value: 'AI & Technology',
                            icon: '🎯',
                            description: '95% engagement rate',
                        },
                        {
                            title: 'Audience Growth',
                            value: '+2,847 followers',
                            icon: '📈',
                            description: 'This month',
                        },
                    ].map((insight, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${(index + 4) * 100}ms` }}
                        >
                            <div className="text-4xl mb-3">{insight.icon}</div>
                            <div className="text-sm text-slate-400 mb-1">{insight.title}</div>
                            <div className="text-2xl font-bold text-white mb-1">{insight.value}</div>
                            <div className="text-xs text-slate-500">{insight.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
