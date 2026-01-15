"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Bell, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScheduledPost {
  id: string
  scheduledAt: Date
  timezone: string
  notifyBefore: number // minutes
}

interface SchedulingReminderProps {
  onSchedule?: (post: ScheduledPost) => void
}

export function SchedulingReminder({ onSchedule }: SchedulingReminderProps) {
  const [open, setOpen] = useState(false)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("09:00")
  const [notifyBefore, setNotifyBefore] = useState(15)
  const { toast } = useToast()

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      })
      return
    }

    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      scheduledAt: new Date(`${scheduledDate}T${scheduledTime}`),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifyBefore,
    }

    setScheduledPosts([...scheduledPosts, newPost])
    onSchedule?.(newPost)

    toast({
      title: "Post scheduled!",
      description: `Your post is scheduled for ${newPost.scheduledAt.toLocaleString()}`,
    })

    // Reset form
    setScheduledDate("")
    setScheduledTime("09:00")
    setNotifyBefore(15)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
          <DialogDescription>
            Schedule your post to publish at the perfect time
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Date & Time inputs */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notify">Notify before (minutes)</Label>
              <Input
                id="notify"
                type="number"
                min="5"
                max="1440"
                value={notifyBefore}
                onChange={(e) => setNotifyBefore(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Info box */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <span className="font-semibold">💡 Tip:</span> Post Tuesday-Thursday at 8am-10am for maximum engagement.
            </p>
          </div>

          {/* Scheduled posts list */}
          {scheduledPosts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Scheduled Posts</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scheduledPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-2.5 border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium">
                            {post.scheduledAt.toLocaleDateString()} {post.scheduledAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            Notify {post.notifyBefore}m before
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setScheduledPosts(
                            scheduledPosts.filter((p) => p.id !== post.id)
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule button */}
          <Button
            onClick={handleSchedule}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add to Schedule
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
