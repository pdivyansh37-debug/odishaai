import { create } from 'zustand'
import { ChatMessage, Language } from '../types'

interface ChatState {
  messages: ChatMessage[]
  sessionId: string | null
  language: Language
  isLoading: boolean
  addMessage: (message: ChatMessage) => void
  clearChat: () => void
  setLanguage: (lang: Language) => void
  setSessionId: (id: string) => void
  setLoading: (loading: boolean) => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  language: 'or',
  isLoading: false,

  addMessage: (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),

  clearChat: () =>
    set({ messages: [], sessionId: generateId() }),

  setLanguage: (lang: Language) =>
    set({ language: lang }),

  setSessionId: (id: string) =>
    set({ sessionId: id }),

  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),
}))
