"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PostHistory, getToneColor, getStatusColor, formatDate } from "@/lib/dashboard-data"
import { Trash2, Eye, Copy } from "lucide-react"

interface RecentPostsTableProps {
  posts: PostHistory[]
  onView?: (post: PostHistory) => void
  onDelete?: (postId: string) => void
  onDuplicate?: (post: PostHistory) => void
}

export function RecentPostsTable({
  posts,
  onView,
  onDelete,
  onDuplicate,
}: RecentPostsTableProps) {
  return (
    <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
        <CardDescription>
          Your latest generated and published posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[200px]">Topic</TableHead>
                <TableHead className="w-[100px]">Tone</TableHead>
                <TableHead className="w-[120px]">Engagement</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="border-border/50 hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-sm">
                    <div className="truncate">{post.topic}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getToneColor(post.tone)}>
                      {post.tone}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{
                            width: `${post.engagementScore}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {post.engagementScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(post.status)}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(post.generatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onView?.(post)}
                        title="View post"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDuplicate?.(post)}
                        title="Duplicate post"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => onDelete?.(post.id)}
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View all button */}
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="gap-2">
            View All Posts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
