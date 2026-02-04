"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10 md:pt-32 md:pb-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Powered by Gemini AI</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight"
        >
          Write Viral LinkedIn Posts in Seconds
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          AI-powered LinkedIn content generator that crafts engaging, professional posts tailored to your audience. Transform your ideas into viral content instantly.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link href="/generate">
            <Button
              size="lg"
              className="relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 px-8 text-base font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Generating Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 group-hover:-inset-2 transition duration-500" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold border-gray-600 hover:border-gray-400 hover:bg-gray-900/50 backdrop-blur-sm"
          >
            See Examples
          </Button>
        </motion.div>

        {/* Floating mockup */}
        <motion.div
          variants={floatingVariants}
          initial="initial"
          animate="animate"
          className="relative mx-auto max-w-3xl"
        >
          <div className="relative rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Glow border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* LinkedIn post mockup */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                <div>
                  <div className="h-4 w-32 bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-800 rounded mt-1" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 mb-4">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-700 rounded w-4/5" />
              </div>

              {/* Image placeholder */}
              <div className="h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center border border-gray-700/50">
                <span className="text-gray-500 text-sm">AI-Generated Content Preview</span>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm text-gray-400">
                <div className="h-3 w-16 bg-gray-700 rounded" />
                <div className="h-3 w-16 bg-gray-700 rounded" />
                <div className="h-3 w-16 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
