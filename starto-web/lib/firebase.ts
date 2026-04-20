import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// ── Required env vars ─────────────────────────────────────────────────────────
// All 6 must be present in starto-web/.env.local (copy from .env.example).
// On missing vars we log a descriptive warning but do NOT throw — throwing at
// module level crashes the entire Next.js app (white screen) before React even
// mounts, giving the user no feedback at all.
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

// ── App + Auth singleton ──────────────────────────────────────────────────────
// getApps().length guard prevents "Firebase App named '[DEFAULT]' already exists"
// errors during Next.js hot-reload and SSR module re-evaluation.
let app: FirebaseApp;
let auth: Auth;
let _firebaseConfigured = true;

const missing = getMissingVars();
if (missing.length > 0) {
    _firebaseConfigured = false;
    console.error(
        `[firebase.ts] Firebase is not configured. Missing env var(s): ${missing.join(', ')}.\n` +
        `Add them to starto-web/.env.local and restart the dev server.\n` +
        `Copy starto-web/.env.example to get the required keys.`
    );
    // Do NOT throw here — throwing at module level causes a white-screen crash.
    // Auth calls will fail gracefully at runtime and show a user-friendly error
    // via the firebaseErrorMessage() mapper in auth/page.tsx.
    app  = {} as FirebaseApp;
    auth = {} as Auth;
} else {
    app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
}

/** True if all required Firebase env vars were present at module load time. */
export const firebaseConfigured = _firebaseConfigured;

export { app, auth };
