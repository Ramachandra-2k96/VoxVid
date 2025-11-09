"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Sparkles, Video, Clock, CheckCircle2, Loader2, PlayCircle, Zap } from 'lucide-react'

interface Project {
  id: string
  name: string
  step: number
  prompt?: string
  imageUrl?: string
  imageBase64?: string | null
  talkId?: string
  status?: string
  resultUrl?: string
  createdAt: string
}

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const loadProjects = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')
      const response = await fetch(`${API_URL}/api/videos/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Map to frontend format
          const mapped = data.map((v: any) => ({
          id: v.id.toString(),
          name: v.name,
          step: v.status === 'done' || v.status === 'completed' ? 4 : 
                v.status === 'processing' || v.status === 'created' ? 3 : 1,
          prompt: v.script_input,
            imageUrl: v.source_url,
            imageBase64: v.original_image_base64 || null,
          talkId: v.talk_id,
          status: v.status,
          resultUrl: v.result_url,
          createdAt: v.created_at,
        }))
        setProjects(mapped)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // If tokens might be written just before navigation (signup auto-login), wait briefly
    const waitForTokens = async (timeout = 2000) => {
      const start = Date.now()
      while (Date.now() - start < timeout) {
        const toks = localStorage.getItem('voxvid_tokens')
        if (toks) return true
        // small delay
        // eslint-disable-next-line no-await-in-loop
        await new Promise(res => setTimeout(res, 150))
      }
      return false
    }

    const init = async () => {
      const has = await waitForTokens(2500)
      if (!has) {
        // no tokens -> redirect to login
        router.replace('/login')
        return
      }
      loadProjects()
    }

    init()

    // Listen for storage events (login/signup from another tab or earlier in same flow)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'voxvid_tokens' && e.newValue) {
        loadProjects()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      projects.forEach(project => {
        if (project.step === 3 && project.talkId) {
          checkStatus(project.id)
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [projects])

  const checkStatus = async (projectId: string) => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')
      const response = await fetch(`${API_URL}/api/videos/${projectId}/update/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'done' || data.status === 'completed') {
          setProjects(prev => prev.map(p => p.id === projectId ? { ...p, step: 4, status: 'done', resultUrl: data.result_url } : p))
        } else if (data.status === 'processing') {
          setProjects(prev => prev.map(p => p.id === projectId ? { ...p, step: 3, status: 'processing' } : p))
        }
      }
    } catch (error) {
      console.error('Error checking status:', error)
    }
  }

  const handleProjectClick = (project: Project) => {
    if (project.step === 4) {
      router.push(`/home/project/${project.id}`)
    }
  }

  const getStatusBadge = (project: Project) => {
    switch (project.step) {
      case 0: return <Badge variant="secondary" className="bg-muted/50 hover:bg-muted/70 border-border">Draft</Badge>
      case 1: return <Badge variant="secondary" className="bg-blue-500/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Pending</Badge>
      case 3: return (
        <Badge variant="secondary" className="bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Processing
        </Badge>
      )
      case 4: return (
        <Badge variant="secondary" className="bg-green-500/10 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Complete
        </Badge>
      )
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-geist">
                Your Projects
              </h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your AI-generated videos
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/home/create')}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
              </Button>
              <Button 
                onClick={() => router.push('/home/create_heygen')}
                size="lg"
                variant="outline"
                className="border-2 hover:border-primary text-black dark:text-white"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">HeyGen Style</span>
                <span className="sm:hidden">HeyGen</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border hover:border-primary/50 transition-all theme-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{projects.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center">
                  <Video className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-all theme-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {projects.filter(p => p.step === 4).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 dark:bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-all theme-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {projects.filter(p => p.step === 3).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/10 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-amber-600 dark:text-amber-500 animate-spin" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-card border-border border-dashed theme-transition">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/10 via-orange-500/10 to-pink-500/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first AI-powered video project. It only takes a few clicks!
              </p>
              <Button 
                onClick={() => router.push('/home/create')}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 hover:opacity-90 text-white"
              >
                <Zap className="mr-2 h-5 w-5" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card 
                key={project.id}
                className={`bg-card border-border overflow-hidden group hover:border-primary/50 transition-all theme-transition ${
                  project.step === 4 ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
                }`}
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {project.imageBase64 ? (
                    <img
                      src={project.imageBase64}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {project.step === 4 && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white" />
                    </div>
                  )}
                  
                  {project.step === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-12 w-12 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <CardHeader className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                      {project.name}
                    </CardTitle>
                    {getStatusBadge(project)}
                  </div>
                  {project.prompt && (
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                      {project.prompt}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(project.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
    