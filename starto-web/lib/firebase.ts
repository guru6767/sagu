import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: 'starto-v3', // Placeholder, assuming it's available or not strictly required for just auth
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let authInstance: any;
try {
    authInstance = getAuth(app);
} catch (error) {
    console.warn("Firebase Auth failed to initialize (likely due to a dummy API key). Using mock auth instance.");
    authInstance = {};
}

export const auth = authInstance;
