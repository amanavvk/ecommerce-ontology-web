# 🏭 Production-Ready Manufacturing R2RML System

## 🎯 Overview

This is a **complete, production-ready R2RML system** that transforms legacy manufacturing databases into semantic knowledge graphs using **MySQL**, **Apache Jena Fuseki**, and **Next.js**. Users can connect their own manufacturing databases and immediately start querying with SPARQL.

## ✨ Features

- **🔄 Real R2RML Processing**: Actual Apache Jena R2RML processor with MySQL integration
- **🌐 Production Fuseki**: Apache Jena Fuseki triple store with persistent data
- **📊 Live SPARQL Interface**: Interactive queries against real RDF data
- **🐳 Docker Deployment**: Complete containerized stack
- **🔧 Easy Customization**: Connect your own database with minimal configuration
- **📈 Sample Data Included**: Complete manufacturing dataset for immediate testing

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker + Docker Compose** (Linux)
- **8GB RAM** minimum
- **10GB disk space**

### Option 1: Automated Setup (Recommended)

#### Windows:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup-production.ps1
```

#### Linux/Mac:
```bash
chmod +x setup-production.sh
./setup-production.sh
```

### Option 2: Manual Setup

```bash
# 1. Copy environment configuration
cp .env.production .env.local

# 2. Start all services
docker-compose up -d

# 3. Monitor startup
docker-compose logs -f
```

### 🌐 Access Points

After setup completes:

- **Web Application**: http://localhost:3000
- **Fuseki Admin**: http://localhost:3030  
- **SPARQL Endpoint**: http://localhost:3030/manufacturing/sparql
- **MySQL**: localhost:3306 (user: r2rml_user)

## 📊 Using Your Own Manufacturing Data

### Step 1: Database Connection

#### Option A: Replace Sample Database
```sql
-- Edit database/init/01-manufacturing-schema.sql
-- Keep the same table structure:

CREATE TABLE Machine (
    MachineID VARCHAR(50) PRIMARY KEY,
    Type VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    InstallDate DATE NOT NULL,
    -- Add your additional columns here
);

CREATE TABLE Production (
    ProductionID INT PRIMARY KEY AUTO_INCREMENT,
    MachineID VARCHAR(50) NOT NULL,
    Timestamp DATETIME NOT NULL,
    Output_Quantity INT NOT NULL,
    Quality_Score DECIMAL(5,2) NOT NULL,
    -- Add your additional columns here
    FOREIGN KEY (MachineID) REFERENCES Machine(MachineID)
);
```

#### Option B: Connect Existing Database
```yaml
# Edit docker-compose.yml
r2rml_processor:
  environment:
    DB_HOST: your-database-host
    DB_PORT: 3306
    DB_NAME: your-database-name
    DB_USER: your-username
    DB_PASSWORD: your-password
```

### Step 2: Update R2RML Mappings (if needed)

```turtle
# Edit r2rml/manufacturing-mappings.ttl
# Update table names and columns to match your schema

<#YourTableMap> a rr:TriplesMap ;
    rr:logicalTable [ rr:tableName "YourTableName" ] ;
    rr:subjectMap [
        rr:template "http://example.org/manufacturing/data/your/{ID}" ;
        rr:class mfg:YourClass
    ] ;
    rr:predicateObjectMap [
        rr:predicate mfg:yourProperty ;
        rr:objectMap [ rr:column "YourColumnName" ]
    ] .
```

### Step 3: Restart Processing

```bash
# Restart R2RML processor to load new data
docker-compose restart r2rml_processor

# Monitor processing logs
docker-compose logs -f r2rml_processor
```

## 🔧 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MySQL DB      │    │  R2RML Processor│    │   Fuseki Store  │
│   Manufacturing │───▶│  Apache Jena    │───▶│   RDF Storage   │
│   Tables        │    │  Mappings       │    │   SPARQL Query  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │   Next.js Web   │
                                               │   Application   │
                                               │   SPARQL UI     │
                                               └─────────────────┘
```

### Data Flow

1. **MySQL Database**: Stores your manufacturing data in relational tables
2. **R2RML Processor**: Transforms SQL data to RDF using mapping rules
3. **Fuseki Triple Store**: Stores generated RDF triples, provides SPARQL endpoint
4. **Web Application**: Interactive interface for SPARQL queries and visualization

## 📈 Sample Queries Included

The system includes production-ready SPARQL queries:

### Machine Analytics
```sparql
PREFIX mfg: <http://example.org/manufacturing#>
SELECT ?machineType (COUNT(?machine) as ?count) WHERE {
    ?machine a mfg:Machine ;
             mfg:machineType ?machineType .
} GROUP BY ?machineType
```

