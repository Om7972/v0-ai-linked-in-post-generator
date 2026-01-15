"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageCircle, Share2, Heart } from "lucide-react"

export function LivePreview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const samplePosts = [
    {
      title: "Professional Growth",
      content:
        "Just realized that the best investment is in yourself. 📚 Spent the last 6 months learning AI and automation. The ROI? Priceless. Your skills are your currency in 2025.",
      emoji: "🚀",
    },
    {
      title: "Industry Insights",
      content:
        "5 things I learned about AI in the workplace: 1. It's not about replacing humans, it's about augmenting capabilities. 2. The learning curve is shorter than you think. 3. Experimentation is key. What's your take?",
      emoji: "🧠",
    },
    {
      title: "Success Story",
      content:
        "From 0 to 1000+ saves in 30 days. Here's what worked: be authentic, provide value, engage consistently. No growth hacks, just genuine connection. Your network is your net worth.",
      emoji: "💎",
    },
  ]

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Live AI Preview
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See real examples of AI-generated LinkedIn posts that drive engagement
          </p>
        </motion.div>

        {/* Preview Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {samplePosts.map((post, index) => (
            <motion.div
              key={index}
              variants={contentVariants}
              className="group"
            >
              <div className="relative">
                {/* Gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />

                {/* Card */}
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-2xl p-6 md:p-8 transition-all duration-300">
                  {/* Post header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-lg font-bold text-white">
                      {post.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{post.title}</p>
                      <p className="text-sm text-gray-500">AI Generated</p>
                    </div>
                  </div>

                  {/* Post content */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Engagement stats */}
                  <div className="flex gap-4 text-sm text-gray-400 border-t border-gray-800 pt-4">
                    <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group/btn">
                      <ThumbsUp className="w-4 h-4 group-hover/btn:fill-current" />
                      <span>342</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-green-400 transition-colors group/btn">
                      <MessageCircle className="w-4 h-4" />
                      <span>89</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-pink-400 transition-colors group/btn">
                      <Heart className="w-4 h-4 group-hover/btn:fill-current" />
                      <span>156</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-purple-400 transition-colors group/btn ml-auto" title="Copy post">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-8 mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            { number: "10K+", label: "Posts Generated" },
            { number: "95%", label: "User Satisfaction" },
            { number: "3.2x", label: "Avg Engagement Boost" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
