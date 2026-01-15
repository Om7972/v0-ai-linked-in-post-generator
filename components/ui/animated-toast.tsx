"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react"
import { ReactNode, useEffect } from "react"

export type ToastVariant = "default" | "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: { label: string; onClick: () => void }
}

const variantConfig: Record<ToastVariant, { bg: string; icon: ReactNode; color: string }> = {
  default: {
    bg: "bg-slate-900",
    icon: <Info className="h-5 w-5" />,
    color: "text-blue-500",
  },
  success: {
    bg: "bg-green-900/20",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-green-500",
  },
  error: {
    bg: "bg-red-900/20",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-900/20",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-yellow-500",
  },
  info: {
    bg: "bg-blue-900/20",
    icon: <Info className="h-5 w-5" />,
    color: "text-blue-500",
  },
}

interface AnimatedToastProps extends Toast {
  onClose: (id: string) => void
}

export function AnimatedToast({
  id,
  title,
  description,
  variant = "default",
  duration = 4000,
  action,
  onClose,
}: AnimatedToastProps) {
  const config = variantConfig[variant]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${config.bg} border border-border/20 rounded-lg p-4 backdrop-blur-sm shadow-lg max-w-sm`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <motion.div
          className={config.color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {config.icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <p className="font-medium text-foreground">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-primary hover:text-primary/80 mt-2 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <motion.button
          onClick={() => onClose(id)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-b-lg"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          origin="left"
        />
      )}
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <AnimatedToast
              {...toast}
              onClose={onClose}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
