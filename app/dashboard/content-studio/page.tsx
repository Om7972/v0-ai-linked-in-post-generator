"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Clock3,
  Command,
  Copy,
  Download,
  History,
  Layers3,
  Palette,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/power-user/command-palette";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const DRAFT_STORAGE_KEY = "content-studio-draft-v1";

const OUTPUT_TYPES = [
  { id: "linkedin_post", label: "LinkedIn Post", description: "Primary long-form post for your feed" },
  { id: "linkedin_carousel", label: "Carousel Script", description: "Slide-by-slide breakdown for carousels" },
  { id: "poll_ideas", label: "Poll Ideas", description: "Interactive prompts to trigger engagement" },
  { id: "comment_suggestions", label: "Comment Suggestions", description: "Thoughtful replies to deepen conversation" },
  { id: "newsletter_draft", label: "Newsletter Draft", description: "Long-form email format for subscribers" },
  { id: "linkedin_headline", label: "LinkedIn Headline", description: "Profile headline variations" },
  { id: "about_section", label: "About Section", description: "Profile summary copy for authority building" },
  { id: "content_hooks", label: "Content Hooks", description: "Opening lines with high stop-the-scroll potential" },
] as const;

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "founder", label: "Founder" },
  { id: "influencer", label: "Influencer" },
] as const;

interface ContentOutputRecord {
  id?: string;
  output_type: string;
  content: string;
  version?: number;
  created_at?: string;
}

interface ContentProjectRecord {
  id: string;
  topic: string;
  tone?: string;
  audience?: string;
  created_at: string;
  content_outputs?: ContentOutputRecord[];
}

