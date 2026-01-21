// User posts storage (in-memory, replace with database in production)
interface SavedPost {
  id: string
  userId: string
  topic: string
  post: string
  hashtags: string
  tone: string
  audience: string
  length: string
  createdAt: string
  updatedAt: string
}

const userPosts: SavedPost[] = []

export function savePost(
  userId: string,
  topic: string,
  post: string,
  hashtags: string,
  tone: string,
  audience: string,
  length: string
): SavedPost {
  const savedPost: SavedPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    topic,
    post,
    hashtags,
    tone,
    audience,
    length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  userPosts.push(savedPost)
  return savedPost
}

export function getUserPosts(userId: string): SavedPost[] {
  return userPosts.filter((p) => p.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function deletePost(postId: string, userId: string): boolean {
  const index = userPosts.findIndex((p) => p.id === postId && p.userId === userId)
  if (index !== -1) {
    userPosts.splice(index, 1)
    return true
  }
  return false
}

export function getPostById(postId: string, userId: string): SavedPost | null {
  return userPosts.find((p) => p.id === postId && p.userId === userId) || null
}

export function getUserStats(userId: string) {
  const posts = getUserPosts(userId)
  const postsGenerated = posts.length
  const savedDrafts = posts.filter((p) => !p.post).length
  
  // Calculate average engagement (simplified - in production, this would come from analytics)
  const avgEngagementScore = posts.length > 0 
    ? Math.min(95, Math.max(60, 70 + Math.floor(Math.random() * 20)))
    : 0
  
  const totalEngagements = posts.length * 150 // Mock data

  return {
    postsGenerated,
    avgEngagementScore,
    savedDrafts,
    totalEngagements,
  }
}

