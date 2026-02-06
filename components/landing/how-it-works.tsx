'use client';

import { useState } from 'react';

export function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Choose Your Topic',
      description: 'Select your subject and define your target audience. Our AI understands context and nuance.',
      icon: '🎯',
      accent: '#6366f1', // indigo
    },
    {
      number: '02',
      title: 'Customize Style',
      description: 'Pick your tone, length, and apply your personal writing style for authenticity.',
      icon: '🎨',
      accent: '#a855f7', // purple
    },
    {
      number: '03',
      title: 'AI Generates',
      description: 'Gemini 1.5 Pro creates engaging content with smart hashtags and engagement scoring.',
      icon: '✨',
      accent: '#ec4899', // pink
    },
    {
      number: '04',
      title: 'Refine & Publish',
      description: 'Review, edit, and share your perfectly crafted post directly to LinkedIn.',
      icon: '🚀',
      accent: '#f97316', // orange
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-indigo-950/20 to-slate-900/0 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Clean Section Header */}
        <div className="text-center mb-20">
          <p className="text-indigo-400 font-medium text-sm tracking-widest uppercase mb-4">
            Simple Process
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            From idea to viral post in under 60 seconds
          </p>
        </div>

        {/* Steps Grid - Clean 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Connection Line (Desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] right-0 h-[2px] bg-gradient-to-r from-slate-700 to-transparent z-0" />
              )}

              {/* Card */}
              <div
                className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/80 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                style={{
                  borderColor: hoveredStep === index ? `${step.accent}40` : undefined,
                }}
              >
                {/* Step Number */}
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold text-sm mb-5 transition-all duration-300"
                  style={{
                    backgroundColor: `${step.accent}20`,
                    color: step.accent,
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Subtle glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${step.accent}08 0%, transparent 70%)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: hoveredStep === index ? '2rem' : '0.5rem',
                  backgroundColor: hoveredStep === index ? step.accent : 'rgb(71 85 105)', // slate-600
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
