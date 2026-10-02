import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function getSafeApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  // If apiKey is present, initialize app normally
  if (firebaseConfig.apiKey) {
    return initializeApp(firebaseConfig);
  }

  // Graceful fallback for SSR/Build time when env is loading
  return initializeApp({
    apiKey: "dummy_build_key",
    authDomain: "dummy.firebaseapp.com",
    projectId: "dummy",
    appId: "dummy"
  });
}

const app = getSafeApp();
export const auth = typeof window !== 'undefined' && firebaseConfig.apiKey ? getAuth(app) : null;

export function getFirebaseAuth() {
  if (typeof window !== 'undefined') {
    const activeApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getAuth(activeApp);
  }
  return auth;
}

export default app;
