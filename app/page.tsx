"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LandingPage } from "@/components/landing"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return <LandingPage />
  }

  // Brief display while redirecting to dashboard
  return null
}
