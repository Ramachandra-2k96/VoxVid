"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function VoiceInputButton({ 
  onTranscript, 
  className,
  variant = 'outline',
  size = 'default'
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      // Initialize speech recognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript.trim())
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions in your browser.')
        } else if (event.error === 'no-speech') {
          // No speech detected, just stop
          setIsListening(false)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting speech recognition:', error)
      }
    }
  }

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled
        className={cn('cursor-not-allowed', className)}
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={toggleListening}
      className={cn(
        isListening && 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white animate-pulse',
        className
      )}
      title={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      {isListening ? (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Listening...
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </>
      )}
    </Button>
  )
}
