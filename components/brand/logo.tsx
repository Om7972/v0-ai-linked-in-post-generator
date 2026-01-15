import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
  className?: string
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
}

/**
 * Main Logo Component
 * - Minimal, modern design
 * - AI spark + LinkedIn structure inspiration
 * - SVG-based for perfect scalability
 */
export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  if (variant === "icon") {
    return <LogoIcon size={size} className={className} />
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon size="md" />
      <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        AI Writer
      </span>
    </div>
  )
}

/**
 * Logo Icon Component (can be used standalone)
 */
export function LogoIcon({ size = "md", className }: Omit<LogoProps, "variant">) {
  const sizeClass = sizeMap[size]

  return (
    <svg
      className={cn("transition-transform duration-200", sizeClass, className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle background */}
      <circle cx="20" cy="20" r="19" fill="url(#gradient1)" opacity="0.1" />

      {/* Main icon: AI spark + pen hybrid */}
      {/* Spark/lightning bolt shape (AI element) */}
      <path
        d="M20 2L25 14H34L27 20L30 32L20 26L10 32L13 20L6 14H15L20 2Z"
        fill="url(#gradient1)"
        fillRule="evenodd"
      />

      {/* Subtle pen stroke (writing element) */}
      <path
        d="M28 12L32 8"
        stroke="url(#gradient2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A66C2" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#0A66C2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/**
 * Square Favicon Version (for app icon)
 */
export function LogoFavicon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="favGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A66C2" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      <rect width="180" height="180" rx="40" fill="url(#favGrad1)" />

      {/* Centered icon */}
      <g transform="translate(45, 45) scale(2.5)">
        <path
          d="M20 2L25 14H34L27 20L30 32L20 26L10 32L13 20L6 14H15L20 2Z"
          fill="white"
          fillRule="evenodd"
        />
        <path
          d="M28 12L32 8"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </g>
    </svg>
  )
}

export default Logo
