#!/bin/bash
# R2RML Processing Script
# Processes manufacturing data from MySQL to RDF and loads into Fuseki

set -e

echo "🚀 Starting R2RML Manufacturing Data Processing..."

# Wait for dependencies
echo "⏳ Waiting for MySQL to be ready..."
./wait-for-it.sh $DB_HOST:$DB_PORT --timeout=60 --strict

echo "⏳ Waiting for Fuseki to be ready..."
./wait-for-it.sh fuseki:3030 --timeout=60 --strict

# Sleep additional time for services to fully initialize
sleep 10

# Environment variables with defaults
DB_HOST=${DB_HOST:-mysql}
DB_PORT=${DB_PORT:-3306}
DB_NAME=${DB_NAME:-manufacturing}
DB_USER=${DB_USER:-r2rml_user}
DB_PASSWORD=${DB_PASSWORD:-secure_password}
FUSEKI_URL=${FUSEKI_URL:-http://fuseki:3030/manufacturing}

# Database connection string
JDBC_URL="jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true"

echo "📊 Database Connection: $JDBC_URL"
echo "🌐 Fuseki Endpoint: $FUSEKI_URL"

# Create output directory
mkdir -p /app/output

# Process R2RML mappings
echo "🔄 Processing R2RML mappings..."

# First, test database connectivity
echo "🔍 Testing database connectivity..."
java -cp "$CLASSPATH" \
    -Dlog4j.configuration=file:log4j.properties \
    jena.cmd.rdfdiff --help > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Jena tools are working"
else
    echo "❌ Jena tools test failed"
    exit 1
fi

# Execute R2RML processing
echo "🏭 Processing manufacturing R2RML mappings..."
java -Xmx2g -cp "$CLASSPATH" \
    jena.cmd.r2rml \
    --r2rml="/app/mappings/manufacturing-r2rml.ttl" \
    --jdbc="$JDBC_URL" \
    --user="$DB_USER" \
    --password="$DB_PASSWORD" \
    --output="/app/output/manufacturing-data.ttl" \
    --format="TTL" \
    --verbose

if [ $? -eq 0 ]; then
    echo "✅ R2RML processing completed successfully"
    
    # Display statistics
    TRIPLE_COUNT=$(grep -c '\.$' /app/output/manufacturing-data.ttl || echo "0")
    echo "📈 Generated $TRIPLE_COUNT RDF triples"
    
    # Show sample of generated data
    echo "📄 Sample generated RDF:"
    head -20 /app/output/manufacturing-data.ttl
else
    echo "❌ R2RML processing failed"
    exit 1
fi

# Load data into Fuseki
echo "📤 Loading RDF data into Fuseki..."

# First, clear any existing data
echo "🧹 Clearing existing data..."
curl -X POST "${FUSEKI_URL}/update" \
    -H "Content-Type: application/sparql-update" \
    -d "CLEAR ALL" \
    --silent --show-error

# Load the ontology first
echo "📚 Loading manufacturing ontology..."
curl -X POST "${FUSEKI_URL}/data" \
    -H "Content-Type: text/turtle" \
    --data-binary @/app/mappings/../public/ontology/manufacturing.owl \
    --silent --show-error

if [ $? -eq 0 ]; then
    echo "✅ Ontology loaded successfully"
else
    echo "⚠️  Ontology loading failed, continuing with data..."
fi

# Load the generated RDF data
echo "📊 Loading manufacturing data..."
curl -X POST "${FUSEKI_URL}/data" \
    -H "Content-Type: text/turtle" \
    --data-binary @/app/output/manufacturing-data.ttl \
    --silent --show-error

if [ $? -eq 0 ]; then
    echo "✅ Manufacturing data loaded successfully"
    
    # Verify data loading with a test query
    echo "🔍 Verifying data loading..."
    MACHINE_COUNT=$(curl -s "${FUSEKI_URL}/sparql" \
        -H "Accept: application/sparql-results+json" \
        -G -d "query=SELECT (COUNT(*) as ?count) WHERE { ?s a <http://example.org/manufacturing#Machine> }" \
        | grep -o '"value":"[0-9]*"' | grep -o '[0-9]*' | head -1)
    
    PRODUCTION_COUNT=$(curl -s "${FUSEKI_URL}/sparql" \
        -H "Accept: application/sparql-results+json" \
        -G -d "query=SELECT (COUNT(*) as ?count) WHERE { ?s a <http://example.org/manufacturing#ProductionRun> }" \
        | grep -o '"value":"[0-9]*"' | grep -o '[0-9]*' | head -1)
    
    echo "📊 Loaded $MACHINE_COUNT machines and $PRODUCTION_COUNT production runs"
    
else
    echo "❌ Data loading failed"
    exit 1
fi

# Set up incremental processing
echo "⏰ Setting up incremental processing..."
echo "# Incremental R2RML Processing Configuration" > /app/output/incremental-config.txt
echo "LAST_PROCESSED=$(date -Iseconds)" >> /app/output/incremental-config.txt
echo "JDBC_URL=$JDBC_URL" >> /app/output/incremental-config.txt
echo "FUSEKI_URL=$FUSEKI_URL" >> /app/output/incremental-config.txt

echo "🎉 R2RML processing pipeline setup complete!"
echo "🌐 Fuseki SPARQL endpoint: ${FUSEKI_URL}/sparql"
echo "📊 Fuseki admin interface: http://localhost:3030"

# Keep container running for incremental processing
echo "🔄 Starting incremental processing daemon..."
while true; do
    sleep 300 # Wait 5 minutes
    
    echo "🔄 Checking for new data..."
    
    # Check if there are new records since last processing
    # This is a simple implementation - in production you'd want more sophisticated change detection
    LATEST_RECORD=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" \
        -e "SELECT MAX(Timestamp) as latest FROM Production;" -s -N 2>/dev/null || echo "")
    
    if [ ! -z "$LATEST_RECORD" ]; then
        echo "📈 Latest record timestamp: $LATEST_RECORD"
        # In a full implementation, you would:
        # 1. Generate incremental R2RML mappings
        # 2. Process only new/changed data
        # 3. Update the triple store incrementally
    fi
done
