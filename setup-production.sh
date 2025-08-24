#!/bin/bash
# Production Setup Script for Manufacturing R2RML System
# This script sets up the complete production environment

set -e

echo "🏭 Manufacturing R2RML Production Setup"
echo "========================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_status "Docker is installed"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_status "Docker Compose is installed"

# Check system resources
TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
if [ "$TOTAL_MEM" -lt 8 ]; then
    print_warning "System has ${TOTAL_MEM}GB RAM. Recommended: 8GB or more"
else
    print_status "System has sufficient RAM (${TOTAL_MEM}GB)"
fi

# Check disk space
AVAILABLE_SPACE=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -lt 10 ]; then
    print_warning "Available disk space: ${AVAILABLE_SPACE}GB. Recommended: 10GB or more"
else
    print_status "Sufficient disk space available (${AVAILABLE_SPACE}GB)"
fi

# Setup environment configuration
echo ""
echo "📝 Setting up environment configuration..."

if [ ! -f ".env.local" ]; then
    cp .env.production .env.local
    print_status "Created .env.local from .env.production"
else
    print_info ".env.local already exists, skipping"
fi

# Generate secure passwords if using defaults
if grep -q "admin123" .env.local; then
    ADMIN_PASS=$(openssl rand -base64 12)
    DB_PASS=$(openssl rand -base64 16)
    JWT_SECRET=$(openssl rand -base64 32)
    
    sed -i "s/admin123/$ADMIN_PASS/g" .env.local
    sed -i "s/secure_password/$DB_PASS/g" .env.local
    sed -i "s/your-secure-jwt-secret-key-here/$JWT_SECRET/g" .env.local
    
    print_status "Generated secure passwords"
    print_info "Admin password: $ADMIN_PASS"
    print_info "Database password: $DB_PASS"
    print_warning "Please save these passwords securely!"
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."

mkdir -p output
mkdir -p backups
mkdir -p logs
mkdir -p certs

print_status "Created necessary directories"

# Download and prepare services
echo ""
echo "🐳 Preparing Docker services..."

# Pull required images
docker-compose pull

print_status "Docker images pulled"

# Build custom images
docker-compose build

print_status "Custom images built"

# Start services
echo ""
echo "🚀 Starting services..."

docker-compose up -d

print_status "Services started"

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."

# Wait for MySQL
print_info "Waiting for MySQL..."
for i in {1..60}; do
    if docker-compose exec -T mysql mysqladmin ping -h localhost --silent; then
        print_status "MySQL is ready"
        break
    fi
    if [ $i -eq 60 ]; then
        print_error "MySQL failed to start within 60 seconds"
        exit 1
    fi
    sleep 1
done

# Wait for Fuseki
print_info "Waiting for Fuseki..."
for i in {1..60}; do
    if curl -s http://localhost:3030/$/ping > /dev/null 2>&1; then
        print_status "Fuseki is ready"
        break
    fi
    if [ $i -eq 60 ]; then
        print_error "Fuseki failed to start within 60 seconds"
        exit 1
    fi
    sleep 1
done

# Wait for R2RML processing to complete
print_info "Waiting for R2RML processing..."
sleep 30

# Wait for web application
print_info "Waiting for web application..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_status "Web application is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Web application failed to start within 30 seconds"
        exit 1
    fi
    sleep 1
done

# Verify installation
echo ""
echo "🔍 Verifying installation..."

# Check service status
ALL_RUNNING=true
for service in mysql fuseki r2rml_processor webapp; do
    if ! docker-compose ps | grep "manufacturing_$service" | grep -q "Up"; then
        print_error "$service is not running"
        ALL_RUNNING=false
    else
        print_status "$service is running"
    fi
done

if [ "$ALL_RUNNING" = false ]; then
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Test database connection
if docker-compose exec -T mysql mysql -u r2rml_user -p$(grep MYSQL_PASSWORD .env.local | cut -d'=' -f2) manufacturing -e "SELECT COUNT(*) FROM Machine;" > /dev/null 2>&1; then
    print_status "Database connection successful"
else
    print_error "Database connection failed"
fi

# Test Fuseki endpoint
if curl -s http://localhost:3030/manufacturing/sparql -d "query=SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }" > /dev/null 2>&1; then
    print_status "Fuseki SPARQL endpoint working"
else
    print_error "Fuseki SPARQL endpoint failed"
fi

# Test web application
if curl -s http://localhost:3000 | grep -q "Manufacturing"; then
    print_status "Web application accessible"
else
    print_error "Web application not accessible"
fi

# Display summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
print_info "Web Application: http://localhost:3000"
print_info "Fuseki Admin: http://localhost:3030"
print_info "MySQL Port: 3306"
echo ""

# Show data statistics
echo "📊 Data Statistics:"
MACHINE_COUNT=$(docker-compose exec -T mysql mysql -u r2rml_user -p$(grep MYSQL_PASSWORD .env.local | cut -d'=' -f2) manufacturing -e "SELECT COUNT(*) FROM Machine;" -s -N 2>/dev/null || echo "0")
PRODUCTION_COUNT=$(docker-compose exec -T mysql mysql -u r2rml_user -p$(grep MYSQL_PASSWORD .env.local | cut -d'=' -f2) manufacturing -e "SELECT COUNT(*) FROM Production;" -s -N 2>/dev/null || echo "0")
print_info "Machines: $MACHINE_COUNT"
print_info "Production Runs: $PRODUCTION_COUNT"

echo ""
print_info "Next steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Navigate to Manufacturing → Queries to test SPARQL"
echo "  3. Check Fuseki admin at http://localhost:3030 for RDF data"
echo "  4. Review PRODUCTION-SETUP.md for customization options"
echo ""
print_warning "To stop services: docker-compose down"
print_warning "To view logs: docker-compose logs -f"
