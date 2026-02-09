"use client"

import { useState } from "react"
import PronunciationGenerator from "@/components/english/pronunciation-generator"
import PronunciationTest from "@/components/english/pronunciation-test"
import PronunciationResults from "@/components/english/pronunciation-results"

type AppState = "setup" | "testing" | "results"

interface Sentence {
  text: string
  score?: number
  feedback?: string
  completed?: boolean
}

interface TestResults {
  sentences: Sentence[]
  totalScore: number
  percentage: number
}

function SoftskillsInterface() {
  const [currentState, setCurrentState] = useState<AppState>("setup")
  const [sentences, setSentences] = useState<string[]>([])
  const [testResults, setTestResults] = useState<TestResults | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTestComplete = (results: TestResults) => {
    setTestResults(results)
    setCurrentState("results")
  }

  const handleRetry = () => {
    setCurrentState("testing")
  }

  const handleNewTest = () => {
    setSentences([])
    setTestResults(null)
    setCurrentState("setup")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        {/* Main Content */}
        <div>
          {currentState === "setup" && (
            <PronunciationGenerator
              onSentencesGenerated={(sentences) => {
                setSentences(sentences)
                setCurrentState("testing")
              }}
              isLoading={isGenerating}
              onLoadingChange={setIsGenerating}
            />
          )}

          {currentState === "testing" && sentences.length > 0 && (
            <PronunciationTest 
              sentences={sentences} 
              onTestComplete={handleTestComplete}
              onBack={() => setCurrentState("setup")}
            />
          )}

          {currentState === "results" && testResults && (
            <PronunciationResults results={testResults} onRetry={handleRetry} onNewTest={handleNewTest} />
          )}
        </div>
      </div>
    </div>
  )
}

export default SoftskillsInterface