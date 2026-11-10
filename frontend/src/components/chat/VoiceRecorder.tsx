import React, { useState, useRef } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface VoiceRecorderProps {
  onAudioRecorded: (blob: Blob) => void
  disabled?: boolean
}

export default function VoiceRecorder({ onAudioRecorded, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<number | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        onAudioRecorded(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordTime(0)

      timerRef.current = window.setInterval(() => {
        setRecordTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      toast.error('Microphone access denied. Please grant permission.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="flex items-center space-x-2">
      {isRecording ? (
        <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full animate-pulse">
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
          <span className="text-xs font-semibold text-rose-700">
            {formatTime(recordTime)} (Recording)
          </span>
          <button
            type="button"
            onClick={stopRecording}
            className="p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors ml-1"
            title="Stop recording"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="p-2.5 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          title="Speak in Odia (Voice input)"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

