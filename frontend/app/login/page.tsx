"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Video, Home, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')

      // store tokens
      localStorage.setItem('voxvid_tokens', JSON.stringify(data.tokens))
      // optional: store user info
      localStorage.setItem('voxvid_user', JSON.stringify(data.user))

      router.push('/home')
    } catch (err: any) {
      console.error('Login error', err)
      alert(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

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
              Transform your scripts into stunning videos with AI-powered voice synthesis and avatar technology.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/70">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                AI-Powered Video Creation
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Sparkles className="h-5 w-5 text-orange-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Professional Voice Synthesis
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Custom Avatar Technology
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
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
              Welcome Back
            </h2>
            <p
              className="text-white/70"
              style={{
                fontFamily: "GeistMono, monospace",
              }}
            >
              Sign in to create amazing videos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400 text-base"
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400 text-base"
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
                />
                <span
                  className="ml-2 text-sm text-white/70"
                  style={{
                    fontFamily: "GeistMono, monospace",
                  }}
                >
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                style={{
                  fontFamily: "GeistMono, monospace",
                }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-500 hover:to-pink-500 text-white font-semibold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                fontFamily: "GeistSans, sans-serif",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
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
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p
              className="text-white/50 text-xs text-center"
              style={{
                fontFamily: "GeistMono, monospace",
              }}
            >
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}