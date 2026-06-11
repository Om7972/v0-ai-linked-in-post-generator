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
import {
  ChevronDown, Zap, DollarSign, FileText, Info, BookOpen,
  Mail, Shield, FileCheck, Cookie, BarChart3, LayoutDashboard,
  Sparkles, Crown, User, Settings, Flame
} from "lucide-react"

/**
 * Header / Navbar Component
 * - 3 main nav items: Generate, Dashboard, Analytics
 * - Everything else in dropdowns
 * - Glassmorphism with scroll shadow
 */
export function Header() {
  const pathname = usePathname()
  const [hasScrolled, setHasScrolled] = useState(false)
  const { isAuthenticated } = useAuth()

  const isAppPage = pathname.startsWith("/dashboard") || pathname === "/generate" || pathname === "/power-user"

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: string; icon?: any }) => (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200",
        pathname === href
          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900/50"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  )

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
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
          <Logo size="md" variant="full" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated && (
            <>
              {/* 3 Main Nav Items */}
              <NavLink href="/generate" icon={Sparkles}>Generate</NavLink>
              <NavLink href="/dashboard/brand-coach" icon={Flame}>AI Brand Coach</NavLink>
              <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            </>
          )}

          {!isAppPage && (
            <>
              {/* Product Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 px-3 py-2 h-auto font-medium text-sm">
                    Product <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 z-[100]">
                  <DropdownMenuLabel>Explore</DropdownMenuLabel>
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
                        <p className="font-medium">How It Works</p>
                        <p className="text-xs text-muted-foreground">See it in action</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 px-3 py-2 h-auto font-medium text-sm">
                    More <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 z-[100]">
                  <DropdownMenuLabel>Company</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/about">
                    <DropdownMenuItem className="cursor-pointer">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      About Us
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/blog">
                    <DropdownMenuItem className="cursor-pointer">
                      <BookOpen className="h-4 w-4 mr-2 text-orange-500" />
                      Blog
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/contact">
                    <DropdownMenuItem className="cursor-pointer">
                      <Mail className="h-4 w-4 mr-2 text-green-500" />
                      Contact
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Legal</DropdownMenuLabel>
                  <Link href="/privacy">
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-2 text-blue-500" />
                      Privacy Policy
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/terms">
                    <DropdownMenuItem className="cursor-pointer">
                      <FileCheck className="h-4 w-4 mr-2 text-purple-500" />
                      Terms of Service
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/cookies">
                    <DropdownMenuItem className="cursor-pointer">
                      <Cookie className="h-4 w-4 mr-2 text-orange-500" />
                      Cookie Policy
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

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

          <MobileNav isAppPage={isAppPage} />
        </div>
      </nav>
    </header>
  )
}

export default Header
