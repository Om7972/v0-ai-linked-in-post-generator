"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { NavLink } from "./nav-link"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Zap, Settings, BarChart3, FileText, Sparkles, Users } from "lucide-react"

// Navigation items with icons and active states
const navItems: Array<{ label: string; href: string; icon: LucideIcon; isApp: boolean }> = [
  { label: "Generator", href: "/generate", icon: Zap, isApp: true },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, isApp: true },
  { label: "Posts", href: "/dashboard/posts", icon: FileText, isApp: true },
  { label: "Power-User", href: "/power-user", icon: Sparkles, isApp: true },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, isApp: true },
  { label: "Pricing", href: "/pricing", icon: BarChart3, isApp: false },
]

// Landing page only nav items (shown when not logged in or on landing)
const landingNavItems: Array<{ label: string; href: string; icon?: LucideIcon }> = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Onboarding", href: "/onboarding" },
]

/**
 * Header / Navbar Component
 * - Sticky positioning with scroll shadow
 * - Adaptive navigation (landing vs app pages)
 * - Glassmorphism design
 * - Responsive mobile drawer
 * - Icons for app navigation
 * - Active route highlighting
 */
export function Header() {
  const pathname = usePathname()
  const [hasScrolled, setHasScrolled] = useState(false)
  
  // Determine if we're on an app page (authenticated area)
  const isAppPage = pathname.startsWith("/dashboard") || pathname === "/generate"
  
  // Use appropriate nav items based on page context
  const activeNavItems = isAppPage ? navItems : landingNavItems

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50",
        "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md",
        "border-b border-gray-200/50 dark:border-gray-800/50",
        "transition-all duration-200",
        hasScrolled && "shadow-lg dark:shadow-xl"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black rounded-md">
          <Logo size="md" variant="full" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {activeNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = "icon" in item ? (item.icon as LucideIcon) : null
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900/50"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {!isAppPage && (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {isAppPage && (
              <Link href="/dashboard/settings">
                <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                  Profile
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <MobileNav navItems={activeNavItems} isAppPage={isAppPage} />
        </div>
      </nav>
    </header>
  )
}

export default Header
