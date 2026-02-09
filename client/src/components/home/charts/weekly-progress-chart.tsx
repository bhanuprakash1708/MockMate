"use client"

import { BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { day: "Mon", quizzes: 4, correct: 3 },
  { day: "Tue", quizzes: 6, correct: 5 },
  { day: "Wed", quizzes: 8, correct: 7 },
  { day: "Thu", quizzes: 5, correct: 4 },
  { day: "Fri", quizzes: 9, correct: 8 },
  { day: "Sat", quizzes: 7, correct: 6 },
  { day: "Sun", quizzes: 3, correct: 3 },
]

const chartConfig = {
  quizzes: {
    label: "Quizzes Taken",
    color: "hsl(221, 83%, 53%)",
  },
  correct: {
    label: "Correct Answers",
    color: "hsl(220, 70%, 65%)", // Lighter blue instead of green
  },
} satisfies ChartConfig

export function WeeklyProgressChart() {
  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-lg bg-blue-50">
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
          Weekly Progress
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">Your quiz performance over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="quizzes" fill="var(--color-quizzes)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="correct" fill="var(--color-correct)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
