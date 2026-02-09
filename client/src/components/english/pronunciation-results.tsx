"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Trophy, CheckCircle, XCircle, RotateCcw, Download } from "lucide-react"
import jsPDF from "jspdf"

interface Sentence {
  text: string
  score?: number
  feedback?: string
  completed?: boolean
}

interface PronunciationResultsProps {
  results: {
    sentences: Sentence[]
    totalScore: number
    percentage: number
  }
  onRetry: () => void
  onNewTest: () => void
}

const PronunciationResults: React.FC<PronunciationResultsProps> = ({ results, onRetry, onNewTest }) => {
  const { sentences, totalScore, percentage } = results
  const maxScore = sentences.length * 5

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-700", bg: "bg-green-50" }
    if (percentage >= 80) return { grade: "A", color: "text-green-700", bg: "bg-green-50" }
    if (percentage >= 70) return { grade: "B", color: "text-blue-700", bg: "bg-blue-50" }
    if (percentage >= 60) return { grade: "C", color: "text-yellow-700", bg: "bg-yellow-50" }
    if (percentage >= 50) return { grade: "D", color: "text-orange-700", bg: "bg-orange-50" }
    return { grade: "F", color: "text-red-700", bg: "bg-red-50" }
  }

  const gradeInfo = getGrade(percentage)

  const downloadReport = () => {
    // Create a new PDF document
    const doc = new jsPDF()
    const today = new Date().toLocaleDateString()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    
    // Helper function for text wrapping
    const splitText = (text: string, maxWidth: number) => {
      return doc.splitTextToSize(text, maxWidth)
    }
    
    // Set title
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246) // Blue
    doc.text('Pronunciation Assessment Report', pageWidth / 2, 20, { align: 'center' })
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${today}`, pageWidth / 2, 30, { align: 'center' })
    
    // Overall Performance Section
    doc.setFontSize(14)
    doc.setTextColor(30, 64, 175) // Dark blue
    doc.text('Overall Performance', margin, 45)
    doc.setLineWidth(0.5)
    doc.line(margin, 48, margin + 60, 48)
    
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    doc.text(`Total Score: ${totalScore}/${maxScore}`, margin, 60)
    doc.text(`Percentage: ${percentage}%`, margin, 70)
    
    // Grade display
    let gradeColor = [0, 0, 0]
    if (gradeInfo.color.includes('green')) gradeColor = [39, 174, 96]
    else if (gradeInfo.color.includes('blue')) gradeColor = [41, 128, 185]
    else if (gradeInfo.color.includes('yellow')) gradeColor = [241, 196, 15]
    else if (gradeInfo.color.includes('orange')) gradeColor = [230, 126, 34]
    else if (gradeInfo.color.includes('red')) gradeColor = [231, 76, 60]
    
    doc.setFillColor(gradeColor[0], gradeColor[1], gradeColor[2], 0.2)
    doc.roundedRect(margin, 75, 25, 15, 3, 3, 'F')
    doc.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2])
    doc.setFontSize(14)
    doc.text(gradeInfo.grade, margin + 12.5, 83, { align: 'center' })
    
    // Detailed Results Section
    doc.setFontSize(14)
    doc.setTextColor(30, 64, 175)
    let yPos = 105
    doc.text('Detailed Results', margin, yPos)
    doc.line(margin, yPos + 3, margin + 50, yPos + 3)
    yPos += 15
    
    // Loop through sentences with pagination support
    doc.setFontSize(10)
    sentences.forEach((sentence, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFillColor(249, 250, 251)
      doc.roundedRect(margin, yPos, contentWidth, 30, 2, 2, 'F')
      
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(11)
      doc.text(`Sentence ${index + 1}:`, margin + 5, yPos + 10)
      
      const wrappedText = splitText(`"${sentence.text}"`, contentWidth - 10)
      doc.setFontSize(10)
      doc.text(wrappedText, margin + 5, yPos + 18)
      
      doc.setFontSize(10)
      doc.text(`Score: ${sentence.score}/5`, margin + 5, yPos + 26)
      doc.text(`Feedback: ${sentence.feedback}`, margin + 50, yPos + 26)
      
      yPos += 35
    })
    
    // Check if we need a new page for summary
    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }
    
    // Performance Summary
    doc.setFontSize(14)
    doc.setTextColor(30, 64, 175)
    doc.text('Performance Summary', margin, yPos)
    doc.line(margin, yPos + 3, margin + 60, yPos + 3)
    yPos += 15
    
    // Excellent box
    doc.setFillColor(236, 253, 245) // Green bg
    doc.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F')
    doc.setTextColor(22, 163, 74) // Green text
    doc.text(`Excellent (4-5): ${sentences.filter(s => (s.score ?? 0) >= 4).length} sentences`, margin + 5, yPos + 10)
    yPos += 20
    
    // Good box
    doc.setFillColor(254, 252, 232) // Yellow bg
    doc.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F')
    doc.setTextColor(202, 138, 4) // Yellow text
    doc.text(`Good (3): ${sentences.filter(s => (s.score ?? 0) === 3).length} sentences`, margin + 5, yPos + 10)
    yPos += 20
    
    // Needs practice box
    doc.setFillColor(254, 242, 242) // Red bg
    doc.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F')
    doc.setTextColor(220, 38, 38) // Red text
    doc.text(`Needs Practice (0-2): ${sentences.filter(s => (s.score ?? 0) < 3).length} sentences`, margin + 5, yPos + 10)
    yPos += 25
    
    // Recommendations
    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(14)
    doc.setTextColor(30, 64, 175)
    doc.text('Recommendations', margin, yPos)
    doc.line(margin, yPos + 3, margin + 60, yPos + 3)
    yPos += 15
    
    doc.setFontSize(10)
    doc.setTextColor(30, 58, 138) // Blue text
    
    // Add recommendations based on percentage
    let recommendations = []
    if (percentage >= 80) {
      recommendations = [
        '• Excellent pronunciation! Keep practicing to maintain your skills.',
        '• Consider helping others improve their pronunciation.'
      ]
    } else if (percentage >= 60) {
      recommendations = [
        '• Good pronunciation with room for improvement.',
        '• Focus on speaking more slowly and clearly.',
        '• Practice difficult words multiple times.'
      ]
    } else {
      recommendations = [
        '• Your pronunciation needs significant improvement.',
        '• Practice pronunciation exercises daily.',
        '• Listen to native speakers and try to mimic their pronunciation.',
        '• Consider working with a pronunciation coach.'
      ]
    }
    
    recommendations.forEach(rec => {
      doc.text(rec, margin, yPos)
      yPos += 10
    })
    
    // Save the PDF
    doc.save(`pronunciation-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Navigation Steps */}
      <div className="flex items-center justify-center space-x-4 bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">✓</span>
          </div>
          <span className="text-green-600 font-medium">Setup</span>
        </div>
        <div className="w-8 h-px bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">✓</span>
          </div>
          <span className="text-green-600 font-medium">Testing</span>
        </div>
        <div className="w-8 h-px bg-gray-200"></div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">3</span>
          </div>
          <span className="text-green-600 font-medium">Results</span>
        </div>
      </div>

      {/* Overall Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assessment Complete</h2>
            <p className="text-sm text-gray-600">Your pronunciation test results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalScore}/{maxScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{percentage}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${gradeInfo.bg} rounded-lg mb-2`}>
              <span className={`text-2xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</span>
            </div>
            <div className="text-sm text-gray-600">Grade</div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retry Test
          </Button>
          <Button onClick={onNewTest} className="bg-blue-600 hover:bg-blue-700 text-white">
            New Test
          </Button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
        <div className="space-y-4">
          {sentences.map((sentence, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Sentence {index + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{sentence.score}/5</span>
                  {(sentence.score ?? 0) >= 4 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (sentence.score ?? 0) >= 3 ? (
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-gray-800 mb-2">"{sentence.text}"</p>
              <p className="text-sm text-gray-600">{sentence.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {sentences.filter(s => (s.score ?? 0) >= 4).length}
            </div>
            <div className="text-sm text-green-600">Excellent (4-5)</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700 mb-1">
              {sentences.filter(s => (s.score ?? 0) === 3).length}
            </div>
            <div className="text-sm text-yellow-600">Good (3)</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700 mb-1">
              {sentences.filter(s => (s.score ?? 0) < 3).length}
            </div>
            <div className="text-sm text-red-600">Needs Practice (0-2)</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommendations</h3>
        <div className="space-y-2 text-blue-800">
          {percentage >= 80 ? (
            <>
              <p>• Excellent pronunciation! Keep practicing to maintain your skills.</p>
              <p>• Consider helping others improve their pronunciation.</p>
            </>
          ) : percentage >= 60 ? (
            <>
              <p>• Good pronunciation with room for improvement.</p>
              <p>• Focus on speaking more slowly and clearly.</p>
              <p>• Practice difficult words multiple times.</p>
            </>
          ) : (
            <>
              <p>• Your pronunciation needs significant improvement.</p>
              <p>• Practice pronunciation exercises daily.</p>
              <p>• Listen to native speakers and try to mimic their pronunciation.</p>
              <p>• Consider working with a pronunciation coach.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PronunciationResults
