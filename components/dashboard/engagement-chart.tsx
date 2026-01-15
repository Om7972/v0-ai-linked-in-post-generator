"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EngagementDataPoint } from "@/lib/dashboard-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface EngagementChartProps {
  data: EngagementDataPoint[]
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Engagement Score Trend</CardTitle>
        <CardDescription>
          Your average engagement score over the past 3 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${value}%`}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(217, 91%, 60%)"
                fillOpacity={1}
                fill="url(#colorScore)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats footer */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-lg font-semibold">
              {Math.round(data.reduce((a, b) => a + b.score, 0) / data.length)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Highest</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {Math.max(...data.map((d) => d.score))}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Posts</p>
            <p className="text-lg font-semibold">
              {data.reduce((a, b) => a + b.posts, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
