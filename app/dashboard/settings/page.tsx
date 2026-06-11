"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Bell, Lock, User, Palette, Shield, Trash2, Download,
  Sun, Moon, Monitor, Loader2, CheckCircle2, AlertTriangle
} from "lucide-react"
import { OnboardingSettings } from "@/components/onboarding/onboarding-settings"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { user, token, updateUser } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!token) return
    try {
      setIsLoadingProfile(true)
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setName(data.user.name)
        setEmail(data.user.email)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [token])

  useEffect(() => {
    if (token && user) fetchProfile()
  }, [token, user, fetchProfile])

  const handleSaveProfile = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      })
      if (response.ok) {
        updateUser({ name })
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        toast({ title: "✅ Profile updated", description: "Your profile has been updated successfully." })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!token) return
    if (!newPassword) {
      toast({ title: "Error", description: "Please enter a new password", variant: "destructive" })
      return
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPassword }),
      })
      if (response.ok) {
        toast({ title: "✅ Password updated", description: "Your password has been changed." })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to update password")
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update password.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    toast({ title: "Exporting...", description: "Preparing your data export." })
    // Simulate export
    setTimeout(() => {
      toast({ title: "✅ Export Ready", description: "Your data has been exported." })
    }, 2000)
  }

  if (isLoadingProfile) {
    return (
      <AuthGuard>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and security</p>
        </div>

        {/* Account Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
            </div>
            <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : null}
              {saveSuccess ? "Saved!" : isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Security */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} placeholder="Minimum 8 characters" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} placeholder="Re-enter new password" />
            </div>
            {newPassword && newPassword.length < 8 && (
              <div className="flex items-center gap-2 text-yellow-600 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Password must be at least 8 characters
              </div>
            )}
            <Button onClick={handleUpdatePassword} disabled={isLoading || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates about your posts and engagement</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Weekly Reports</p>
                <p className="text-xs text-muted-foreground">Get weekly engagement summaries and insights</p>
              </div>
              <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Appearance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the app's look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  onClick={() => setTheme(value)}
                  className={`gap-2 ${theme === value ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Data & Privacy */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Manage your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="gap-2 w-full justify-start" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Export My Data
            </Button>
            <Button variant="outline" className="gap-2 w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Onboarding */}
        <OnboardingSettings />
      </motion.div>
    </AuthGuard>
  )
}