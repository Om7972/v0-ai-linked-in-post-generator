'use client';

export function FeaturesGrid() {
    const features = [
        {
            icon: '✨',
            title: 'AI-Powered Generation',
            description: 'Advanced Gemini 1.5 Pro creates engaging posts tailored to your audience',
            gradient: 'from-indigo-500 to-purple-600',
        },
        {
            icon: '📊',
            title: 'Engagement Scoring',
            description: 'Real-time scoring with 8-factor algorithm and actionable recommendations',
            gradient: 'from-purple-500 to-pink-600',
        },
        {
            icon: '⏱️',
            title: 'Version History',
            description: 'Track every change and rollback to any previous version instantly',
            gradient: 'from-pink-500 to-rose-600',
        },
        {
            icon: '#️⃣',
            title: 'Smart Hashtags',
            description: 'AI categorizes hashtags by niche, broad, trending, and branded',
            gradient: 'from-rose-500 to-orange-600',
        },
        {
            icon: '📝',
            title: 'Template Library',
            description: 'Role-based templates for founders, recruiters, influencers, and more',
            gradient: 'from-orange-500 to-amber-600',
        },
        {
            icon: '⚡',
            title: 'AI Caching',
            description: 'Instant results with intelligent response caching (40-60% cost reduction)',
            gradient: 'from-amber-500 to-yellow-600',
        },
        {
            icon: '🎨',
            title: 'Personal Writing Style',
            description: 'Train AI on your voice - paste 3-5 posts and maintain your unique style',
            gradient: 'from-emerald-500 to-cyan-600',
        },
        {
            icon: '👥',
            title: 'Team Workspaces',
            description: 'Collaborate with your team on content creation with role-based access',
            gradient: 'from-cyan-500 to-blue-600',
        },
    ];

    return (
        <section id="features" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Everything you need to create viral LinkedIn content
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient Glow on Hover */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Corner Accent */}
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
