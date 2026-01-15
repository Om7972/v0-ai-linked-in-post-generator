export const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to LinkedIn Post Generator! 🎉",
    description: "Let's take a quick tour to get you started creating engaging LinkedIn posts.",
    target: null,
    action: "click-next",
  },
  {
    id: "form",
    title: "Write Your Post",
    description: "Start by entering your topic or idea. You can write about anything - your insights, updates, or industry news.",
    target: "topic-input",
    position: "bottom" as const,
    tip: "Make your topic specific for better results",
  },
  {
    id: "audience",
    title: "Choose Your Audience",
    description: "Select who you're writing for. This helps tailor the tone and content to resonate with your target audience.",
    target: "audience-select",
    position: "bottom" as const,
    tip: "Different audiences = different tones",
  },
  {
    id: "tone",
    title: "Pick Your Tone",
    description: "Choose a tone that matches your brand. Professional, Founder, Influencer, or Casual - whatever fits your style!",
    target: "tone-tabs",
    position: "bottom" as const,
    tip: "Switch between tones to find your voice",
  },
  {
    id: "generate",
    title: "Generate Your Post",
    description: "Click the 'Generate Post' button and our AI will create an engaging LinkedIn post tailored to your preferences.",
    target: "generate-button",
    position: "top" as const,
    tip: "Takes just a few seconds",
  },
  {
    id: "result",
    title: "Your Generated Post",
    description: "Here's your AI-generated post with engagement score. Edit, copy, or save it. You can regenerate anytime!",
    target: "post-result",
    position: "left" as const,
    tip: "Engagement score shows post quality",
  },
  {
    id: "dashboard",
    title: "Track Your Success",
    description: "Visit the Dashboard to see your post analytics, engagement trends, and manage all your posts in one place.",
    target: null,
    action: "highlight-dashboard",
  },
]

export const faqItems = [
  {
    question: "How does the AI generate posts?",
    answer: "Our AI uses advanced language models trained on successful LinkedIn posts to generate content that's engaging and authentic to your voice.",
  },
  {
    question: "Can I edit the generated posts?",
    answer: "Absolutely! Every generated post can be edited directly. We encourage you to add your personal touch.",
  },
  {
    question: "What's the engagement score?",
    answer: "The engagement score (0-100) predicts how well your post might perform based on factors like length, CTAs, hashtags, and formatting.",
  },
  {
    question: "Can I try a sample post first?",
    answer: "Yes! We've prepared a sample post showing what you can generate. Feel free to explore different tones and settings.",
  },
]
