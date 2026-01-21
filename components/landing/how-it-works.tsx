"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Share Your Topic",
    description: "Tell us what you want to write about or paste your raw ideas",
  },
  {
    number: "02",
    title: "Choose Your Style",
    description: "Select your desired tone, audience, and content length",
  },
  {
    number: "03",
    title: "AI Generates Content",
    description: "Our Gemini AI creates multiple variations instantly",
  },
  {
    number: "04",
    title: "Refine & Optimize",
    description: "Edit, refine, and get AI suggestions for engagement",
  },
  {
    number: "05",
    title: "Get Hashtags",
    description: "Auto-generate relevant hashtags for maximum visibility",
  },
  {
    number: "06",
    title: "Post & Track",
    description: "Copy to clipboard or connect your LinkedIn account",
  },
]

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section id="how-it-works" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Six simple steps to viral LinkedIn posts
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="space-y-8 md:space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex gap-6 md:gap-8"
            >
              {/* Timeline indicator */}
              <div className="flex flex-col items-center gap-4 flex-shrink-0">
                {/* Circle with number */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Pulse effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{ scale: 1.2, opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Connector line */}
                {index !== steps.length - 1 && (
                  <div className="w-1 h-16 bg-gradient-to-b from-blue-600 to-purple-600 opacity-30" />
                )}
              </div>

              {/* Content */}
              <div className="pt-2 pb-8 md:pb-12">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-lg">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-300">
              Start creating in under 1 minute
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
