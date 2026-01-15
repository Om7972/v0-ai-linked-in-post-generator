"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BillingToggleProps {
  isYearly: boolean
  onToggle: (yearly: boolean) => void
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <span className={`text-lg font-semibold ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>

        {/* Toggle Switch */}
        <button
          title="Toggle billing period"
          onClick={() => onToggle(!isYearly)}
          className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
            isYearly
              ? "bg-gradient-to-r from-blue-600 to-purple-600"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg"
            style={{
              x: isYearly ? 32 : 0,
            }}
          />
        </button>

        <span className={`text-lg font-semibold ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly
        </span>
      </div>

      {/* Savings Badge */}
      {isYearly && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-4 py-2 text-sm font-semibold">
            💰 Save up to 17%
          </Badge>
        </motion.div>
      )}
    </div>
  )
}
