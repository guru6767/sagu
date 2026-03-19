# Starto V2 - Local Development Guide

Welcome to the Starto V2 ecosystem. This guide provides instructions on how to set up and run the entire platform locally.

## Project Structure
- `/starto-api`: Spring Boot 3.3.x Backend (Java 21)
- `/starto-web`: Next.js 14 Frontend (React)
- `/starto-android`: Kotlin Jetpack Compose Mobile App

---

## 🏗️ 1. Backend Setup (Spring Boot)

### Prerequisites
- JDK 21
- Maven
- PostgreSQL (with PostGIS extension)
- Redis

### Steps
1. **Database**: 
   - Create a database named `starto`.
   - Run the content of `schema.sql` (in the root) to create tables and extensions.
2. **Environment Variables**:
   - Create an `application-local.yml` or set the following in your environment:
     - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://localhost:5432/starto`
     - `SPRING_DATASOURCE_USERNAME`: your_user
     - `SPRING_DATASOURCE_PASSWORD`: your_password
     - `SPRING_DATA_REDIS_URL`: `redis://localhost:6379`
     - `FIREBASE_CONFIG_PATH`: Path to your Firebase service account JSON.
3. **Run**:
   ```powershell
   # Use the automated runner (replaces mvn)
   .\run-backend.ps1
   ```
   The API will be available at `http://localhost:8080`.

---

## 🌐 2. Web Frontend Setup (Next.js)

### Prerequisites
- Node.js 20.x
- npm or yarn

### Steps
1. **Install Dependencies**:
   ```bash
   cd starto-web
   npm install
   ```
2. **Environment Variables**:
   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
     NEXT_PUBLIC_FIREBASE_API_KEY=your_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
     ```
3. **Run**:
   ```bash
   npm run dev
   ```
   The web app will be available at `http://localhost:3000`.

---

## 📱 3. Mobile Setup (Android)

### Prerequisites
- Android Studio (Iguana or newer)
- Android SDK 34+

### Steps
1. **Open Project**:
   - Open the `starto-android` folder in Android Studio.
2. **Sync Gradle**:
   - Let Android Studio perform the initial Gradle sync.
3. **Configuration**:
   - Update `Constants.kt` (or similar) to point to your local IP for the API (e.g., `http://10.0.2.2:8080` for emulator).
4. **Run**:
   - Select an emulator or physical device.
   - Click the "Run" button (Green play icon).

---

## 🛠️ Common Commands

- **Build Backend**: `mvn clean install`
- **Build Web**: `npm run build`
- **Lint Web**: `npm run lint`

---

## 🛡️ Security Note
Ensure your `google-services.json` (Android) and `firebase-config.js` (Web) are correctly populated with your Firebase project credentials to enable authentication.
