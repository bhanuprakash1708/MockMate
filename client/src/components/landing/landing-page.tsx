"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Brain, MessageSquare, Trophy, Zap, Sparkles, GraduationCap, Play, Code, Users } from "lucide-react"

export default function AILearningPlatform() {
  const navigate = useNavigate()
  const [displayText, setDisplayText] = useState("")
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleGetStarted = () => {
    navigate("/dashboard")
  }

  const handleWatchDemo = () => {
    navigate("/dashboard")
  }

  const prompts = [
    "Upload your study materials and get instant AI-powered quizzes...",
    "Chat with Gemini AI about complex topics from your documents...",
    "Solve coding challenges with real-time hints and feedback...",
    "Practice soft skills through interactive scenarios and assessments...",
    "Generate personalized learning paths based on your progress...",
    "Get detailed explanations for any concept you're struggling with...",
    "Transform PDFs, images, and notes into interactive learning content...",
  ]

  // Typing animation effect
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (currentCharIndex < prompts[currentPromptIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(prompts[currentPromptIndex].substring(0, currentCharIndex + 1))
          setCurrentCharIndex(currentCharIndex + 1)
        }, 50)
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      if (currentCharIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(prompts[currentPromptIndex].substring(0, currentCharIndex - 1))
          setCurrentCharIndex(currentCharIndex - 1)
        }, 20)
      } else {
        timeout = setTimeout(() => {
          setCurrentPromptIndex((currentPromptIndex + 1) % prompts.length)
          setIsTyping(true)
        }, 500)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentCharIndex, currentPromptIndex, isTyping, prompts])

  // Mouse tracking for smooth spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const features = [
    {
      icon: <Brain className="h-7 w-7" />,
      title: "AI-Powered Quiz Generation",
      description:
        "Upload any document and instantly generate personalized quizzes tailored to your learning level and goals with advanced AI algorithms.",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      accentColor: "rgba(59, 130, 246, 0.4)",
      shadowColor: "shadow-blue-500/25",
    },
    {
      icon: <Code className="h-7 w-7" />,
      title: "Interactive Coding Challenges",
      description:
        "Master programming concepts through hands-on coding challenges with real-time feedback, hints, and automated testing.",
      gradient: "from-emerald-500 via-green-600 to-teal-500",
      accentColor: "rgba(16, 185, 129, 0.4)",
      shadowColor: "shadow-emerald-500/25",
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Soft Skills Development",
      description:
        "Enhance your communication, leadership, and teamwork abilities through interactive scenarios and peer feedback systems.",
      gradient: "from-rose-500 via-pink-600 to-fuchsia-500",
      accentColor: "rgba(244, 63, 94, 0.4)",
      shadowColor: "shadow-rose-500/25",
    },
    {
      icon: <MessageSquare className="h-7 w-7" />,
      title: "Chat with Gemini AI",
      description:
        "Have intelligent conversations about your study materials. Ask questions, get explanations, and dive deeper into complex topics.",
      gradient: "from-purple-500 via-purple-600 to-violet-500",
      accentColor: "rgba(168, 85, 247, 0.4)",
      shadowColor: "shadow-purple-500/25",
    },
    {
      icon: <Trophy className="h-7 w-7" />,
      title: "Progress Tracking & Analytics",
      description:
        "Monitor your learning journey with detailed analytics, achievement systems, and personalized improvement suggestions.",
      gradient: "from-yellow-500 via-amber-500 to-orange-500",
      accentColor: "rgba(245, 158, 11, 0.4)",
      shadowColor: "shadow-yellow-500/25",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Instant Feedback System",
      description:
        "Get immediate explanations for quiz answers, code reviews, and adaptive learning recommendations in real-time.",
      gradient: "from-indigo-500 via-indigo-600 to-blue-500",
      accentColor: "rgba(99, 102, 241, 0.4)",
      shadowColor: "shadow-indigo-500/25",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      {/* Custom Styles */}
      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        
        .group:hover .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 25s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          {/* Very Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
              maskImage: "radial-gradient(circle at center, transparent 30%, black 80%)",
              WebkitMaskImage: "radial-gradient(circle at center, transparent 30%, black 80%)",
            }}
          />

          {/* Modern Geometric Squares */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large floating squares */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-blue-600/5 rounded-2xl rotate-12 animate-pulse" />
            <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/8 to-purple-600/4 rounded-xl rotate-45 animate-pulse delay-1000" />
            <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400/12 to-cyan-600/6 rounded-lg -rotate-12 animate-pulse delay-2000" />
            <div className="absolute bottom-60 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-400/9 to-emerald-600/5 rounded-xl rotate-30 animate-pulse delay-500" />

            {/* Medium squares */}
            <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-gradient-to-br from-rose-400/10 to-rose-600/5 rounded-lg rotate-45 animate-pulse delay-1500" />
            <div className="absolute top-2/3 right-10 w-12 h-12 bg-gradient-to-br from-yellow-400/12 to-yellow-600/6 rounded-md -rotate-30 animate-pulse delay-3000" />
            <div className="absolute bottom-20 left-1/3 w-14 h-14 bg-gradient-to-br from-indigo-400/8 to-indigo-600/4 rounded-lg rotate-12 animate-pulse delay-2500" />

            {/* Small accent squares */}
            <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-br from-pink-400/15 to-pink-600/8 rounded rotate-45 animate-pulse delay-4000" />
            <div className="absolute bottom-1/3 left-20 w-6 h-6 bg-gradient-to-br from-teal-400/12 to-teal-600/6 rounded -rotate-12 animate-pulse delay-3500" />
            <div className="absolute top-1/2 left-10 w-10 h-10 bg-gradient-to-br from-violet-400/10 to-violet-600/5 rounded-md rotate-30 animate-pulse delay-1000" />
          </div>

          {/* Modern Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated border squares */}
            <div className="absolute top-32 right-1/4 w-40 h-40 border border-blue-400/20 rounded-2xl rotate-12 animate-spin-slow" />
            <div className="absolute bottom-32 left-1/4 w-32 h-32 border border-purple-400/15 rounded-xl -rotate-45 animate-spin-reverse-slow" />
            <div className="absolute top-1/2 right-20 w-24 h-24 border border-cyan-400/25 rounded-lg rotate-30 animate-spin-slow delay-2000" />
          </div>

          {/* Smooth Dynamic Spotlight */}
          <div
            className="absolute inset-0 opacity-60 transition-all duration-300 ease-out"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.25), transparent 60%)`,
            }}
          />

          {/* Multiple Smooth Animated Gradients */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(800px circle at 25% 25%, rgba(168, 85, 247, 0.2), transparent 60%),
                radial-gradient(600px circle at 75% 70%, rgba(34, 197, 94, 0.15), transparent 60%),
                radial-gradient(500px circle at 50% 80%, rgba(245, 158, 11, 0.1), transparent 60%)
              `,
            }}
          />

          {/* Smooth Animated Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-gray-900/50" />
        </div>

        <div className="container px-6 md:px-8 py-20 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-400/30 px-6 py-3 text-sm mb-10 backdrop-blur-xl shadow-lg shadow-blue-500/10">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-blue-100">AI-Powered Learning Platform</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            {/* Enhanced Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-50 to-cyan-100 bg-clip-text text-transparent drop-shadow-2xl">
                Learn Smarter
              </span>
              <br />
              <span className="text-blue-400 font-bold">with AI</span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mb-16 leading-relaxed font-light">
              Transform documents into interactive quizzes, solve{" "}
              <span className="text-white font-bold">coding challenges</span>, develop{" "}
              <span className="text-blue-400 font-bold">soft skills</span>, and chat with{" "}
              <span className="text-white font-bold">Gemini AI</span> - all in one comprehensive learning platform that
              adapts to your pace and goals.
            </p>

            {/* Enhanced Interactive Input */}
            <div className="relative w-full max-w-3xl mx-auto mb-16">
              <div className="relative group backdrop-blur-2xl bg-white/5 rounded-3xl p-2 border border-white/10 shadow-2xl">
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>

                <div className="relative">
                  <Input
                    className="pr-24 py-8 text-lg rounded-2xl backdrop-blur-xl border-2 bg-gray-800/60 border-gray-600/40 text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500/60 shadow-2xl"
                    placeholder=""
                    value={displayText}
                    readOnly
                  />
                  <Button
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 backdrop-blur-md shadow-xl rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Send className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                onClick={handleGetStarted}
                className="group flex items-center gap-4 px-10 py-8 h-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-2xl border-0 shadow-2xl shadow-blue-600/30 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-blue-600/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/20 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                <GraduationCap className="h-6 w-6 relative z-10" />
                <div className="flex flex-col items-start relative z-10">
                  <span className="text-lg font-bold">Start Learning</span>
                  <span className="text-sm text-blue-200 -mt-1">Free to try • No credit card</span>
                </div>
              </Button>

              <Button
                onClick={handleWatchDemo}
                className="group flex items-center gap-3 px-10 py-8 h-auto rounded-2xl border-2 border-gray-600/60 bg-gray-800/40 hover:bg-gray-700/60 text-lg font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-gray-500/60 shadow-xl"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Showcase */}
      <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-emerald-900/5" />
        </div>

        {/* Modern geometric background for features section */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500/8 to-blue-700/4 rounded-xl rotate-45 animate-float" />
          <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 rounded-lg -rotate-30 animate-float delay-1000" />
          <div className="absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-br from-purple-500/12 to-purple-700/6 rounded-md rotate-60 animate-float delay-2000" />
          <div className="absolute bottom-1/3 left-10 w-24 h-24 border border-rose-400/15 rounded-2xl rotate-12 animate-spin-slow" />
        </div>

        <div className="container px-6 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Three Pillars of Modern Learning
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Master every aspect of your education with our comprehensive AI-powered approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* AI Quiz Generation */}
            <div className="group relative bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-3xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Quiz Generation</h3>
                <p className="text-gray-300 leading-relaxed">
                  Upload any document and instantly generate personalized quizzes. Perfect for academic preparation and
                  knowledge retention.
                </p>
              </div>
            </div>

            {/* Coding Challenges */}
            <div className="group relative bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Coding Challenges</h3>
                <p className="text-gray-300 leading-relaxed">
                  Solve programming problems with real-time feedback and hints. Build your coding skills from beginner
                  to advanced level.
                </p>
              </div>
            </div>

            {/* Soft Skills Development */}
            <div className="group relative bg-gradient-to-br from-rose-900/20 to-rose-800/10 rounded-3xl p-8 border border-rose-500/20 hover:border-rose-400/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Soft Skills Training</h3>
                <p className="text-gray-300 leading-relaxed">
                  Develop communication, leadership, and teamwork skills through interactive scenarios and peer
                  assessments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-800/60 to-gray-900/80 backdrop-blur-sm relative">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10" />

        {/* Advanced geometric patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large decorative squares */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/8 to-transparent rounded-full blur-2xl" />

          {/* Geometric square grid */}
          <div className="absolute top-20 left-1/4 grid grid-cols-3 gap-4 opacity-30">
            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400/20 to-cyan-600/10 rounded-sm rotate-45" />
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400/15 to-blue-600/8 rounded-sm -rotate-12" />
            <div className="w-4 h-4 bg-gradient-to-br from-purple-400/18 to-purple-600/9 rounded-sm rotate-30" />
            <div className="w-4 h-4 bg-gradient-to-br from-pink-400/12 to-pink-600/6 rounded-sm rotate-45" />
            <div className="w-4 h-4 bg-gradient-to-br from-emerald-400/16 to-emerald-600/8 rounded-sm -rotate-30" />
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-400/14 to-yellow-600/7 rounded-sm rotate-60" />
          </div>

          {/* Floating modern squares */}
          <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400/6 to-indigo-600/3 rounded-2xl rotate-12 animate-float" />
          <div className="absolute top-1/3 right-20 w-20 h-20 border-2 border-gradient-to-r from-rose-400/20 to-rose-600/10 rounded-xl -rotate-45 animate-spin-slow" />
        </div>

        <div className="container px-6 md:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
            {/* Enhanced Section Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-600/20 border border-purple-400/30 px-6 py-3 text-sm backdrop-blur-xl shadow-lg">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="font-medium text-purple-100">Key Features</span>
            </div>

            {/* Enhanced Section Title */}
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                Complete Learning
              </span>
              <br />
              <span className="text-blue-400 font-bold">Ecosystem</span>
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl leading-relaxed font-light">
              Our comprehensive AI-powered platform combines cutting-edge technology with proven learning methodologies
              to help you master technical skills, soft skills, and academic concepts faster and more effectively than
              ever before.
            </p>
          </div>

          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group h-full bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/60 transition-all duration-500 hover:shadow-2xl relative overflow-hidden rounded-2xl hover:scale-105"
              >
                {/* Enhanced Card Content */}
                <div className="p-8 h-full flex flex-col relative z-10">
                  {/* Enhanced Icon with Better Gradient */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} shadow-xl ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 flex-grow leading-relaxed text-base group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Enhanced Animated Background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${feature.accentColor} 0%, transparent 70%)`,
                  }}
                />

                {/* Enhanced Border Glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            ))}
          </div>

          {/* Enhanced Bottom CTA */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-800/80 backdrop-blur-xl border border-gray-600/40 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                  Ready to master coding, soft skills, and more?
                </h3>
                <p className="text-gray-300 text-lg">
                  Join thousands of learners already excelling with our comprehensive AI platform.
                </p>
              </div>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-10 py-4 rounded-2xl font-bold shadow-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
