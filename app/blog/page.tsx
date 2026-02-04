import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, ArrowRight, TrendingUp, Lightbulb, Target } from "lucide-react"

export const metadata: Metadata = {
    title: "Blog",
    description: "Insights, tips, and strategies for creating engaging LinkedIn content with AI.",
}

const blogPosts = [
    {
        id: 1,
        title: "10 LinkedIn Post Formulas That Drive Engagement",
        excerpt: "Discover proven post structures that consistently generate likes, comments, and shares on LinkedIn.",
        category: "Strategy",
        author: "Sarah Chen",
        authorAvatar: "",
        date: "Feb 2, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
        featured: true,
    },
    {
        id: 2,
        title: "How AI is Transforming Professional Content Creation",
        excerpt: "Explore the impact of AI tools on how professionals create and share content on LinkedIn.",
        category: "AI Insights",
        author: "Michael Torres",
        authorAvatar: "",
        date: "Jan 28, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        featured: true,
    },
    {
        id: 3,
        title: "The Psychology Behind Viral LinkedIn Posts",
        excerpt: "Understanding what makes people stop scrolling and engage with your content.",
        category: "Psychology",
        author: "Dr. Emily Watson",
        authorAvatar: "",
        date: "Jan 25, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
        featured: false,
    },
    {
        id: 4,
        title: "Building Your Personal Brand on LinkedIn in 2026",
        excerpt: "A comprehensive guide to establishing and growing your professional presence.",
        category: "Personal Branding",
        author: "James Rodriguez",
        authorAvatar: "",
        date: "Jan 20, 2026",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop",
        featured: false,
    },
    {
        id: 5,
        title: "Optimizing Post Timing for Maximum Reach",
        excerpt: "Data-driven insights on when to post for different industries and audiences.",
        category: "Analytics",
        author: "Sarah Chen",
        authorAvatar: "",
        date: "Jan 15, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        featured: false,
    },
    {
        id: 6,
        title: "Crafting Compelling Calls-to-Action",
        excerpt: "Learn how to end your posts with CTAs that drive meaningful engagement.",
        category: "Writing Tips",
        author: "Michael Torres",
        authorAvatar: "",
        date: "Jan 10, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        featured: false,
    },
]

const categories = ["All", "Strategy", "AI Insights", "Psychology", "Personal Branding", "Analytics", "Writing Tips"]

export default function BlogPage() {
    const featuredPosts = blogPosts.filter(post => post.featured)
    const regularPosts = blogPosts.filter(post => !post.featured)

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 animate-fade-in">
                        <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            <Lightbulb className="w-3 h-3 mr-1" />
                            Insights & Resources
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            LinkedIn Content Mastery
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Expert insights, proven strategies, and actionable tips to elevate your LinkedIn presence and drive real engagement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={category === "All" ? "default" : "outline"}
                                className={category === "All" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-8">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <h2 className="text-3xl font-bold">Featured Articles</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {featuredPosts.map((post) => (
                            <Card key={post.id} className="group overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <Badge className="absolute top-4 left-4 z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                                        {post.category}
                                    </Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="text-base line-clamp-2">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={post.authorAvatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                                                    {post.author.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{post.author}</p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {post.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {post.readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Regular Posts */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post) => (
                            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                                    <Badge className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/90 text-foreground">
                                        {post.category}
                                    </Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                                    {post.author.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{post.author}</span>
                                        </div>
                                        <span className="text-muted-foreground">{post.readTime}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                        <CardContent className="pt-8 text-center space-y-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold">Never Miss an Insight</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Get weekly tips, strategies, and exclusive content delivered straight to your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                    Subscribe
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Join 10,000+ professionals. Unsubscribe anytime.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
