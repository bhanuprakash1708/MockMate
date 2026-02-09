"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, X, Loader2, Sparkles, ImageIcon, FileText, Volume2 } from "lucide-react"
import Markdown from "react-markdown"

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

interface Message {
  text: string
  files?: File[]
  sender: "user" | "bot"
  isError?: boolean
  isStreaming?: boolean
}

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prevFiles) => [...prevFiles, ...files])
  }

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1]
          resolve(base64String)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const simulateTypingAnimation = async (text: string) => {
    setStreamingText("")
    setIsStreaming(true)

    // Split by characters for more realistic typing
    const chars = text.split("")

    for (let i = 0; i < chars.length; i++) {
      await new Promise((resolve) => {
        // Variable speed - faster for spaces, slower for punctuation
        const char = chars[i]
        let delay = 20

        if (char === " ") delay = 10
        else if ([".", "!", "?", ",", ";", ":"].includes(char)) delay = 100
        else if (char === "\n") delay = 50
        else delay = 15 + Math.random() * 25

        setTimeout(resolve, delay)
      })

      setStreamingText((prev) => prev + chars[i])
    }

    // Small pause before finishing
    await new Promise((resolve) => setTimeout(resolve, 300))

    setIsStreaming(false)
    setStreamingText("")
    setMessages((prev) => [...prev, { text, sender: "bot" }])
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() && selectedFiles.length === 0) return

    if (!API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Please set your NEXT_PUBLIC_GEMINI_API_KEY environment variable to use this chat.",
          sender: "bot",
          isError: true,
        },
      ])
      return
    }

    setIsLoading(true)
    const userMessage: Message = { text: inputText, files: selectedFiles, sender: "user" }
    setMessages((prevMessages) => [...prevMessages, userMessage])

    const currentInput = inputText
    const currentFiles = selectedFiles
    setInputText("")
    setSelectedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    try {
      const parts: any[] = []

      if (currentInput.trim()) {
        parts.push({ text: currentInput.trim() })
      }

      for (const file of currentFiles || []) {
        const base64 = await fileToBase64(file)
        parts.push({
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        })
      }

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        safetySettings,
      })

      const response = await result.response
      const text = response.text()
      console.log("Generated content:", text)

      setIsLoading(false)
      await simulateTypingAnimation(text)
    } catch (error) {
      console.error("Error generating content:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setIsLoading(false)
      setMessages((prevMessages) => [...prevMessages, { text: `Error: ${errorMessage}`, sender: "bot", isError: true }])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-gray-500" />
    if (file.type.startsWith("audio/")) return <Volume2 className="w-4 h-4 text-gray-500" />
    return <FileText className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-medium text-gray-800">Gemini Multi-Modal Chat</h1>
                <p className="text-gray-600 mt-1">Powered by Google Generative AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 text-gray-400">🤖</div>
              <h2 className="text-2xl font-medium text-gray-700 mb-2">Start a conversation with Gemini</h2>
              <p className="text-gray-500">Upload files, ask questions, or request assistance to get started</p>
              {!API_KEY && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Set your NEXT_PUBLIC_GEMINI_API_KEY environment variable to enable AI
                    responses.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.sender === "user" ? (
                  <div className="flex items-start space-x-4">
                    <div className="flex-1"></div>
                    <div className="flex items-start space-x-3 max-w-3xl">
                      <div className="bg-gray-100 border border-gray-200 text-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                        {msg.text && (
                          <div className="prose prose-sm max-w-none">
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        )}
                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            {msg.files.map((file: File, fileIndex: number) => (
                              <div key={fileIndex} className="relative">
                                {file.type.startsWith("image/") && (
                                  <img
                                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                                    alt={`Uploaded ${file.name}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                  />
                                )}
                                {file.type.startsWith("audio/") && (
                                  <audio controls src={URL.createObjectURL(file)} className="w-full"></audio>
                                )}
                                {!file.type.startsWith("image/") && !file.type.startsWith("audio/") && (
                                  <div className="bg-gray-200 p-3 rounded-lg text-sm text-gray-700">
                                    <div className="flex items-center">
                                      <Paperclip size={16} className="mr-2" />
                                      <span className="truncate">
                                        {file.name} ({Math.round(file.size / 1024)} KB)
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        U
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 max-w-3xl">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 self-start">
                      AI
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        msg.isError ? "bg-red-50 border border-red-200" : "bg-white border border-gray-200"
                      }`}
                    >
                      {msg.text && (
                        <div className={`prose prose-sm max-w-none ${msg.isError ? "text-red-700" : "text-gray-800"}`}>
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Enhanced Streaming Response */}
            {(isLoading || isStreaming || streamingText) && (
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 self-start">
                  AI
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  {isLoading && !streamingText ? (
                    <div className="flex items-center text-gray-600">
                      <Loader2 size={16} className="animate-spin mr-2 text-blue-500" />
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-gray-800 relative">
                      <div className="inline">
                        <span className="inline">
                          <Markdown>{streamingText}</Markdown>
                        </span>
                        {isStreaming && (
                          <span className="inline-block w-0.5 h-5 bg-gray-800 animate-pulse ml-0.5 relative top-0.5"></span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 flex items-center space-x-2 text-sm text-gray-700"
                >
                  {getFileIcon(file)}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end space-x-3">
            {/* File Input */}
            <label htmlFor="file-input" className="cursor-pointer mb-2">
              <div className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-600 hover:text-gray-700 border border-gray-300">
                <Paperclip size={20} />
              </div>
              <input
                id="file-input"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,audio/*,application/pdf,text/plain"
              />
            </label>

            {/* Textarea */}
            <div className="flex-1 relative">
              <Textarea
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[52px] max-h-32 transition-all"
                placeholder="Type your message or ask about the files..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || isStreaming || (!inputText.trim() && selectedFiles.length === 0)}
              className={`p-3 rounded-xl transition-all border mb-2 ${
                isLoading || isStreaming || (!inputText.trim() && selectedFiles.length === 0)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                  : "bg-gray-800 hover:bg-gray-700 text-white shadow-sm border-gray-800 hover:shadow-md"
              }`}
            >
              {isLoading || isStreaming ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}