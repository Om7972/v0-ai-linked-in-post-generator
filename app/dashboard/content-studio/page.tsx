"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Save,
  Settings,
  Command,
  Users,
  Palette,
  Layout,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const OUTPUT_TYPES = [
  { id: "linkedin_post", label: "LinkedIn Post" },
  { id: "linkedin_carousel", label: "LinkedIn Carousel" },
  { id: "poll_ideas", label: "Poll Ideas" },
  { id: "comment_suggestions", label: "Comment Suggestions" },
  { id: "newsletter_draft", label: "Newsletter Draft" },
  { id: "linkedin_headline", label: "LinkedIn Headline" },
  { id: "about_section", label: "About Section" },
  { id: "content_hooks", label: "Content Hooks" },
] as const;

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "founder", label: "Founder" },
  { id: "influencer", label: "Influencer" },
];

export default function ContentStudioPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Form state
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("professionals in my industry");
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(["linkedin_post"]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Results state
  const [projectId, setProjectId] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/auth/login");
    }
  }, [token, authLoading, router]);

  const handleOutputToggle = (type: string) => {
    setSelectedOutputs((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!topic || selectedOutputs.length === 0) return;

    setIsGenerating(true);
    setCurrentProgress(0);

    try {
      const response = await fetch("/api/content-studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          tone,
          audience,
          outputTypes: selectedOutputs,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setProjectId(data.projectId);

      const newOutputs: Record<string, string> = {};
      for (let i = 0; i < data.outputs.length; i++) {
        const out = data.outputs[i];
        newOutputs[out.output_type] = out.content;
        setCurrentProgress(Math.round(((i + 1) / data.outputs.length) * 100));
        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setOutputs(newOutputs);
    } catch (error) {
      console.error("Error generating:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (content: string, type: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    const content = Object.entries(outputs)
      .map(([type, text]) => `# ${type}\n\n${text}\n\n`)
      .join("");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-studio-${Date.now()}.txt`;
    a.click();
  };

  if (authLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="lg:col-span-3 border-r border-border/50 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Content Studio
              </h2>
              <p className="text-muted-foreground text-sm">
                Generate multiple content assets from one idea
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Topic
                </label>
                <Input
                  placeholder="e.g., AI in marketing, remote work tips..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <Button
                      key={t.id}
                      variant={tone === t.id ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setTone(t.id)}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Audience
                </label>
                <Input
                  placeholder="e.g., startup founders, software engineers..."
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Content Types
                </label>
                <div className="space-y-2">
                  {OUTPUT_TYPES.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        id={type.id}
                        checked={selectedOutputs.includes(type.id)}
                        onCheckedChange={() => handleOutputToggle(type.id)}
                        disabled={isGenerating}
                      />
                      <label
                        htmlFor={type.id}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic || selectedOutputs.length === 0}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      Generating... {currentProgress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="lg:col-span-1 p-6 border-r border-border/50 flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent/20">
          {isGenerating ? (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-bold text-primary">
                  {currentProgress}%
                </div>
              </div>
              <p className="text-muted-foreground">
                Generating your content...
              </p>
            </div>
          ) : Object.keys(outputs).length > 0 ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-xl font-bold">Content Ready!</h3>
                <p className="text-muted-foreground">
                  {Object.keys(outputs).length} assets generated
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="secondary" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button variant="outline" onClick={() => {
                  setOutputs({});
                  setProjectId(null);
                }}>
                  New Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-xl font-bold">Ready to create!</h3>
                <p className="text-muted-foreground">
                  Enter your topic and generate content
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-8 p-6 overflow-y-auto">
          {Object.keys(outputs).length > 0 ? (
            <Tabs defaultValue={Object.keys(outputs)[0]} className="w-full">
              <TabsList className="w-full flex-wrap h-auto p-1 mb-6">
                {Object.keys(outputs).map((type) => {
                  const typeInfo = OUTPUT_TYPES.find((t) => t.id === type);
                  return (
                    <TabsTrigger key={type} value={type} className="flex-1 min-w-[100px]">
                      {typeInfo?.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(outputs).map(([type, content]) => (
                <TabsContent key={type} value={type} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{OUTPUT_TYPES.find((t) => t.id === type)?.label}</CardTitle>
                          <CardDescription>Generated content</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(content, type)}
                          >
                            {copied === type ? (
                              <Check className="h-4 w-4 mr-1" />
                            ) : (
                              <Copy className="h-4 w-4 mr-1" />
                            )}
                            {copied === type ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={content}
                          onChange={(e) =>
                            setOutputs((prev) => ({ ...prev, [type]: e.target.value }))
                          }
                          className="min-h-[400px] w-full resize-none bg-muted/30"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-4 max-w-md">
                <Save className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select your content types and click generate to see your content here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Import missing icon
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
