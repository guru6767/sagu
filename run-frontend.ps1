# Starto V2 - Frontend Runner
# This script starts the Next.js development server with local API configuration.

$env:NEXT_PUBLIC_API_BASE_URL = if ($env:NEXT_PUBLIC_API_BASE_URL) { $env:NEXT_PUBLIC_API_BASE_URL } else { "http://localhost:8081" }
$env:NEXT_PUBLIC_FIREBASE_API_KEY = if ($env:NEXT_PUBLIC_FIREBASE_API_KEY) { $env:NEXT_PUBLIC_FIREBASE_API_KEY } else { "AIzaSyBKz0cblPeBYqbGOuNYyOD7NAe6F9BpmFk" }
$env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = if ($env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) { $env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN } else { "starto-v3.firebaseapp.com" }

Write-Host "Starting Starto V2 Frontend..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\starto-web"

# Install dependencies if node_modules is missing
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies... this may take a moment." -ForegroundColor Yellow
    npm install
}

npm run dev
