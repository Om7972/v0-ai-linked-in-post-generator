import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Database, UserCheck, Bell, Cookie, Mail } from "lucide-react"

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 animate-fade-in">
                        <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            <Shield className="w-3 h-3 mr-1" />
                            Privacy Policy
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Your Privacy Matters
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            We're committed to protecting your personal information and being transparent about how we use it.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: February 4, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Overview */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Privacy at a Glance</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Lock, title: "Secure Storage", desc: "Your data is encrypted and stored securely" },
                            { icon: Eye, title: "Transparency", desc: "We're clear about what data we collect" },
                            { icon: UserCheck, title: "Your Control", desc: "You own your data and can delete it anytime" },
                            { icon: Shield, title: "No Selling", desc: "We never sell your personal information" }
                        ].map((item, i) => (
                            <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6 space-y-3">
                                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Policy */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Introduction */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            AI LinkedIn Post Generator ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                        </p>
                    </div>

                    {/* Information We Collect */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Database className="w-6 h-6 text-blue-600" />
                                Information We Collect
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                                <p className="text-muted-foreground mb-2">
                                    We collect information that you provide directly to us, including:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Name and email address</li>
                                    <li>Account credentials</li>
                                    <li>Profile information</li>
                                    <li>Payment information (processed securely through third-party providers)</li>
                                    <li>Communication preferences</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2">Usage Information</h3>
                                <p className="text-muted-foreground mb-2">
                                    We automatically collect certain information about your device and how you interact with our service:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Log data (IP address, browser type, pages visited)</li>
                                    <li>Device information</li>
                                    <li>Usage patterns and preferences</li>
                                    <li>Generated content and prompts</li>
                                    <li>Performance and analytics data</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How We Use Your Information */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Eye className="w-6 h-6 text-purple-600" />
                                How We Use Your Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process your transactions and manage your account</li>
                                <li>Send you technical notices, updates, and support messages</li>
                                <li>Respond to your comments, questions, and customer service requests</li>
                                <li>Communicate with you about products, services, and events</li>
                                <li>Monitor and analyze trends, usage, and activities</li>
                                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                                <li>Personalize and improve your experience</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Data Sharing */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <UserCheck className="w-6 h-6 text-green-600" />
                                How We Share Your Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We may share your information in the following situations:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li><strong>Service Providers:</strong> We share information with third-party vendors who perform services on our behalf (e.g., payment processing, analytics, hosting)</li>
                                <li><strong>AI Services:</strong> Your prompts are processed by Google Gemini AI to generate content. Google's privacy policy applies to this processing</li>
                                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                                <li><strong>With Your Consent:</strong> We may share information for any other purpose with your consent</li>
                            </ul>
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    We never sell your personal information to third parties.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Security */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Lock className="w-6 h-6 text-orange-600" />
                                Data Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We implement appropriate technical and organizational measures to protect your personal information, including:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Secure data centers and infrastructure</li>
                                <li>Employee training on data protection</li>
                            </ul>
                            <p className="text-sm text-muted-foreground italic mt-4">
                                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Your Rights */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Shield className="w-6 h-6 text-red-600" />
                                Your Privacy Rights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Depending on your location, you may have the following rights:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                                <li><strong>Objection:</strong> Object to processing of your information</li>
                                <li><strong>Restriction:</strong> Request restriction of processing</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                To exercise these rights, please contact us at{" "}
                                <a href="mailto:privacy@ailinkedinpost.com" className="text-blue-600 hover:text-blue-700 font-medium">
                                    privacy@ailinkedinpost.com
                                </a>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Cookies */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Cookie className="w-6 h-6 text-yellow-600" />
                                Cookies and Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We use cookies and similar tracking technologies to collect and track information about your activity on our service. You can control cookies through your browser settings.
                            </p>
                            <Link href="/cookies">
                                <Button variant="outline" className="mt-2">
                                    Learn More About Cookies
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Children's Privacy */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                        <p className="text-muted-foreground">
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                        </p>
                    </div>

                    {/* Changes to Policy */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </div>

                    {/* Contact */}
                    <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                        <CardContent className="pt-6 text-center space-y-4">
                            <Mail className="w-12 h-12 mx-auto text-blue-600" />
                            <h3 className="text-2xl font-bold">Questions About Privacy?</h3>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="space-y-2">
                                <p className="font-medium">Email: <a href="mailto:privacy@ailinkedinpost.com" className="text-blue-600 hover:text-blue-700">privacy@ailinkedinpost.com</a></p>
                                <p className="text-sm text-muted-foreground">
                                    123 Innovation Drive, San Francisco, CA 94105
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
