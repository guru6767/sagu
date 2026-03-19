# Starto V2 - Frontend Runner
# This script starts the Next.js development server with local API configuration.

$env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:8081"
$env:NEXT_PUBLIC_FIREBASE_API_KEY = "dummy_key"
$env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "dummy_domain"

Write-Host "Starting Starto V2 Frontend..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\starto-web"

# Install dependencies if node_modules is missing
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies... this may take a moment." -ForegroundColor Yellow
    npm install
}

npm run dev
