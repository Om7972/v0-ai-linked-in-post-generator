"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
  children?: React.ReactNode
  variant?: "default" | "text" | "circle" | "rect"
}

export function Skeleton({
  className,
  isLoading = true,
  children,
  variant = "default",
  ...props
}: SkeletonProps) {
  if (!isLoading && children) {
    return <>{children}</>
  }

  if (!isLoading) {
    return null
  }

  const skeletonVariants = {
    default: "h-12 w-full rounded-md",
    text: "h-4 w-full rounded",
    circle: "h-12 w-12 rounded-full",
    rect: "h-48 w-full rounded-md",
  }

  return (
    <motion.div
      className={cn(
        "bg-muted/50 animate-pulse",
        skeletonVariants[variant],
        className
      )}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    />
  )
}

interface SkeletonGroupProps {
  count?: number
  variant?: "text" | "card" | "table"
  spacing?: "sm" | "md" | "lg"
}

export function SkeletonGroup({
  count = 3,
  variant = "text",
  spacing = "md",
}: SkeletonGroupProps) {
  const spacingMap = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  }

  if (variant === "text") {
    return (
      <motion.div
        className={`space-y-3 ${spacingMap[spacing]}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            <Skeleton variant="text" />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (variant === "card") {
    return (
      <motion.div
        className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="p-4 rounded-lg border border-border/50"
          >
            <Skeleton variant="rect" className="h-32 mb-4" />
            <Skeleton variant="text" className="mb-2" />
            <Skeleton variant="text" className="w-3/4" />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (variant === "table") {
    return (
      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="flex gap-4"
          >
            <Skeleton variant="circle" className="h-10 w-10" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return null
}