### Quality Analysis
```sparql
PREFIX mfg: <http://example.org/manufacturing#>
SELECT ?production ?quality ?machine WHERE {
    ?production a mfg:ProductionRun ;
                mfg:qualityScore ?quality ;
                mfg:producedBy ?machine .
    FILTER(?quality >= 95.0)
} ORDER BY DESC(?quality)
```

### Production Efficiency
```sparql
PREFIX mfg: <http://example.org/manufacturing#>
SELECT ?machineType (AVG(?output) as ?avgOutput) WHERE {
    ?production mfg:producedBy ?machine ;
                mfg:outputQuantity ?output .
    ?machine mfg:machineType ?machineType .
} GROUP BY ?machineType
```

## 🔍 Monitoring & Troubleshooting

### Check Service Status
```bash
# View all services
docker-compose ps

# Check specific service logs
docker-compose logs mysql
docker-compose logs fuseki
docker-compose logs r2rml_processor
```

### Common Issues

#### Database Connection Failed
```bash
# Test MySQL connection
docker exec -it manufacturing_mysql mysql -u r2rml_user -p

# Check user permissions
docker exec -it manufacturing_mysql mysql -u root -p
SHOW GRANTS FOR 'r2rml_user'@'%';
```

#### Fuseki Not Accessible
```bash
# Check Fuseki status
curl http://localhost:3030/$/ping

# View available datasets
curl http://localhost:3030/$/datasets
```

#### R2RML Processing Failed
```bash
# Check processor logs
docker-compose logs r2rml_processor

# Manual processing
docker exec -it r2rml_processor /app/r2rml-processor.sh
```

### Performance Tuning

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_production_machine_time ON Production(MachineID, Timestamp);
CREATE INDEX idx_production_quality ON Production(Quality_Score);
```

#### Fuseki Memory Settings
```yaml
# In docker-compose.yml
fuseki:
  environment:
    JVM_ARGS: "-Xmx4g -Xms2g"
```

## 🔐 Production Security

### Change Default Passwords
```bash
# Edit .env.local
ADMIN_PASSWORD=your-secure-admin-password
MYSQL_PASSWORD=your-secure-db-password
JWT_SECRET=your-secure-jwt-secret
```

### Enable HTTPS (Recommended)
```yaml
# Add SSL certificates to ./certs/
# Update docker-compose.yml with volume mounts
volumes:
  - ./certs:/certs:ro
```

## 💾 Backup & Recovery

### Database Backup
```bash
# Create database backup
docker exec manufacturing_mysql mysqldump -u root -p manufacturing > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i manufacturing_mysql mysql -u root -p manufacturing < backup_file.sql
```

### Fuseki Backup
```bash
# Backup RDF data
docker exec manufacturing_fuseki tar -czf /tmp/fuseki-backup.tar.gz /fuseki/databases
docker cp manufacturing_fuseki:/tmp/fuseki-backup.tar.gz ./backups/

# Restore RDF data
docker cp ./backups/fuseki-backup.tar.gz manufacturing_fuseki:/tmp/
docker exec manufacturing_fuseki tar -xzf /tmp/fuseki-backup.tar.gz -C /
```

## 🌐 API Endpoints

### SPARQL Endpoint
- **URL**: `http://localhost:3030/manufacturing/sparql`
- **Method**: `POST`
- **Content-Type**: `application/sparql-query`

### Example cURL Query
```bash
curl -X POST http://localhost:3030/manufacturing/sparql \
  -H "Content-Type: application/sparql-query" \
  -d "SELECT * WHERE { ?s ?p ?o } LIMIT 10"
```

## 📚 Extending the System

### Add New Tables
1. Update database schema in `database/init/`
2. Add R2RML mappings in `r2rml/manufacturing-mappings.ttl`
3. Update ontology in `public/ontology/manufacturing.owl`
4. Add queries in web interface

### Custom Analytics
1. Create SPARQL queries for your use cases
2. Add to `src/app/manufacturing/queries/page.tsx`
3. Build custom dashboards using the SPARQL client

## 🆘 Support & Documentation

- **R2RML Specification**: https://www.w3.org/TR/r2rml/
- **SPARQL Tutorial**: https://www.w3.org/TR/sparql11-query/
- **Apache Jena**: https://jena.apache.org/documentation/
- **Fuseki Documentation**: https://jena.apache.org/documentation/fuseki2/

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 You now have a complete, production-ready R2RML manufacturing system that can integrate with your existing databases and provide semantic data access through SPARQL!**
