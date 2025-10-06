# Online LMS Windows Deployment Script
Write-Host "🚀 Starting Online LMS Deployment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit .env file with your configuration" -ForegroundColor Yellow
    Write-Host "✏️  Opening .env file for editing..." -ForegroundColor Cyan
    notepad .env
    Read-Host "Press Enter after editing .env file to continue"
}

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "nginx\ssl" | Out-Null
New-Item -ItemType Directory -Force -Path "scripts" | Out-Null
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

# Build Docker images
Write-Host "🔨 Building Docker images..." -ForegroundColor Cyan
docker-compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    exit 1
}

# Start services
Write-Host "🚀 Starting services..." -ForegroundColor Cyan
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if services are running
$runningServices = docker-compose ps --services --filter "status=running"
if ($runningServices) {
    Write-Host "✅ Services started successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some services may not be running. Check logs with: docker-compose logs" -ForegroundColor Yellow
}

# Get the app port from .env file
$appPort = 80
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $portLine = $envContent | Where-Object { $_ -match "^APP_PORT=" }
    if ($portLine) {
        $appPort = ($portLine -split "=")[1]
    }
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Application is available at: http://localhost:$appPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  Stop services: docker-compose down" -ForegroundColor White
Write-Host "  Restart services: docker-compose restart" -ForegroundColor White
Write-Host "  Check status: docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To check if the application is working:" -ForegroundColor Cyan
Write-Host "  Open your browser and go to http://localhost:$appPort" -ForegroundColor White