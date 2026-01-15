"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Marketing Director",
    company: "TechStart Inc",
    text: "This tool saved me 20+ hours monthly on content creation. The AI suggestions are incredibly accurate and help me maintain consistency.",
    rating: 5,
    initials: "SC",
  },
  {
    name: "Marcus Johnson",
    title: "Startup Founder",
    company: "Growth Labs",
    text: "Finally, a tool that actually understands LinkedIn. My posts now get 3x more engagement. This is a game-changer for solo entrepreneurs.",
    rating: 5,
    initials: "MJ",
  },
  {
    name: "Emma Rodriguez",
    title: "Content Strategist",
    company: "Digital Agency",
    text: "The quality of generated content is exceptional. My clients have noticed immediate improvements in their LinkedIn presence.",
    rating: 5,
    initials: "ER",
  },
  {
    name: "Alex Kumar",
    title: "B2B SaaS CEO",
    company: "CloudFlow",
    text: "Best investment for my personal brand. The AI understands industry nuances and generates posts that resonate with my audience.",
    rating: 5,
    initials: "AK",
  },
]

export function SocialProof() {
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />

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
            Trusted by Professionals
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of marketers and creators boosting their LinkedIn presence
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="relative">
                {/* Gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500" />

                {/* Card */}
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-2xl p-8 transition-all duration-300">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.title} at {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="mt-4 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
