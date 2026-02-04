"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface MobileNavProps {
  isAppPage: boolean
}

/**
 * Mobile Navigation Drawer
 * - Slide-in from left
 * - Large touch targets
 * - Active route highlighting
 */
export function MobileNav({ isAppPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

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
          "fixed left-0 top-0 h-full w-full max-w-xs z-50 bg-white dark:bg-gray-950 shadow-lg transition-transform duration-300 md:hidden overflow-y-auto",
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
          {!isAppPage ? (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</div>
              <Link href="/#features" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Features
                </div>
              </Link>
              <Link href="/pricing" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Pricing
                </div>
              </Link>
              <Link href="/#how-it-works" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Examples
                </div>
              </Link>

              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Company</div>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  About
                </div>
              </Link>
              <Link href="/blog" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Blog
                </div>
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Contact
                </div>
              </Link>

              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Legal</div>
              <Link href="/privacy" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Privacy Policy
                </div>
              </Link>
              <Link href="/terms" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Terms of Service
                </div>
              </Link>
              <Link href="/cookies" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Cookie Policy
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/generate" onClick={() => setIsOpen(false)}>
                <div className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg",
                  pathname === "/generate" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-900"
                )}>
                  Generator
                </div>
              </Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <div className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg",
                  pathname === "/dashboard" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-900"
                )}>
                  Dashboard
                </div>
              </Link>
              <Link href="/dashboard/posts" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  My Posts
                </div>
              </Link>
              <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900">
                  Settings
                </div>
              </Link>
            </>
          )}
        </nav>

        {/* Bottom CTA section */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex gap-2">
            <ThemeToggle />
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileNav
