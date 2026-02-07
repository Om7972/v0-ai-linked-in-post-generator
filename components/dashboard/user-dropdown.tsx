"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User as UserIcon, LayoutDashboard, FileText, ChevronDown, CreditCard, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function UserDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus-visible:ring-0 focus-visible:ring-offset-0 group">
          <Avatar className="h-9 w-9 border-2 border-slate-200 dark:border-slate-700 transition-all group-hover:border-indigo-500">
            <AvatarImage src={user.avatarUrl || ''} alt={user.name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start gap-0.5">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none group-hover:text-indigo-600 transition-colors">
              {user.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Free Plan
            </span>
          </div>

          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors hidden md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 z-[100] p-2 rounded-2xl border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 dark:border-slate-800" sideOffset={8}>
        <DropdownMenuLabel className="p-3 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
              <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup className="px-1 space-y-1">
          <Link href="/dashboard" className="w-full cursor-pointer">
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/20">
              <LayoutDashboard className="h-4 w-4 mr-3 text-slate-500" />
              <span className="font-medium">Dashboard</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/dashboard/posts" className="w-full cursor-pointer">
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/20">
              <FileText className="h-4 w-4 mr-3 text-slate-500" />
              <span className="font-medium">My Posts</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-slate-800" />

        <DropdownMenuGroup className="px-1 space-y-1">
          <Link href="/dashboard/settings/profile" className="w-full cursor-pointer">
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/20">
              <UserIcon className="h-4 w-4 mr-3 text-slate-500" />
              <span className="font-medium">Profile Details</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/dashboard/settings" className="w-full cursor-pointer">
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/20">
              <Settings className="h-4 w-4 mr-3 text-slate-500" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-slate-800" />

        <div className="p-1">
          <Link href="/pricing">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 text-white mb-2 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="font-bold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-[10px] text-indigo-100 opacity-90">Unlock unlimited posts & AI features</p>
            </div>
          </Link>
        </div>

        <DropdownMenuItem
          onClick={handleLogout}
          className="mx-1 rounded-lg py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
