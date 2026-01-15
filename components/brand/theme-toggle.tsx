"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Theme Toggle Component
 * - Smooth light/dark mode transition
 * - Accessible button
 * - Icon animation
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center justify-center",
        "w-10 h-10 rounded-lg",
        "bg-gray-100 dark:bg-gray-900",
        "border border-gray-300 dark:border-gray-700",
        "text-gray-600 dark:text-gray-400",
        "hover:bg-gray-200 dark:hover:bg-gray-800",
        "hover:text-gray-900 dark:hover:text-white",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
      )}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all duration-200" />
      ) : (
        <Moon className="w-5 h-5 rotate-0 scale-100 transition-all duration-200" />
      )}
    </button>
  )
}

export default ThemeToggle
