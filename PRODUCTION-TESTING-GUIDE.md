# Complete Production Testing Guide - Step by Step

## Phase 1: Start Docker Desktop (Required First)

### Step 1.1: Manual Docker Startup
**Please follow these steps manually:**

1. **Open Windows Start Menu** (Windows Key)
2. **Type "Docker Desktop"** 
3. **Click on Docker Desktop application**
4. **Wait for the whale icon** to appear in system tray (bottom right)
5. **Wait until the whale icon stops animating** (usually 1-2 minutes)

### Step 1.2: Verify Docker is Running
After Docker Desktop starts, run this command in PowerShell:
```powershell
docker ps
```
You should see an empty list (no containers running) instead of an error.

---

## Phase 2: Production Stack Deployment

### Step 2.1: Deploy the Full Stack
```powershell
# Navigate to project directory
cd "C:\Users\VGE2885\Downloads\case_study_ontology\ecommerce-pwa\ecommerce-ontology-web"

# Start all production services
docker-compose up -d
```

### Step 2.2: Verify All Services are Running
```powershell
# Check all containers
docker-compose ps

# Expected output should show:
# - mysql (port 3306)
# - fuseki (port 3030) 
# - r2rml-processor
# - webapp (port 3001)
```

### Step 2.3: Initialize Database and Load Data
```powershell
# Wait for MySQL to be ready (30 seconds)
Start-Sleep -Seconds 30

# Initialize the database schema
docker-compose exec mysql mysql -u root -proot123 ecommerce_db < /docker-entrypoint-initdb.d/schema.sql

# Run R2RML mapping to load data
docker-compose exec r2rml-processor java -jar /app/r2rml.jar /app/config/mapping.ttl
```

---

## Phase 3: Testing the Production Application

### Step 3.1: Access Production Application
- **Production App:** http://localhost:3001
- **Fuseki SPARQL Endpoint:** http://localhost:3030
- **MySQL Database:** localhost:3306 (user: root, password: root123)

### Step 3.2: Test Key Features
1. **Home Page:** Verify e-commerce ontology features load
2. **Manufacturing Page:** Check all tabs work (Overview, R2RML, Validation, Demo, Visualization)
3. **Manufacturing Queries:** Test SPARQL queries against real Fuseki data
4. **Ontology Viewer:** Verify visualization works

### Step 3.3: Test Production vs Development Differences
- **Development (localhost:3000):** Uses mock data
- **Production (localhost:3001):** Uses real MySQL + Fuseki data

---

## Phase 4: Validate Production Features

### Step 4.1: Test SPARQL Queries
```sparql
# Example query to test in production:
PREFIX mfg: <http://example.org/manufacturing#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?machine ?name ?type WHERE {
  ?machine a mfg:Machine ;
           rdfs:label ?name ;
           mfg:machineType ?type .
}
```

### Step 4.2: Test Data Upload
1. Go to Manufacturing → Demo tab
2. Try uploading custom manufacturing data
3. Verify it appears in query results

### Step 4.3: Test Ontology Validation
1. Go to Manufacturing → Validation tab
2. Upload an OWL file for validation
3. Check validation results

---

## Phase 5: Clean Up (Optional)

### Step 5.1: Stop Production Services
```powershell
# Stop all services
docker-compose down

# Remove volumes (if you want to start fresh)
docker-compose down -v
```

### Step 5.2: Return to Development Mode
The development server should still be running at http://localhost:3000

---

## Troubleshooting

### If Docker Fails to Start:
1. Check Windows system requirements
2. Enable WSL 2 in Windows Features
3. Restart computer if needed
4. Run Docker Desktop as Administrator

### If Services Fail to Deploy:
1. Check ports 3001, 3030, 3306 are not in use
2. Ensure sufficient disk space (2GB+)
3. Check Docker logs: `docker-compose logs [service-name]`

### If Application Doesn't Load:
1. Wait 2-3 minutes for all services to initialize
2. Check service status: `docker-compose ps`
3. Check application logs: `docker-compose logs webapp`

---

## Success Criteria

✅ Docker Desktop running (whale icon in system tray)
✅ All 4 services running: `docker-compose ps` shows "Up"
✅ Production app accessible at http://localhost:3001
✅ SPARQL queries return real data (not mock data)
✅ Manufacturing features work with real Fuseki endpoint
✅ Data persistence across container restarts
