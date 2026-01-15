"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Filter } from "lucide-react"
import { RecentPostsTable } from "@/components/dashboard/recent-posts-table"
import { EmptyPostsState } from "@/components/dashboard/empty-states"
import { mockPostHistory, type PostHistory } from "@/lib/dashboard-data"
import { useToast } from "@/hooks/use-toast"

export default function PostsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<PostHistory[]>(mockPostHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterTone, setFilterTone] = useState<string>("all")

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.topic
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus
    const matchesTone = filterTone === "all" || post.tone === filterTone

    return matchesSearch && matchesStatus && matchesTone
  })

  const handleViewPost = (post: PostHistory) => {
    toast({
      title: "Viewing post",
      description: `${post.topic.substring(0, 30)}...`,
    })
  }

  const handleDuplicatePost = (post: PostHistory) => {
    toast({
      title: "Post duplicated",
      description: "Opening editor with this post content",
    })
    router.push("/generate")
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    toast({
      title: "Post deleted",
      description: "This action cannot be undone",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your generated posts
          </p>
        </div>
        <Button
          onClick={() => router.push("/generate")}
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts by topic..."
                className="pl-10 bg-secondary/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select value={filterTone} onValueChange={setFilterTone}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tones</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Founder">Founder</SelectItem>
                    <SelectItem value="Influencer">Influencer</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              Showing {filteredPosts.length} of {posts.length} posts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      {filteredPosts.length > 0 ? (
        <RecentPostsTable
          posts={filteredPosts}
          onView={handleViewPost}
          onDelete={handleDeletePost}
          onDuplicate={handleDuplicatePost}
        />
      ) : posts.length === 0 ? (
        <EmptyPostsState />
      ) : (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterTone("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
