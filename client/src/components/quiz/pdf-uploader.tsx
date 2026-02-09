import React from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Brain,
  Download,
} from "lucide-react";
import type { Quiz } from "@/types/quiz";
import { downloadSamplePDF } from "@/lib/sample-pdf";

interface PDFUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  generationProgress: string;
  setGenerationProgress: (progress: string) => void;
  setQuiz: (quiz: Quiz | null) => void;
  setSelectedAnswers: (answers: number[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({
  file,
  setFile,
  isGenerating,
  setIsGenerating,
  generationProgress,
  setGenerationProgress,
  setQuiz,
  setSelectedAnswers,
  fileInputRef,
}) => {
  const [numQuestions, setNumQuestions] = React.useState<number>(5);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Helper function to convert file to base64
  const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          if (!base64) {
            throw new Error("Invalid base64 data");
          }
          resolve(base64);
        } catch (error) {
          console.error('Base64 conversion error:', error);
          reject(new Error("Failed to convert PDF to base64 format."));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read PDF file"));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Helper function to extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let text = '';
      for (let i = 0; i < uint8Array.length; i++) {
        const char = String.fromCharCode(uint8Array[i]);
        if ((char >= ' ' && char <= '~') || char === '\n' || char === '\r' || char === '\t') {
          text += char;
        }
      }
      
      text = text
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,!?;:()\-"']/g, '')
        .trim();
      
      if (text.length > 100) {
        return text;
      }
      
      throw new Error('No readable text found in PDF');
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  // Generate quiz using Gemini AI
  const generateQuiz = async (
    pdfFile: File,
    questionCount: number
  ): Promise<Quiz> => {
    if (!apiKey) {
      throw new Error("Please provide a valid Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
      const fileSizeMB = pdfFile.size / (1024 * 1024);
      setGenerationProgress(`Processing PDF (${fileSizeMB.toFixed(1)}MB)...`);
      
      let prompt = "";
      let parts: any[] = [];
      
      if (fileSizeMB > 15) {
        setGenerationProgress("Extracting text from large PDF...");
        try {
          const extractedText = await extractTextFromPDF(pdfFile);
          const truncatedText = extractedText.substring(0, 30000);
          
          prompt = `Based on the following text extracted from a PDF document, generate a comprehensive quiz with exactly ${questionCount} high-quality multiple-choice questions.

Text content: "${truncatedText}"

Please respond ONLY with a valid JSON object in this exact format:
{
  "title": "Quiz Title Based on Document Content",
  "description": "Brief description of what the quiz covers",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Make exactly ${questionCount} questions
- Each question should have exactly 4 options
- correctAnswer should be the index (0-3) of the correct option
- Questions should be challenging but fair
- Cover different topics from the content
- Include both factual recall and analytical questions
- Provide clear explanations for each answer`;

          parts = [prompt];
        } catch (textError) {
          console.warn("Text extraction failed, trying base64 method:", textError);
          throw new Error("Unable to process this PDF. The file may be scanned or contain no readable text.");
        }
      } else {
        setGenerationProgress("Converting PDF to base64...");
        const base64Data = await convertFileToBase64(pdfFile);
        
        prompt = `Analyze this PDF document and generate a comprehensive quiz with exactly ${questionCount} high-quality multiple-choice questions. 
The questions should be diverse, covering different aspects and difficulty levels of the content.

Please respond ONLY with a valid JSON object in this exact format:
{
  "title": "Quiz Title",
  "description": "Brief description of what the quiz covers",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Make exactly ${questionCount} questions
- Each question should have exactly 4 options
- correctAnswer should be the index (0-3) of the correct option
- Questions should be challenging but fair
- Cover different topics from the content
- Include both factual recall and analytical questions
- Provide clear explanations for each answer`;

        parts = [
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf",
            },
          },
        ];
      }

      setGenerationProgress("Generating quiz with AI...");

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Request timeout. Please try again with a smaller file or fewer questions."));
        }, 120000);
      });

      const generationPromise = model.generateContent(parts);
      const result = await Promise.race([generationPromise, timeoutPromise]);
      const response = await (result as any).response;
      const text = response.text();

      setGenerationProgress("Parsing quiz data...");

      let quiz: Quiz;
      try {
        let jsonText = text.trim();
        jsonText = jsonText.replace(/```json\s*|\s*```/g, '');
        
        const jsonStart = jsonText.indexOf('{');
        const jsonEnd = jsonText.lastIndexOf('}') + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error("No valid JSON found in response");
        }
        
        jsonText = jsonText.substring(jsonStart, jsonEnd);
        quiz = JSON.parse(jsonText);
        
        if (!quiz.questions || !Array.isArray(quiz.questions)) {
          throw new Error("Invalid quiz structure: missing questions array");
        }
        
        if (quiz.questions.length !== questionCount) {
          console.warn(`Expected ${questionCount} questions, got ${quiz.questions.length}`);
        }
        
        quiz.questions.forEach((q, index) => {
          if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
            throw new Error(`Invalid question structure at index ${index}`);
          }
          if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
            throw new Error(`Invalid correct answer at question ${index + 1}`);
          }
        });
        
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw response:', text);
        throw new Error("Failed to parse quiz data. The AI response was not in the expected format.");
      }

      return quiz;
    } catch (error: any) {
      console.error('Generation error:', error);
      
      if (error.message?.includes('timeout')) {
        throw new Error("The request timed out. Please try with a smaller file or fewer questions.");
      } else if (error.message?.includes('base64')) {
        throw new Error("Failed to process the PDF file. Please try a different PDF or a smaller file.");
      } else if (error.message?.includes('SAFETY')) {
        throw new Error("The content was blocked by safety filters. Please try a different PDF.");
      } else if (error.message?.includes('API key')) {
        throw new Error("Invalid API key. Please check your Gemini API configuration.");
      } else if (error.message?.includes('quota')) {
        throw new Error("API quota exceeded. Please try again later.");
      }
      
      throw error;
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      
      if (fileSizeMB > 100) {
        alert(`This PDF is very large (${fileSizeMB.toFixed(1)}MB). Please try a smaller file (under 100MB) for better performance.`);
        return;
      }
      
      setFile(selectedFile);
      setQuiz(null);
      setSelectedAnswers([]);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    if (!file) {
      alert("Please upload a PDF file first");
      return;
    }

    if (numQuestions < 1 || numQuestions > 20) {
      alert("Please enter a number of questions between 1 and 20");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress("Starting quiz generation...");
    setQuiz(null);
    setSelectedAnswers([]);

    try {
      const generatedQuiz = await generateQuiz(file, numQuestions);
      setQuiz(generatedQuiz);
      setSelectedAnswers(new Array(generatedQuiz.questions.length).fill(-1));
      setGenerationProgress("");
    } catch (error: any) {
      console.error("Quiz generation failed:", error);
      alert(`Failed to generate quiz: ${error.message}`);
      setGenerationProgress("");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Upload PDF Document
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Transform any PDF into an interactive quiz with AI-powered question generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* File Upload */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-800 block">
              Select PDF File
            </label>
            <div className="relative group">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 group-hover:scale-[1.02]"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 group-hover:text-blue-600" />
                  <p className="mb-2 text-sm text-gray-700 font-medium">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF files up to 100MB</p>
                </div>
              </label>
            </div>
            
            {file && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{file.name}</p>
                    <p className="text-gray-600 text-xs">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white px-3 py-1">
                  Ready
                </Badge>
              </div>
            )}
          </div>

          {/* Number of Questions */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-800 block">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                className="w-24 h-12 text-center text-lg font-semibold bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Choose between 1-20 questions</p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 5-10 questions for optimal experience</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleGenerateQuiz}
              disabled={!file || isGenerating}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Brain className="h-5 w-5 mr-2" />
              {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadSamplePDF}
              className="h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 hover:shadow-md transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Sample PDF
            </Button>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              How it works:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Upload PDF</p>
                  <p className="text-xs text-gray-600 mt-1">Text-based PDFs work best</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">AI Analysis</p>
                  <p className="text-xs text-gray-600 mt-1">Content analyzed automatically</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Quiz Generated</p>
                  <p className="text-xs text-gray-600 mt-1">Relevant questions created</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Gesture Control</p>
                  <p className="text-xs text-gray-600 mt-1">Use fingers to select answers</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <div className="text-center space-y-6">
              {/* Loading Icon */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-8 w-8 text-white animate-pulse" />
              </div>
              
              {/* Loading Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Your Quiz</h3>
                <p className="text-gray-600">AI is analyzing your document and creating questions...</p>
              </div>
              
              {/* Progress Text */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-blue-900 font-medium text-sm">{generationProgress}</p>
              </div>
              
              {/* Loading Animation */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              
              {/* Estimated Time */}
              <p className="text-xs text-gray-500">This usually takes 30-60 seconds</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFUploader;