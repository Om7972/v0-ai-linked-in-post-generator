'use client';

import { Star } from 'lucide-react';

export function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Tech Founder',
            company: 'AI Startup',
            avatar: '👩‍💼',
            rating: 5,
            text: 'This tool has 10x my LinkedIn engagement. The personal writing style feature is a game-changer - posts sound exactly like me!',
        },
        {
            name: 'Michael Rodriguez',
            role: 'Content Creator',
            company: 'Digital Marketing',
            avatar: '👨‍💻',
            rating: 5,
            text: 'I went from spending 2 hours per post to 5 minutes. The engagement scoring helps me optimize before publishing. Absolutely worth it!',
        },
        {
            name: 'Emily Watson',
            role: 'HR Director',
            company: 'Fortune 500',
            avatar: '👩‍🎓',
            rating: 5,
            text: 'Our team uses this for employer branding. The team workspace and version history make collaboration seamless. Highly recommend!',
        },
        {
            name: 'David Kim',
            role: 'Sales Leader',
            company: 'SaaS Company',
            avatar: '👨‍💼',
            rating: 5,
            text: 'The hashtag intelligence is incredible. My posts now reach 3x more people. Best investment for my personal brand.',
        },
        {
            name: 'Lisa Anderson',
            role: 'Marketing Manager',
            company: 'E-commerce',
            avatar: '👩‍🔬',
            rating: 5,
            text: 'AI caching saves us time and money. We generate hundreds of posts monthly and the quality is consistently excellent.',
        },
        {
            name: 'James Taylor',
            role: 'Entrepreneur',
            company: 'Startup Founder',
            avatar: '👨‍🚀',
            rating: 5,
            text: 'Finally, an AI tool that doesn\'t sound robotic. The personal style training makes every post authentic and engaging.',
        },
    ];

    return (
        <section id="testimonials" className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Loved by Creators Worldwide
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Join thousands of professionals creating viral content
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-slate-400">
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '10,000+', label: 'Posts Generated' },
                        { value: '500+', label: 'Happy Users' },
                        { value: '95%', label: 'Engagement Increase' },
                        { value: '4.9/5', label: 'Average Rating' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
