import { create } from 'zustand'
import { ChatMessage, Language } from '../types'

interface ChatState {
  messages: ChatMessage[]
  sessionId: string
  language: Language
  isLoading: boolean
  addMessage: (message: Omit<ChatMessage, 'id'> & { id?: string }) => void
  clearChat: () => void
  setLanguage: (lang: Language) => void
  setSessionId: (id: string) => void
  setLoading: (loading: boolean) => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: generateId(),
  language: 'or',
  isLoading: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: message.id || generateId(),
        },
      ],
    })),

  clearChat: () =>
    set({ messages: [], sessionId: generateId() }),

  setLanguage: (lang: Language) =>
    set({ language: lang }),

  setSessionId: (id: string) =>
    set({ sessionId: id }),

  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),
}))
