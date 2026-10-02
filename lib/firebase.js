import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBg0T0idJ1Z1i8aInzLaxixZzT3hIbhBxg',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'al-hayy-international.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'al-hayy-international',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'al-hayy-international.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '787112479953',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:787112479953:web:e8426d41ae54656578c9f0'
};

function initFirebase() {
  if (typeof window === 'undefined') {
    // Return dummy or existing instance during SSR prerender
    if (getApps().length > 0) return getApp();
    return initializeApp(firebaseConfig);
  }
  
  if (getApps().length > 0) {
    return getApp();
  }
  
  return initializeApp(firebaseConfig);
}

const app = initFirebase();
export const auth = typeof window !== 'undefined' || process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? getAuth(app) : null;
export function getFirebaseAuth() {
  if (typeof window !== 'undefined') {
    const activeApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getAuth(activeApp);
  }
  return auth;
}

export default app;
