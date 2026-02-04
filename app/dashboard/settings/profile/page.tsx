"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function ProfilePage() {
    const { user, token } = useAuth()
    const { toast } = useToast()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)

    useEffect(() => {
        if (token && user) {
            fetchProfile()
        }
    }, [token, user])

    const fetchProfile = async () => {
        if (!token) return

        try {
            setIsLoadingProfile(true)
            const response = await fetch("/api/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setName(data.user.name)
                setEmail(data.user.email)
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch profile data.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        } finally {
            setIsLoadingProfile(false)
        }
    }

    const handleSaveProfile = async () => {
        if (!token) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            })

            if (response.ok) {
                toast({
                    title: "Profile updated",
                    description: "Your profile information has been updated.",
                })
                // Optionally refresh user context here
            } else {
                throw new Error("Failed to update profile")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdatePassword = async () => {
        if (!token) return

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all password fields",
                variant: "destructive",
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            })
            return
        }

        if (newPassword.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            // Logic for password update (usually different endpoint or same profile endpoint)
            // For now mocking or assuming API handles it if we sent it
            // Standard auth providers (Supabase) utilize specific password update method.
            // We might need /api/auth/update-password endpoint.
            // Assuming we just mock success for UI feedback unless backend is ready.

            // Let's assume we implement it later properly or use existing pattern.
            // For now, simple success.
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Password update functionality coming soon (Mocked).",
            })

            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update password.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoadingProfile) {
        return (
            <AuthGuard>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <div className="max-w-3xl space-y-8 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and security.</p>
                </div>

                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            Personal Details
                        </CardTitle>
                        <CardDescription>Update your public profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    className="bg-secondary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={true}
                                    className="bg-muted cursor-not-allowed opacity-70"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            Security
                        </CardTitle>
                        <CardDescription>Manage your password and account security.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="bg-secondary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="bg-secondary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="bg-secondary/20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleUpdatePassword} disabled={isLoading} variant="outline" className="border-primary/50 hover:bg-primary/5">
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthGuard>
    )
}
