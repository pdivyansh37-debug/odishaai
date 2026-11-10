import React from 'react'
import { Bot, User, Sparkles } from 'lucide-react'
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

  return (
    <div className={`flex w-full my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2.5`}>
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
            {/* Intent badge for assistant if present */}
            {!isUser && intent && (
              <div className="flex items-center space-x-1.5 mb-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{intent.replace('_', ' ')}</span>
              </div>
            )}

            <div className="whitespace-pre-wrap">{content}</div>

            {/* If ticket generated */}
            {ticket_id && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between">
                <span>🎫 Ticket ID: <strong>{ticket_id}</strong></span>
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

