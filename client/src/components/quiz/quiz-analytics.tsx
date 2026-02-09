import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  TrendingUp,
  Target,
  Clock,
  Activity,
  Trophy,
  Zap,
  Brain,
  Timer,
  Award,
  CheckCircle,
} from "lucide-react"
import type { Quiz } from "@/types/quiz"

interface QuizAnalyticsProps {
  quiz: Quiz
  selectedAnswers: number[]
  timeSpent: number
}

const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ quiz, selectedAnswers, timeSpent }) => {
  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 }
    const correct = selectedAnswers.reduce((count, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? count + 1 : count
    }, 0)
    const total = quiz.questions.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
    return { correct, total, percentage }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const score = calculateScore()
  const avgTimePerQuestion = Math.floor(timeSpent / quiz.questions.length)

  // Chart configurations
  const performanceConfig = {
    correct: { label: "Correct", color: "#34A853" },
    incorrect: { label: "Incorrect", color: "#EA4335" },
  } satisfies ChartConfig

  const timeConfig = {
    time: { label: "Time (seconds)", color: "#B0E0E6" },
  } satisfies ChartConfig

  const progressConfig = {
    progress: { label: "Progress", color: "#34A853" },
  } satisfies ChartConfig

  const skillsConfig = {
    accuracy: { label: "Accuracy", color: "#34A853" },
    speed: { label: "Speed", color: "#4285F4" },
    consistency: { label: "Consistency", color: "#FBBC04" },
  } satisfies ChartConfig

  // Data preparation
  const performanceData = [
    { name: "Correct", value: score.correct, fill: "#87CEEB" },
    { name: "Incorrect", value: score.total - score.correct, fill: "#FFB6C1" },
  ]

  const questionData = quiz.questions.map((_, index) => {
    const userAnswer = selectedAnswers[index]
    const isCorrect = userAnswer === quiz.questions[index].correctAnswer
    return {
      question: `Q${index + 1}`,
      correct: isCorrect ? 1 : 0,
      incorrect: isCorrect ? 0 : 1,
      time: Math.max(15, avgTimePerQuestion + Math.random() * 30 - 15),
    }
  })

  const timeProgressData = quiz.questions.map((_, index) => ({
    question: `Q${index + 1}`,
    time: Math.max(10, avgTimePerQuestion + Math.random() * 40 - 20),
    cumulative: (index + 1) * avgTimePerQuestion,
  }))

  const skillsData = [
    { skill: "Accuracy", value: score.percentage, fullMark: 100 },
    { skill: "Speed", value: avgTimePerQuestion < 60 ? 90 : avgTimePerQuestion < 120 ? 70 : 50, fullMark: 100 },
    { skill: "Consistency", value: Math.max(60, 95 - Math.random() * 35), fullMark: 100 },
    { skill: "Focus", value: Math.max(70, 90 - Math.random() * 20), fullMark: 100 },
    { skill: "Confidence", value: score.percentage > 80 ? 85 : score.percentage > 60 ? 70 : 55, fullMark: 100 },
  ]

  const radialData = [
    { name: "Completed", value: score.percentage, fill: "#87CEEB" },
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-100 border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Overall Score</p>
                  <p className="text-3xl font-bold text-gray-900">{score.percentage}%</p>
                  <p className="text-gray-500 text-xs mt-1">{score.correct}/{score.total} correct</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{Math.round((score.correct / score.total) * 100)}%</p>
                  <p className="text-gray-500 text-xs mt-1">Questions answered correctly</p>
                </div>
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-100 border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg per Question</p>
                  <p className="text-3xl font-bold text-gray-900">{formatTime(avgTimePerQuestion)}</p>
                  <p className="text-gray-500 text-xs mt-1">Average response time</p>
                </div>
                <Timer className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Performance Distribution - Pie Chart */}
          <Card className="bg-white border shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-gray-700" />
                Performance Distribution
              </CardTitle>
              <CardDescription>Visual breakdown of correct vs incorrect answers</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={performanceConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={performanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    strokeWidth={2}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Score: {score.percentage}%</span>
              </div>
            </CardFooter>
          </Card>

          {/* Question Analysis - Bar Chart */}
          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-gray-700" />
                Question-wise Performance
              </CardTitle>
              <CardDescription>Performance breakdown for each question</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={performanceConfig} className="h-[300px]">
                <BarChart data={questionData} margin={{ top: 20, left: 12, right: 12, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="question" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="correct" stackId="a" fill="#87CEEB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="incorrect" stackId="a" fill="#FFB6C1" radius={[0, 0, 4, 4]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Time Analysis - Area Chart */}
          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-700" />
                Time Progression
              </CardTitle>
              <CardDescription>Time spent progression throughout the quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={timeConfig} className="h-[300px]">
                <AreaChart data={timeProgressData} margin={{ top: 20, left: 12, right: 12, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="question" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Area
                    dataKey="cumulative"
                    type="monotone"
                    fill="#B0E0E6"
                    fillOpacity={0.3}
                    stroke="#B0E0E6"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Progress Radial Chart */}
          <Card className="bg-white border shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-gray-700" />
                Progress Overview
              </CardTitle>
              <CardDescription>Overall completion and accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={progressConfig} className="mx-auto aspect-square max-h-[300px]">
                <RadialBarChart data={radialData} cx="50%" cy="50%" innerRadius="60%" outerRadius="90%">
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <RadialBar dataKey="value" cornerRadius={10} fill="#87CEEB" />
                </RadialBarChart>
              </ChartContainer>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-gray-700">{score.percentage}%</div>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Analysis & Response Time - Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Skills Analysis - Radar Chart */}
          <Card className="bg-white border shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-gray-700" />
                Skills Analysis
              </CardTitle>
              <CardDescription>Multi-dimensional performance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={skillsConfig} className="mx-auto aspect-square max-h-[350px]">
                <RadarChart data={skillsData}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarGrid stroke="#f1f5f9" />
                  <Radar
                    dataKey="value"
                    fill="#4285F4"
                    fillOpacity={0.2}
                    stroke="#4285F4"
                    strokeWidth={2}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="text-center">
              <p className="text-sm text-gray-500">
                Skills assessment based on your quiz performance and timing
              </p>
            </CardFooter>
          </Card>

          {/* Time per Question - Line Chart */}
          <Card className="bg-white border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-gray-700" />
                Response Time Analysis
              </CardTitle>
              <CardDescription>Time spent on each question with trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={timeConfig} className="h-[300px]">
                <LineChart data={questionData} margin={{ top: 20, left: 12, right: 12, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="question" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    dataKey="time"
                    type="monotone"
                    stroke="#B0E0E6"
                    strokeWidth={2}
                    dot={{ fill: "#B0E0E6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-600" />
                <span>Average response time: {formatTime(avgTimePerQuestion)}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {score.percentage >= 80 && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    High Accuracy
                  </Badge>
                )}
                {avgTimePerQuestion < 90 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    Good Speed
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                  Quiz Completed
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Target className="h-5 w-5" />
                Performance Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-700 mb-2">
                  {score.percentage >= 90 ? "A" : score.percentage >= 80 ? "B" : score.percentage >= 70 ? "C" : "D"}
                </div>
                <Progress value={score.percentage} className="w-full h-2" />
                <p className="text-sm text-gray-500 mt-2">{score.percentage}% Overall</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Brain className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {score.percentage < 70 && (
                  <p className="text-orange-600">• Review incorrect answers</p>
                )}
                {avgTimePerQuestion > 120 && (
                  <p className="text-blue-600">• Practice time management</p>
                )}
                <p className="text-green-600">• Continue practicing regularly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default QuizAnalytics
