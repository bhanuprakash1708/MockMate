"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, SkipForward, RotateCcw, CheckCircle, Volume2, ArrowLeft } from "lucide-react"

interface Sentence {
  text: string
  score?: number
  feedback?: string
  completed?: boolean
}

interface PronunciationTestProps {
  sentences: string[]
  onTestComplete: (results: { sentences: Sentence[]; totalScore: number; percentage: number }) => void
  onBack?: () => void
}

const PronunciationTest: React.FC<PronunciationTestProps> = ({ sentences, onTestComplete, onBack }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [sentenceResults, setSentenceResults] = useState<Sentence[]>(
    sentences.map((text) => ({ text, completed: false })),
  )
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"
    }
    return () => {
      stopRecording()
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setIsListening(true)

      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim()
          evaluatePronunciation(transcript)
        }
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }
        recognitionRef.current.start()
      }

      setTimeout(() => {
        if (isRecording) {
          stopRecording()
        }
      }, 10000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    setIsListening(false)
  }

  const evaluatePronunciation = (spokenText: string) => {
    const currentSentence = sentences[currentSentenceIndex]
    const similarity = calculateSimilarity(currentSentence.toLowerCase(), spokenText.toLowerCase())
    let score = Math.round(similarity * 5)
    score = Math.max(0, Math.min(5, score))

    let feedback = ""
    if (score >= 4.5) feedback = "Excellent pronunciation!"
    else if (score >= 3.5) feedback = "Good pronunciation with minor issues"
    else if (score >= 2.5) feedback = "Fair pronunciation, needs improvement"
    else if (score >= 1.5) feedback = "Poor pronunciation, practice needed"
    else feedback = "Very poor pronunciation, significant practice required"

    const updatedResults = [...sentenceResults]
    updatedResults[currentSentenceIndex] = {
      text: currentSentence,
      score,
      feedback,
      completed: true,
    }
    setSentenceResults(updatedResults)
    stopRecording()
  }

  const calculateSimilarity = (original: string, spoken: string): number => {
    const originalWords = original.split(" ")
    const spokenWords = spoken.split(" ")
    let matches = 0
    const maxLength = Math.max(originalWords.length, spokenWords.length)

    originalWords.forEach((word) => {
      if (spokenWords.some((spokenWord) => spokenWord.includes(word) || word.includes(spokenWord))) {
        matches++
      }
    })

    return matches / maxLength
  }

  const nextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1)
    } else {
      const totalScore = sentenceResults.reduce((sum, result) => sum + (result.score || 0), 0)
      const maxScore = sentences.length * 5
      const percentage = Math.round((totalScore / maxScore) * 100)
      onTestComplete({
        sentences: sentenceResults,
        totalScore,
        percentage,
      })
    }
  }

  const retryCurrentSentence = () => {
    const updatedResults = [...sentenceResults]
    updatedResults[currentSentenceIndex] = {
      text: sentences[currentSentenceIndex],
      completed: false,
    }
    setSentenceResults(updatedResults)
  }

  const speakSentence = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex])
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const currentResult = sentenceResults[currentSentenceIndex]
  const completedCount = sentenceResults.filter((result) => result.completed).length
  const progressPercentage = Math.round((completedCount / sentences.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation with Back Button */}
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <div className="flex justify-start w-72">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2 border-blue-200/60 text-blue-600 hover:bg-blue-50/80 hover:border-blue-300 rounded-xl px-6 py-2 transition-all duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Setup
              </Button>
            )}
          </div>

          {/* Simple Navigation Steps */}
          <div className="flex items-center justify-center bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">✓</span>
                </div>
                <span className="text-green-600 font-medium">Setup</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">2</span>
                </div>
                <span className="text-yellow-600 font-medium">Testing</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-semibold text-sm">3</span>
                </div>
                <span className="text-gray-400 font-medium">Results</span>
              </div>
            </div>
          </div>

          {/* Right Spacer */}
          <div className="w-72"></div>
        </div>

        {/* Main Test Card */}
        <Card className="bg-sky-50 backdrop-blur-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {/* Clean Question Display */}
            <div className="text-center mb-10">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={speakSentence}
                  className="text-slate-600 hover:bg-blue-100/60 rounded-full p-2 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Listen</span>
                </Button>
              </div>
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-100/70 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-blue-700">
                    Question {currentSentenceIndex + 1} of {sentences.length}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Read this sentence clearly</h3>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50/80 via-slate-50/60 to-indigo-50/40 rounded-2xl p-6 border border-blue-100/40 backdrop-blur-sm mb-8">
                <p className="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed">
                  "{sentences[currentSentenceIndex]}"
                </p>
              </div>

              {/* Recording Status */}
              {isListening && (
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 px-6 py-3 rounded-2xl border-2 border-rose-200 backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-rose-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="font-bold">Listening... Speak clearly!</span>
                  </div>
                </div>
              )}

              {/* Recording Controls */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    disabled={currentResult?.completed}
                    size="lg"
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium px-10 py-3 rounded-xl hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-200"
                  >
                    <Mic className="h-5 w-5 mr-3" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    className="bg-white border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:border-rose-400"
                  >
                    <MicOff className="h-5 w-5 mr-3" />
                    Stop Recording
                  </Button>
                )}
                {currentResult?.completed && (
                  <Button
                    onClick={retryCurrentSentence}
                    size="lg"
                    variant="outline"
                    className="bg-white/80 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:border-amber-400"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>

            {/* Simple completion message - no score */}
            {currentResult?.completed && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-2xl border border-green-200 shadow-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Question completed!</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentResult?.completed && (
              <div className="flex justify-center">
                {currentSentenceIndex < sentences.length - 1 ? (
                  <Button
                    onClick={nextSentence}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Next Question
                    <SkipForward className="h-5 w-5 ml-3" />
                  </Button>
                ) : (
                  <Button
                    onClick={nextSentence}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Complete Test
                    <CheckCircle className="h-5 w-5 ml-3" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fixed Progress Tracker */}
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="bg-white/90 backdrop-blur-xl shadow-sm border-0 rounded-3xl w-64 overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Progress Tracker</span>
                </div>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{completedCount}</div>
                  <div className="text-sm font-medium text-slate-500">of {sentences.length} questions completed</div>
                </div>
                <div className="bg-slate-100 rounded-full h-4 overflow-hidden mb-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-indigo-300 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
                <Badge
                  className={`${
                    progressPercentage === 0
                      ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-600 hover:border-slate-200"
                      : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-200"
                  } text-sm font-bold px-4 py-2 rounded-xl border-2 transition-colors duration-200 cursor-default`}
                >
                  {progressPercentage}% Complete
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PronunciationTest