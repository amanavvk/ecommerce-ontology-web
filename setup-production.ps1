# Manufacturing R2RML Production Setup Script for Windows
# PowerShell script to set up the complete production environment

# Set error handling
$ErrorActionPreference = "Stop"

Write-Host "🏭 Manufacturing R2RML Production Setup (Windows)" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Status "Docker is installed: $dockerVersion"
} catch {
    Write-Error "Docker is not installed. Please install Docker Desktop for Windows first."
    Write-Info "Download from: https://docs.docker.com/desktop/install/windows-install/"
    exit 1
}

# Check Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Status "Docker Compose is installed: $composeVersion"
} catch {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Status "Docker service is running"
} catch {
    Write-Error "Docker service is not running. Please start Docker Desktop."
    exit 1
}

# Check system resources
$totalRAM = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)
if ($totalRAM -lt 8) {
    Write-Warning "System has ${totalRAM}GB RAM. Recommended: 8GB or more"
} else {
    Write-Status "System has sufficient RAM (${totalRAM}GB)"
}

# Check disk space
$freeSpace = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
if ($freeSpace -lt 10) {
    Write-Warning "Available disk space: ${freeSpace}GB. Recommended: 10GB or more"
} else {
    Write-Status "Sufficient disk space available (${freeSpace}GB)"
}

# Setup environment configuration
Write-Host ""
Write-Host "📝 Setting up environment configuration..." -ForegroundColor Blue

if (!(Test-Path ".env.local")) {
    Copy-Item ".env.production" ".env.local"
    Write-Status "Created .env.local from .env.production"
} else {
    Write-Info ".env.local already exists, skipping"
}

# Generate secure passwords if using defaults
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "admin123") {
    $adminPass = [System.Web.Security.Membership]::GeneratePassword(12, 3)
    $dbPass = [System.Web.Security.Membership]::GeneratePassword(16, 4)
    $jwtSecret = [System.Web.Security.Membership]::GeneratePassword(32, 8)
    
    $envContent = $envContent -replace "admin123", $adminPass
    $envContent = $envContent -replace "secure_password", $dbPass
    $envContent = $envContent -replace "your-secure-jwt-secret-key-here", $jwtSecret
    
    Set-Content ".env.local" $envContent
    
    Write-Status "Generated secure passwords"
    Write-Info "Admin password: $adminPass"
    Write-Info "Database password: $dbPass"
    Write-Warning "Please save these passwords securely!"
}

# Create necessary directories
Write-Host ""
Write-Host "📁 Creating directories..." -ForegroundColor Blue

$directories = @("output", "backups", "logs", "certs")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

Write-Status "Created necessary directories"

# Download and prepare services
Write-Host ""
Write-Host "🐳 Preparing Docker services..." -ForegroundColor Blue

# Pull required images
Write-Info "Pulling Docker images..."
docker-compose pull

Write-Status "Docker images pulled"

# Build custom images
Write-Info "Building custom images..."
docker-compose build

Write-Status "Custom images built"

# Start services
Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Blue

docker-compose up -d

Write-Status "Services started"

# Wait for services to be ready
Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Blue

# Wait for MySQL
Write-Info "Waiting for MySQL..."
$maxAttempts = 60
$attempt = 0
do {
    $attempt++
    try {
        docker-compose exec -T mysql mysqladmin ping -h localhost --silent
        Write-Status "MySQL is ready"
        break
    } catch {
        if ($attempt -eq $maxAttempts) {
            Write-Error "MySQL failed to start within 60 seconds"
            exit 1
        }
        Start-Sleep -Seconds 1
    }
} while ($attempt -lt $maxAttempts)

