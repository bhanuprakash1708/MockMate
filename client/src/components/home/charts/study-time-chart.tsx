"use client"

import { Clock } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { name: "Quiz Taking", value: 45, fill: "hsl(221, 83%, 53%)" },
  { name: "AI Chat", value: 25, fill: "hsl(142, 71%, 45%)" },
  { name: "Document Review", value: 20, fill: "hsl(47, 96%, 53%)" },
  { name: "Others", value: 10, fill: "hsl(0, 84%, 60%)" },
]

const chartConfig = {
  value: {
    label: "Time %",
  },
  quizTaking: {
    label: "Quiz Taking",
    color: "hsl(221, 83%, 53%)",
  },
  aiChat: {
    label: "AI Chat",
    color: "hsl(142, 71%, 45%)",
  },
  documentReview: {
    label: "Document Review",
    color: "hsl(47, 96%, 53%)",
  },
  others: {
    label: "Others",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function StudyTimeChart() {
  return (
    <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-lg bg-orange-50">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          Study Time
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">How you spend your learning time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="space-y-3 mt-6">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-gray-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
