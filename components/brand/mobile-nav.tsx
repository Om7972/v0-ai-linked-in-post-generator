"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
  isApp?: boolean
}

interface MobileNavProps {
  navItems: NavItem[]
  isAppPage: boolean
}

/**
 * Mobile Navigation Drawer
 * - Slide-in from left
 * - Large touch targets
 * - Active route highlighting
 * - Responsive icons
 */
export function MobileNav({ navItems, isAppPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-full max-w-xs z-50 bg-white dark:bg-gray-950 shadow-lg transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon as LucideIcon | undefined
            const isActive = pathname === item.href
            const isAnchorLink = item.href.startsWith("#")
            
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              setIsOpen(false)
              if (isAnchorLink) {
                e.preventDefault()
                const element = document.querySelector(item.href)
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }
            }
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleClick}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg flex items-center gap-3 transition-colors",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                )}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom CTA section */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex gap-2">
            <ThemeToggle />
            {!isAppPage && (
              <Link href="/auth/login" className="flex-1" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
            {isAppPage && (
              <Link href="/dashboard/settings" className="flex-1" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Profile
                </Button>
              </Link>
            )}
          </div>

          {!isAppPage && (
            <Link href="/auth/signup" className="block w-full" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default MobileNav
