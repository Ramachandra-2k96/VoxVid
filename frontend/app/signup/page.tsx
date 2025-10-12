"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Video, Home, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) return

    setIsLoading(true)
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Signup failed')

      // Auto-login: store tokens and redirect
      localStorage.setItem('voxvid_tokens', JSON.stringify(data.tokens))
      localStorage.setItem('voxvid_user', JSON.stringify(data.user))
      // navigate to home
      window.location.href = '/home'
    } catch (err: any) {
      console.error('Signup error', err)
      alert(err.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "One number", met: /\d/.test(formData.password) },
  ]

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0

  return (
    <div className="min-h-screen bg-black text-white font-geist flex">
      {/* Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 transition-all duration-200"
        style={{
          fontFamily: "GeistMono, monospace",
        }}
      >
        <Home className="h-4 w-4" />
        <span className="text-sm font-medium">Home</span>
      </Link>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          />
        </div>

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 flex items-center justify-center mb-6 mx-auto">
              <Video className="h-10 w-10 text-white" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "GeistSans, sans-serif",
              }}
            >
              VoxVid
            </h1>
            <p
              className="text-white/80 text-lg max-w-md"
              style={{
                fontFamily: "GeistMono, monospace",
              }}
            >
              Join thousands of creators who transform their ideas into stunning videos with AI-powered technology.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/70">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Free to get started
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Sparkles className="h-5 w-5 text-orange-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Create your first video in minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 flex items-center justify-center mb-4 mx-auto">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{
                background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "GeistSans, sans-serif",
              }}
            >
              VoxVid
            </h1>
          </div>

          <div className="text-center">
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: "GeistSans, sans-serif",
              }}
            >
              Create Account
            </h2>
            <p
              className="text-white/70"
              style={{
                fontFamily: "GeistMono, monospace",
              }}
            >
              Start creating amazing videos today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-white/90 text-sm font-medium"
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                >
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-white/90 text-sm font-medium"
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                >
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                    style={{
                      fontFamily: "GeistMono, monospace",
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-white/90 text-sm font-medium"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-white/90 text-sm font-medium"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-1 mt-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className={`h-3 w-3 ${req.met ? 'text-green-400' : 'text-white/30'}`} />
                      <span
                        className={`text-xs ${req.met ? 'text-green-400' : 'text-white/50'}`}
                        style={{
                          fontFamily: "GeistMono, monospace",
                        }}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-white/90 text-sm font-medium"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400 ${
                    formData.confirmPassword && !passwordsMatch ? 'border-red-400' : ''
                  }`}
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "GeistMono, monospace" }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-white/70 leading-relaxed"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                I agree to the{" "}
                <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreedToTerms || !passwordsMatch}
              className="w-full h-12 bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                fontFamily: "GeistSans, sans-serif",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p
              className="text-white/70"
              style={{
                fontFamily: "GeistMono, monospace",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}