import React, { useState, useEffect } from 'react';
import { Play, Database, FileText, BarChart3 } from 'lucide-react';

interface SPARQLQueryInterfaceProps {
  rdfLoaded?: boolean;
  tripleCount?: number;
  uploadedData?: any[];
}

const SPARQLQueryInterface: React.FC<SPARQLQueryInterfaceProps> = ({ 
  rdfLoaded = false, 
  tripleCount = 0,
  uploadedData = []
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [querying, setQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSchema, setDetectedSchema] = useState<string>('');

  // Detect data schema and generate appropriate queries
  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      const firstRow = uploadedData[0];
      const columns = Object.keys(firstRow);
      
      // Detect data type based on column names
      let dataType = 'general';
      let entityName = 'entity';
      
      if (columns.includes('machineId') || columns.includes('machineName')) {
        dataType = 'machine';
        entityName = 'machine';
      } else if (columns.includes('employeeId') || columns.includes('firstName')) {
        dataType = 'employee';
        entityName = 'employee';
      } else if (columns.includes('productId') || columns.includes('productName')) {
        dataType = 'product';
        entityName = 'product';
      }
      
      setDetectedSchema(dataType);
      
      // Set default query based on detected schema
      const defaultQuery = generateDefaultQuery(dataType, columns);
      setQuery(defaultQuery);
    } else {
      // Default machine query when no data is uploaded
      setQuery(`PREFIX ex: <http://example.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?machine ?name ?type ?efficiency WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasType ?type ;
           ex:hasEfficiency ?efficiency .
} ORDER BY DESC(?efficiency) LIMIT 10`);
    }
  }, [uploadedData]);

  const generateDefaultQuery = (dataType: string, columns: string[]) => {
    const prefix = `PREFIX ex: <http://example.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

`;

    switch (dataType) {
      case 'machine':
        const machineColumns = columns.filter(col => 
          ['machineId', 'machineName', 'type', 'efficiency', 'status', 'location', 'manufacturer'].includes(col)
        ).slice(0, 6);
        
        return prefix + `SELECT ${machineColumns.map(col => `?${col}`).join(' ')} WHERE {
  ?machine ${machineColumns.map(col => `ex:${col} ?${col}`).join(' ;\n           ')} .
} ORDER BY DESC(?efficiency) LIMIT 10`;

      case 'employee':
        const empColumns = columns.filter(col => 
          ['employeeId', 'firstName', 'lastName', 'department', 'role', 'salary'].includes(col)
        ).slice(0, 6);
        
        return prefix + `SELECT ${empColumns.map(col => `?${col}`).join(' ')} WHERE {
  ?employee ${empColumns.map(col => `ex:${col} ?${col}`).join(' ;\n            ')} .
} ORDER BY DESC(?salary) LIMIT 10`;

      case 'product':
        const prodColumns = columns.filter(col => 
          ['productId', 'productName', 'category', 'unitPrice', 'supplier'].includes(col)
        ).slice(0, 5);
        
        return prefix + `SELECT ${prodColumns.map(col => `?${col}`).join(' ')} WHERE {
  ?product ${prodColumns.map(col => `ex:${col} ?${col}`).join(' ;\n           ')} .
} ORDER BY DESC(?unitPrice) LIMIT 10`;

      default:
        // Generic query using first few columns
        const genericColumns = columns.slice(0, 4);
        return prefix + `SELECT ${genericColumns.map(col => `?${col}`).join(' ')} WHERE {
  ?entity ${genericColumns.map(col => `ex:${col} ?${col}`).join(' ;\n          ')} .
} LIMIT 10`;
    }
  };

  const getSampleQueries = () => {
    if (!uploadedData || uploadedData.length === 0) {
      // Default machine queries when no data is uploaded
      return [
        {
          name: "All Machines by Efficiency",
          query: `PREFIX ex: <http://example.org/>
SELECT ?machine ?name ?type ?efficiency WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasType ?type ;
           ex:hasEfficiency ?efficiency .
} ORDER BY DESC(?efficiency)`
        },
        {
          name: "Operational Machines Only",
          query: `PREFIX ex: <http://example.org/>
SELECT ?machine ?name ?status ?location WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasStatus "OPERATIONAL" ;
           ex:hasLocation ?location .
}`
        },
        {
          name: "Machines by Manufacturer",
          query: `PREFIX ex: <http://example.org/>
SELECT ?manufacturer (COUNT(?machine) as ?count) WHERE {
  ?machine a ex:Machine ;
           ex:hasManufacturer ?manufacturer .
} GROUP BY ?manufacturer ORDER BY DESC(?count)`
        },
        {
          name: "Low Efficiency Alerts",
          query: `PREFIX ex: <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?machine ?name ?efficiency WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasEfficiency ?efficiency .
  FILTER(?efficiency < 80)
} ORDER BY ?efficiency`
        }
      ];
    }

    const firstRow = uploadedData[0];
    const columns = Object.keys(firstRow);

    if (detectedSchema === 'machine') {
      return [
        {
          name: "All Machines by Efficiency",
          query: `PREFIX ex: <http://example.org/>
SELECT ?machineId ?machineName ?type ?efficiency ?status WHERE {
  ?machine ex:machineId ?machineId ;
           ex:machineName ?machineName ;
           ex:type ?type ;
           ex:efficiency ?efficiency ;
           ex:status ?status .
} ORDER BY DESC(?efficiency)`
        },
        {
          name: "Operational Machines",
          query: `PREFIX ex: <http://example.org/>
SELECT ?machineId ?machineName ?location ?manufacturer WHERE {
  ?machine ex:machineId ?machineId ;
           ex:machineName ?machineName ;
           ex:status "OPERATIONAL" ;
           ex:location ?location ;
           ex:manufacturer ?manufacturer .
}`
        },
        {
          name: "High Efficiency Machines",
          query: `PREFIX ex: <http://example.org/>
SELECT ?machineId ?machineName ?efficiency WHERE {
  ?machine ex:machineId ?machineId ;
           ex:machineName ?machineName ;
           ex:efficiency ?efficiency .
  FILTER(?efficiency > 85)
} ORDER BY DESC(?efficiency)`
        }
      ];
    } else if (detectedSchema === 'employee') {
      return [
        {
          name: "All Employees by Salary",
          query: `PREFIX ex: <http://example.org/>
SELECT ?employeeId ?firstName ?lastName ?department ?salary WHERE {
  ?employee ex:employeeId ?employeeId ;
            ex:firstName ?firstName ;
            ex:lastName ?lastName ;
            ex:department ?department ;
            ex:salary ?salary .
} ORDER BY DESC(?salary)`
        },
        {
          name: "Employees by Department",
          query: `PREFIX ex: <http://example.org/>
SELECT ?department (COUNT(?employee) as ?count) WHERE {
  ?employee ex:department ?department .
} GROUP BY ?department ORDER BY DESC(?count)`
        },
        {
          name: "Senior Level Employees",
          query: `PREFIX ex: <http://example.org/>
SELECT ?employeeId ?firstName ?lastName ?role WHERE {
  ?employee ex:employeeId ?employeeId ;
            ex:firstName ?firstName ;
            ex:lastName ?lastName ;
            ex:skillLevel "Senior" ;
            ex:role ?role .
}`
        }
      ];
    } else {
      // Generic queries for other data types
      const firstFewColumns = columns.slice(0, 4);
      return [
        {
          name: `All ${detectedSchema} Records`,
          query: `PREFIX ex: <http://example.org/>
SELECT ${firstFewColumns.map(col => `?${col}`).join(' ')} WHERE {
  ?entity ${firstFewColumns.map(col => `ex:${col} ?${col}`).join(' ;\n          ')} .
} LIMIT 10`
        }
      ];
    }
  };

  const sampleQueries = getSampleQueries();

  const executeQuery = async () => {
    if (!rdfLoaded) {
      setError("Please process R2RML data first to enable querying");
      return;
    }

    setQuerying(true);
    setError(null);

    try {
      // Execute query against the uploaded RDF data
      const response = await fetch('/api/sparql-uploaded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `query=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.bindings) {
        // Convert SPARQL JSON results to display format
        const displayResults = data.results.bindings.map((binding: any) => {
          const result: any = {};
          Object.keys(binding).forEach(key => {
            result[key] = binding[key].value || binding[key];
          });
          return result;
        });
        
        setResults(displayResults);
      } else {
        setError('No results returned from SPARQL query');
      }
    } catch (err: any) {
      console.error('SPARQL query error:', err);
      setError(err.message || 'Query execution failed');
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      marginTop: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Database size={32} style={{ color: '#667eea', marginRight: '1rem' }} />
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            SPARQL Query Interface
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Query your uploaded data using semantic SPARQL syntax
            {tripleCount > 0 && ` (${tripleCount} triples loaded)`}
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: rdfLoaded ? '#f0fdf4' : '#fef3c7',
        border: `1px solid ${rdfLoaded ? '#22c55e' : '#f59e0b'}`,
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: rdfLoaded ? '#22c55e' : '#f59e0b',
          marginRight: '0.75rem'
        }} />
        <span style={{
          fontWeight: '600',
          color: rdfLoaded ? '#166534' : '#92400e'
        }}>
          {rdfLoaded ? 'Triple Store Ready' : 'Waiting for R2RML Processing'}
        </span>
      </div>

      {/* Sample Queries */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          Sample Queries
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {sampleQueries.map((sample, index) => (
            <button
              key={index}
              onClick={() => setQuery(sample.query)}
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                {sample.name}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                Click to load this query
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Editor */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937' }}>
            SPARQL Query
          </h3>
          <button
            onClick={executeQuery}
            disabled={querying || !rdfLoaded}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              backgroundColor: querying || !rdfLoaded ? '#9ca3af' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: querying || !rdfLoaded ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            <Play size={20} style={{ marginRight: '0.5rem' }} />
            {querying ? 'Executing...' : 'Execute Query'}
          </button>
        </div>
        
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SPARQL query here..."
          style={{
            width: '100%',
            height: '200px',
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontFamily: 'Monaco, Consolas, "Ubuntu Mono", monospace',
            backgroundColor: '#f9fafb',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileText size={20} style={{ color: '#ef4444', marginRight: '0.5rem' }} />
            <span style={{ color: '#dc2626', fontWeight: '600' }}>Query Error</span>
          </div>
          <p style={{ color: '#dc2626', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            {error}
          </p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <BarChart3 size={24} style={{ color: '#22c55e', marginRight: '0.5rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Query Results ({results.length} rows)
            </h3>
          </div>
          
          <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  {results.length > 0 && Object.keys(results[0]).map(key => (
                    <th key={key} style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #e5e7eb',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td key={cellIndex} style={{ 
                        padding: '1rem',
                        color: '#6b7280'
                      }}>
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SPARQLQueryInterface;
