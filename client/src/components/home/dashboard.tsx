"use client";

import { CardDescription } from "@/components/ui/card";
import DecryptedText from "../animations/decrypted-text";
import { CardTitle } from "@/components/ui/card";

import { CardHeader } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WelcomePopup } from "@/components/home/welcome-popup";
import { WeeklyProgressChart } from "@/components/home/charts/weekly-progress-chart";
import { AccuracyTrendChart } from "@/components/home/charts/accuracy-trend-chart";
import { StudyTimeChart } from "@/components/home/charts/study-time-chart";
import { SkillsRadarChart } from "@/components/home/charts/skills-radar-chart";
import { PerformanceRadialChart } from "@/components/home/charts/performance-radial-chart";
import {
  Brain,
  Trophy,
  Target,
  Clock,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Plus,
  Activity,
} from "lucide-react";

// Import the custom font styles
import "./dashboard.css";

// Minimalistic color palette - soft and light
const COLORS = {
  primary: "hsl(221, 83%, 53%)", // Soft blue
  secondary: "hsl(142, 71%, 45%)", // Soft green
  accent: "hsl(47, 96%, 53%)", // Soft yellow
  destructive: "hsl(0, 84%, 60%)", // Soft red
  orange: "hsl(25, 95%, 53%)", // Soft orange
  slate: "hsl(215, 20%, 65%)", // Soft slate
};

const subjectPerformanceData = [
  { subject: "Mathematics", score: 92, quizzes: 15, color: COLORS.primary },
  { subject: "Science", score: 88, quizzes: 12, color: COLORS.secondary },
  { subject: "History", score: 85, quizzes: 10, color: COLORS.accent },
  { subject: "Literature", score: 90, quizzes: 8, color: COLORS.destructive },
  { subject: "Geography", score: 78, quizzes: 6, color: COLORS.orange },
];

