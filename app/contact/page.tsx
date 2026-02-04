import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, Linkedin } from "lucide-react"

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with our team. We're here to help with any questions about AI-powered LinkedIn content creation.",
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 animate-fade-in">
                        <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Get in Touch
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            We'd Love to Hear From You
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Have questions, feedback, or need support? Our team is here to help you succeed with AI-powered content creation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="border-2 border-border/50 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you within 24 hours.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name *</Label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    className="bg-secondary/20"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name *</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    className="bg-secondary/20"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john.doe@example.com"
                                                className="bg-secondary/20"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                placeholder="How can we help you?"
                                                className="bg-secondary/20"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={6}
                                                className="bg-secondary/20 resize-none"
                                                required
                                            />
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <input
                                                type="checkbox"
                                                id="consent"
                                                className="mt-1"
                                                required
                                            />
                                            <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                                                I agree to receive communications from AI LinkedIn Post Generator and understand that I can unsubscribe at any time.
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            For general inquiries and support
                                        </p>
                                        <a
                                            href="mailto:support@ailinkedinpost.com"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            support@ailinkedinpost.com
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            We're here to help during:
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                                            <p>Saturday - Sunday: Closed</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center">
                                        <Linkedin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Connect on LinkedIn</h3>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            Follow us for tips and updates
                                        </p>
                                        <a
                                            href="https://linkedin.com/company/ai-linkedin-post-generator"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            @AILinkedInPostGen
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Office Location</h3>
                                        <p className="text-muted-foreground text-sm">
                                            123 Innovation Drive<br />
                                            San Francisco, CA 94105<br />
                                            United States
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Quick answers to common questions
                        </p>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                q: "How quickly will I receive a response?",
                                a: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mark your message as high priority."
                            },
                            {
                                q: "Do you offer phone support?",
                                a: "Currently, we provide support via email and our in-app chat feature. This allows us to provide detailed, documented assistance for technical questions."
                            },
                            {
                                q: "Can I schedule a demo or consultation?",
                                a: "Yes! Enterprise customers can schedule personalized demos. Please mention this in your message and we'll coordinate a time that works for you."
                            },
                            {
                                q: "Where can I find technical documentation?",
                                a: "Our comprehensive help center and API documentation are available in the dashboard. For specific technical questions, our support team is here to help."
                            }
                        ].map((faq, i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
