import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Brain,
  RotateCcw,
  RefreshCw
} from "lucide-react";
import PDFUploader from "@/components/quiz/pdf-uploader";
import QuizPlayer from "@/components/quiz/quiz-player";
import QuizResults from "@/components/quiz/quiz-results";
import FingerDetection from "@/components/quiz/finger-detection";
import type { Quiz } from "@/types/quiz";

const IntegratedQuizSystem: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [fingerDetectionMode, setFingerDetectionMode] = useState<boolean>(false);
  const [fingerCount, setFingerCount] = useState<number>(0);
  const [lastOptionTime, setLastOptionTime] = useState<number>(0);
  const [lastSoundTime, setLastSoundTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Finger detection state management
  const [fingerSelectionState, setFingerSelectionState] = useState<{
    detectedCount: number;
    startTime: number;
    isActive: boolean;
  }>({ detectedCount: 0, startTime: 0, isActive: false });
  
  const [selectionProgress, setSelectionProgress] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Update selection progress smoothly for better animation
  useEffect(() => {
    let animationFrame: number;
    
    if (fingerSelectionState.isActive && fingerSelectionState.detectedCount >= 1 && fingerSelectionState.detectedCount <= 4) {
      const updateProgress = () => {
        const elapsed = Date.now() - fingerSelectionState.startTime;
        const progress = Math.min((elapsed / 2000) * 100, 100);
        setSelectionProgress(progress);
        
        if (progress < 100) {
          animationFrame = requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();
    } else {
      setSelectionProgress(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [fingerSelectionState.isActive, fingerSelectionState.startTime, fingerSelectionState.detectedCount]);

  // Timer for quiz duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quiz && !showResults) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [quiz, showResults]);

  // Handle finger count updates from the finger detection component
  const handleFingerCountUpdate = (count: number) => {
    setFingerCount(count);
    
    // Debug log to verify finger detection is working
    if (count > 0) {
      console.log(`Finger count detected: ${count}`);
    }
    
    // Only process finger count for option selection when quiz is active
    if (!quiz || showResults || selectedAnswers[currentQuestionIndex] !== -1) {
      // Reset state when not in active quiz mode
      setFingerSelectionState({ detectedCount: 0, startTime: 0, isActive: false });
      return;
    }

    const now = Date.now();
    const validOptionCount = count >= 1 && count <= 4;

    if (validOptionCount) {
      // Check if this is the same count as before
      if (fingerSelectionState.detectedCount === count && fingerSelectionState.isActive) {
        // Check if we've held this gesture long enough (2 seconds)
        if (now - fingerSelectionState.startTime >= 2000) {
          // Prevent double-selection with cooldown
          if (now - lastOptionTime > 1000) {
            console.log(`Selecting option ${count} (index ${count - 1})`);
            handleAnswerSelect(count - 1);
            setLastOptionTime(now);
            // Reset state after selection
            setFingerSelectionState({ detectedCount: 0, startTime: 0, isActive: false });
          }
        }
      } else {
        // New valid count detected or count changed - start tracking
        console.log(`Starting selection tracking for ${count} fingers`);
        setFingerSelectionState({
          detectedCount: count,
          startTime: now,
          isActive: true
        });
      }
    } else {
      // Invalid count or no fingers - reset state
      setFingerSelectionState({ detectedCount: 0, startTime: 0, isActive: false });
    }
  };

  // Play sound effects with better management to prevent duplicates
  const playSound = (isCorrect: boolean) => {
    const now = Date.now();
    if (now - lastSoundTime < 1000) return; // Prevent sounds within 1 second
    
    setLastSoundTime(now);
    
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (isCorrect) {
        // Success sound - ascending notes
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        // Error sound - descending notes
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.15); // G3
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log("Audio not supported or blocked");
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    
    // Don't allow re-selection if answer is already selected for this question
    if (selectedAnswers[currentQuestionIndex] !== -1) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
    
    // Play sound effect
    const isCorrect = answerIndex === quiz?.questions[currentQuestionIndex].correctAnswer;
    playSound(isCorrect);
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate and show results
  const handleShowResults = () => {
    setShowResults(true);
    setFingerDetectionMode(false);
  };

  // Reset the entire quiz system
  const handleResetQuiz = () => {
    setQuiz(null);
    setFile(null);
    setShowResults(false);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setGenerationProgress("");
    setFingerDetectionMode(false);
    setFingerCount(0);
    setTimeSpent(0);
    setLastOptionTime(0);
    setFingerSelectionState({ detectedCount: 0, startTime: 0, isActive: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle finger detection mode
  const toggleFingerDetection = () => {
    setFingerDetectionMode(!fingerDetectionMode);
  };

  // Refresh finger detection (reload the hand gesture model)
  const refreshFingerDetection = () => {
    setRefreshKey(prev => prev + 1);
    setFingerCount(0);
    setFingerSelectionState({ detectedCount: 0, startTime: 0, isActive: false });
  };

  // Check if all questions are answered
  const allQuestionsAnswered = quiz ? 
    selectedAnswers.slice(0, quiz.questions.length).every(answer => answer !== -1) : false;

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      {/* Always present progress indicator that only changes content */}
      {fingerDetectionMode && (
        <div className="fixed top-20 right-6 z-50 pointer-events-none">
          <div className={`bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 transform transition-all duration-300 ease-in-out ${
            fingerSelectionState.isActive && fingerSelectionState.detectedCount >= 1 && fingerSelectionState.detectedCount <= 4 
              ? 'opacity-100 scale-100' 
              : 'opacity-75 scale-95'
          }`}>
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-gray-800">
                {fingerSelectionState.isActive 
                  ? `Selecting Option ${String.fromCharCode(65 + fingerSelectionState.detectedCount - 1)}`
                  : 'Ready for Selection'
                }
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-100"
                  style={{ 
                    width: `${fingerSelectionState.isActive ? selectionProgress : 0}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {fingerSelectionState.isActive 
                  ? `Hold ${fingerSelectionState.detectedCount} finger${fingerSelectionState.detectedCount !== 1 ? 's' : ''} for 2 seconds`
                  : 'Show 1-4 fingers to select'
                }
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header - Only show during PDF upload phase */}
        {!quiz && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 mb-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
              <Brain className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              AI Quiz Master
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload PDF documents, generate intelligent quizzes with AI, and interact using intuitive finger gestures
            </p>
          </div>
        )}

        {/* Control Panel - Only show during quiz, not during results */}
        {quiz && !showResults && (
          <Card className="mb-8 bg-white shadow-lg border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <CardTitle className="text-gray-800 flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Camera className="h-5 w-5 text-blue-600" />
                  </div>
                  Quiz Controls
                </CardTitle>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={toggleFingerDetection}
                    variant={fingerDetectionMode ? "destructive" : "default"}
                    className={fingerDetectionMode ? 
                      "bg-red-500 hover:bg-red-600 text-white shadow-md" : 
                      "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    }
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {fingerDetectionMode ? "Disable Camera" : "Enable Camera"}
                  </Button>
                  {fingerDetectionMode && (
                    <Button
                      onClick={refreshFingerDetection}
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 shadow-md"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Camera
                    </Button>
                  )}
                  <Button
                    onClick={handleResetQuiz}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Quiz
                  </Button>
                </div>
              </div>
            </CardHeader>
            {fingerDetectionMode && (
              <CardContent className="pt-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center space-y-4">
                    <p className="text-blue-800 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl">👋</span>
                        Show 1-4 fingers to select options A-D
                      </span>
                    </p>
                    
                    {/* Simple status display */}
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Current Detection</div>
                        <Badge className={`px-3 py-1 ${
                          fingerCount >= 1 && fingerCount <= 4 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {fingerCount} finger{fingerCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      {fingerCount >= 1 && fingerCount <= 4 && (
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Will Select</div>
                          <Badge className="bg-blue-500 text-white px-3 py-1">
                            Option {String.fromCharCode(64 + fingerCount)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {!quiz ? (
          /* PDF Upload - Full width and centered when no quiz */
          <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
            <div className="w-full max-w-4xl">
              <PDFUploader
                file={file}
                setFile={setFile}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                generationProgress={generationProgress}
                setGenerationProgress={setGenerationProgress}
                setQuiz={setQuiz}
                setSelectedAnswers={setSelectedAnswers}
                fileInputRef={fileInputRef}
              />
            </div>
          </div>
        ) : showResults ? (
          /* Results Mode - Full width */
          <QuizResults
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            timeSpent={timeSpent}
            onRetakeQuiz={handleResetQuiz}
          />
        ) : (
          /* Quiz Mode - Grid layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Quiz */}
            <div className="space-y-6">
              <QuizPlayer
                quiz={quiz}
                currentQuestionIndex={currentQuestionIndex}
                selectedAnswers={selectedAnswers}
                showResults={showResults}
                onAnswerSelect={handleAnswerSelect}
                onPreviousQuestion={handlePreviousQuestion}
                onNextQuestion={handleNextQuestion}
                onShowResults={handleShowResults}
                allQuestionsAnswered={allQuestionsAnswered}
                fingerCount={fingerCount}
                fingerDetectionMode={fingerDetectionMode}
                timeSpent={timeSpent}
              />
            </div>

            {/* Right Column - Finger Detection */}
            <div className="space-y-6">
              {fingerDetectionMode && (
                <FingerDetection 
                  key={refreshKey} 
                  onFingerCountUpdate={handleFingerCountUpdate} 
                />
              )}
              
              {!fingerDetectionMode && (
              <Card className="bg-white border-gray-100 shadow-sm">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                    <Camera className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-gray-900 text-xl font-semibold">
                    Enable Camera for Gesture Control
                  </CardTitle>
                  <p className="text-gray-500 text-sm mt-2">
                    Experience hands-free quiz interaction with intuitive gestures
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-600 leading-relaxed text-sm">
                        Turn on your camera to select quiz options using intuitive finger gestures. Simply show 1-4 fingers to choose options A-D.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <div className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-white text-xs font-semibold">1</span>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Option A</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-white text-xs font-semibold">2</span>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Option B</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-white text-xs font-semibold">3</span>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Option C</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-white text-xs font-semibold">4</span>
                        </div>
                        <div className="text-xs font-medium text-gray-700">Option D</div>
                      </div>
                    </div>

                    <Button
                      onClick={toggleFingerDetection}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2.5 text-base font-medium rounded-lg"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Enable Gesture Control
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegratedQuizSystem;
