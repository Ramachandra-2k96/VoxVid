"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { VoiceInputButton } from '@/components/voice-input-button'
import { 
  ArrowLeft, 
  Upload,
  Mic,
  Play,
  Volume2,
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react'

interface Voice {
  voice_id: string
  language: string
  gender: string
  name: string
  preview_audio: string
}

interface FormData {
  projectName: string
  inputType: 'text' | 'audio'
  script: string
  audioFile: File | null
  audioPreview: string
  avatarFile: File | null
  avatarPreview: string
  avatarShape: 'square' | 'circle'
  backgroundType: 'image' | 'video'
  backgroundFile: File | null
  backgroundPreview: string
  needSubtitles: boolean
  selectedVoice: Voice | null
  avatarScale: number
  avatarX: number
  avatarY: number
}

export default function CreateHeyGenPage() {
  const router = useRouter()
  const [voices, setVoices] = useState<Voice[]>([])
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([])
  const [searchVoice, setSearchVoice] = useState('')
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all')
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundImageRef = useRef<HTMLImageElement | null>(null)
  const avatarImageRef = useRef<HTMLImageElement | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    inputType: 'text',
    script: '',
    audioFile: null,
    audioPreview: '',
    avatarFile: null,
    avatarPreview: '',
    avatarShape: 'square',
    backgroundType: 'image',
    backgroundFile: null,
    backgroundPreview: '',
    needSubtitles: false,
    selectedVoice: null,
    avatarScale: 1,
    avatarX: 0,
    avatarY: 0
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

  // Load voices from JSON
  useEffect(() => {
    fetch('/voices.json')
      .then(res => res.json())
      .then(data => {
        const voiceList = data.data?.voices || []
        setVoices(voiceList)
        setFilteredVoices(voiceList)
      })
      .catch(err => console.error('Error loading voices:', err))
  }, [])

  // Filter voices
  useEffect(() => {
    let filtered = voices

    if (genderFilter !== 'all') {
      filtered = filtered.filter(v => v.gender.toLowerCase() === genderFilter)
    }

    if (searchVoice) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(searchVoice.toLowerCase()) ||
        v.language.toLowerCase().includes(searchVoice.toLowerCase())
      )
    }

    setFilteredVoices(filtered)
  }, [voices, searchVoice, genderFilter])

  // Load and cache background image/video
  useEffect(() => {
    if (!formData.backgroundPreview) {
      backgroundImageRef.current = null
      redrawCanvas()
      return
    }

    if (formData.backgroundType === 'video') {
      const video = document.createElement('video')
      video.src = formData.backgroundPreview
      video.muted = true
      video.playsInline = true
      
      video.onloadeddata = () => {
        video.currentTime = 0
      }
      
      video.onseeked = () => {
        // Create an image from the video frame
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = 1280
        tempCanvas.height = 720
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.drawImage(video, 0, 0, 1280, 720)
          const img = new Image()
          img.src = tempCanvas.toDataURL()
          img.onload = () => {
            backgroundImageRef.current = img
            redrawCanvas()
          }
        }
      }
      
      video.load()
    } else {
      const bgImg = new Image()
      bgImg.src = formData.backgroundPreview
      bgImg.onload = () => {
        backgroundImageRef.current = bgImg
        redrawCanvas()
      }
    }
  }, [formData.backgroundPreview, formData.backgroundType])

  // Load and cache avatar image
  useEffect(() => {
    if (!formData.avatarPreview) {
      avatarImageRef.current = null
      redrawCanvas()
      return
    }

    const avatarImg = new Image()
    avatarImg.src = formData.avatarPreview
    avatarImg.onload = () => {
      avatarImageRef.current = avatarImg
      redrawCanvas()
    }
  }, [formData.avatarPreview])

  // Redraw canvas when avatar position/scale/shape changes
  useEffect(() => {
    redrawCanvas()
  }, [formData.avatarScale, formData.avatarX, formData.avatarY, formData.avatarShape])

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    if (backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height)
    } else {
      // Default gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1a1a1a')
      gradient.addColorStop(1, '#2d2d2d')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw avatar
    if (avatarImageRef.current) {
      const scale = formData.avatarScale
      const maxWidth = canvas.width * 0.4
      const maxHeight = canvas.height * 0.6
      
      let width = avatarImageRef.current.width
      let height = avatarImageRef.current.height
      
      // Scale to fit
      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width
        height = maxHeight
      }

      width *= scale
      height *= scale

      // Convert normalized coordinates (-0.5 to 0.5) to pixel coordinates
      // X: -0.5 = left, 0 = center, 0.5 = right
      // Y: -0.5 = top, 0 = center, 0.5 = bottom
      const normalizedX = formData.avatarX
      const normalizedY = formData.avatarY
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      // Calculate position with normalized coordinates (multiply by full width/height since range is -0.5 to 0.5)
      const x = centerX + (normalizedX * canvas.width) - (width / 2)
      const y = centerY + (normalizedY * canvas.height) - (width / 2)

      // Apply clipping for circle shape
      if (formData.avatarShape === 'circle') {
        ctx.save()
        ctx.beginPath()
        const radius = Math.min(width, height) / 2
        const circleX = x + width / 2
        const circleY = y + height / 2
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
      }

      ctx.drawImage(avatarImageRef.current, x, y, width, height)

      if (formData.avatarShape === 'circle') {
        ctx.restore()
      }
    }
  }

  const handlePlayVoice = (voice: Voice) => {
    if (!voice.preview_audio) return

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
    }

    if (playingVoiceId === voice.voice_id) {
      setPlayingVoiceId(null)
      return
    }

    const audio = new Audio(voice.preview_audio)
    audio.onended = () => setPlayingVoiceId(null)
    audio.onerror = () => setPlayingVoiceId(null)
    
    audio.play()
      .then(() => {
        setPlayingVoiceId(voice.voice_id)
        audioPlayerRef.current = audio
      })
      .catch(err => console.error('Error playing audio:', err))
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          avatarFile: file,
          avatarPreview: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          backgroundFile: file,
          backgroundPreview: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        audioFile: file,
        audioPreview: url
      }))
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      recordedChunksRef.current = []
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      
      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setFormData(prev => ({ ...prev, audioFile: file, audioPreview: url }))
        stream.getTracks().forEach(t => t.stop())
        setIsRecording(false)
        mediaRecorderRef.current = null
      }
      
      mr.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Could not access microphone. Please allow microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.projectName.trim()) {
      alert('Please enter a project name')
      return
    }

    if (formData.inputType === 'text' && !formData.script.trim()) {
      alert('Please enter a script')
      return
    }

    if (formData.inputType === 'audio' && !formData.audioFile) {
      alert('Please upload or record audio')
      return
    }

    if (!formData.avatarFile) {
      alert('Please upload an avatar image')
      return
    }

    if (!formData.backgroundFile) {
      alert('Please upload a background')
      return
    }

    if (formData.inputType === 'text' && !formData.selectedVoice) {
      alert('Please select a voice')
      return
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')

      const formDataToSend = new FormData()
      formDataToSend.append('project_name', formData.projectName)
      formDataToSend.append('input_type', formData.inputType)
      formDataToSend.append('avatar_shape', formData.avatarShape)
      formDataToSend.append('background_type', formData.backgroundType)
      formDataToSend.append('need_subtitles', formData.needSubtitles.toString())
      formDataToSend.append('avatar_scale', formData.avatarScale.toString())
      formDataToSend.append('avatar_x', formData.avatarX.toString())
      formDataToSend.append('avatar_y', formData.avatarY.toString())

      if (formData.inputType === 'text') {
        formDataToSend.append('script', formData.script)
        if (formData.selectedVoice) {
          formDataToSend.append('voice_id', formData.selectedVoice.voice_id)
          formDataToSend.append('voice_name', formData.selectedVoice.name)
        }
      } else if (formData.audioFile) {
        formDataToSend.append('audio_file', formData.audioFile)
      }

      if (formData.avatarFile) {
        formDataToSend.append('avatar_file', formData.avatarFile)
      }

      if (formData.backgroundFile) {
        formDataToSend.append('background_file', formData.backgroundFile)
      }

      const response = await fetch(`${API_URL}/api/heygen/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create video')
      }

      const data = await response.json()
      console.log('Success:', data)
      alert('Video creation request submitted successfully!')
      router.push('/home')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create video. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/home')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Create HeyGen Video</h1>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 hover:opacity-90 text-white"
            >
              Generate Video
            </Button>
          </div>
        </div>

        {/* Main Content - Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Form */}
          <div className="w-1/2 border-r border-border overflow-y-auto p-6 space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="My Awesome Video"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
              />
            </div>

            {/* Input Type Toggle */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={formData.inputType === 'text' ? 'default' : 'outline'}
                  className={formData.inputType === 'text' ? 'bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 text-white' : ''}
                  onClick={() => setFormData(prev => ({ ...prev, inputType: 'text' }))}
                >
                  Text Script
                </Button>
                <Button
                  variant={formData.inputType === 'audio' ? 'default' : 'outline'}
                  className={formData.inputType === 'audio' ? 'bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 text-white' : ''}
                  onClick={() => setFormData(prev => ({ ...prev, inputType: 'audio' }))}
                >
                  Audio File
                </Button>
              </div>
            </div>

            {/* Text Script or Audio */}
            {formData.inputType === 'text' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="script">Script</Label>
                  <VoiceInputButton
                    onTranscript={(text) => {
                      setFormData(prev => ({
                        ...prev,
                        script: prev.script ? prev.script + ' ' + text : text
                      }))
                    }}
                    size="sm"
                  />
                </div>
                <Textarea
                  id="script"
                  placeholder="Enter your script here..."
                  value={formData.script}
                  onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">{formData.script.length} characters</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Audio File</Label>
                {!formData.audioPreview ? (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload audio</p>
                      <p className="text-xs text-muted-foreground">MP3, WAV, M4A</p>
                      <input type="file" className="hidden" accept="audio/*" onChange={handleAudioUpload} />
                    </label>
                    <div className="text-center text-xs text-muted-foreground">or</div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {isRecording ? 'Stop Recording' : 'Record Audio'}
                    </Button>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">{formData.audioFile?.name}</span>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => setFormData(prev => ({ ...prev, audioFile: null, audioPreview: '' }))}>
                          Remove
                        </Button>
                      </div>
                      <audio controls className="w-full" src={formData.audioPreview} />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Avatar Image */}
            <div className="space-y-2">
              <Label>Avatar Image</Label>
              {!formData.avatarPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload Avatar Image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img src={formData.avatarPreview} alt="Avatar" className="w-full h-40 object-cover" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, avatarFile: null, avatarPreview: '' }))}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  {/* Avatar Controls */}
                  <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
                    {/* Shape Selection */}
                    <div className="space-y-1">
                      <Label className="text-xs">Shape</Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={formData.avatarShape === 'square' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setFormData(prev => ({ ...prev, avatarShape: 'square' }))}
                        >
                          Square
                        </Button>
                        <Button
                          size="sm"
                          variant={formData.avatarShape === 'circle' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setFormData(prev => ({ ...prev, avatarShape: 'circle' }))}
                        >
                          Circle
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Scale: {formData.avatarScale.toFixed(2)}x</Label>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setFormData(prev => ({ ...prev, avatarScale: Math.max(0.1, prev.avatarScale - 0.1) }))}>
                          <ZoomOut className="h-3 w-3" />
                        </Button>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={formData.avatarScale}
                          onChange={(e) => setFormData(prev => ({ ...prev, avatarScale: parseFloat(e.target.value) }))}
                          className="flex-1 accent-primary
    dark:accent-primary
    [&::-webkit-slider-thumb]:bg-primary
    [&::-moz-range-thumb]:bg-primary
    [&::-webkit-slider-runnable-track]:bg-gray-300
    dark:[&::-webkit-slider-runnable-track]:bg-gray-600"
                        />
                        <Button size="sm" variant="outline" onClick={() => setFormData(prev => ({ ...prev, avatarScale: Math.min(3, prev.avatarScale + 0.1) }))}>
                          <ZoomIn className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">X Offset: {formData.avatarX.toFixed(2)}</Label>
                        <input
                          type="range"
                          min="-0.5"
                          max="0.5"
                          step="0.01"
                          value={formData.avatarX}
                          onChange={(e) => setFormData(prev => ({ ...prev, avatarX: parseFloat(e.target.value) }))}
                          className="w-full accent-primary
                              dark:accent-primary
                              [&::-webkit-slider-thumb]:bg-primary
                              [&::-moz-range-thumb]:bg-primary
                              [&::-webkit-slider-runnable-track]:bg-gray-300
                              dark:[&::-webkit-slider-runnable-track]:bg-gray-600"
                        />
                        <p className="text-[10px] text-muted-foreground">-0.5 (left) to 0.5 (right)</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Y Offset: {formData.avatarY.toFixed(2)}</Label>
                        <input
                          type="range"
                          min="-0.5"
                          max="0.5"
                          step="0.01"
                          value={formData.avatarY}
                          onChange={(e) => setFormData(prev => ({ ...prev, avatarY: parseFloat(e.target.value) }))}
                          className="w-full accent-primary
                            dark:accent-primary
                            [&::-webkit-slider-thumb]:bg-primary
                            [&::-moz-range-thumb]:bg-primary
                            [&::-webkit-slider-runnable-track]:bg-gray-300
                            dark:[&::-webkit-slider-runnable-track]:bg-gray-600" 
                        />
                        <p className="text-[10px] text-muted-foreground">-0.5 (top) to 0.5 (bottom)</p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => setFormData(prev => ({ ...prev, avatarScale: 1, avatarX: 0, avatarY: 0 }))}
                    >
                      <Move className="h-3 w-3 mr-2" />
                      Reset Position
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Background */}
            <div className="space-y-2">
              <Label>Background</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  size="sm"
                  variant={formData.backgroundType === 'image' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'image' }))}
                >
                  Image
                </Button>
                <Button
                  size="sm"
                  variant={formData.backgroundType === 'video' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, backgroundType: 'video' }))}
                >
                  Video
                </Button>
              </div>

              {!formData.backgroundPreview && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
                  {formData.backgroundType === 'image' ? <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" /> : <VideoIcon className="h-8 w-8 text-muted-foreground mb-2" />}
                  <p className="text-sm text-muted-foreground">Upload {formData.backgroundType}</p>
                  <input
                    type="file"
                    className="hidden"
                    accept={formData.backgroundType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleBackgroundUpload}
                  />
                </label>
              )}

              {formData.backgroundPreview && (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  {formData.backgroundType === 'image' ? (
                    <img src={formData.backgroundPreview} alt="Background" className="w-full h-32 object-cover" />
                  ) : (
                    <video src={formData.backgroundPreview} className="w-full h-32 object-cover" muted playsInline />
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, backgroundFile: null, backgroundPreview: '' }))}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Subtitles Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <Label htmlFor="subtitles" className="cursor-pointer">Enable Subtitles</Label>
                <p className="text-xs text-muted-foreground">Add captions to your video</p>
              </div>
              <Switch
                id="subtitles"
                checked={formData.needSubtitles}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needSubtitles: checked }))}
              />
            </div>

            {/* Voice Selection - Only show if text input */}
            {formData.inputType === 'text' && (
              <div className="space-y-3">
                <Label>Select Voice</Label>
                
                {/* Search and Filter */}
                <div className="space-y-2">
                  <Input
                    placeholder="Search voices..."
                    value={searchVoice}
                    onChange={(e) => setSearchVoice(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={genderFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setGenderFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={genderFilter === 'male' ? 'default' : 'outline'}
                      onClick={() => setGenderFilter('male')}
                    >
                      Male
                    </Button>
                    <Button
                      size="sm"
                      variant={genderFilter === 'female' ? 'default' : 'outline'}
                      onClick={() => setGenderFilter('female')}
                    >
                      Female
                    </Button>
                  </div>
                </div>

                {/* Voice List */}
                <div className="max-h-96 overflow-y-auto space-y-2 border border-border rounded-lg p-2">
                  {filteredVoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No voices found</p>
                  ) : (
                    filteredVoices.slice(0, 50).map((voice) => (
                      <Card
                        key={voice.voice_id}
                        className={`cursor-pointer transition-all ${
                          formData.selectedVoice?.voice_id === voice.voice_id
                            ? 'ring-2 ring-primary border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, selectedVoice: voice }))}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{voice.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {voice.language} • {voice.gender}
                              </p>
                            </div>
                            {voice.preview_audio && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePlayVoice(voice)
                                }}
                              >
                                {playingVoiceId === voice.voice_id ? (
                                  <Volume2 className="h-4 w-4 animate-pulse" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-muted/10 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See how your video will look
                </p>
              </div>

              {/* Canvas Preview */}
              <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden border-2 border-border shadow-xl">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-full"
                />
                
                {!formData.avatarPreview && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Upload an avatar to see preview</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Info */}
              <div className="mt-4 p-4 bg-card border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span className="font-medium">1280 × 720</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{formData.projectName || 'Untitled'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Content Type:</span>
                  <span className="font-medium capitalize">{formData.inputType}</span>
                </div>
                {formData.avatarPreview && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avatar Shape:</span>
                    <span className="font-medium capitalize">{formData.avatarShape}</span>
                  </div>
                )}
                {formData.avatarPreview && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avatar Position:</span>
                    <span className="font-medium text-xs">x: {formData.avatarX.toFixed(2)}, y: {formData.avatarY.toFixed(2)}</span>
                  </div>
                )}
                {formData.inputType === 'text' && formData.selectedVoice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Voice:</span>
                    <span className="font-medium">{formData.selectedVoice.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtitles:</span>
                  <span className="font-medium">{formData.needSubtitles ? 'Enabled' : 'Disabled'}</span>
                </div>
                {formData.backgroundPreview && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Background:</span>
                    <span className="font-medium capitalize">{formData.backgroundType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
