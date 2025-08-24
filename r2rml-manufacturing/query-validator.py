#!/usr/bin/env python3
"""
R2RML Manufacturing Integration - Query Validator
This script validates SPARQL queries and tests them against the knowledge graph.
"""

import json
import requests
import sys
from urllib.parse import urlencode

class SPARQLQueryValidator:
    def __init__(self, endpoint_url="http://localhost:3030/manufacturing/sparql"):
        self.endpoint_url = endpoint_url
        self.prefixes = """
PREFIX mfg: <http://example.org/manufacturing#>
PREFIX ex: <http://example.org/manufacturing/data/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        """
    
    def test_connection(self):
        """Test if SPARQL endpoint is available"""
        try:
            response = requests.get(f"{self.endpoint_url.replace('/sparql', '/$/ping')}", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def execute_query(self, query, limit=10):
        """Execute a SPARQL query and return results"""
        try:
            full_query = self.prefixes + "\n" + query
            
            params = {
                'query': full_query,
                'format': 'json'
            }
            
            response = requests.get(
                self.endpoint_url,
                params=params,
                headers={'Accept': 'application/sparql-results+json'},
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {'error': f'HTTP {response.status_code}: {response.text}'}
                
        except Exception as e:
            return {'error': str(e)}
    
    def format_results(self, results):
        """Format query results for display"""
        if 'error' in results:
            return f"❌ Error: {results['error']}"
        
        if 'results' not in results or 'bindings' not in results['results']:
            return "❌ Invalid result format"
        
        bindings = results['results']['bindings']
        if not bindings:
            return "ℹ️ No results found"
        
        # Get variable names from first binding
        if bindings:
            vars = list(bindings[0].keys())
            
            output = []
            output.append(f"✅ Found {len(bindings)} results:")
            output.append("-" * 50)
            
            for i, binding in enumerate(bindings[:10]):  # Limit to first 10 results
                row = []
                for var in vars:
                    if var in binding:
                        value = binding[var]['value']
                        # Simplify URIs for readability
                        if value.startswith('http://example.org/manufacturing'):
                            value = value.split('/')[-1]
                        elif '#' in value:
                            value = value.split('#')[-1]
                        row.append(f"{var}: {value}")
                    else:
                        row.append(f"{var}: N/A")
                
                output.append(f"  {i+1}. {' | '.join(row)}")
            
            if len(bindings) > 10:
                output.append(f"  ... and {len(bindings) - 10} more results")
            
            return "\n".join(output)
        
        return "ℹ️ Empty results"

def main():
    print("🔍 R2RML Manufacturing Integration - Query Validator")
    print("=" * 55)
    
    validator = SPARQLQueryValidator()
    
    # Test connection
    print("\n📡 Testing SPARQL endpoint connection...")
    if validator.test_connection():
        print("✅ SPARQL endpoint is available")
    else:
        print("❌ SPARQL endpoint not available")
        print("💡 To start Fuseki: ./fuseki-server --mem --update /manufacturing")
        print("💡 Load sample data first: see test-execution.ps1")
        return
    
    # Define test queries
    test_queries = [
        {
            "name": "Entity Count Validation",
            "description": "Count all entity types to verify data loading",
            "query": """
SELECT ?type (COUNT(?entity) as ?count) WHERE {
  ?entity a ?type .
  FILTER(?type IN (mfg:Machine, mfg:ProductionRun, mfg:QualityMeasurement, mfg:Location))
} GROUP BY ?type ORDER BY ?type
            """
        },
        {
            "name": "Machine Inventory",
            "description": "List all machines with basic properties",
            "query": """
SELECT ?machineID ?type ?location WHERE {
  ?machine a mfg:Machine ;
           mfg:machineID ?machineID ;
           mfg:machineType ?type ;
           mfg:locationName ?location .
} ORDER BY ?machineID
            """
        },
        {
            "name": "Production Summary",
            "description": "Production runs with quality scores",
            "query": """
SELECT ?productionID ?machineID ?quantity ?qualityScore WHERE {
  ?production a mfg:ProductionRun ;
              mfg:productionID ?productionID ;
              mfg:outputQuantity ?quantity ;
              mfg:producedBy ?machine ;
              mfg:hasQualityMeasurement ?qm .
  ?machine mfg:machineID ?machineID .
  ?qm mfg:qualityScore ?qualityScore .
} ORDER BY DESC(?qualityScore) LIMIT 10
            """
        },
        {
            "name": "Quality Analysis",
            "description": "Average quality by machine type",
            "query": """
SELECT ?machineType 
       (COUNT(?production) as ?productionCount)
       (AVG(?qualityScore) as ?avgQuality)
       (MIN(?qualityScore) as ?minQuality)
       (MAX(?qualityScore) as ?maxQuality) WHERE {
  ?machine a mfg:Machine ;
           mfg:machineType ?machineType ;
           mfg:hasProduction ?production .
  ?production mfg:hasQualityMeasurement ?qm .
  ?qm mfg:qualityScore ?qualityScore .
} GROUP BY ?machineType
ORDER BY DESC(?avgQuality)
            """
        },
        {
            "name": "High Quality Productions",
            "description": "Productions with quality >= 95",
            "query": """
SELECT ?productionID ?machineType ?qualityScore ?outputQuantity WHERE {
  ?production a mfg:ProductionRun ;
              mfg:productionID ?productionID ;
              mfg:outputQuantity ?outputQuantity ;
              mfg:producedBy ?machine ;
              mfg:hasQualityMeasurement ?qm .
  ?machine mfg:machineType ?machineType .
  ?qm mfg:qualityScore ?qualityScore .
  FILTER(?qualityScore >= 95.0)
} ORDER BY DESC(?qualityScore)
            """
        },
        {
            "name": "Relationship Integrity Check",
            "description": "Verify all productions have machines",
            "query": """
SELECT ?production WHERE {
  ?production a mfg:ProductionRun .
  FILTER NOT EXISTS { ?production mfg:producedBy ?machine }
}
            """
        }
    ]
    
    # Execute test queries
    passed = 0
    total = len(test_queries)
    
    for i, test in enumerate(test_queries, 1):
        print(f"\n🔍 Test {i}/{total}: {test['name']}")
        print(f"Description: {test['description']}")
        print("-" * 50)
        
        results = validator.execute_query(test['query'])
        formatted_results = validator.format_results(results)
        print(formatted_results)
        
        if not formatted_results.startswith("❌"):
            passed += 1
    
    # Summary
    print(f"\n📊 Test Summary")
    print("=" * 30)
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 All tests passed! R2RML integration is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Check SPARQL endpoint and data loading.")
    
    # Interactive mode
    print(f"\n💡 Interactive Mode")
    print("Enter custom SPARQL queries (type 'exit' to quit):")
    
    while True:
        try:
            user_query = input("\nSPARQL> ")
            if user_query.lower() in ['exit', 'quit', 'q']:
                break
            
            if user_query.strip():
                results = validator.execute_query(user_query)
                formatted_results = validator.format_results(results)
                print(formatted_results)
        
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
