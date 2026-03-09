import { create } from 'zustand'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import type { User } from '../types'
import { authService } from '../services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Nasłuchuj zmian stanu Firebase Auth
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await authService.getProfile()
        const token = await firebaseUser.getIdToken()
        set({ user, token, isLoading: false })
      } catch {
        set({ user: null, token: null, isLoading: false })
      }
    } else {
      set({ user: null, token: null, isLoading: false })
    }
  })

  return {
    user: null,
    token: null,
    isLoading: true,
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null })
      try {
        const { token, user } = await authService.login({ email, password })
        set({ token, user, isLoading: false })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Błąd logowania'
        set({ error: message, isLoading: false })
        throw err
      }
    },

    register: async (email, password, name) => {
      set({ isLoading: true, error: null })
      try {
        const { token, user } = await authService.register({ email, password, name })
        set({ token, user, isLoading: false })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Błąd rejestracji'
        set({ error: message, isLoading: false })
        throw err
      }
    },

    logout: async () => {
      try { await authService.logout() } catch { /* ignoruj */ }
      set({ user: null, token: null })
    },

    fetchProfile: async () => {
      set({ isLoading: true })
      try {
        const user = await authService.getProfile()
        set({ user, isLoading: false })
      } catch {
        set({ user: null, token: null, isLoading: false })
      }
    },

    clearError: () => set({ error: null }),
  }
})
