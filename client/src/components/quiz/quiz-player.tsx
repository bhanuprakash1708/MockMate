import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle,
  Clock,
  Play,
  XCircle,
} from "lucide-react";
import type { Quiz } from "@/types/quiz";

interface QuizPlayerProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  selectedAnswers: number[];
  showResults: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onShowResults: () => void;
  allQuestionsAnswered: boolean;
  fingerCount: number;
  fingerDetectionMode: boolean;
  timeSpent: number;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  currentQuestionIndex,
  selectedAnswers,
  showResults,
  onAnswerSelect,
  onPreviousQuestion,
  onNextQuestion,
  onShowResults,
  allQuestionsAnswered,
  fingerCount,
  fingerDetectionMode,
  timeSpent,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render anything for results mode - that will be handled by a separate component
  if (showResults) {
    return null;
  }

  // Quiz Playing Mode Only
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const userAnswer = selectedAnswers[currentQuestionIndex];
  const hasAnswered = userAnswer !== -1;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card */}
      <Card className="bg-white shadow-lg border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Badge className="bg-blue-100 text-blue-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Badge>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
          <CardTitle className="text-xl text-gray-800 mt-4">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = userAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showFeedback = hasAnswered;

              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={hasAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    showFeedback
                      ? isCorrect && isSelected
                        ? "bg-green-50 border-green-500"
                        : isSelected && !isCorrect
                        ? "bg-red-50 border-red-500"
                        : "bg-blue-50 border-blue-200"
                      : isSelected
                      ? "bg-blue-50 border-blue-500 ring-2 ring-offset-2 ring-blue-500"
                      : "bg-blue-50 border-blue-200 hover:shadow-md hover:scale-[1.02]"
                  } ${hasAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-normal ${
                      showFeedback
                        ? isCorrect && isSelected
                          ? "text-green-700"
                          : isSelected && !isCorrect
                          ? "text-red-700"
                          : "text-blue-700"
                        : "text-blue-700"
                    }`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    {showFeedback && isCorrect && isSelected && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {fingerDetectionMode && fingerCount === index + 1 && !hasAnswered && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Play className="h-3 w-3 text-white fill-current" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={onPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  onClick={onNextQuestion}
                  disabled={!hasAnswered}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={onShowResults}
                  disabled={!allQuestionsAnswered}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Trophy className="h-4 w-4" />
                  Show Results
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPlayer;
