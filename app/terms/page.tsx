import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Scale, AlertCircle, UserX, DollarSign, Shield, Mail } from "lucide-react"

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read our terms of service and user agreement for AI LinkedIn Post Generator.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6 animate-fade-in">
                        <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                            <FileCheck className="w-3 h-3 mr-1" />
                            Terms of Service
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Terms of Service
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Please read these terms carefully before using our service.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last Updated: February 4, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Points */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Key Terms at a Glance</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Scale, title: "Fair Use", desc: "Use our service responsibly and ethically" },
                            { icon: Shield, title: "Your Content", desc: "You retain ownership of content you create" },
                            { icon: DollarSign, title: "Billing", desc: "Clear pricing with no hidden fees" },
                            { icon: UserX, title: "Termination", desc: "You can cancel anytime" },
                            { icon: AlertCircle, title: "Liability", desc: "Service provided 'as is' with limitations" },
                            { icon: FileCheck, title: "Updates", desc: "We may update terms with notice" }
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

            {/* Detailed Terms */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Agreement */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using AI LinkedIn Post Generator ("Service," "we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                        </p>
                    </div>

                    {/* Account Terms */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <UserX className="w-6 h-6 text-blue-600" />
                                Account Terms
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>You must be at least 18 years old to use this Service</li>
                                <li>You must provide accurate and complete information when creating an account</li>
                                <li>You are responsible for maintaining the security of your account and password</li>
                                <li>You are responsible for all activities that occur under your account</li>
                                <li>You must not use the Service for any illegal or unauthorized purpose</li>
                                <li>You must not violate any laws in your jurisdiction when using the Service</li>
                                <li>One person or legal entity may not maintain more than one free account</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Acceptable Use */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Scale className="w-6 h-6 text-purple-600" />
                                Acceptable Use Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                You agree not to use the Service to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                                <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                                <li>Generate spam, phishing attempts, or other malicious content</li>
                                <li>Violate any intellectual property rights of others</li>
                                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Use automated systems to access the Service without permission</li>
                                <li>Resell or redistribute the Service without authorization</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Intellectual Property */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Shield className="w-6 h-6 text-green-600" />
                                Intellectual Property Rights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Your Content</h3>
                                <p className="text-muted-foreground">
                                    You retain all rights to the content you create using our Service. By using the Service, you grant us a limited license to process, store, and display your content solely for the purpose of providing the Service to you.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Our Content</h3>
                                <p className="text-muted-foreground">
                                    The Service and its original content (excluding user-generated content), features, and functionality are owned by AI LinkedIn Post Generator and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">AI-Generated Content</h3>
                                <p className="text-muted-foreground">
                                    Content generated by our AI is provided to you for your use. However, you are responsible for reviewing and ensuring that any AI-generated content complies with applicable laws and LinkedIn's terms of service before posting.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Terms */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <DollarSign className="w-6 h-6 text-orange-600" />
                                Payment and Billing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Paid plans are billed in advance on a monthly or annual basis</li>
                                <li>All fees are non-refundable except as required by law</li>
                                <li>We reserve the right to change our pricing with 30 days' notice</li>
                                <li>Failure to pay may result in suspension or termination of your account</li>
                                <li>You are responsible for all applicable taxes</li>
                                <li>Downgrades may result in loss of features or capacity</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Cancellation */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <UserX className="w-6 h-6 text-red-600" />
                                Cancellation and Termination
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Your Rights</h3>
                                <p className="text-muted-foreground">
                                    You may cancel your account at any time through your account settings. Upon cancellation, your access to paid features will continue until the end of your current billing period.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Our Rights</h3>
                                <p className="text-muted-foreground">
                                    We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity. We will provide notice when reasonably possible.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Disclaimers */}
                    <Card className="border-2 border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                                Disclaimers and Limitations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                    Important Notice
                                </p>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                                </p>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free</li>
                                <li>We are not responsible for the accuracy, quality, or appropriateness of AI-generated content</li>
                                <li>You are solely responsible for how you use content generated by the Service</li>
                                <li>We do not guarantee specific results or outcomes from using the Service</li>
                                <li>Our liability is limited to the amount you paid us in the past 12 months</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Indemnification */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
                        <p className="text-muted-foreground">
                            You agree to indemnify and hold harmless AI LinkedIn Post Generator and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
                        </p>
                    </div>

                    {/* Governing Law */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                        <p className="text-muted-foreground">
                            These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County, California.
                        </p>
                    </div>

                    {/* Changes to Terms */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                        <p className="text-muted-foreground">
                            We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
                        </p>
                    </div>

                    {/* Contact */}
                    <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                        <CardContent className="pt-6 text-center space-y-4">
                            <Mail className="w-12 h-12 mx-auto text-blue-600" />
                            <h3 className="text-2xl font-bold">Questions About These Terms?</h3>
                            <p className="text-muted-foreground">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-2">
                                <p className="font-medium">Email: <a href="mailto:legal@ailinkedinpost.com" className="text-blue-600 hover:text-blue-700">legal@ailinkedinpost.com</a></p>
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
