import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cookie, Settings, Eye, Shield, BarChart, Mail } from "lucide-react"

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "Learn about how we use cookies and similar technologies on our website.",
}

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 animate-fade-in">
                        <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            <Cookie className="w-3 h-3 mr-1" />
                            Cookie Policy
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Cookie Policy
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Understanding how we use cookies and similar technologies to improve your experience.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: February 4, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* What Are Cookies */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold mb-4">What Are Cookies?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to website owners.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar technologies (such as web beacons, pixels, and local storage) to recognize you, customize your experience, and analyze how you use our Service.
                        </p>
                    </div>

                    {/* Types of Cookies */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-center">Types of Cookies We Use</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        Essential Cookies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling out forms.
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                                            Examples: Authentication, security, session management
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                                            <BarChart className="w-5 h-5 text-white" />
                                        </div>
                                        Analytics Cookies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                    </p>
                                    <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                                            Examples: Google Analytics, usage statistics, performance metrics
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                                            <Settings className="w-5 h-5 text-white" />
                                        </div>
                                        Functional Cookies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                                    </p>
                                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                                            Examples: Language preferences, theme settings, saved filters
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                                            <Eye className="w-5 h-5 text-white" />
                                        </div>
                                        Targeting Cookies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        These cookies may be set through our site by advertising partners to build a profile of your interests and show you relevant ads.
                                    </p>
                                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-orange-900 dark:text-orange-100">
                                            Examples: Advertising networks, remarketing, conversion tracking
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Specific Cookies */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-2xl">Cookies We Use</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-border">
                                        <tr className="text-left">
                                            <th className="pb-3 font-semibold">Cookie Name</th>
                                            <th className="pb-3 font-semibold">Purpose</th>
                                            <th className="pb-3 font-semibold">Duration</th>
                                            <th className="pb-3 font-semibold">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr>
                                            <td className="py-3 font-mono text-xs">auth_token</td>
                                            <td className="py-3 text-muted-foreground">Maintains your login session</td>
                                            <td className="py-3 text-muted-foreground">30 days</td>
                                            <td className="py-3"><Badge variant="outline">Essential</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-xs">theme_preference</td>
                                            <td className="py-3 text-muted-foreground">Remembers your theme choice</td>
                                            <td className="py-3 text-muted-foreground">1 year</td>
                                            <td className="py-3"><Badge variant="outline">Functional</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-xs">_ga</td>
                                            <td className="py-3 text-muted-foreground">Google Analytics tracking</td>
                                            <td className="py-3 text-muted-foreground">2 years</td>
                                            <td className="py-3"><Badge variant="outline">Analytics</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-xs">_gid</td>
                                            <td className="py-3 text-muted-foreground">Google Analytics session</td>
                                            <td className="py-3 text-muted-foreground">24 hours</td>
                                            <td className="py-3"><Badge variant="outline">Analytics</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-xs">cookie_consent</td>
                                            <td className="py-3 text-muted-foreground">Stores your cookie preferences</td>
                                            <td className="py-3 text-muted-foreground">1 year</td>
                                            <td className="py-3"><Badge variant="outline">Essential</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Third-Party Cookies */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-2xl">Third-Party Cookies</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We use services from third-party companies that may set their own cookies. These include:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                                <li><strong>Vercel Analytics:</strong> For performance monitoring and optimization</li>
                                <li><strong>Supabase:</strong> For authentication and database services</li>
                                <li><strong>Google Gemini AI:</strong> For AI-powered content generation</li>
                            </ul>
                            <p className="text-sm text-muted-foreground italic">
                                These third parties have their own privacy policies governing their use of cookies.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Managing Cookies */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Settings className="w-6 h-6 text-blue-600" />
                                Managing Your Cookie Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                You have several options for managing cookies:
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Browser Settings</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Most web browsers allow you to control cookies through their settings. You can:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                                        <li>Block all cookies</li>
                                        <li>Accept only first-party cookies</li>
                                        <li>Delete cookies when you close your browser</li>
                                        <li>View and delete individual cookies</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Browser-Specific Instructions</h3>
                                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                            → Chrome Cookie Settings
                                        </a>
                                        <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                            → Firefox Cookie Settings
                                        </a>
                                        <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                            → Safari Cookie Settings
                                        </a>
                                        <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                            → Edge Cookie Settings
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                                        Important Note
                                    </p>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Blocking or deleting cookies may impact your experience and some features may not work properly.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Do Not Track */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Do Not Track Signals</h2>
                        <p className="text-muted-foreground">
                            Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. We do not currently respond to DNT signals, but we are committed to respecting your privacy choices.
                        </p>
                    </div>

                    {/* Updates */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Changes to This Cookie Policy</h2>
                        <p className="text-muted-foreground">
                            We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
                        </p>
                    </div>

                    {/* Contact */}
                    <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                        <CardContent className="pt-6 text-center space-y-4">
                            <Mail className="w-12 h-12 mx-auto text-blue-600" />
                            <h3 className="text-2xl font-bold">Questions About Cookies?</h3>
                            <p className="text-muted-foreground">
                                If you have any questions about our use of cookies, please contact us:
                            </p>
                            <div className="space-y-2">
                                <p className="font-medium">Email: <a href="mailto:privacy@ailinkedinpost.com" className="text-blue-600 hover:text-blue-700">privacy@ailinkedinpost.com</a></p>
                                <p className="text-sm text-muted-foreground">
                                    123 Innovation Drive, San Francisco, CA 94105
                                </p>
                            </div>
                            <div className="pt-4">
                                <Link href="/privacy">
                                    <Button variant="outline">
                                        View Full Privacy Policy
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
