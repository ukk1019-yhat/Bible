import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyDSZ4h6Hqpg6xrSgY-B0u6eYGOFel7k_s4',
  authDomain: 'satyasakshi-bible.firebaseapp.com',
  projectId: 'satyasakshi-bible',
  storageBucket: 'satyasakshi-bible.firebasestorage.app',
  messagingSenderId: '354631692603',
  appId: '1:354631692603:web:e76810e4a29c138f40071e',
}

// Initialize Firebase once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
export const db = getFirestore(app)
