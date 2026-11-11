import React, { useState } from 'react'
import { Bot, User, Sparkles, Volume2, VolumeX } from 'lucide-react'
import SchemeCard from '../schemes/SchemeCard'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: string
  schemes?: any[]
  ticket_id?: string
}

export default function ChatBubble({
  role,
  content,
  timestamp,
  intent,
  schemes,
  ticket_id,
}: ChatBubbleProps) {
  const isUser = role === 'user'
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(content)
    utterance.lang = 'or-IN'
    utterance.rate = 0.95
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`flex w-full my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[85%] md:max-w-[75%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        } items-start gap-2.5`}
      >
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
            isUser ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white'
          }`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>

        {/* Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${
              isUser
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
            }`}
          >
            {/* Intent badge + Listen button for assistant */}
            {!isUser && (
              <div className="flex items-center justify-between gap-4 mb-1.5">
                {intent ? (
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{intent.replace('_', ' ')}</span>
                  </div>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={handleToggleSpeak}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                  title="Listen aloud / ଶୁଣନ୍ତୁ"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3 h-3 text-rose-600" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 text-emerald-600" />
                      <span>Listen / ଶୁଣନ୍ତୁ</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="whitespace-pre-wrap">{content}</div>

            {/* If ticket generated */}
            {ticket_id && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between">
                <span>
                  🎫 Ticket ID: <strong>{ticket_id}</strong>
                </span>
              </div>
            )}

            {/* Timestamp */}
            <div
              className={`text-[10px] mt-1 text-right ${
                isUser ? 'text-emerald-100' : 'text-slate-400'
              }`}
            >
              {timestamp}
            </div>
          </div>

          {/* Render matched schemes if any */}
          {schemes && schemes.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide pl-1">
                Matched Schemes / ଯୋଜନାଗୁଡ଼ିକ:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {schemes.map((scheme, idx) => (
                  <SchemeCard key={scheme.id || idx} scheme={scheme} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
