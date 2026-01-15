"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface NavLinkProps {
  href: string
  children: ReactNode
  active?: boolean
  className?: string
  onClick?: () => void
}

/**
 * Navigation Link Component
 * - Smooth hover underline animation
 * - Active state indicator
 * - Accessible focus states
 */
export function NavLink({ href, children, active = false, className, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
        "text-gray-600 dark:text-gray-300 hover:text-foreground dark:hover:text-white",
        active && "text-blue-600 dark:text-blue-400",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black rounded-md",
        className
      )}
    >
      {children}

      {/* Animated underline */}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out",
          active ? "w-full" : "w-0 group-hover:w-full"
        )}
      />

      {/* Hover underline effect */}
      <style jsx>{`
        a:hover span {
          width: 100%;
        }
      `}</style>
    </a>
  )
}

export default NavLink
