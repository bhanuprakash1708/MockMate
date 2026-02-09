import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BarChart3,
  Trophy,
  CheckCircle,
  BookOpen,
  Download,
  RotateCcw,
} from "lucide-react";
import jsPDF from "jspdf";
import type { Quiz } from "@/types/quiz";
import QuizAnalytics from "./quiz-analytics";

interface QuizResultsProps {
  quiz: Quiz;
  selectedAnswers: number[];
  timeSpent: number;
  onRetakeQuiz?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  selectedAnswers,
  timeSpent,
  onRetakeQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<"results" | "analytics">("results");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };

    const correct = selectedAnswers.reduce((count, answer, index) => {
      return answer === quiz.questions[index].correctAnswer ? count + 1 : count;
    }, 0);

    const total = quiz.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, total, percentage };
  };

  const downloadReport = () => {
    const score = calculateScore();
    const doc = new jsPDF();
    
    // Set title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Quiz Results Report", 20, 20);
    
    // Set quiz info
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Quiz: ${quiz.title}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Time Taken: ${formatTime(timeSpent)}`, 20, 55);
    
    // Set score summary
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Score Summary", 20, 75);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Overall Score: ${score.percentage}%`, 20, 90);
    doc.text(`Correct Answers: ${score.correct} out of ${score.total}`, 20, 100);
    doc.text(`Incorrect Answers: ${score.total - score.correct}`, 20, 110);
    
    // Add questions and answers
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Results", 20, 130);
    
    let yPosition = 145;
    
    quiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Question
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Q${index + 1}: ${question.question}`, 20, yPosition);
      yPosition += 10;
      
      // User's answer
      doc.setFont("helvetica", "normal");
      if (userAnswer !== -1) {
        doc.text(`Your Answer: ${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Status: ${isCorrect ? 'Correct' : 'Incorrect'}`, 20, yPosition);
      } else {
        doc.text("Your Answer: Not answered", 20, yPosition);
        yPosition += 8;
        doc.text("Status: Skipped", 20, yPosition);
      }
      yPosition += 8;
      
      // Correct answer
      doc.text(`Correct Answer: ${String.fromCharCode(65 + question.correctAnswer)}. ${question.options[question.correctAnswer]}`, 20, yPosition);
      yPosition += 8;
      
      // Explanation
      doc.text("Explanation:", 20, yPosition);
      yPosition += 8;
      const splitExplanation = doc.splitTextToSize(question.explanation, 170);
      doc.text(splitExplanation, 20, yPosition);
      yPosition += splitExplanation.length * 5 + 10;
    });
    
    // Save the PDF
    doc.save(`quiz-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const score = calculateScore();

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={downloadReport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        {onRetakeQuiz && (
          <Button
            onClick={onRetakeQuiz}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
        )}
      </div>

      {/* Centered Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
              activeTab === "results"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FileText className="h-4 w-4" />
            Results
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${
              activeTab === "analytics"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>
      </div>

      {activeTab === "results" ? (
        <div className="space-y-6">
          {/* Performance Summary */}
          <Card className="bg-white shadow-sm border border-gray-200 rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-800 text-xl">
                {score.percentage >= 80 ? (
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                ) : score.percentage >= 60 ? (
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-3xl font-bold text-blue-700 mb-1">
                    {score.percentage}%
                  </div>
                  <p className="text-blue-600 text-sm font-medium">Overall Score</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    {score.correct}/{score.total}
                  </div>
                  <p className="text-green-600 text-sm font-medium">Correct Answers</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                  <div className="text-3xl font-bold text-purple-700 mb-1">
                    {formatTime(timeSpent)}
                  </div>
                  <p className="text-purple-600 text-sm font-medium">Total Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <Card key={index} className="bg-white shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">
                      Question {index + 1}
                    </CardTitle>
                    <p className="text-gray-600">{question.question}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? "bg-green-50 border-green-500"
                                : isUserAnswer
                                ? "bg-yellow-50 border-yellow-300"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${
                                isCorrectAnswer
                                  ? "text-green-700"
                                  : isUserAnswer
                                  ? "text-yellow-700"
                                  : "text-blue-700"
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}. {option}
                                {isCorrectAnswer && (
                                  <span className="text-green-600 ml-2 text-sm">(Correct Option)</span>
                                )}
                              </span>
                              {isCorrectAnswer && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Your Answer */}
                    {userAnswer !== -1 && (
                      <div className={`p-3 rounded-lg ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border`}>
                        <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
                        <Badge className={`${isCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"} border-current`}>
                          {String.fromCharCode(65 + userAnswer)}. {question.options[userAnswer]}
                        </Badge>
                        {isCorrect ? (
                          <span className="ml-2 text-green-600 text-sm font-medium">✓ Correct</span>
                        ) : (
                          <span className="ml-2 text-red-600 text-sm font-medium">✗ Incorrect</span>
                        )}
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                      <p className="text-sm text-gray-600">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <QuizAnalytics
          quiz={quiz}
          selectedAnswers={selectedAnswers}
          timeSpent={timeSpent}
        />
      )}
    </div>
  );
};

export default QuizResults;
