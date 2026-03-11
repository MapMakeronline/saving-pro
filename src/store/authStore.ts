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
  loginWithGoogle: () => Promise<void>
  loginWithGithub: () => Promise<void>
  loginWithFacebook: () => Promise<void>
  loginWithMicrosoft: () => Promise<void>
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
        const code = (err as { code?: string }).code
        const message =
          code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' ? 'Nieprawidłowy e-mail lub hasło.' :
          code === 'auth/too-many-requests' ? 'Za dużo prób logowania. Spróbuj ponownie za chwilę.' :
          code === 'auth/invalid-email' ? 'Podaj prawidłowy adres e-mail.' :
          err instanceof Error ? err.message : 'Błąd logowania'
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
        const code = (err as { code?: string }).code
        const message =
          code === 'auth/email-already-in-use' ? 'Konto z tym adresem e-mail już istnieje. Zaloguj się.' :
          code === 'auth/weak-password' ? 'Hasło jest za słabe. Użyj minimum 6 znaków.' :
          code === 'auth/invalid-email' ? 'Podaj prawidłowy adres e-mail.' :
          err instanceof Error ? err.message : 'Błąd rejestracji'
        set({ error: message, isLoading: false })
        throw err
      }
    },

    loginWithGoogle: async () => {
      set({ isLoading: true, error: null })
      try {
        const { token, user } = await authService.loginWithGoogle()
        set({ token, user, isLoading: false })
      } catch (err: unknown) {
        const code = (err as { code?: string }).code
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
          set({ error: 'Błąd logowania przez Google', isLoading: false })
        } else {
          set({ isLoading: false })
        }
        throw err
      }
    },

    loginWithGithub: async () => {
      set({ isLoading: true, error: null })
      try {
        const { token, user } = await authService.loginWithGithub()
        set({ token, user, isLoading: false })
      } catch (err: unknown) {
        const code = (err as { code?: string }).code
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
          set({ error: 'Błąd logowania przez GitHub', isLoading: false })
        } else {
          set({ isLoading: false })
        }
        throw err
      }
    },

    loginWithFacebook: async () => {
      set({ isLoading: true, error: null })
      try {
        const { token, user } = await authService.loginWithFacebook()
        set({ token, user, isLoading: false })
      } catch (err: unknown) {
        const code = (err as { code?: string }).code
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
          set({ error: 'Błąd logowania przez Facebook', isLoading: false })
        } else {
          set({ isLoading: false })
        }
        throw err
      }
    },

    loginWithMicrosoft: async () => {
      set({ isLoading: true, error: null })
      try {
        const { token, user } = await authService.loginWithMicrosoft()
        set({ token, user, isLoading: false })
      } catch (err: unknown) {
        const code = (err as { code?: string }).code
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
          set({ error: 'Błąd logowania przez Microsoft', isLoading: false })
        } else {
          set({ isLoading: false })
        }
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