# Wait for Fuseki
Write-Info "Waiting for Fuseki..."
$attempt = 0
do {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3030/`$/ping" -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Status "Fuseki is ready"
            break
        }
    } catch {
        if ($attempt -eq 60) {
            Write-Error "Fuseki failed to start within 60 seconds"
            exit 1
        }
        Start-Sleep -Seconds 1
    }
} while ($attempt -lt 60)

# Wait for R2RML processing to complete
Write-Info "Waiting for R2RML processing..."
Start-Sleep -Seconds 30

# Wait for web application
Write-Info "Waiting for web application..."
$attempt = 0
do {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Status "Web application is ready"
            break
        }
    } catch {
        if ($attempt -eq 30) {
            Write-Error "Web application failed to start within 30 seconds"
            exit 1
        }
        Start-Sleep -Seconds 1
    }
} while ($attempt -lt 30)

# Verify installation
Write-Host ""
Write-Host "🔍 Verifying installation..." -ForegroundColor Blue

# Check service status
$services = @("mysql", "fuseki", "r2rml_processor", "webapp")
$allRunning = $true

foreach ($service in $services) {
    $status = docker-compose ps | Select-String "manufacturing_$service"
    if ($status -and $status.Line -match "Up") {
        Write-Status "$service is running"
    } else {
        Write-Error "$service is not running"
        $allRunning = $false
    }
}

if (-not $allRunning) {
    Write-Error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
}

# Test database connection
try {
    $dbPassword = (Get-Content ".env.local" | Select-String "MYSQL_PASSWORD" | ForEach-Object { $_.Line.Split("=")[1] })
    docker-compose exec -T mysql mysql -u r2rml_user -p$dbPassword manufacturing -e "SELECT COUNT(*) FROM Machine;" | Out-Null
    Write-Status "Database connection successful"
} catch {
    Write-Error "Database connection failed"
}

# Test Fuseki endpoint
try {
    $query = "SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }"
    $body = "query=$([uri]::EscapeDataString($query))"
    Invoke-WebRequest -Uri "http://localhost:3030/manufacturing/sparql" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded" -UseBasicParsing | Out-Null
    Write-Status "Fuseki SPARQL endpoint working"
} catch {
    Write-Error "Fuseki SPARQL endpoint failed"
}

# Test web application
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    if ($response.Content -match "Manufacturing") {
        Write-Status "Web application accessible"
    } else {
        Write-Error "Web application not accessible"
    }
} catch {
    Write-Error "Web application not accessible"
}

# Display summary
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Info "Web Application: http://localhost:3000"
Write-Info "Fuseki Admin: http://localhost:3030"
Write-Info "MySQL Port: 3306"
Write-Host ""

# Show data statistics
Write-Host "📊 Data Statistics:" -ForegroundColor Blue
try {
    $dbPassword = (Get-Content ".env.local" | Select-String "MYSQL_PASSWORD" | ForEach-Object { $_.Line.Split("=")[1] })
    $machineCount = docker-compose exec -T mysql mysql -u r2rml_user -p$dbPassword manufacturing -e "SELECT COUNT(*) FROM Machine;" -s -N 2>$null
    $productionCount = docker-compose exec -T mysql mysql -u r2rml_user -p$dbPassword manufacturing -e "SELECT COUNT(*) FROM Production;" -s -N 2>$null
    Write-Info "Machines: $machineCount"
    Write-Info "Production Runs: $productionCount"
} catch {
    Write-Info "Unable to retrieve data statistics"
}

Write-Host ""
Write-Info "Next steps:"
Write-Host "  1. Open http://localhost:3000 in your browser"
Write-Host "  2. Navigate to Manufacturing → Queries to test SPARQL"
Write-Host "  3. Check Fuseki admin at http://localhost:3030 for RDF data"
Write-Host "  4. Review PRODUCTION-SETUP.md for customization options"
Write-Host ""
Write-Warning "To stop services: docker-compose down"
Write-Warning "To view logs: docker-compose logs -f"

# Open browser automatically
$openBrowser = Read-Host "Would you like to open the web application in your browser? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Start-Process "http://localhost:3000"
}
