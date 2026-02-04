'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'How does the AI generation work?',
            answer: 'Our AI uses Google Gemini 1.5 Pro to analyze your topic, audience, and tone preferences. It generates authentic LinkedIn posts that match your requirements, complete with engagement scoring and intelligent hashtags.',
        },
        {
            question: 'Can I customize the AI templates?',
            answer: 'Yes! Pro and higher plans include access to role-based templates (Founder, Recruiter, Influencer, etc.) and the ability to create custom templates. You can also train the AI on your personal writing style.',
        },
        {
            question: 'What\'s included in the free plan?',
            answer: 'The free plan includes 3 posts per day (30/month), basic engagement scoring, 3 hashtags per post, and 3 version history. It\'s perfect for trying out the platform and generating quality content.',
        },
        {
            question: 'How does version history work?',
            answer: 'Every time you generate or edit a post, we automatically save a version. You can view all versions and rollback to any previous version with one click. Version limits depend on your plan.',
        },
        {
            question: 'Can I use this for my team?',
            answer: 'Yes! Creator and Enterprise plans include team workspaces with role-based access control. Team members can collaborate on content creation with granular permissions.',
        },
        {
            question: 'What is Personal Writing Style?',
            answer: 'This premium feature lets you paste 3-5 of your LinkedIn posts, and the AI learns your unique voice - tone, sentence structure, emoji usage, and more. Future posts will match your authentic style.',
        },
        {
            question: 'How does AI caching save costs?',
            answer: 'When you generate similar posts, we cache the AI responses for 7 days. This means instant results and 40-60% reduction in API costs. Available on Pro+ plans.',
        },
        {
            question: 'Can I cancel anytime?',
            answer: 'Absolutely! There are no long-term contracts. You can cancel your subscription at any time, and you\'ll retain access until the end of your billing period.',
        },
    ];

    return (
        <section id="faq" className="py-20 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Everything you need to know about AI-powered LinkedIn post generation
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <span className="text-lg font-semibold text-white pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 text-slate-300 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-12 text-center">
                    <p className="text-slate-400 mb-4">Still have questions?</p>
                    <a
                        href="mailto:support@example.com"
                        className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                        Contact our support team →
                    </a>
                </div>
            </div>
        </section>
    );
}