export default function ContentStudioPage() {
  const { token, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]["id"]>("professional");
  const [audience, setAudience] = useState("professionals in my industry");
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(["linkedin_post", "content_hooks"]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("linkedin_post");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<ContentProjectRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const orderedOutputTypes = useMemo(
    () => OUTPUT_TYPES.filter((item) => selectedOutputs.includes(item.id)),
    [selectedOutputs]
  );

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/auth/login");
    }
  }, [authLoading, router, token]);

  useEffect(() => {
    const storedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (storedDraft) {
      try {
        const parsed = JSON.parse(storedDraft);
        setTopic(parsed.topic || "");
        setTone(parsed.tone || "professional");
        setAudience(parsed.audience || "professionals in my industry");
        setSelectedOutputs(
          Array.isArray(parsed.selectedOutputs) && parsed.selectedOutputs.length > 0
            ? parsed.selectedOutputs
            : ["linkedin_post", "content_hooks"]
        );
        setOutputs(parsed.outputs || {});
        if (parsed.outputs && Object.keys(parsed.outputs).length > 0) {
          setActiveTab(Object.keys(parsed.outputs)[0]);
        }
      } catch (error) {
        console.warn("Failed to restore Content Studio draft:", error);
      }
    }
  }, []);

  useEffect(() => {
    const topicFromQuery = searchParams.get("topic");
    if (topicFromQuery) {
      setTopic(topicFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const draft = {
      topic,
      tone,
      audience,
      selectedOutputs,
      outputs,
    };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [audience, outputs, selectedOutputs, tone, topic]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!isGenerating && topic.trim() && selectedOutputs.length > 0) {
          void handleGenerate();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGenerating, selectedOutputs.length, token, topic]);

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    if (!token) {
      return;
    }

    setHistoryLoading(true);
    try {
      const response = await fetch("/api/content-studio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load Content Studio history");
      }

      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOutputToggle = (type: string) => {
    setSelectedOutputs((current) => {
      if (current.includes(type)) {
        const next = current.filter((item) => item !== type);
        return next.length > 0 ? next : current;
      }
      return [...current, type];
    });
  };

  const loadProject = (project: ContentProjectRecord) => {
    setProjectId(project.id);
    setTopic(project.topic);
    setTone((project.tone as (typeof TONES)[number]["id"]) || "professional");
    setAudience(project.audience || "professionals in my industry");

    const nextOutputs = (project.content_outputs || []).reduce<Record<string, string>>((acc, item) => {
      acc[item.output_type] = item.content;
      return acc;
    }, {});

    const nextSelectedOutputs = Object.keys(nextOutputs);
    setSelectedOutputs(nextSelectedOutputs.length > 0 ? nextSelectedOutputs : ["linkedin_post"]);
    setOutputs(nextOutputs);
    setActiveTab(nextSelectedOutputs[0] || "linkedin_post");
    toast({
      title: "Version restored",
      description: "Loaded the selected project into Content Studio.",
    });
  };

  const handleGenerate = async () => {
    if (!token || !topic.trim() || selectedOutputs.length === 0) {
      return;
    }

    setIsGenerating(true);
    setProgress(12);

    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 88 ? current : current + 8));
    }, 350);

    try {
      const response = await fetch("/api/content-studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          tone,
          audience,
          outputTypes: selectedOutputs,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Generation failed");
      }

      const nextOutputs = (payload.outputs || []).reduce<Record<string, string>>(
        (acc: Record<string, string>, item: ContentOutputRecord) => {
          acc[item.output_type] = item.content;
          return acc;
        },
        {}
      );

      setProjectId(payload.projectId || null);
      setOutputs(nextOutputs);
      const firstTab = Object.keys(nextOutputs)[0] || selectedOutputs[0] || "linkedin_post";
      setActiveTab(firstTab);
      setProgress(100);
      toast({
        title: "Assets generated",
        description: `Created ${Object.keys(nextOutputs).length} content assets from one idea.`,
      });
      await fetchHistory();
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      window.clearInterval(timer);
      setTimeout(() => setProgress(0), 500);
      setIsGenerating(false);
    }
  };

  const handleCopy = async (content: string, key: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleExport = () => {
    const exportPayload = Object.entries(outputs)
      .map(([key, value]) => {
        const outputConfig = OUTPUT_TYPES.find((item) => item.id === key);
        return `# ${outputConfig?.label || key}\n\n${value}\n`;
      })
      .join("\n\n");

    const blob = new Blob([exportPayload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `content-studio-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setProjectId(null);
    setTopic("");
    setTone("professional");
    setAudience("professionals in my industry");
    setSelectedOutputs(["linkedin_post", "content_hooks"]);
    setOutputs({});
    setActiveTab("linkedin_post");
  };

  if (authLoading || !token) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommandPalette />

      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10 p-6 shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge className="border-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI Content Studio
            </Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Generate every asset from one idea</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
                Build posts, profile assets, hooks, and newsletter drafts in one premium workspace without breaking the dashboard layout.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Command className="mr-1 h-3.5 w-3.5" />
              Ctrl/Cmd + K
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Wand2 className="mr-1 h-3.5 w-3.5" />
              Ctrl/Cmd + Enter
            </Badge>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers3 className="h-5 w-5 text-primary" />
                Studio Inputs
              </CardTitle>
              <CardDescription>Define the idea, audience, and asset mix once.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="AI content strategy for B2B founders"
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((option) => (
                    <Button
                      key={option.id}
                      type="button"
                      variant={tone === option.id ? "default" : "secondary"}
                      className="justify-center"
                      onClick={() => setTone(option.id)}
                      disabled={isGenerating}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Audience
                </label>
                <Input
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  placeholder="Startup founders and GTM leaders"
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Content Types</label>
                  <span className="text-xs text-muted-foreground">{selectedOutputs.length} selected</span>
                </div>
                <div className="space-y-2">
                  {OUTPUT_TYPES.map((item) => (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOutputToggle(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleOutputToggle(item.id);
                        }
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors",
                        "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30",
                        selectedOutputs.includes(item.id)
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/60 hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={selectedOutputs.includes(item.id)}
                        onCheckedChange={() => handleOutputToggle(item.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
                  disabled={isGenerating || !topic.trim() || selectedOutputs.length === 0}
                  onClick={() => void handleGenerate()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isGenerating}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-primary" />
                Version History
              </CardTitle>
              <CardDescription>Reload earlier projects and continue editing.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[260px] pr-3">
                <div className="space-y-2">
                  {historyLoading ? (
                    <p className="text-sm text-muted-foreground">Loading history...</p>
                  ) : history.length > 0 ? (
                    history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => loadProject(item)}
                        className={cn(
                          "w-full rounded-2xl border p-3 text-left transition-colors hover:bg-muted/50",
                          projectId === item.id ? "border-primary/30 bg-primary/5" : "border-border/60"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{item.topic}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {(item.content_outputs || []).length} assets • {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                      Generated projects will appear here for quick restore and version reuse.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-lg">Generation Status</CardTitle>
                  <CardDescription>
                    Auto-save is enabled locally. Generated assets stay editable in place.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleExport} disabled={Object.keys(outputs).length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void handleCopy(Object.values(outputs).join("\n\n"), "all")}
                    disabled={Object.keys(outputs).length === 0}
                  >
                    {copiedKey === "all" ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copiedKey === "all" ? "Copied" : "Copy All"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Topic</p>
                  <p className="mt-2 text-sm font-medium">{topic || "No topic selected yet"}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Tone</p>
                  <p className="mt-2 text-sm font-medium capitalize">{tone}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Assets</p>
                  <p className="mt-2 text-sm font-medium">{orderedOutputTypes.length}</p>
                </div>
              </div>

              {isGenerating ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Generating multi-output content</span>
                    <span className="text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                  <p className="text-sm text-muted-foreground">
                    Building professional assets from a single prompt and saving the session state.
                  </p>
                </motion.div>
              ) : Object.keys(outputs).length > 0 ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">Content bundle ready</p>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(outputs).length} outputs generated and available for edit, copy, or export.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center">
                  <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">Content Studio is ready</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add a topic, choose your formats, and run generation to fill the workspace.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Generated Content</CardTitle>
              <CardDescription>Review, refine, and copy each asset individually.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(outputs).length > 0 ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                    {orderedOutputTypes.map((item) => (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className="rounded-full border border-border/60 bg-muted/40 px-4 py-2 data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10"
                      >
                        {item.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {orderedOutputTypes.map((item) => (
                    <TabsContent key={item.id} value={item.id} className="mt-0">
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => void handleCopy(outputs[item.id] || "", item.id)}>
                            {copiedKey === item.id ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                            {copiedKey === item.id ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        <Textarea
                          value={outputs[item.id] || ""}
                          onChange={(event) =>
                            setOutputs((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }))
                          }
                          className="min-h-[420px] resize-y rounded-2xl border-border/60 bg-background"
                        />
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center">
                  <Wand2 className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">No assets generated yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your output tabs will appear here once generation completes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
