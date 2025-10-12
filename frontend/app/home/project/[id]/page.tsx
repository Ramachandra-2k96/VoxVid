"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Share2, Play, Image as ImageIcon, Loader2 } from 'lucide-react'

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

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
        const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')
        const response = await fetch(`${API_URL}/api/videos/${params.id}/`, {
          headers: {
            'Authorization': `Bearer ${tokens.access}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          const mapped: Project = {
            id: data.id.toString(),
            name: data.name,
            step: data.status === 'done' ? 4 : data.status === 'created' ? 3 : 1,
            prompt: data.script_input,
            imageUrl: data.source_url,
            talkId: data.talk_id,
            status: data.status,
            resultUrl: data.result_url,
            createdAt: data.created_at,
          }
          setProject(mapped)
        }
      } catch (error) {
        console.error('Error loading project:', error)
      }
    }

    loadProject()
    setIsLoading(false)

    // Check for updates every 5 seconds
    const interval = setInterval(loadProject, 5000)

    return () => clearInterval(interval)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => router.push('/home')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    if (project.resultUrl) {
      const link = document.createElement('a')
      link.href = project.resultUrl
      link.download = `${project.name || 'video'}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (navigator.share && project.resultUrl) {
      navigator.share({
        title: project.name,
        text: 'Check out this AI-generated video!',
        url: project.resultUrl,
      })
    } else {
      navigator.clipboard.writeText(project.resultUrl || '')
      alert('Video URL copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push('/home')}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleDownload} variant="default" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Project Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {project.name}
          </h1>
          <Badge variant="secondary" className="text-sm">
            {project.step === 4 ? 'Completed' : 'In Progress'}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Source Image */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Source Image</h3>
              </div>
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt="Source"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-600" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Video */}
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold">Generated Video</h3>
              </div>
              {project.step === 4 && project.resultUrl ? (
                <video
                  src={project.resultUrl}
                  controls
                  className="w-full h-64 rounded-lg shadow-lg"
                  poster={project.imageUrl}
                />
              ) : project.step === 3 ? (
                <div className="w-full h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-300">Generating your video...</p>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-600" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Script */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Script Prompt</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300 leading-relaxed">
                {project.prompt || 'No script provided'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Created on {new Date(project.createdAt).toLocaleDateString()}</p>
          {project.talkId && <p className="mt-1">Talk ID: {project.talkId}</p>}
        </div>
      </div>
    </div>
  )
}