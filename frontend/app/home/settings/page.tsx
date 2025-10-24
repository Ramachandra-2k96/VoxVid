"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Bell, Globe, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })
  const [language, setLanguage] = useState("en")
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
  })

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      try {
        const tokens = localStorage.getItem('voxvid_tokens')
        if (!tokens) {
          router.replace('/login')
          return
        }
        
        const parsedTokens = JSON.parse(tokens)
        if (!parsedTokens.access) {
          router.replace('/login')
          return
        }
        
        // Optional: Check if token is expired
        try {
          const payload = JSON.parse(atob(parsedTokens.access.split('.')[1]))
          const currentTime = Date.now() / 1000
          if (payload.exp < currentTime) {
            localStorage.removeItem('voxvid_tokens')
            router.replace('/login')
            return
          }
        } catch (e) {
          // If token parsing fails, redirect to login
          localStorage.removeItem('voxvid_tokens')
          router.replace('/login')
          return
        }
      } catch (e) {
        localStorage.removeItem('voxvid_tokens')
        router.replace('/login')
      }
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setNotifications(settings.notifications || notifications)
      setLanguage(settings.language || language)
      setPrivacy(settings.privacy || privacy)
    }
  }, [])

  const saveSettings = () => {
    const settings = {
      notifications,
      language,
      privacy,
      theme,
    }
    localStorage.setItem('userSettings', JSON.stringify(settings))
    // Here you could also send to backend API
  }

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how VoxVid looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your language and regional preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Profile visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) =>
                    setPrivacy(prev => ({ ...prev, profileVisible: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Data sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing anonymized data for product improvement
                  </p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) =>
                    setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSettings} className="px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}