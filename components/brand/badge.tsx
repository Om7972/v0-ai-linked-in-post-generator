import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface BrandBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * AI Powered Badge Component
 * Used in hero sections, pricing cards, feature highlights
 */
export function BrandBadge({ className, size = "md" }: BrandBadgeProps) {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs gap-1.5",
    md: "px-4 py-1.5 text-sm gap-2",
    lg: "px-5 py-2 text-base gap-2.5",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full",
        "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
        "border border-blue-500/30 backdrop-blur-sm",
        "hover:border-blue-500/50 transition-colors",
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className={cn("text-blue-400", iconSizes[size])} />
      <span className="font-medium text-blue-300">AI Powered</span>
    </div>
  )
}

interface AvatarProps {
  initials?: string
  size?: "sm" | "md" | "lg" | "xl"
  showAIBadge?: boolean
  className?: string
  image?: string
}

const avatarSizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
}

const badgeSizeMap = {
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-4 h-4",
  xl: "w-5 h-5",
}

/**
 * Brand Avatar Component
 * - Circular profile avatar
 * - Gradient background
 * - Optional AI badge overlay
 */
export function BrandAvatar({
  initials = "AI",
  size = "md",
  showAIBadge = true,
  className,
  image,
}: AvatarProps) {
  return (
    <div className="relative inline-block">
      {/* Avatar circle */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-gradient-to-br from-blue-500 to-purple-600",
          "text-white font-semibold",
          avatarSizeMap[size],
          className
        )}
      >
        {image ? (
          <img src={image} alt={initials} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className={size === "xl" ? "text-2xl" : size === "lg" ? "text-lg" : "text-sm"}>
            {initials}
          </span>
        )}
      </div>

      {/* AI Badge overlay */}
      {showAIBadge && (
        <div
          className={cn(
            "absolute -bottom-1 -right-1 rounded-full",
            "bg-gradient-to-r from-blue-600 to-purple-600",
            "border-2 border-white dark:border-gray-950",
            "flex items-center justify-center",
            badgeSizeMap[size]
          )}
        >
          <Sparkles className="w-1.5 h-1.5 text-white" />
        </div>
      )}
    </div>
  )
}

export default BrandBadge
