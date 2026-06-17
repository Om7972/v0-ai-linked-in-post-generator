"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/app/dashboard/layout";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OpportunityItem {
  id?: string;
  topic: string;
  category: string;
  confidence_score: number;
  status: "new" | "saved" | "dismissed" | "generated";
  angle: string;
  reason: string;
  trend_match: string;
  quick_prompt: string;
  created_at?: string;
}

interface OpportunityDashboardData {
  niche: string;
  posting_frequency: string;
  opportunity_score: number;
  opportunities: OpportunityItem[];
  weekly_topics: string[];
  ai_recommendations: string[];
  content_gap_alerts: string[];
  suggested_angles: string[];
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function OpportunitiesWorkspace() {
  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<OpportunityDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchDashboard(false);
  }, [token]);

  const fetchDashboard = async (forceRefresh: boolean) => {
    if (!token) {
      return;
    }

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`/api/opportunities${forceRefresh ? "?refresh=true" : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to load opportunities");
      }

      setData(payload);
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to load opportunities",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const trackAction = async (opportunityId: string | undefined, actionTaken: string) => {
    if (!token) {
      return;
    }

    try {
      await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "track",
          opportunityId: opportunityId || null,
          actionTaken,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const quickGenerate = async (opportunity: OpportunityItem) => {
    await trackAction(opportunity.id, "quick_generate");
    router.push(`/dashboard/content-studio?topic=${encodeURIComponent(opportunity.topic)}`);
  };

  const saveForLater = async (opportunity: OpportunityItem) => {
    await trackAction(opportunity.id, "saved");
    toast({
      title: "Saved to history",
      description: "Opportunity action recorded for future recommendation tuning.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your opportunity engine...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.section variants={item} className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-cyan-500/10 p-6 shadow-sm">
        <div className="absolute right-0 top-0 h-44 w-44 translate-x-10 -translate-y-8 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge className="border-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI Content Opportunity Engine
            </Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Know what to post next</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
                Personalized opportunities, gap detection, trend-aligned recommendations, and one-click handoff into content generation.
              </p>
            </div>
          </div>

          <Button
            onClick={() => void fetchDashboard(true)}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Ideas
          </Button>
        </div>
      </motion.section>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={<Compass className="h-5 w-5 text-blue-600" />}
          label="User Niche"
          value={data.niche}
          help="Personalized niche context used for scoring and recommendations."
        />
        <MetricCard
          icon={<Target className="h-5 w-5 text-violet-600" />}
          label="Opportunity Score"
          value={`${data.opportunity_score}/100`}
          help="Weighted from niche fit, content gaps, trend alignment, and posting cadence."
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          label="Posting Frequency"
          value={data.posting_frequency}
          help="Used to balance easy-win topics with authority-building plays."
        />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <motion.div variants={item} className="space-y-6">
          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Opportunity Feed
              </CardTitle>
              <CardDescription>Highest-value ideas ranked for your niche and brand momentum.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.opportunities.map((opportunity) => (
                <div key={opportunity.id || opportunity.topic} className="rounded-3xl border border-border/60 bg-muted/20 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          {opportunity.category}
                        </Badge>
                        <Badge className="rounded-full border-0 bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                          {Math.round(opportunity.confidence_score)} confidence
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{opportunity.topic}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{opportunity.reason}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Content Angle</p>
                          <p className="mt-2 text-sm">{opportunity.angle}</p>
                        </div>
                        <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">Trend Match</p>
                          <p className="mt-2 text-sm">{opportunity.trend_match}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 lg:w-[220px] lg:flex-col">
                      <Button onClick={() => void quickGenerate(opportunity)} className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                        Quick Generate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={() => void saveForLater(opportunity)} className="flex-1">
                        Save Signal
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Suggested Angles
              </CardTitle>
              <CardDescription>Reusable perspectives for authority-driven content.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {data.suggested_angles.map((angle, index) => (
                <div key={`${angle}-${index}`} className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm">
                  {angle}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <InfoCard
            title="Weekly Suggested Topics"
            description="Fast-start prompts for your upcoming publishing queue."
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            items={data.weekly_topics}
            actionLabel="Open Studio"
            onAction={(topic) => router.push(`/dashboard/content-studio?topic=${encodeURIComponent(topic)}`)}
          />

          <InfoCard
            title="AI Recommendation Cards"
            description="System guidance based on your current opportunity landscape."
            icon={<Target className="h-5 w-5 text-primary" />}
            items={data.ai_recommendations}
          />

          <InfoCard
            title="Content Gap Alerts"
            description="Coverage issues the engine wants you to close next."
            icon={<Compass className="h-5 w-5 text-primary" />}
            items={data.content_gap_alerts}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  help,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  help: string;
}) {
  return (
    <Card className="rounded-3xl border-border/60 shadow-sm">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="rounded-full bg-muted p-2">{icon}</div>
        </div>
        <div>
          <p className="text-xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{help}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCard({
  title,
  description,
  icon,
  items,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: string[];
  actionLabel?: string;
  onAction?: (item: string) => void;
}) {
  return (
    <Card className="rounded-3xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm">{item}</p>
              {actionLabel && onAction ? (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => onAction(item)}>
                  {actionLabel}
                </Button>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            No insights available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OpportunitiesPage() {
  return (
    <DashboardLayout>
      <OpportunitiesWorkspace />
    </DashboardLayout>
  );
}
