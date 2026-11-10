import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Officer } from '../types'

interface AuthState {
  officer: Officer | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setOfficer: (officer: Officer, token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      officer: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Login failed')
        }

        const data = await response.json()
        set({
          officer: data.officer,
          token: data.access_token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({ officer: null, token: null, isAuthenticated: false })
      },

      setOfficer: (officer: Officer, token: string) => {
        set({ officer, token, isAuthenticated: true })
      },
    }),
    {
      name: 'graamseva-auth',
      partialize: (state) => ({
        officer: state.officer,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
