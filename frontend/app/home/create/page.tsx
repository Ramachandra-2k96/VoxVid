"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Video, 
  Wand2, 
  FileText, 
  Image as ImageIcon,
  Mic,
  CheckCircle2,
  Loader2,
  Upload,
  Play,
  Volume2
} from 'lucide-react'

interface VoiceLanguage {
  locale: string
  language: string
  accent?: string
  previewUrl?: string
  config?: {
    modelId?: string
    availableModels?: string[]
  }
}

interface VoiceOption {
  id: string
  name: string
  gender: string
  access: string
  provider: string
  styles: string[]
  languages: VoiceLanguage[]
  description?: string
  age?: string
  useCase?: string
  isLegacy?: boolean
}

interface CreateData {
  name: string
  script: string
  imageFile: File | null
  imagePreview: string
  voiceProvider: string
  voiceId: string
  voiceName: string
  voiceLanguage: string
}

export default function CreateProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [voices, setVoices] = useState<Record<string, VoiceOption[]>>({})
  const [selectedProvider, setSelectedProvider] = useState<string>('microsoft')
  const [isLoadingVoices, setIsLoadingVoices] = useState(false)
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  
  const [formData, setFormData] = useState<CreateData>({
    name: '',
    script: '',
    imageFile: null,
    imagePreview: '',
    voiceProvider: 'microsoft',
    voiceId: '',
    voiceName: '',
    voiceLanguage: ''
  })

  const providers = ['amazon', 'microsoft', 'elevenlabs', 'google', 'playHT']

  const totalSteps = 5

  // Load voices when provider changes
  useEffect(() => {
    if (currentStep === 4 && selectedProvider && !voices[selectedProvider]) {
      loadVoices(selectedProvider)
    }
  }, [currentStep, selectedProvider])

  const loadVoices = async (provider: string) => {
    setIsLoadingVoices(true)
    try {
      const response = await fetch(
        `https://api.d-id.com/tts/voices?provider=${provider}`,
        {
          headers: {
            'accept': 'application/json',
            'authorization': 'Basic YkdWc1lYSTVNemM1TWtCbllXMWxaM1JoTG1OdmJROmpIZXFrUks3LXVHWTFwcVB1d2Z6MDo='
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        setVoices(prev => ({ ...prev, [provider]: data }))
        
        // Extract all unique languages from the voices
        const languages = new Set<string>()
        data.forEach((voice: VoiceOption) => {
          voice.languages?.forEach(lang => {
            if (lang.language) {
              languages.add(lang.language)
            }
          })
        })
        setAvailableLanguages(Array.from(languages).sort())
      }
    } catch (error) {
      console.error('Error loading voices:', error)
    } finally {
      setIsLoadingVoices(false)
    }
  }

  const handlePlayVoice = (voiceId: string, previewUrl: string) => {
    // Stop any currently playing audio
    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer.currentTime = 0
    }

    // If clicking the same voice that's playing, stop it
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null)
      setAudioPlayer(null)
      return
    }

    // Create and play new audio
    const audio = new Audio(previewUrl)
    
    audio.onended = () => {
      setPlayingVoiceId(null)
      setAudioPlayer(null)
    }
    
    audio.onerror = () => {
      setPlayingVoiceId(null)
      setAudioPlayer(null)
      alert('Failed to play voice preview')
    }

    audio.play()
      .then(() => {
        setPlayingVoiceId(voiceId)
        setAudioPlayer(audio)
      })
      .catch((error) => {
        console.error('Error playing audio:', error)
        setPlayingVoiceId(null)
        setAudioPlayer(null)
      })
  }

  const handleNext = () => {
    // Validation
    if (currentStep === 1 && !formData.name.trim()) {
      alert('Please enter a project name')
      return
    }
    if (currentStep === 2 && !formData.script.trim()) {
      alert('Please enter a script')
      return
    }
    if (currentStep === 3 && !formData.imageFile) {
      alert('Please upload an image')
      return
    }
    if (currentStep === 4 && !formData.voiceId) {
      alert('Please select a voice')
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAIEnhance = async () => {
    if (!formData.script.trim()) return
    
    setIsEnhancing(true)
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')

      const response = await fetch(`${API_URL}/api/ai/enhance/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({
          script: formData.script
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          script: data.enhanced_script
        }))
      } else {
        console.error('Failed to enhance script')
        // Fallback to local enhancement for demo
        setFormData(prev => ({
          ...prev,
          script: prev.script + ' ai'
        }))
      }
    } catch (error) {
      console.error('Error enhancing script:', error)
      // Fallback to local enhancement for demo
      setFormData(prev => ({
        ...prev,
        script: prev.script + ' ai'
      }))
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://127.0.0.1:8000'
      const tokens = JSON.parse(localStorage.getItem('voxvid_tokens') || '{}')
      
      const form = new FormData()
      form.append('name', formData.name)
      form.append('script_input', formData.script)
      form.append('voice_provider', formData.voiceProvider)
      form.append('voice_id', formData.voiceId)
      if (formData.voiceLanguage) {
        form.append('voice_language', formData.voiceLanguage)
      }
      if (formData.imageFile) {
        form.append('image_file', formData.imageFile)
      }

      const response = await fetch(`${API_URL}/api/videos/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: form,
      })

      if (!response.ok) {
        throw new Error('Failed to create video')
      }

      router.push('/home')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 via-orange-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Name Your Project</h2>
              <p className="text-muted-foreground">Give your video project a memorable name</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="projectName" className="text-base font-medium">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Product Launch, Tutorial Video, Welcome Message"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2 h-12 text-base bg-background border-border focus:border-primary"
                  autoFocus
                />
              </div>

              {/* Decorative Preview */}
              <div className="mt-8 p-6 rounded-lg border-2 border-dashed border-border bg-muted/20">
                <p className="text-sm text-muted-foreground text-center">
                  {formData.name || 'Your project name will appear here'}
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 via-orange-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Write Your Script</h2>
              <p className="text-muted-foreground">The AI will convert this to speech and animate your avatar</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Label htmlFor="script" className="text-base font-medium">Script</Label>
                <Textarea
                  id="script"
                  placeholder="Enter your script here... This text will be converted to speech by AI."
                  value={formData.script}
                  onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                  rows={10}
                  className="mt-2 text-base bg-background border-border focus:border-primary resize-none"
                />
                <div className="absolute bottom-4 right-4">
                  <Button
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={isEnhancing || !formData.script.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 hover:opacity-90 text-white"
                    title="AI Enhanced Script"
                  >
                    {isEnhancing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formData.script.length} characters</span>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 via-orange-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Upload Avatar Image</h2>
              <p className="text-muted-foreground">Choose an image that will be animated with your script</p>
            </div>

            <div className="max-w-md mx-auto">
              {!formData.imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={formData.imagePreview}
                      alt="Avatar preview"
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    {formData.imageFile?.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 via-orange-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose a Voice</h2>
              <p className="text-muted-foreground">Select the perfect voice for your video</p>
            </div>

            {/* Provider Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {providers.map((provider) => (
                <Button
                  key={provider}
                  variant={selectedProvider === provider ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedProvider(provider)}
                  className={selectedProvider === provider ? 'bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 text-white' : ''}
                >
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Button>
              ))}
            </div>

            {/* Language and Gender Filters */}
            <Card className="bg-card border-border mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language-filter">Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {availableLanguages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender-filter">Gender</Label>
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voices Grid */}
            <div className="max-w-6xl mx-auto">
              {isLoadingVoices ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading voices...</p>
                </div>
              ) : voices[selectedProvider] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voices[selectedProvider]
                    .filter((voice) => {
                      // Apply language filter
                      if (selectedLanguage !== 'all') {
                        const hasLanguage = voice.languages?.some(lang => lang.language === selectedLanguage)
                        if (!hasLanguage) return false
                      }
                      
                      // Apply gender filter
                      if (selectedGender !== 'all') {
                        if (voice.gender !== selectedGender) return false
                      }
                      
                      return true
                    })
                    .map((voice) => {
                    const isSelected = formData.voiceId === voice.id;
                    // Find the selected language or default to first available
                    const selectedLang = voice.languages?.find(lang => lang.language === selectedLanguage) || 
                                       voice.languages?.find(lang => lang.locale?.startsWith('en-')) || 
                                       voice.languages?.[0]
                    const previewUrl = selectedLang?.previewUrl
                    const isPlaying = playingVoiceId === voice.id;
                    
                    return (
                      <Card
                        key={voice.id}
                        className={`cursor-pointer transition-all border-2 ${
                          isSelected 
                            ? 'ring-2 ring-primary shadow-lg border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:shadow-md'
                        }`}
                        onClick={() => {
                          const selectedLangData = voice.languages?.find(lang => lang.language === selectedLanguage) || 
                                                 voice.languages?.find(lang => lang.locale?.startsWith('en-')) || 
                                                 voice.languages?.[0]
                          setFormData(prev => ({
                            ...prev,
                            voiceId: voice.id,
                            voiceName: voice.name,
                            voiceProvider: selectedProvider,
                            voiceLanguage: selectedLangData?.language || ''
                          }))
                        }}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-base flex items-center gap-2">
                                {voice.name}
                                {isSelected && (
                                  <Badge variant="default" className="text-xs">Selected</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize mt-1">
                                {voice.gender} • {selectedLang?.language || voice.languages?.[0]?.language || 'English'}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {voice.description && (
                              <Badge variant="secondary" className="text-xs">
                                {voice.description}
                              </Badge>
                            )}
                            {voice.age && (
                              <Badge variant="outline" className="text-xs">
                                {voice.age}
                              </Badge>
                            )}
                            {voice.styles?.map((style, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {style}
                              </Badge>
                            ))}
                          </div>
                          
                          {previewUrl ? (
                            <div className="space-y-2">
                              <Button
                                type="button"
                                variant={isPlaying ? "default" : "outline"}
                                size="sm"
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayVoice(voice.id, previewUrl);
                                }}
                              >
                                {isPlaying ? (
                                  <>
                                    <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                                    Playing...
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Preview Voice
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground text-center py-2 bg-muted/30 rounded">
                              No preview available
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Click a provider to load voices</p>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 via-orange-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Review & Create</h2>
              <p className="text-muted-foreground">Double-check everything before creating your video</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Project Name</Label>
                    <p className="text-base font-medium text-foreground mt-1">{formData.name}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Script</Label>
                    <div className="mt-1 p-3 bg-muted/30 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-sm text-foreground">{formData.script}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Avatar Image</Label>
                    {formData.imagePreview && (
                      <img
                        src={formData.imagePreview}
                        alt="Avatar"
                        className="mt-2 w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Voice</Label>
                    <p className="text-base font-medium text-foreground mt-1">
                      {formData.voiceName} ({formData.voiceProvider})
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 hover:opacity-90 text-white text-base h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-5 w-5" />
                    Create Video
                  </>
                )}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push('/home')}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index + 1 === currentStep
                    ? 'w-8 bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500'
                    : index + 1 < currentStep
                    ? 'w-6 bg-primary'
                    : 'w-6 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 1}
            className="w-32"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < totalSteps && (
            <Button
              onClick={handleNext}
              className="w-32 bg-gradient-to-r from-cyan-500 via-orange-500 to-pink-500 hover:opacity-90 text-white"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
