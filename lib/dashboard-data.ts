/**
 * Mock Dashboard Data
 * Provides realistic analytics data for the dashboard
 */

export interface DashboardStats {
  postsGenerated: number
  avgEngagementScore: number
  savedDrafts: number
  totalEngagements: number
}

export interface EngagementDataPoint {
  date: string
  score: number
  posts: number
}

export interface ToneDistribution {
  tone: string
  count: number
  percentage: number
}

export interface PostHistory {
  id: string
  topic: string
  tone: string
  engagementScore: number
  generatedAt: string
  status: "published" | "draft" | "archived"
  hashtags: string
}

// Mock user data
export const mockUser = {
  name: "Sarah Anderson",
  email: "sarah.anderson@example.com",
  avatar: "SA",
  role: "Content Creator",
  joinedDate: "2024-06-15",
}

// Mock dashboard statistics
export const mockStats: DashboardStats = {
  postsGenerated: 247,
  avgEngagementScore: 73,
  savedDrafts: 12,
  totalEngagements: 18500,
}

// Mock engagement over time data
export const mockEngagementData: EngagementDataPoint[] = [
  { date: "Jan 1", score: 45, posts: 3 },
  { date: "Jan 8", score: 52, posts: 5 },
  { date: "Jan 15", score: 58, posts: 7 },
  { date: "Jan 22", score: 65, posts: 8 },
  { date: "Jan 29", score: 72, posts: 10 },
  { date: "Feb 5", score: 68, posts: 9 },
  { date: "Feb 12", score: 75, posts: 12 },
  { date: "Feb 19", score: 78, posts: 14 },
  { date: "Feb 26", score: 73, posts: 11 },
  { date: "Mar 5", score: 82, posts: 15 },
  { date: "Mar 12", score: 79, posts: 13 },
  { date: "Mar 19", score: 85, posts: 16 },
]

// Mock tone distribution
export const mockToneDistribution: ToneDistribution[] = [
  { tone: "Professional", count: 95, percentage: 38 },
  { tone: "Founder", count: 72, percentage: 29 },
  { tone: "Influencer", count: 52, percentage: 21 },
  { tone: "Casual", count: 28, percentage: 12 },
]

// Mock recent posts
export const mockPostHistory: PostHistory[] = [
  {
    id: "1",
    topic: "The Future of Remote Work",
    tone: "Professional",
    engagementScore: 87,
    generatedAt: "2024-03-19T14:30:00Z",
    status: "published",
    hashtags: "#RemoteWork #FutureOfWork #Leadership",
  },
  {
    id: "2",
    topic: "Building Sustainable Startups",
    tone: "Founder",
    engagementScore: 92,
    generatedAt: "2024-03-18T10:15:00Z",
    status: "published",
    hashtags: "#Startup #Sustainability #Innovation",
  },
  {
    id: "3",
    topic: "AI and Productivity Hacks",
    tone: "Influencer",
    engagementScore: 78,
    generatedAt: "2024-03-17T16:45:00Z",
    status: "draft",
    hashtags: "#AI #Productivity #TechHacks",
  },
  {
    id: "4",
    topic: "My Journey to 100K Followers",
    tone: "Casual",
    engagementScore: 85,
    generatedAt: "2024-03-16T09:20:00Z",
    status: "published",
    hashtags: "#Success #PersonalGrowth #Community",
  },
  {
    id: "5",
    topic: "Advanced Analytics Strategies",
    tone: "Professional",
    engagementScore: 81,
    generatedAt: "2024-03-15T13:50:00Z",
    status: "published",
    hashtags: "#Analytics #DataDriven #Strategy",
  },
  {
    id: "6",
    topic: "Lessons from My First Unicorn",
    tone: "Founder",
    engagementScore: 94,
    generatedAt: "2024-03-14T11:30:00Z",
    status: "published",
    hashtags: "#Entrepreneurship #Startup #Lessons",
  },
  {
    id: "7",
    topic: "Content Creation Tips for 2024",
    tone: "Influencer",
    engagementScore: 76,
    generatedAt: "2024-03-13T15:20:00Z",
    status: "draft",
    hashtags: "#ContentCreation #SocialMedia #Tips",
  },
  {
    id: "8",
    topic: "Why I Love Monday Mornings",
    tone: "Casual",
    engagementScore: 72,
    generatedAt: "2024-03-12T08:40:00Z",
    status: "published",
    hashtags: "#MondayMotivation #Mindset #Positivity",
  },
]

// Helper function to get tone color
export function getToneColor(tone: string): string {
  const colors: Record<string, string> = {
    Professional: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    Founder: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    Influencer: "bg-pink-500/20 text-pink-700 dark:text-pink-300",
    Casual: "bg-green-500/20 text-green-700 dark:text-green-300",
  }
  return colors[tone] || "bg-gray-500/20 text-gray-700 dark:text-gray-300"
}

// Helper function to get status badge color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    published: "bg-green-500/20 text-green-700 dark:text-green-300",
    draft: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    archived: "bg-gray-500/20 text-gray-700 dark:text-gray-300",
  }
  return colors[status] || "bg-gray-500/20 text-gray-700 dark:text-gray-300"
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
