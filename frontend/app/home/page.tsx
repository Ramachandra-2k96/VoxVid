"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Sparkles, Video } from 'lucide-react'

interface Project {
  id: string
  name: string
  step: number
  prompt?: string
  imageUrl?: string
  talkId?: string
  status?: string
  resultUrl?: string
  createdAt: string
}

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Protect page client-side: if no access token, redirect to login
    try {
      const tokens = localStorage.getItem('voxvid_tokens')
      if (!tokens) {
        router.replace('/login')
      }
    } catch (e) {
      router.replace('/login')
    }
  }, [])

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
          step: v.status === 'done' ? 4 : v.status === 'created' ? 3 : 1,
          prompt: v.script_input,
          imageUrl: v.source_url,
          talkId: v.talk_id,
          status: v.status,
          resultUrl: v.result_url,
          createdAt: v.created_at,
        }))
        setProjects(mapped)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  useEffect(() => {
    loadProjects()
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
        if (data.status === 'done') {
          setProjects(prev => prev.map(p => p.id === projectId ? { ...p, step: 4, status: 'done', resultUrl: data.result_url } : p))
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
      case 0: return <Badge variant="secondary" className="bg-gray-700">Draft</Badge>
      case 1: return <Badge variant="secondary" className="bg-blue-900">In Progress</Badge>
      case 2: return <Badge variant="secondary" className="bg-blue-900">Ready</Badge>
      case 3: return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Generating</Badge>
      case 4: return <Badge variant="default" className="bg-green-600">Completed</Badge>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">AI-Powered Video Generation</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Personalized Voice-to-Video Narrator
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform text scripts into professional videos with AI voices and avatars.
            Create engaging video content instantly.
          </p>
          <Button
            onClick={() => router.push('/home/create')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Video
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Create your first AI-generated video to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card
                  key={project.id}
                  className={`bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 cursor-pointer ${
                    project.step === 4 ? 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10' : ''
                  }`}
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg truncate">
                        {project.name || 'Untitled Project'}
                      </CardTitle>
                      {getStatusBadge(project)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {project.step === 4 && project.resultUrl ? (
                      <div className="space-y-3">
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                          <video
                            src={project.resultUrl}
                            className="w-full h-full object-cover"
                            muted
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          Click to view full details
                        </p>
                      </div>
                    ) : project.step === 3 ? (
                      <div className="aspect-video bg-gray-800 rounded-lg flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="text-sm text-gray-300 mt-2">Generating...</span>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
