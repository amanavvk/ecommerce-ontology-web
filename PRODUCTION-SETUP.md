# Manufacturing R2RML Production Deployment Guide

## 🚀 Quick Start - Production Ready Setup

### Prerequisites

1. **Docker & Docker Compose** installed
2. **8GB RAM** minimum for full stack
3. **10GB disk space** for databases and logs

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ecommerce-ontology-web

# Copy environment configuration
cp .env.production .env.local

# Edit configuration for your environment
nano .env.local
```

### 2. Start the Complete Stack

```bash
# Start all services (MySQL, Fuseki, R2RML Processor, Web App)
docker-compose up -d

# Monitor logs
docker-compose logs -f
```

### 3. Verify Installation

```bash
# Check service health
docker-compose ps

# Test MySQL connection
docker exec -it manufacturing_mysql mysql -u r2rml_user -p manufacturing

# Test Fuseki endpoint
curl http://localhost:3030/manufacturing/$/stats

# Test web application
curl http://localhost:3000
```

### 4. Access the Application

- **Web Application**: http://localhost:3000
- **Fuseki Admin**: http://localhost:3030
- **MySQL**: localhost:3306 (username: r2rml_user)

## 📊 Using Your Own Data

### Option 1: Replace Sample Data

1. **Update SQL Schema**:
```bash
# Edit the database initialization file
nano database/init/01-manufacturing-schema.sql

# Add your machine and production data
# Keep the same table structure for R2RML compatibility
```

2. **Restart MySQL**:
```bash
docker-compose restart mysql
```

### Option 2: Connect Existing Database

1. **Update docker-compose.yml**:
```yaml
# Comment out the mysql service
# mysql:
#   image: mysql:8.0
#   ...

# Update environment variables to point to your database
r2rml_processor:
  environment:
    DB_HOST: your-database-host
    DB_PORT: 3306
    DB_NAME: your-database-name
    DB_USER: your-username
    DB_PASSWORD: your-password
```

2. **Update R2RML Mappings** (if needed):
```bash
# Edit mappings for your schema
nano r2rml/manufacturing-mappings.ttl

# Update table names, column names to match your database
```

## 🔧 Customization

### Modify R2RML Mappings

1. **Edit mapping file**:
```bash
nano r2rml/manufacturing-mappings.ttl
```

2. **Update for your schema**:
```turtle
# Example: Add new table mapping
<#YourTableMap> a rr:TriplesMap ;
    rr:logicalTable [ rr:tableName "YourTable" ] ;
    rr:subjectMap [
        rr:template "http://example.org/manufacturing/data/your/{ID}" ;
        rr:class mfg:YourClass
    ] ;
    rr:predicateObjectMap [
        rr:predicate mfg:yourProperty ;
        rr:objectMap [ rr:column "YourColumn" ]
    ] .
```

3. **Restart R2RML processor**:
```bash
docker-compose restart r2rml_processor
```

### Add Custom SPARQL Queries

1. **Edit web application**:
```bash
nano src/app/manufacturing/queries/page.tsx
```

2. **Add your queries to the queries array**:
```typescript
{
  id: 'your-query',
  title: 'Your Custom Query',
  description: 'Description of what it does',
  category: 'analytics',
  sparql: `
    PREFIX mfg: <http://example.org/manufacturing#>
    SELECT ?machine ?result WHERE {
      # Your SPARQL query here
    }
  `
}
```

## 🔍 Monitoring and Troubleshooting

### Check Service Status

```bash
# View all container status
docker-compose ps

# Check specific service logs
docker-compose logs mysql
docker-compose logs fuseki
docker-compose logs r2rml_processor
docker-compose logs webapp
```

### Common Issues

#### 1. MySQL Connection Failed
```bash
# Check MySQL is running
docker-compose logs mysql

# Test connection
docker exec -it manufacturing_mysql mysql -u root -p

# Verify user permissions
SHOW GRANTS FOR 'r2rml_user'@'%';
```

#### 2. Fuseki Not Accessible
```bash
# Check Fuseki logs
docker-compose logs fuseki

# Test endpoint
curl http://localhost:3030/$/ping

# Check dataset exists
curl http://localhost:3030/$/datasets
```

#### 3. R2RML Processing Failed
```bash
# Check processor logs
docker-compose logs r2rml_processor

# Manual R2RML execution
docker exec -it r2rml_processor /app/r2rml-processor.sh
```

#### 4. Web App Connection Issues
```bash
# Check environment variables
docker exec -it manufacturing_webapp env | grep FUSEKI

# Test SPARQL endpoint from container
docker exec -it manufacturing_webapp curl $FUSEKI_ENDPOINT
```

### Performance Tuning

#### MySQL Optimization
```sql
-- Add indexes for better R2RML performance
CREATE INDEX idx_production_machine_time ON Production(MachineID, Timestamp);
CREATE INDEX idx_production_quality ON Production(Quality_Score);
CREATE INDEX idx_machine_type_location ON Machine(Type, Location);
```

#### Fuseki Configuration
```bash
# Increase Java heap size
# Edit docker-compose.yml:
environment:
  JVM_ARGS: "-Xmx4g -Xms2g"
```

## 🚀 Production Deployment

### 1. Security Hardening

```bash
# Change default passwords
nano .env.local
# Update: ADMIN_PASSWORD, MYSQL_PASSWORD, JWT_SECRET

# Enable SSL/TLS
# Add SSL certificates to ./certs/
# Update docker-compose.yml with volume mounts
```

### 2. Backup Strategy

```bash
# Database backup script
docker exec manufacturing_mysql mysqldump -u root -p manufacturing > backup_$(date +%Y%m%d).sql

# Fuseki backup
docker exec manufacturing_fuseki tar -czf /tmp/fuseki-backup.tar.gz /fuseki/databases
docker cp manufacturing_fuseki:/tmp/fuseki-backup.tar.gz ./backups/
```

### 3. Monitoring Setup

```bash
# Add monitoring stack
# Edit docker-compose.yml to include:
# - Prometheus for metrics
# - Grafana for dashboards
# - ELK stack for logs
```

## 📚 Additional Resources

- **SPARQL Tutorial**: https://www.w3.org/TR/sparql11-query/
- **R2RML Specification**: https://www.w3.org/TR/r2rml/
- **Apache Jena Documentation**: https://jena.apache.org/documentation/
- **Fuseki Documentation**: https://jena.apache.org/documentation/fuseki2/

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Validate your R2RML mappings with Jena tools
4. Test SPARQL queries in Fuseki admin interface
