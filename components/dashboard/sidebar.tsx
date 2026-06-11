"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3, Home, FileText, Settings, LogOut, Sparkles,
  Menu, X, User, TrendingUp, Crown, Flame, ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Generate", href: "/generate", icon: Sparkles },
  { label: "AI Brand Coach", href: "/dashboard/brand-coach", icon: Flame },
  { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
]

const contentNavItems = [
  { label: "My Posts", href: "/dashboard/posts", icon: FileText },
]

const accountNavItems = [
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Upgrade", href: "/dashboard/upgrade", icon: Crown },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  const getInitials = (name: string) => {
    if (!name) return ""
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleNavClick}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <Icon className={cn("h-4.5 w-4.5 flex-shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-20 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl shadow-lg bg-background/80 backdrop-blur-sm"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-card/95 backdrop-blur-sm border-r border-border/50 transition-all duration-300 z-40 md:translate-x-0 flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3 group" onClick={handleNavClick}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-none">PostGenius</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">AI Content Studio</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Main</p>
            {mainNavItems.map(renderNavItem)}
          </div>

          {/* Content */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Content</p>
            {contentNavItems.map(renderNavItem)}
          </div>

          {/* Account */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Account</p>
            {accountNavItems.map(renderNavItem)}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-border/50 p-3 space-y-2">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-9 w-9 border-2 border-border">
                <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
            onClick={() => {
              logout()
              handleNavClick()
            }}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
