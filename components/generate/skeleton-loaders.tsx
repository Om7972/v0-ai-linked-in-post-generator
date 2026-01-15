"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    </div>
  )
}

export function PostSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/5" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FormSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 animate-pulse">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

export function EngagementScoreSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32" />
        <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  )
}
