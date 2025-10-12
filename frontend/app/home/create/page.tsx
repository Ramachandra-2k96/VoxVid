"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Sparkles, Video, Wand2 } from 'lucide-react'

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

export default function CreateProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [projectData, setProjectData] = useState({
    name: '',
    imageUrl: '',
    prompt: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectData.name.trim() || !projectData.imageUrl.trim() || !projectData.prompt.trim()) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')
      const response = await fetch(`${API_URL}/api/videos/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          name: projectData.name.trim(),
          source_url: projectData.imageUrl.trim(),
          script_input: projectData.prompt.trim(),
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start video generation')
      }

      const data = await response.json()

      console.log('Created video generation:', data)

      // Navigate back to home
      router.push('/home')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-8">
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
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Create New Video</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Bring Your Ideas to Life
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enter your project details and let AI create a personalized video for you
          </p>
        </div>

        {/* Form */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Wand2 className="h-6 w-6 text-blue-400" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Project Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Product Demo, Welcome Message..."
                  value={projectData.name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-600 focus:border-blue-500 mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-sm font-medium">Avatar Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={projectData.imageUrl}
                  onChange={(e) => setProjectData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="bg-gray-800 border-gray-600 focus:border-blue-500 mt-1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Direct link to an image (JPG, PNG, etc.)
                </p>
              </div>

              <div>
                <Label htmlFor="prompt" className="text-sm font-medium">Script Text</Label>
                <Textarea
                  id="prompt"
                  placeholder="Write your script here... The AI will convert this text to speech and animate the avatar."
                  value={projectData.prompt}
                  onChange={(e) => setProjectData(prev => ({ ...prev, prompt: e.target.value }))}
                  rows={6}
                  className="bg-gray-800 border-gray-600 focus:border-blue-500 mt-1"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-5 w-5" />
                    Generate Video
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {(projectData.imageUrl || projectData.prompt) && (
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm max-w-2xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-center">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectData.imageUrl && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Avatar Image</h4>
                    <img
                      src={projectData.imageUrl}
                      alt="Avatar preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0QzE0IDUuMSAxMy4xIDYgMTIgNkMxMC45IDYgMTAgNS4xIDEwIDRDMTAgMi45IDEwLjkgMiAxMiAyWk0yMSAxOVYyMEgzVjE5QzMgMTYuMzMgOCAzLjY3IDEyIDMuNjdDMTYgMy42NyAyMSAxNi4zMyAyMSAxOVoiIGZpbGw9IiM2MzY2ZjEiLz4KPC9zdmc+'
                      }}
                    />
                  </div>
                )}
                {projectData.prompt && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Script Preview</h4>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 h-48 overflow-y-auto">
                      <p className="text-sm text-gray-300">{projectData.prompt}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}