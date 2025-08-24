# Docker-Free Production Setup Script
# Runs the application with local endpoints instead of Docker containers

Write-Host "Starting Docker-Free Production Setup" -ForegroundColor Green
Write-Host ""

# Copy the docker-free environment file
if (Test-Path ".env.docker-free") {
    Copy-Item ".env.docker-free" ".env.local"
    Write-Host "Environment configured for Docker-free setup" -ForegroundColor Green
} else {
    Write-Host "Error: .env.docker-free file not found" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed" -ForegroundColor Green
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Application built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "Docker-Free Production Setup Complete!" -ForegroundColor Green
Write-Host "What's Running:" -ForegroundColor Yellow
Write-Host "   • Next.js Application (with local SPARQL endpoint)" -ForegroundColor White
Write-Host "   • Local API endpoints for manufacturing data" -ForegroundColor White
Write-Host "   • Mock R2RML data (no external database required)" -ForegroundColor White
Write-Host ""
Write-Host "Starting production server..." -ForegroundColor Yellow
Write-Host "   • Production URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   • Manufacturing: http://localhost:3000/manufacturing" -ForegroundColor Cyan
Write-Host "   • Queries: http://localhost:3000/manufacturing/queries" -ForegroundColor Cyan
Write-Host ""

# Start the production server
npm start
