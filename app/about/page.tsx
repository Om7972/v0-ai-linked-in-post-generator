import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, Users, Rocket, Heart, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about our mission to revolutionize LinkedIn content creation with AI-powered tools.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 animate-fade-in">
                        <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            <Sparkles className="w-3 h-3 mr-1" />
                            About Us
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Empowering Your LinkedIn Presence
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            We're on a mission to help professionals, founders, and creators craft compelling LinkedIn content that drives engagement and builds meaningful connections.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-card/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    To democratize professional content creation by making AI-powered writing accessible to everyone, regardless of their writing skills or experience.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Our Values</h3>
                                <p className="text-muted-foreground">
                                    Innovation, authenticity, and user empowerment drive everything we do. We believe in creating tools that enhance, not replace, human creativity.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
                                    <Rocket className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">Our Vision</h3>
                                <p className="text-muted-foreground">
                                    A world where every professional can confidently share their expertise and build their personal brand through compelling content.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                            <div className="w-20 h-1 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                        </div>
                        <div className="prose prose-lg dark:prose-invert mx-auto">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Founded in 2024, AI LinkedIn Post Generator was born from a simple observation: talented professionals often struggle to articulate their expertise in engaging LinkedIn posts. We saw countless brilliant minds with valuable insights who simply didn't have the time or confidence to share their knowledge effectively.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Leveraging the power of Google's Gemini AI, we built a platform that understands context, tone, and audience engagement. Our tool doesn't just generate text—it helps you craft authentic, impactful messages that resonate with your network.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Today, we're proud to serve thousands of professionals worldwide, helping them amplify their voice and build meaningful connections on LinkedIn.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Powered by Innovation</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Built with cutting-edge AI technology and a passion for helping professionals succeed.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Zap, title: "AI-Powered", desc: "Leveraging Google Gemini for intelligent content generation" },
                            { icon: Users, title: "User-Centric", desc: "Designed with feedback from thousands of LinkedIn creators" },
                            { icon: Sparkles, title: "Constantly Evolving", desc: "Regular updates with new features and improvements" }
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-4 p-6 rounded-xl bg-card hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your LinkedIn Presence?</h2>
                    <p className="text-xl text-muted-foreground">
                        Join thousands of professionals who are already creating engaging content with AI.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/signup">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