const recentActivities = [
  {
    id: 1,
    type: "quiz",
    title: "Mathematics - Algebra Quiz",
    score: "9/10",
    time: "2 hours ago",
    icon: Brain,
    color: COLORS.primary,
  },
  {
    id: 2,
    type: "chat",
    title: "Discussed Physics concepts with AI",
    duration: "15 min",
    time: "4 hours ago",
    icon: MessageSquare,
    color: COLORS.secondary,
  },
  {
    id: 3,
    type: "quiz",
    title: "History - World War II",
    score: "8/10",
    time: "1 day ago",
    icon: Brain,
    color: COLORS.primary,
  },
  {
    id: 4,
    type: "achievement",
    title: "Reached 90% accuracy milestone!",
    badge: "Gold",
    time: "2 days ago",
    icon: Trophy,
    color: COLORS.accent,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [userData, setUserData] = useState({ name: 'Student', email: 'user@example.com' });
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Check if user has completed onboarding
    const stored = localStorage.getItem('userData');
    if (stored) {
      const data = JSON.parse(stored);
      setUserData(data);
      if (!data.onboardingCompleted) {
        setShowWelcomePopup(true);
      }
    } else {
      setShowWelcomePopup(true);
    }

    // Listen for user data updates
    const handleUserDataUpdate = (event: CustomEvent) => {
      setUserData(event.detail);
      setAnimationKey(prev => prev + 1); // Force re-animation
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);

    const timer = setTimeout(() => setAnimationComplete(true), 300);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, []);

  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false);
    // Re-fetch user data after popup closes
    const stored = localStorage.getItem('userData');
    if (stored) {
      const data = JSON.parse(stored);
      setUserData(data);
    }
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const handleChatWithAI = () => {
    navigate("/chat");
  };

  return (
    <>
      <WelcomePopup open={showWelcomePopup} onClose={handleCloseWelcomePopup} />

      <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Welcome Header - Simplified */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <div className="welcome-title">
                  <DecryptedText
                    key={`welcome-${animationKey}`}
                    text="Welcome back,"
                    animateOn="view"
                    revealDirection="start"
                    speed={80}
                    maxIterations={40}
                    sequential={true}
                    className="text-5xl font-semibold text-gray-900"
                    encryptedClassName="text-5xl font-semibold text-gray-400"
                  />
                </div>
                <div className="welcome-name">
                  <DecryptedText
                    key={`name-${animationKey}`}
                    text={`${userData.name}!`}
                    animateOn="view"
                    revealDirection="center"
                    speed={100}
                    maxIterations={40}
                    sequential={true}
                    className="text-7xl text-blue-600"
                    encryptedClassName="text-5xl text-gray-400"
                  />
                </div>
              </div>
              <p className="welcome-subtitle text-gray-600">
                Here's your learning progress overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleStartQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Quiz
              </Button>
              <Button onClick={handleChatWithAI} variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with AI
              </Button>
            </div>
          </div>
          <Separator />
        </div>

        {/* Key Stats Cards - Only 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Total Quizzes",
              value: "127",
              change: "+12",
              changeText: "this week",
              icon: Brain,
              bgColor: "bg-blue-50",
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
              changeColor: "text-blue-600",
            },
            {
              title: "Average Score",
              value: "88%",
              change: "+5%",
              changeText: "improvement",
              icon: Target,
              bgColor: "bg-amber-50",
              iconBg: "bg-amber-100",
              iconColor: "text-amber-600",
              changeColor: "text-amber-600",
            },
            {
              title: "Study Time",
              value: "24.5h",
              change: "+3.2h",
              changeText: "this week",
              icon: Clock,
              bgColor: "bg-red-50",
              iconBg: "bg-red-100",
              iconColor: "text-red-600",
              changeColor: "text-red-600",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className={`transition-all duration-500 hover:shadow-lg hover:scale-105 hover:-translate-y-2 border-0 shadow-sm ${
                stat.bgColor
              } ${
                animationComplete
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              } cursor-pointer group`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className={`font-semibold ${stat.changeColor}`}>
                        {stat.change}
                      </span>{" "}
                      {stat.changeText}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section - Two rows of side-by-side charts */}
        <div className="space-y-6">
          {/* Top Row: Accuracy Trend and Skills Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccuracyTrendChart />
            <SkillsRadarChart />
          </div>

          {/* Bottom Row: Weekly Progress and Performance Radial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklyProgressChart />
            <PerformanceRadialChart />
          </div>
        </div>

        {/* Subject Performance and Study Time - Better spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Performance */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-blue-50">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                Subject Performance
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Your performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subjectPerformanceData.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {subject.subject}
                        </p>
                        <p className="text-xs text-gray-400">
                          {subject.quizzes} quizzes completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        {subject.score}%
                      </p>
                      <Badge
                        variant={
                          subject.score >= 90
                            ? "default"
                            : subject.score >= 80
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {subject.score >= 90
                          ? "Excellent"
                          : subject.score >= 80
                          ? "Good"
                          : "Improving"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <StudyTimeChart />
        </div>

        {/* Recent Activities - Full Width Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  Recent Activities
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Your latest learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${activity.color}15` }}
                        >
                          <activity.icon
                            className="h-4 w-4"
                            style={{ color: activity.color }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.score && `Score: ${activity.score}`}
                            {activity.duration &&
                              `Duration: ${activity.duration}`}
                            {activity.badge && `Badge: ${activity.badge}`}
                            {" • " + activity.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Continue your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleStartQuiz}
                    className="w-full h-auto p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all duration-200"
                    size="lg"
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Take New Quiz</span>
                    </div>
                  </Button>
                  <Button
                    onClick={handleChatWithAI}
                    className="w-full h-auto p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-all duration-200"
                    size="lg"
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Chat with AI</span>
                    </div>
                  </Button>
                  <Button
                    onClick={handleStartQuiz}
                    className="w-full h-auto p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all duration-200"
                    size="lg"
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium">
                        Upload Document
                      </span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
