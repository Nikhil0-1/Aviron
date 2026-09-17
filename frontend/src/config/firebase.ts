import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoApiKeyForOfflineMode',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'aviron-rescue-center.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'aviron-rescue-center',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'aviron-rescue-center.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

export let firebaseApp: FirebaseApp | null = null;
export let firebaseAuth: Auth | null = null;
export let isFirebaseWebConfigured = false;

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (apiKey && !apiKey.includes('YourFirebaseApiKey')) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    firebaseAuth = getAuth(firebaseApp);
    isFirebaseWebConfigured = true;
    console.log('🔥 Firebase Web Auth Client initialized.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Firebase Web Client:', error);
  }
} else {
  console.log('ℹ️ Firebase API Key not provided. Demo Authentication active.');
}
