"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Camera, User, Mail, FileText, Calendar, MapPin, Link as LinkIcon, Loader2 } from "lucide-react"

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  bio: string
  location: string
  website: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [userStats, setUserStats] = useState({
    videosCreated: 0,
    totalViews: 0,
    joinDate: "January 2024"
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      location: "",
      website: "",
    }
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')

      // Fetch profile data
      const profileResponse = await fetch(`${API_URL}/api/profile/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        form.reset({
          firstName: profileData.user.first_name,
          lastName: profileData.user.last_name,
          email: profileData.user.email,
          bio: profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
        })
        setAvatarPreview(profileData.avatar_url || "")
        setUserStats(prev => ({
          ...prev,
          joinDate: new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        }))
      }

      // Fetch video count
      const videosResponse = await fetch(`${API_URL}/api/videos/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      })

      if (videosResponse.ok) {
        const videosData = await videosResponse.json()
        const videoCount = Array.isArray(videosData) ? videosData.length : videosData.count || 0
        const totalViews = Array.isArray(videosData) 
          ? videosData.reduce((sum: number, video: any) => sum + (video.view_count || 0), 0)
          : 0

        setUserStats(prev => ({
          ...prev,
          videosCreated: videoCount,
          totalViews: totalViews
        }))
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')

      const formData = new FormData()
      formData.append('bio', data.bio)
      formData.append('location', data.location)
      formData.append('website', data.website)

      // Handle avatar upload if changed
      if (fileInputRef.current?.files?.[0]) {
        formData.append('avatar', fileInputRef.current.files[0])
      }

      const response = await fetch(`${API_URL}/api/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: formData,
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setAvatarPreview(updatedProfile.avatar_url || "")
        setIsEditing(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and public profile.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={avatarPreview} alt="Profile picture" />
                  <AvatarFallback className="text-lg">
                    {getInitials(form.watch("firstName"), form.watch("lastName"))}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <CardTitle className="mt-4">
                {form.watch("firstName")} {form.watch("lastName")}
              </CardTitle>
              <CardDescription>{form.watch("email")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{userStats.videosCreated}</div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userStats.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Joined {userStats.joinDate}
                </div>
                {form.watch("location") && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {form.watch("location")}
                  </div>
                )}
                {form.watch("website") && (
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="w-4 h-4" />
                    <a href={form.watch("website")} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {form.watch("website")}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and bio.
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" disabled={!isEditing} />
                        </FormControl>
                        <FormDescription>
                          This email will be used for account notifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself..."
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Max 500 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} placeholder="City, Country" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}