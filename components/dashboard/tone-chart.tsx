"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToneDistribution } from "@/lib/dashboard-data"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getToneColor } from "@/lib/dashboard-data"

interface ToneChartProps {
  data: ToneDistribution[]
}

const COLORS = ["#3b82f6", "#a855f7", "#ec4899", "#10b981"]

export function ToneChart({ data }: ToneChartProps) {
  return (
    <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Tone Distribution</CardTitle>
        <CardDescription>
          Breakdown of posts by writing tone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tone, percentage }) => `${tone}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${value} posts`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with counts */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border/50">
          {data.map((item, index) => (
            <div key={item.tone} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div>
                <p className="text-xs font-medium">{item.tone}</p>
                <p className="text-xs text-muted-foreground">
                  {item.count} ({item.percentage}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
