"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Share2, Lock, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "editor" | "viewer"
  avatar?: string
  joinedAt: Date
}

interface TeamCollaborationProps {
  postId?: string
}

const mockTeam: TeamMember[] = [
  {
    id: "user-1",
    name: "You",
    email: "you@example.com",
    role: "owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "editor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "user-3",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    role: "viewer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

export function TeamCollaboration({ postId }: TeamCollaborationProps) {
  const [open, setOpen] = useState(false)
  const [team, setTeam] = useState(mockTeam)
  const { toast } = useToast()

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Your team members can access this post via the shared link",
    })
  }

  const handleRemoveMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id))
    toast({
      title: "Member removed",
      description: "They no longer have access to this post",
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400"
      case "editor":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
      case "viewer":
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400"
      default:
        return "bg-secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Team Collaboration</DialogTitle>
          <DialogDescription>
            Manage who can view, edit, and comment on this post
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Share section */}
          <Card className="border-border/50 bg-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share with Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleShare} className="w-full gap-2 text-sm" size="sm">
                <Lock className="h-3 w-3" />
                Get Share Link
              </Button>
              <p className="text-xs text-muted-foreground">
                Share a secure link to collaborate on this draft
              </p>
            </CardContent>
          </Card>

          {/* Team members */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Team Members ({team.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-3 border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 items-end">
                        <Badge className={getRoleColor(member.role)} variant="secondary">
                          {member.role}
                        </Badge>
                      </div>
                    </div>

                    {member.id !== "user-1" && (
                      <div className="mt-2 flex gap-1 text-xs">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 h-6 gap-1"
                          disabled
                        >
                          <MessageSquare className="h-3 w-3" />
                          Comment
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 h-6"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Permissions info */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <span className="font-semibold">💡 Permissions:</span>
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-400 mt-1 space-y-0.5 ml-4">
              <li>• Owner: Full control</li>
              <li>• Editor: Can edit and comment</li>
              <li>• Viewer: Read-only access</li>
            </ul>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
