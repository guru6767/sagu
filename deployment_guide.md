# Starto V2 Deployment Guide

## Backend (Railway)
- **Service Type**: Docker or Maven (Railway auto-detects Starto-API).
- **Environment Variables Required**:
  - `SPRING_DATASOURCE_URL`: PostgreSQL connection string.
  - `SPRING_DATA_REDIS_URL`: Redis connection string.
  - `FIREBASE_CONFIG_PATH`: Path to service account secret.
  - `OPENAI_API_KEY`: For GPT-4o analysis.
  - `GEMINI_API_KEY`: For Gemini 1.5 Pro analysis.
  - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`: For Indian payments.

## Frontend (Vercel)
- **Framework**: Next.js
- **Root Directory**: `starto-web`
- **Environment Variables Required**:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_API_BASE_URL`: Pointer to Railway backend.

## Database (Neon / Railway PostgreSQL)
- Ensure PostGIS and pg_trgm are enabled on the target instance.
- Run `schema.sql` to initialize the tables.
