"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Repeat2, Send, Globe, MoreHorizontal, ThumbsUp, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"

interface LivePreviewProps {
  content: string
  hashtags: string
  userName?: string
  userTitle?: string
}

export function LivePreview({ content, hashtags, userName, userTitle }: LivePreviewProps) {
  const { user } = useAuth()
  const displayName = userName || user?.name || "Your Name"
  const displayTitle = userTitle || "Content Creator | AI Enthusiast"

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  // Format content for display
  const formatContent = (text: string) => {
    if (!text) return <span className="text-muted-foreground italic">Your post will appear here...</span>
    
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  const engagementCount = Math.floor(Math.random() * 200 + 50)
  const commentCount = Math.floor(Math.random() * 30 + 5)
  const repostCount = Math.floor(Math.random() * 15 + 2)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* LinkedIn Card */}
      <div className="bg-white dark:bg-[#1b1f23] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        {/* Post Header */}
        <div className="p-4 flex items-start gap-3">
          <Avatar className="h-12 w-12 border-2 border-blue-500/20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-sm">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{displayName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{displayTitle}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
              Just now · <Globe className="h-3 w-3" />
            </p>
          </div>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {formatContent(content)}
          </div>
          {hashtags && (
            <p className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
              {hashtags}
            </p>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-500 text-[8px] text-white">👍</span>
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[8px] text-white">❤️</span>
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-500 text-[8px] text-white">🎉</span>
            </div>
            <span>{engagementCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{commentCount} comments</span>
            <span>{repostCount} reposts</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around">
          {[
            { icon: ThumbsUp, label: "Like" },
            { icon: MessageCircle, label: "Comment" },
            { icon: Repeat2, label: "Repost" },
            { icon: Send, label: "Send" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 text-xs font-medium"
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Label */}
      <p className="text-center text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
        LinkedIn Preview — How your post will look
      </p>
    </motion.div>
  )
}
