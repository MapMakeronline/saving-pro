import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB5IQnMAR5vnaHdVg0gyBhppgygxzabayg',
  authDomain: 'saving-pro-finance.firebaseapp.com',
  projectId: 'saving-pro-finance',
  storageBucket: 'saving-pro-finance.firebasestorage.app',
  messagingSenderId: '996102562843',
  appId: '1:996102562843:web:ad81bc17c55bebb44f04be',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
