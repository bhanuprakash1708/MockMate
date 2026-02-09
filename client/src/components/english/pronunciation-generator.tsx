"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Volume2, Target, Sparkles, Clock, Brain, Mic, BarChart3, Award, Play } from "lucide-react"
import { generatePronunciationSentences } from "@/lib/pronunciation-api"

interface PronunciationGeneratorProps {
  onSentencesGenerated: (sentences: string[]) => void
  isLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

const PronunciationGenerator: React.FC<PronunciationGeneratorProps> = ({
  onSentencesGenerated,
  isLoading,
  onLoadingChange,
}) => {
  const [sentenceCount, setSentenceCount] = useState<number>(5)
  const [difficulty, setDifficulty] = useState<"medium" | "hard" | "expert">("medium")

  const generateSentences = async () => {
    onLoadingChange(true)
    try {
      const sentences = await generatePronunciationSentences({
        count: sentenceCount,
        difficulty: difficulty,
      })
      onSentencesGenerated(sentences)
    } catch (error) {
      console.error("Error generating sentences:", error)
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl shadow-sm">
            <Volume2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pronunciation Assessment</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure your personalized pronunciation test and improve your speaking skills with AI-powered feedback
          </p>
        </div>

        {/* Navigation Steps */}
        <div className="flex items-center justify-center space-x-4 bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <span className="text-blue-600 font-medium">Setup</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-semibold text-sm">2</span>
                </div>
                <span className="text-gray-400 font-medium">Testing</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-semibold text-sm">3</span>
                </div>
                <span className="text-gray-400 font-medium">Results</span>
              </div>
            </div>

        {/* Main Configuration Card */}
        <Card className="bg-white shadow-lg border-0 rounded-2xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-t-2xl">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Setup Assessment
            </CardTitle>
            <p className="text-gray-600 text-sm">Configure your pronunciation test parameters</p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Number of Sentences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  </div>
                  <label className="font-medium text-gray-900">Number of Sentences</label>
                </div>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={sentenceCount}
                    onChange={(e) => setSentenceCount(Number(e.target.value))}
                    className="h-12 text-lg font-medium text-center border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-blue-50/30"
                    placeholder="5"
                  />
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700 font-medium flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Total Score
                      </span>
                      <Badge variant="secondary" className="bg-blue-600 text-white font-semibold">
                        {sentenceCount * 5} marks
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">5 marks per sentence</p>
                  </div>
                  {(sentenceCount < 1 || sentenceCount > 20) && (
                    <p className="text-xs text-red-500 font-medium bg-red-50 rounded p-2 text-center">
                      Please enter 1-20 sentences
                    </p>
                  )}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <label className="font-medium text-gray-900">Difficulty Level</label>
                </div>
                <div className="space-y-3">
                  {(['medium', 'hard', 'expert'] as const).map((level) => {
                    const levelConfig = {
                      medium: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Medium' },
                      hard: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'Hard' },
                      expert: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Expert' }
                    };
                    
                    return (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 font-medium ${
                          difficulty === level
                            ? `${levelConfig[level].bg} ${levelConfig[level].border} ${levelConfig[level].text} shadow-sm`
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{levelConfig[level].label}</span>
                          {difficulty === level && (
                            <div className="w-2 h-2 bg-current rounded-full"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateSentences}
              disabled={isLoading || sentenceCount < 1 || sentenceCount > 20}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>Generate Assessment</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* How it Works Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardHeader className="bg-blue-50 rounded-t-2xl">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                How it Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                {
                  icon: Brain,
                  title: "AI Generation",
                  description: "Advanced AI creates pronunciation challenges tailored to your difficulty level",
                  color: "bg-blue-100 text-blue-600"
                },
                {
                  icon: Mic,
                  title: "Voice Recording",
                  description: "Read sentences aloud using your device's microphone for analysis",
                  color: "bg-green-100 text-green-600"
                },
                {
                  icon: BarChart3,
                  title: "Real-time Analysis",
                  description: "Get instant feedback on pronunciation accuracy and clarity",
                  color: "bg-orange-100 text-orange-600"
                },
                {
                  icon: Award,
                  title: "Detailed Results",
                  description: "View comprehensive scores and personalized improvement recommendations",
                  color: "bg-red-100 text-red-600"
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardHeader className="bg-green-50 rounded-t-2xl">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {[
                "Find a quiet environment for best results",
                "Speak clearly and at natural pace",
                "Allow microphone access when prompted",
                "Practice regularly for improvement"
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PronunciationGenerator
