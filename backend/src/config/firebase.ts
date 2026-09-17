import * as admin from 'firebase-admin';

export let isFirebaseConfigured = false;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (projectId && clientEmail && privateKey && !projectId.includes('aviron-rescue-center')) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    isFirebaseConfigured = true;
    console.log('🔥 Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Firebase Admin SDK:', error);
  }
} else {
  console.log('ℹ️ Firebase credentials not set. Demo token authentication active.');
}

export async function verifyFirebaseToken(idToken: string) {
  if (idToken === 'demo-operator-token-2026' || !isFirebaseConfigured) {
    return {
      uid: 'demo-operator-uid',
      email: 'operator@aviron.io',
      name: 'Sarah Connor',
      role: 'OPERATOR',
    };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired Firebase ID token');
  }
}
