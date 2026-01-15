"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { faqItems } from "@/lib/pricing-data"

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Find answers to common questions about our pricing and plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const itemId = `faq-${idx}`
            const isOpen = openItems.includes(itemId)

            return (
              <motion.div
                key={idx}
                className="border border-border/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(itemId)}
                  className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-semibold text-left">{item.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-secondary/30 border-t border-border/50 text-sm text-muted-foreground">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
