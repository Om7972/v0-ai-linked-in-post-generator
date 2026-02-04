"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { UserDropdown } from "@/components/dashboard/user-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Zap, DollarSign, FileText, Info, BookOpen, Mail, Shield, FileCheck, Cookie } from "lucide-react"

/**
 * Header / Navbar Component with Dropdown Menus
 * - Product, Company, and Legal dropdowns
 * - Sticky positioning with scroll shadow
 * - Glassmorphism design
 * - Responsive mobile drawer
 */
export function Header() {
  const pathname = usePathname()
  const [hasScrolled, setHasScrolled] = useState(false)
  const { isAuthenticated } = useAuth()

  // Determine if we're on an app page (authenticated area)
  const isAppPage = pathname.startsWith("/dashboard") || pathname === "/generate" || pathname === "/power-user"

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
          {!isAppPage && (
            <>
              {/* Show Generate and Power User for authenticated users */}
              {isAuthenticated && (
                <>
                  <Link
                    href="/generate"
                    className="px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900/50"
                  >
                    <Zap className="w-4 h-4" />
                    Generate
                  </Link>
                  <Link
                    href="/power-user"
                    className="px-3 py-2 rounded-lg font-medium text-sm transition-colors text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900/50"
                  >
                    Power User
                  </Link>
                </>
              )}

              {/* Product Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 px-3 py-2 h-auto font-medium text-sm">
                    Product
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 z-[100]">
                  <DropdownMenuLabel>Explore Features</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/#features">
                    <DropdownMenuItem className="cursor-pointer">
                      <Zap className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">Features</p>
                        <p className="text-xs text-muted-foreground">AI-powered capabilities</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/pricing">
                    <DropdownMenuItem className="cursor-pointer">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Pricing</p>
                        <p className="text-xs text-muted-foreground">Plans for every need</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/#how-it-works">
                    <DropdownMenuItem className="cursor-pointer">
                      <FileText className="h-4 w-4 mr-2 text-purple-500" />
                      <div>
                        <p className="font-medium">Examples</p>
                        <p className="text-xs text-muted-foreground">See it in action</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Company Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 px-3 py-2 h-auto font-medium text-sm">
                    Company
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 z-[100]">
                  <DropdownMenuLabel>About Us</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/about">
                    <DropdownMenuItem className="cursor-pointer">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <p className="font-medium">About</p>
                        <p className="text-xs text-muted-foreground">Our mission & story</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/blog">
                    <DropdownMenuItem className="cursor-pointer">
                      <BookOpen className="h-4 w-4 mr-2 text-orange-500" />
                      <div>
                        <p className="font-medium">Blog</p>
                        <p className="text-xs text-muted-foreground">Latest insights</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/contact">
                    <DropdownMenuItem className="cursor-pointer">
                      <Mail className="h-4 w-4 mr-2 text-green-500" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-xs text-muted-foreground">Get in touch</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Legal Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 px-3 py-2 h-auto font-medium text-sm">
                    Legal
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 z-[100]">
                  <DropdownMenuLabel>Legal Information</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/privacy">
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Privacy Policy</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/terms">
                    <DropdownMenuItem className="cursor-pointer">
                      <FileCheck className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Terms of Service</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/cookies">
                    <DropdownMenuItem className="cursor-pointer">
                      <Cookie className="h-4 w-4 mr-2 text-orange-500" />
                      <span>Cookie Policy</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {isAppPage && (
            <>
              <Link
                href="/generate"
                className={cn(
                  "px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors",
                  pathname === "/generate"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900/50"
                )}
              >
                <Zap className="w-4 h-4" />
                Generator
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "px-3 py-2 rounded-lg font-medium text-sm transition-colors",
                  pathname === "/dashboard"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900/50"
                )}
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {!isAuthenticated && (
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
            {isAuthenticated && <UserDropdown />}
          </div>

          {/* Mobile menu */}
          <MobileNav isAppPage={isAppPage} />
        </div>
      </nav>
    </header>
  )
}

export default Header
