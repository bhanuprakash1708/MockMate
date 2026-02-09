"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A radar chart showing skill levels across subjects"

const chartData = [
  { subject: "Mathematics", level: 92 },
  { subject: "Science", level: 88 },
  { subject: "History", level: 85 },
  { subject: "Literature", level: 90 },
  { subject: "Geography", level: 78 },
  { subject: "Physics", level: 83 },
]

const chartConfig = {
  level: {
    label: "Skill Level",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig

export function SkillsRadarChart() {
  return (
    <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader className="items-center pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-lg bg-blue-50">
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          Skills Overview
        </CardTitle>
        <CardDescription className="text-center">
          Your proficiency levels across different subjects
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid
              className="fill-blue-50 opacity-40"
              gridType="polygon"
            />
            <PolarAngleAxis 
              dataKey="subject" 
              className="text-xs text-gray-600"
              tick={{ fontSize: 11 }}
            />
            <Radar
              dataKey="level"
              fill="hsl(221, 83%, 53%)"
              fillOpacity={0.15}
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={{ fill: "hsl(221, 83%, 53%)", strokeWidth: 0, r: 4 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 leading-none font-medium text-green-600">
          Trending up by 8.5% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-500 flex items-center gap-2 leading-none">
          Based on quiz performance and learning activities
        </div>
      </CardFooter>
    </Card>
  )
}
