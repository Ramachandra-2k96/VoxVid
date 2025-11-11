"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, ArrowRight, ArrowLeft, Video, Home, KeyRound, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = 'email' | 'otp' | 'password'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const API_URL = (process.env.NEXT_PUBLIC_API_URL as string)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/password-reset/request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to send OTP')
      }

      setStep('otp')
    } catch (err: any) {
      console.error('Error sending OTP', err)
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/auth/password-reset/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to reset password')
      }

      // Success - redirect to login
      alert('Password reset successfully! Please login with your new password.')
      router.push('/login')
    } catch (err: any) {
      console.error('Error resetting password', err)
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-geist flex">
      {/* Home Button */}
      <Link
        href="/login"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-border rounded-lg px-4 py-2 transition-all duration-200"
        style={{
          fontFamily: "GeistMono, monospace",
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        {/* Gradient Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30 dark:opacity-100"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%)",
            }}
          />
          <div
            className="absolute inset-0 bg-background/80 dark:bg-black/70"
          />
        </div>

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
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
              <Shield className="h-10 w-10 text-white" />
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
              Reset Password
            </h1>
            <p
              className="text-foreground/80 text-lg max-w-md"
              style={{
                fontFamily: "GeistMono, monospace",
              }}
            >
              Secure your account with a new password. We'll send you a verification code to confirm it's you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <KeyRound className="h-5 w-5 text-cyan-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Secure OTP Verification
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-orange-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Email Confirmation
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Lock className="h-5 w-5 text-pink-400" />
              <span className="text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                Enhanced Security
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 flex items-center justify-center mb-4 mx-auto">
              <Shield className="h-8 w-8 text-white" />
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

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step === 'email' ? 'bg-cyan-400' : 'bg-white/20'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'otp' ? 'bg-cyan-400' : 'bg-white/20'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 'password' ? 'bg-cyan-400' : 'bg-white/20'}`} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50">
              <p className="text-destructive text-sm" style={{ fontFamily: "GeistMono, monospace" }}>
                {error}
              </p>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "GeistSans, sans-serif" }}
                >
                  Forgot Password?
                </h2>
                <p
                  className="text-white/60 text-sm"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  Enter your email to receive a verification code
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ fontFamily: "GeistMono, monospace" }}>
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="pl-10"
                      style={{ fontFamily: "GeistMono, monospace" }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-500 hover:to-pink-500 text-white border-0"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('password'); }} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "GeistSans, sans-serif" }}
                >
                  Verify Your Email
                </h2>
                <p
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  Enter the 6-digit code sent to <span className="text-cyan-400">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" style={{ fontFamily: "GeistMono, monospace" }}>
                    Verification Code
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      required
                      maxLength={6}
                      className="pl-10 text-center text-2xl tracking-widest"
                      style={{ fontFamily: "GeistMono, monospace" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center" style={{ fontFamily: "GeistMono, monospace" }}>
                    Code expires in 10 minutes
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-500 hover:to-pink-500 text-white border-0"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  Verify Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "GeistSans, sans-serif" }}
                >
                  Set New Password
                </h2>
                <p
                  className="text-muted-foreground text-sm"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  Create a strong password for your account
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" style={{ fontFamily: "GeistMono, monospace" }}>
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="pl-10"
                      style={{ fontFamily: "GeistMono, monospace" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" style={{ fontFamily: "GeistMono, monospace" }}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="pl-10"
                      style={{ fontFamily: "GeistMono, monospace" }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-500 hover:to-pink-500 text-white border-0"
                  style={{ fontFamily: "GeistMono, monospace" }}
                >
                  {isLoading ? (
                    "Resetting Password..."
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
