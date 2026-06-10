"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User, Briefcase, MapPin, LinkIcon, Flame, Trophy,
  Calendar, FileText, TrendingUp, Edit3, Save, X,
  Sparkles, Crown, ExternalLink, CheckCircle2, Loader2
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth/auth-guard"

interface ProfileData {
  name: string
  email: string
  bio: string
  company: string
  job_title: string
  linkedin_url: string
  avatar_url: string
  plan: string
  created_at: string
  writing_streak: number
}

interface UsageData {
  posts_generated_today: number
  total_posts_generated: number
}

export default function ProfilePage() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [postCount, setPostCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<ProfileData>>({})

  const fetchProfile = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          bio: data.user.bio || "",
          company: data.user.company || "",
          job_title: data.user.job_title || "",
          linkedin_url: data.user.linkedin_url || "",
          avatar_url: data.user.avatar_url || "",
          plan: data.user.plan || "free",
          created_at: data.user.created_at || "",
          writing_streak: data.user.writing_streak || 0,
        })
        setUsage(data.usage)
        setPostCount(data.postCount || 0)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profile })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const handleSave = async () => {
    if (!token) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      })
      if (res.ok) {
        toast({ title: "Profile Updated", description: "Your changes have been saved." })
        setIsEditing(false)
        fetchProfile()
      } else {
        throw new Error("Failed to save")
      }
    } catch {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const planConfig: Record<string, { label: string; color: string; icon: any }> = {
    free: { label: "Free", color: "bg-slate-500", icon: User },
    pro: { label: "Pro", color: "bg-blue-500", icon: Sparkles },
    creator: { label: "Creator", color: "bg-purple-500", icon: Crown },
    enterprise: { label: "Enterprise", color: "bg-amber-500", icon: Trophy },
  }

  if (isLoading || !profile) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    )
  }

  const plan = planConfig[profile.plan] || planConfig.free
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently"

  return (
    <AuthGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-0 shadow-xl">
          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          </div>
          
          <CardContent className="relative pb-8">
            {/* Avatar */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12">
              <Avatar className="h-28 w-28 border-4 border-background shadow-2xl">
                <AvatarImage src={profile.avatar_url} alt={profile.name} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <Badge className={`${plan.color} text-white text-xs px-2.5 py-0.5`}>
                    {plan.label} Plan
                  </Badge>
                </div>
                {profile.job_title && (
                  <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start">
                    <Briefcase className="h-4 w-4" />
                    {profile.job_title}
                    {profile.company && <span>at {profile.company}</span>}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-sm text-muted-foreground mt-2 max-w-lg">{profile.bio}</p>
                )}
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" className="gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Posts Created", value: postCount, icon: FileText, color: "text-blue-500" },
            { label: "Writing Streak", value: `${profile.writing_streak}d`, icon: Flame, color: "text-orange-500" },
            { label: "Today's Posts", value: usage?.posts_generated_today || 0, icon: TrendingUp, color: "text-green-500" },
            { label: "Member Since", value: memberSince, icon: Calendar, color: "text-purple-500", isText: true },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="border border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`font-bold ${stat.isText ? "text-sm" : "text-xl"}`}>{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Edit Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-primary" />
                    Edit Profile
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input
                        id="edit-name"
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-job">Job Title</Label>
                      <Input
                        id="edit-job"
                        value={editData.job_title || ""}
                        onChange={(e) => setEditData({ ...editData, job_title: e.target.value })}
                        placeholder="e.g. Product Manager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-company">Company</Label>
                      <Input
                        id="edit-company"
                        value={editData.company || ""}
                        onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-linkedin">LinkedIn URL</Label>
                      <Input
                        id="edit-linkedin"
                        value={editData.linkedin_url || ""}
                        onChange={(e) => setEditData({ ...editData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bio">Bio</Label>
                    <textarea
                      id="edit-bio"
                      value={editData.bio || ""}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Write a short bio about yourself..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{(editData.bio || "").length}/500</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-avatar">Avatar URL</Label>
                    <Input
                      id="edit-avatar"
                      value={editData.avatar_url || ""}
                      onChange={(e) => setEditData({ ...editData, avatar_url: e.target.value })}
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Info Cards */}
        {!isEditing && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{profile.email}</p>
                  </div>
                </div>
                {profile.linkedin_url && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <LinkIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">LinkedIn</p>
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1 truncate"
                      >
                        {profile.linkedin_url.replace("https://", "").slice(0, 40)}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
                {profile.company && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Briefcase className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-sm font-medium">{profile.company}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Details */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plan & Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${plan.color} text-white`}>{plan.label}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {profile.plan === "free" ? "5 posts/day" : profile.plan === "pro" ? "50 posts/day" : "Unlimited"}
                    </span>
                  </div>
                  {profile.plan === "free" && (
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                      Upgrade
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today's Usage</span>
                    <span className="font-medium">{usage?.posts_generated_today || 0} / {profile.plan === "free" ? 5 : 50}</span>
                  </div>
                  <Progress 
                    value={((usage?.posts_generated_today || 0) / (profile.plan === "free" ? 5 : 50)) * 100} 
                    className="h-2"
                  />
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Posts Generated</span>
                  <span className="font-bold">{usage?.total_posts_generated || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </AuthGuard>
  )
}
