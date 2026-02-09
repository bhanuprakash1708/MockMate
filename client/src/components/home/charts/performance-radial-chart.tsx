"use client"

import { TrendingUp } from "lucide-react"
import { RadialBarChart, RadialBar } from "recharts"

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
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { name: "Completed", value: 85, fill: "#3b82f6" },
  { name: "Remaining", value: 15, fill: "#e5e7eb" }
]

const chartConfig = {
  Completed: {
    label: "Completed",
    color: "#3b82f6",
  },
  Remaining: {
    label: "Remaining",
    color: "#e5e7eb",
  },
} satisfies ChartConfig

export function PerformanceRadialChart() {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Overall Progress</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Your learning completion rate
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={60}
            outerRadius={120}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-gray-900 text-2xl font-bold"
            >
              85%
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-green-600">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-500 leading-none">
          Great progress! Keep up the momentum.
        </div>
      </CardFooter>
    </Card>
  )
}
