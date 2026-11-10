import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles, AlertCircle, RefreshCw } from 'lucide-react'
import Header from '../../components/layout/Header'
import ChatBubble from '../../components/chat/ChatBubble'
import VoiceRecorder from '../../components/chat/VoiceRecorder'
import { useChatStore } from '../../stores/chatStore'
import { sendChatMessage, sendVoiceMessage } from '../../api/chat'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const { messages, sessionId, addMessage, clearChat, language, setLanguage } = useChatStore()
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const quickPrompts = [
    { label: 'ମୋ ପାଇଁ ଯୋଜନା (My Schemes)', text: 'ମୋ ପାଇଁ କେଉଁ ସରକାରୀ ଯୋଜନା ଉପଲବ୍ଧ ଅଛି?' },
    { label: 'କାଳିଆ ଯୋଜନା (KALIA Scheme)', text: 'କାଳିଆ ଯୋଜନା କିପରି ଆବେଦନ କରିବି ଏବଂ କେତେ ଟଙ୍କା ମିଳିବ?' },
    { label: 'ଅଭିଯୋଗ ଦାଖଲ (File Complaint)', text: 'ମୁଁ ଆମ ଗାଁ ରାସ୍ତା ଖରାପ ବିଷୟରେ ଅଭିଯୋଗ କରିବାକୁ ଚାହୁଁଛି।' },
    { label: 'ବିଏସକେୱାଇ (BSKY Card)', text: 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନାରେ କିପରି ଚିକିତ୍ସା ମିଳିବ?' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText.trim()
    if (!text || isLoading) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add user message
    addMessage({
      role: 'user',
      content: text,
      timestamp: now,
    })
    setInputText('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(text, language, sessionId)
      addMessage({
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        schemes: response.matched_schemes,
        ticket_id: response.ticket_id,
      })
    } catch (err: any) {
      console.error('Chat error:', err)
      toast.error('Could not get response. Showing local fallback.')
      addMessage({
        role: 'assistant',
        content: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପାଇଁ ଧନ୍ୟବାଦ। ଆପଣ କାଳିଆ ଯୋଜନା, ବିଏସକେୱାଇ କିମ୍ବା ମମତା ଯୋଜନା ବିଷୟରେ ପଚାରିପାରିବେ। ଆମେ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବାକୁ ପ୍ରସ୍ତୁତ।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'general',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAudioRecorded = async (blob: Blob) => {
    setIsLoading(true)
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    addMessage({
      role: 'user',
      content: '🎙️ [Voice input in Odia / କଣ୍ଠସ୍ୱର ସନ୍ଦେଶ]',
      timestamp: now,
    })

    try {
      const response = await sendVoiceMessage(blob, sessionId, language)
      addMessage({
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        schemes: response.matched_schemes,
      })
    } catch (err) {
      toast.error('Voice processing failed. Please type your message.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      {/* Main Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat Header Card */}
        <div className="bg-white rounded-2xl px-5 py-3.5 shadow-xs border border-slate-200/90 flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🤖
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                GraamSeva AI Chatbot / ଗ୍ରାମ ସେବା
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Gemini NLP • Multilingual • Voice Ready
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Clear Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-inner">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mb-4 shadow-sm">
                🌾
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                ଜୟ ଜଗନ୍ନାଥ! ମୁଁ ଆପଣଙ୍କ ଗ୍ରାମ ସେବା AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 mb-6">
                ଆପଣ କୌଣସି ସରକାରୀ ଯୋଜନା, ସୁବିଧା କିମ୍ବା ଗ୍ରାମ ସମସ୍ୟା ବିଷୟରେ ପଚାରିପାରିବେ।
              </p>

              {/* Suggestions */}
              <div className="w-full max-w-md space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ (Suggested Questions):
                </div>
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs sm:text-sm text-slate-700 font-medium transition-all shadow-xs flex items-center justify-between"
                  >
                    <span>{item.text}</span>
                    <span className="text-xs text-emerald-600">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  intent={msg.intent}
                  schemes={msg.schemes}
                  ticket_id={msg.ticket_id}
                />
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-slate-500 text-xs p-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="font-medium text-slate-600">AI is thinking in Odia...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input Footer */}
        <div className="mt-3 bg-white p-2 sm:p-3 rounded-2xl border border-slate-200/90 shadow-md">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center space-x-2"
          >
            <VoiceRecorder onAudioRecorded={handleAudioRecorded} disabled={isLoading} />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ଏଠାରେ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ... (Type in Odia / English)"
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors shadow-xs flex-shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

