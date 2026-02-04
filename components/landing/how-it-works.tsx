'use client';

import { useEffect, useRef, useState } from 'react';

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: '01',
      title: 'Choose Your Topic',
      description: 'Select what you want to write about and define your target audience. Our AI understands context and nuance.',
      icon: '🎯',
      details: [
        'Pick any professional topic',
        'Define your target audience',
        'Set your goals',
      ],
      color: 'from-indigo-500 to-purple-600',
    },
    {
      number: '02',
      title: 'Customize Your Style',
      description: 'Choose tone, length, and optionally use your personal writing style trained from your previous posts.',
      icon: '🎨',
      details: [
        'Select tone (Professional, Casual, Founder)',
        'Choose post length',
        'Apply personal writing style',
      ],
      color: 'from-purple-500 to-pink-600',
    },
    {
      number: '03',
      title: 'AI Generates Magic',
      description: 'Our advanced Gemini 1.5 Pro AI creates a perfectly crafted post with engagement scoring and smart hashtags.',
      icon: '✨',
      details: [
        'AI analyzes best practices',
        'Generates engaging content',
        'Scores engagement potential',
      ],
      color: 'from-pink-500 to-rose-600',
    },
    {
      number: '04',
      title: 'Refine & Publish',
      description: 'Review engagement score, edit if needed, track versions, and share your viral content on LinkedIn.',
      icon: '🚀',
      details: [
        'Review engagement score',
        'Edit and refine',
        'Track version history',
        'Publish to LinkedIn',
      ],
      color: 'from-rose-500 to-orange-600',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Auto-advance steps when section is visible
            const interval = setInterval(() => {
              setActiveStep((prev) => (prev + 1) % steps.length);
            }, 3000);
            return () => clearInterval(interval);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden" ref={sectionRef}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-indigo-300 text-sm font-medium">
              Simple 4-Step Process
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From idea to viral post in under 60 seconds
          </p>
        </div>

        {/* Desktop View - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-500 ${activeStep === index
                    ? 'bg-white/10 backdrop-blur-sm border-2 border-indigo-500/50 scale-105'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8'
                  }`}
              >
                {/* Active Indicator */}
                {activeStep === index && (
                  <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${activeStep === index ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                    <span className="text-3xl">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-indigo-400">{step.number}</span>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-3">
                      {step.description}
                    </p>

                    {/* Details - Show when active */}
                    <div className={`overflow-hidden transition-all duration-500 ${activeStep === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <ul className="space-y-2 mt-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Visual Preview */}
          <div className="relative">
            <div className="sticky top-24">
              {/* Main Card */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
                {/* Animated Glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${steps[activeStep].color} opacity-20 blur-2xl transition-all duration-500`} />

                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${steps[activeStep].color} text-white font-bold text-sm`}>
                      Step {steps[activeStep].number}
                    </div>
                    <div className="text-6xl animate-float">
                      {steps[activeStep].icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {steps[activeStep].title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    {steps[activeStep].description}
                  </p>

                  {/* Details */}
                  <div className="space-y-3">
                    {steps[activeStep].details.map((detail, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Dots */}
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`transition-all duration-300 rounded-full ${activeStep === index
                            ? 'w-8 h-2 bg-gradient-to-r from-indigo-500 to-purple-600'
                            : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Vertical Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Number Badge */}
              <div className="absolute -top-4 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/50">
                {step.number}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mt-4`}>
                <span className="text-4xl">{step.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Details */}
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
