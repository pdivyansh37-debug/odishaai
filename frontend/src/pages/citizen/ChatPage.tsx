import React, { useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Send, RefreshCw, FileText, AlertCircle, MapPin } from 'lucide-react'
import Header from '../../components/layout/Header'
import ChatBubble from '../../components/chat/ChatBubble'
import VoiceRecorder from '../../components/chat/VoiceRecorder'
import { useChatStore } from '../../stores/chatStore'
import { sendChatMessage, sendVoiceMessage } from '../../api/chat'
import { ODISHA_SCHEMES } from '../../data/odishaData'
import toast from 'react-hot-toast'

function buildSmartFallback(text: string): { reply: string; intent: string; schemes: any[] } {
  const q = text.toLowerCase()

  if (q.includes('kalia') || q.includes('କାଳିଆ') || q.includes('farmer') || q.includes('କୃଷକ')) {
    return {
      intent: 'scheme_query',
      schemes: [ODISHA_SCHEMES[1], ODISHA_SCHEMES[6]],
      reply:
        '🌾 କାଳିଆ ଯୋଜନା (KALIA) ଅଧୀନରେ କ୍ଷୁଦ୍ର ଓ ନାମମାତ୍ର ଚାଷୀଙ୍କୁ ବର୍ଷକୁ ₹10,000 (ଖରିଫ ₹5,000 + ରବି ₹5,000) ଏବଂ ଭୂମିହୀନ କୃଷି ପରିବାରକୁ ₹12,500 ସହାୟତା ମିଳେ।\n\nଆବଶ୍ୟକ କାଗଜପତ୍ର: ଆଧାର କାର୍ଡ, ବ୍ୟାଙ୍କ ପାସବୁକ୍, ଜମି ପଟ୍ଟା ଓ ରାସନ କାର୍ଡ।',
    }
  }

  if (q.includes('bsky') || q.includes('ବିଏସକେୱାଇ') || q.includes('health') || q.includes('hospital')) {
    return {
      intent: 'scheme_query',
      schemes: [ODISHA_SCHEMES[0]],
      reply:
        '🏥 ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (BSKY) ଅଧୀନରେ ପ୍ରତି ପରିବାରକୁ ବାର୍ଷିକ ₹5 ଲକ୍ଷ (ମହିଳାଙ୍କ ପାଇଁ ₹10 ଲକ୍ଷ) ପର୍ଯ୍ୟନ୍ତ ମାଗଣା ଚିକିତ୍ସା ସୁବିଧା ମିଳେ। Helpline: 104 / 155369।',
    }
  }

  if (q.includes('mamata') || q.includes('ମମତା') || q.includes('shakti') || q.includes('women') || q.includes('ମହିଳା')) {
    return {
      intent: 'scheme_query',
      schemes: [ODISHA_SCHEMES[2], ODISHA_SCHEMES[3]],
      reply:
        '👩 ମହିଳା ଓ ମାତୃ କଲ୍ୟାଣ ପାଇଁ "ମମତା ଯୋଜନା" (₹5,000 ସହାୟତା) ଏବଂ "ମିଶନ ଶକ୍ତି" (0% ସୁଧରେ ₹5 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ SHG ଋଣ) ଉପଲବ୍ଧ ଅଛି।',
    }
  }

  if (q.includes('pension') || q.includes('ପେନସନ') || q.includes('madhu') || q.includes('ମଧୁବାବୁ') || q.includes('house') || q.includes('ଘର')) {
    return {
      intent: 'scheme_query',
      schemes: [ODISHA_SCHEMES[4], ODISHA_SCHEMES[5]],
      reply:
        '🏡 ବରିଷ୍ଠ ନାଗରିକ, ବିଧବା ଓ ଭିନ୍ନକ୍ଷମଙ୍କ ପାଇଁ "ମଧୁବାବୁ ପେନସନ ଯୋଜନା" (₹500–₹1,000/ମାସ) ଏବଂ କଚ୍ଚା ଘର ପାଇଁ "ବିଜୁ ପକ୍କା ଘର ଯୋଜନା" (₹1.20–1.30 ଲକ୍ଷ) ଉପଲବ୍ଧ ଅଛି।',
    }
  }

  if (q.includes('ଅଭିଯୋଗ') || q.includes('complaint') || q.includes('road') || q.includes('ରାସ୍ତା') || q.includes('water') || q.includes('ପାଣି')) {
    return {
      intent: 'grievance',
      schemes: [],
      reply:
        '📋 ଆପଣଙ୍କ ଅଭିଯୋଗ ଦାଖଲ କରିବା ପାଇଁ ଉପର ଥିବା "File Grievance / ଅଭିଯୋଗ" ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ। ଆପଣ ଫଟୋ, GPS ଏବଂ ଓଡ଼ିଆ ଭଏସ୍ ଦ୍ୱାରା ଅଭିଯୋଗ କରିପାରିବେ ଏବଂ WhatsApp ରେ ଟିକେଟ୍ ନମ୍ବର ପାଇବେ।',
    }
  }

  return {
    intent: 'scheme_query',
    schemes: ODISHA_SCHEMES.slice(0, 3),
    reply:
      '🙏 ଜୟ ଜଗନ୍ନାଥ! ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଅନୁସାରେ ଏହି ଓଡ଼ିଶା ସରକାରୀ ଯୋଜନାଗୁଡ଼ିକ ଉପଲବ୍ଧ ଅଛି। ଅଧିକ ବିବରଣୀ ପାଇଁ "Schemes / ଯୋଜନା" ପୃଷ୍ଠାରେ ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ କିମ୍ବା ନିକଟସ୍ଥ ଜନ ସେବା କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ।',
  }
}

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { messages, sessionId, addMessage, clearChat, language } = useChatStore()
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const initialQueryHandledRef = useRef(false)

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

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !initialQueryHandledRef.current) {
      initialQueryHandledRef.current = true
      setSearchParams({}, { replace: true })
      handleSend(q)
    }
  }, [searchParams])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim()
    if (!text || isLoading) return

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

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
    } catch {
      const fallback = buildSmartFallback(text)
      addMessage({
        role: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: fallback.intent,
        schemes: fallback.schemes,
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
    } catch {
      const fallback = buildSmartFallback('kalia bsky')
      addMessage({
        role: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: fallback.intent,
        schemes: fallback.schemes,
      })
      toast('Responded using offline Odia assistant.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      {/* Main Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
        {/* Chat Header Card */}
        <div className="bg-white rounded-2xl px-4 sm:px-5 py-3 shadow-xs border border-slate-200/90 flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🤖
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                GraamSeva AI Chatbot / ଗ୍ରାମ ସେବା
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Gemini NLP • Listen Aloud • Voice Ready
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/schemes"
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Eligibility</span>
            </Link>
            <Link
              to="/grievance"
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Complain</span>
            </Link>
            <Link
              to="/#csc-locator"
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>CSC</span>
            </Link>
            <button
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Clear Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-inner">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 text-slate-500">
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
                  ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ (Tap any question):
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
                  <span className="font-medium text-slate-600">AI is thinking...</span>
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
              placeholder="ଏଠାରେ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ... (Type in Odia / Hindi / English)"
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
