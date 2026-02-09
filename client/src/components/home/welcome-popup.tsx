"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, CheckCircle, User, Mail } from "lucide-react"

interface WelcomePopupProps {
  open: boolean
  onClose: () => void
}

export function WelcomePopup({ open, onClose }: WelcomePopupProps) {
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    if (name.trim() && email.trim()) {
      // Store user data in localStorage
      const userData = {
        name: name.trim(),
        email: email.trim(),
        onboardingCompleted: true
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
      
      onClose();
    }
  }

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/70" />
      <DialogContent className="sm:max-w-md border-0 shadow-2xl p-0 overflow-hidden bg-white rounded-xl">
        <div className="bg-white p-8 text-center">
          {/* Clean animated icon */}
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>

          {/* Clean title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Your Dashboard</h2>

          {/* Clear description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Enter your details so we can personalize your learning experience and track your progress effectively.
          </p>

          {/* Clean User Input Form */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Properly aligned feature list */}
          <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
            {["Track your quiz performance", "Monitor learning progress", "Analyze study patterns"].map(
              (feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="leading-relaxed">{feature}</span>
                </div>
              ),
            )}
          </div>

          {/* Simple button */}
          <Button
            onClick={handleGetStarted}
            disabled={!name.trim() || !email.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
