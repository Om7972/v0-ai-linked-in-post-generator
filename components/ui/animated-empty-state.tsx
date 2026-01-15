"use client"

import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  variant?: "default" | "error" | "success" | "info"
}

const variantConfig = {
  default: {
    bg: "bg-secondary/30",
    icon: <AlertCircle className="h-12 w-12 text-muted-foreground" />,
  },
  error: {
    bg: "bg-red-500/10",
    icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
  },
  success: {
    bg: "bg-green-500/10",
    icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
  },
  info: {
    bg: "bg-blue-500/10",
    icon: <Info className="h-12 w-12 text-blue-500" />,
  },
}

export function AnimatedEmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const config = variantConfig[variant]

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-12 rounded-lg border border-border/50 ${config.bg}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Icon with bounce animation */}
      <motion.div
        className="mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {icon || config.icon}
      </motion.div>

      {/* Text content */}
      <motion.div
        className="text-center space-y-2 mb-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </motion.div>

      {/* Action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export function LoadingEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-border/30 border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="text-sm text-muted-foreground"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </motion.div>
  )
}
