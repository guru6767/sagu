import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// ── Required env vars ─────────────────────────────────────────────────────────
// All six must be present in .env.local (or CI env) for Firebase Auth to work.
// If any are missing, we surface a clear error immediately rather than a cryptic
// `auth/configuration-not-found` at runtime when a user tries to sign in/up.
const REQUIRED_VARS = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

function getMissingVars(): string[] {
    return REQUIRED_VARS.filter(
        (key) => !process.env[key] || process.env[key]!.trim() === ''
    );
}

// ── Firebase config ───────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    // measurementId is optional — only needed for Firebase Analytics
    measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ── App singleton ─────────────────────────────────────────────────────────────
// getApps().length guard prevents "Firebase App named '[DEFAULT]' already exists"
// errors that occur during Next.js hot-reload and SSR module re-evaluation.
let app: FirebaseApp;
let auth: Auth;

const missing = getMissingVars();

if (missing.length > 0) {
    // Throw once at module load time so the developer sees the exact missing key
    // in the Next.js overlay, rather than a silent `{}` fallback that only fails
    // later when a user submits the auth form.
    const msg = `Firebase is not configured. Missing env var(s): ${missing.join(', ')}. Add them to starto-web/.env.local and restart the dev server.`;
    console.error(`[firebase.ts] ${msg}`);
    // In dev we throw; in production the catch below turns this into a safe no-op
    // so the app can still render non-auth pages.
    if (process.env.NODE_ENV === 'development') {
        throw new Error(msg);
    }
    // Prod fallback: export stubs so pages that don't use auth still render
    app = {} as FirebaseApp;
    auth = {} as Auth;
} else {
    app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
}

export { app, auth };
