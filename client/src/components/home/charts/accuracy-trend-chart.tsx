"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { week: "Week 1", accuracy: 65 },
  { week: "Week 2", accuracy: 72 },
  { week: "Week 3", accuracy: 78 },
  { week: "Week 4", accuracy: 85 },
  { week: "Week 5", accuracy: 88 },
  { week: "Week 6", accuracy: 92 },
]

const chartConfig = {
  accuracy: {
    label: "Accuracy %",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function AccuracyTrendChart() {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-lg bg-red-50">
            <TrendingUp className="h-4 w-4 text-red-600" />
          </div>
          Accuracy Trend
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">Your quiz accuracy improvement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => value.replace("Week ", "W")}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} domain={[60, 95]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accuracy)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-accuracy)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="accuracy"
              type="natural"
              fill="url(#fillAccuracy)"
              fillOpacity={0.4}
              stroke="var(--color-accuracy)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium text-green-600">
              Trending up by 27% over 6 weeks <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Consistent improvement in quiz accuracy
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
