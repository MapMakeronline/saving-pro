import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types'

async function buildUser(uid: string, email: string): Promise<User> {
  const snap = await getDoc(doc(db, 'users', uid))
  const data = snap.data() || {}
  return {
    id: uid,
    email,
    name: data.name || '',
    currency: data.currency || 'PLN',
    language: data.language || 'pl',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { user: fb } = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    const token = await fb.getIdToken()
    const user = await buildUser(fb.uid, fb.email!)
    return { token, user }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { user: fb } = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
    const now = new Date().toISOString()
    const profileData = { name: credentials.name, currency: 'PLN', language: 'pl', createdAt: now, updatedAt: now }
    await setDoc(doc(db, 'users', fb.uid), profileData)
    await sendEmailVerification(fb)
    const token = await fb.getIdToken()
    const user = { id: fb.uid, email: fb.email!, ...profileData }
    return { token, user }
  },

  async getProfile(): Promise<User> {
    const fb = auth.currentUser
    if (!fb) throw new Error('Nie zalogowany')
    return buildUser(fb.uid, fb.email!)
  },

  async updateProfile(updates: Partial<Pick<User, 'name' | 'currency' | 'language'>>): Promise<User> {
    const fb = auth.currentUser
    if (!fb) throw new Error('Nie zalogowany')
    await updateDoc(doc(db, 'users', fb.uid), { ...updates, updatedAt: new Date().toISOString() })
    return buildUser(fb.uid, fb.email!)
  },

  async loginWithProvider(provider: GoogleAuthProvider | GithubAuthProvider | FacebookAuthProvider | OAuthProvider): Promise<AuthResponse> {
    const { user: fb } = await signInWithPopup(auth, provider)
    const ref = doc(db, 'users', fb.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      const now = new Date().toISOString()
      await setDoc(ref, {
        name: fb.displayName || '',
        currency: 'PLN',
        language: 'pl',
        createdAt: now,
        updatedAt: now,
      })
    }
    const token = await fb.getIdToken()
    const user = await buildUser(fb.uid, fb.email!)
    return { token, user }
  },

  async loginWithGoogle(): Promise<AuthResponse> {
    return this.loginWithProvider(new GoogleAuthProvider())
  },

  async loginWithGithub(): Promise<AuthResponse> {
    return this.loginWithProvider(new GithubAuthProvider())
  },

  async loginWithFacebook(): Promise<AuthResponse> {
    return this.loginWithProvider(new FacebookAuthProvider())
  },

  async loginWithMicrosoft(): Promise<AuthResponse> {
    return this.loginWithProvider(new OAuthProvider('microsoft.com'))
  },

  async logout(): Promise<void> {
    await signOut(auth)
  },
}
