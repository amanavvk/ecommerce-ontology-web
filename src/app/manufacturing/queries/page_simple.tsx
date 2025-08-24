'use client';
import React, { useState, useEffect } from 'react';
import { executeSPARQLQuery, getSystemStatus } from '@/lib/production-sparql-client';

interface Query {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'analytics' | 'performance' | 'validation';
  sparql: string;
  expectedResults: string;
}

const manufacturingQueries: Query[] = [
  {
    id: 'machines-list',
    title: 'List All Manufacturing Machines',
    description: 'Retrieve all machines with their properties and locations',
    category: 'basic',
    sparql: `PREFIX mfg: <http://example.org/manufacturing#>
PREFIX ex: <http://example.org/manufacturing/data/>

SELECT ?machine ?machineID ?type ?location ?installDate WHERE {
  ?machine a mfg:Machine ;
           mfg:machineID ?machineID ;
           mfg:machineType ?type ;
           mfg:locationName ?location ;
           mfg:installDate ?installDate .
} ORDER BY ?machineID`,
    expectedResults: 'Complete list of manufacturing machines with IDs (M001-M005), types (CNC, Assembly, Quality Control), locations, and installation dates'
  },
  {
    id: 'production-summary',
    title: 'Production Summary by Machine',
    description: 'Get production statistics for each machine including total output and average quality',
    category: 'analytics',
    sparql: `PREFIX mfg: <http://example.org/manufacturing#>

SELECT ?machineID 
       (COUNT(?production) as ?totalRuns)
       (SUM(?outputQuantity) as ?totalOutput)
       (AVG(?qualityScore) as ?avgQuality) WHERE {
  ?machine a mfg:Machine ;
           mfg:machineID ?machineID ;
           mfg:hasProduction ?production .
  ?production mfg:outputQuantity ?outputQuantity ;
              mfg:hasQualityMeasurement ?qm .
  ?qm mfg:qualityScore ?qualityScore .
} GROUP BY ?machineID
ORDER BY DESC(?totalOutput)`,
    expectedResults: 'Summary statistics showing total production runs, output quantities, and average quality scores per machine'
  },
  {
    id: 'recent-production',
    title: 'Recent Production Activity',
    description: 'Show latest production runs in the last week',
    category: 'basic',
    sparql: `PREFIX mfg: <http://example.org/manufacturing#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?productionID ?machineID ?timestamp ?outputQuantity ?qualityScore WHERE {
  ?production a mfg:ProductionRun ;
              mfg:productionID ?productionID ;
              mfg:producedBy ?machine ;
              mfg:timestamp ?timestamp ;
              mfg:outputQuantity ?outputQuantity ;
              mfg:hasQualityMeasurement ?qm .
  ?machine mfg:machineID ?machineID .
  ?qm mfg:qualityScore ?qualityScore .
  FILTER(?timestamp >= "2024-01-15T00:00:00"^^xsd:dateTime)
} ORDER BY DESC(?timestamp)`,
    expectedResults: 'Most recent production runs showing current manufacturing activity and performance'
  },
  {
    id: 'quality-control',
    title: 'Quality Control Analysis',
    description: 'Analyze quality control metrics and defect patterns',
    category: 'validation',
    sparql: `PREFIX mfg: <http://example.org/manufacturing#>

SELECT ?qualityID ?productionID ?inspectionResult ?defectCount ?defectType WHERE {
  ?qc a mfg:QualityInspection ;
      mfg:qualityID ?qualityID ;
      mfg:inspects ?production ;
      mfg:inspectionResult ?inspectionResult ;
      mfg:defectCount ?defectCount .
  ?production mfg:productionID ?productionID .
  OPTIONAL { ?qc mfg:defectType ?defectType }
} ORDER BY DESC(?defectCount)`,
    expectedResults: 'Quality control inspection results with defect analysis and inspection outcomes'
  }
];

const categoryColors = {
  basic: '#3b82f6',
  analytics: '#10b981',
  performance: '#f59e0b',
  validation: '#8b5cf6'
};

const categoryIcons = {
  basic: '📋',
  analytics: '📊',
  performance: '⚡',
  validation: '✅'
};

const ManufacturingQueriesPage = () => {
  const [selectedQuery, setSelectedQuery] = useState<Query>(manufacturingQueries[0]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  
  // Simple SPARQL Editor States
  const [customQuery, setCustomQuery] = useState<string>(`PREFIX mfg: <http://example.org/manufacturing#>

SELECT ?machine ?type WHERE {
  ?machine a mfg:Machine ;
           mfg:machineType ?type .
} LIMIT 3`);
  const [showSampleData, setShowSampleData] = useState(false);
  const [customQueryResults, setCustomQueryResults] = useState<any[]>([]);
  const [customQueryError, setCustomQueryError] = useState<string | null>(null);

  // Load system status on component mount
  React.useEffect(() => {
    getSystemStatus().then(setSystemStatus).catch(console.error);
  }, []);

  // Simple executeCustomQuery function
  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    setLoading(true);
    setCustomQueryError(null);
    setCustomQueryResults([]);
    
    try {
      console.log('🚀 Executing custom SPARQL query:', customQuery);
      const queryResults = await executeSPARQLQuery(customQuery);
      setCustomQueryResults(queryResults);
      console.log('✅ Custom query executed successfully:', queryResults);
    } catch (error) {
      console.error('❌ Custom query execution failed:', error);
      setCustomQueryError(error instanceof Error ? error.message : 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (query: Query) => {
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const queryResults = await executeSPARQLQuery(query.sparql);
      setResults(queryResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredQueries = activeCategory === 'all' 
    ? manufacturingQueries 
    : manufacturingQueries.filter(q => q.category === activeCategory);

  const groupedQueries = manufacturingQueries.reduce((acc, query) => {
    if (!acc[query.category]) {
      acc[query.category] = [];
    }
    acc[query.category].push(query);
    return acc;
  }, {} as Record<string, Query[]>);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)',
      padding: '40px 20px'
    }}>
      
      <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <div className="card" style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px', 
            color: '#0c4a6e',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Manufacturing <span style={{ color: '#0284c7' }}>SPARQL Queries</span> <span style={{ color: '#8b5cf6' }}>+ Simple Editor</span>
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#075985', 
            marginBottom: '24px', 
            lineHeight: '1.8' 
          }}>
            Interactive SPARQL interface for manufacturing data analysis, production monitoring, and quality control insights.
          </p>

          {/* System Status Indicator */}
          {systemStatus && (
            <div style={{
              background: systemStatus.usingMockData ? '#fff3cd' : '#d1edff',
              border: `2px solid ${systemStatus.usingMockData ? '#ffc107' : '#0284c7'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {systemStatus.usingMockData ? '🎭' : '🔗'}
              </span>
              <div>
                <strong style={{ color: systemStatus.usingMockData ? '#856404' : '#0c4a6e' }}>
                  {systemStatus.usingMockData ? 'Demo Mode' : 'Production Mode'}
                </strong>
                <div style={{ fontSize: '14px', color: systemStatus.usingMockData ? '#856404' : '#075985' }}>
                  {systemStatus.usingMockData 
                    ? 'Using sample data for demonstration'
                    : `Connected to Fuseki: ${systemStatus.fusekiEndpoint}`
                  }
                </div>
                {systemStatus.usingMockData && (
                  <button
                    onClick={() => setShowSampleData(!showSampleData)}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {showSampleData ? '🔼 Hide Sample Data' : '🔽 View Sample Data'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sample Data Viewer */}
          {showSampleData && systemStatus?.usingMockData && (
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                color: '#1e40af', 
                marginBottom: '16px',
                fontSize: '24px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 Sample Manufacturing Data
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {/* Machines Data */}
                <div style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '18px' }}>
                    🏭 Manufacturing Machines (8 machines)
                  </h4>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                    Machine types: CNC Mill, Assembly Line, Quality Control Station, CNC Lathe, Injection Molding, Welding Robot, Packaging Line
                  </div>
                  <button
                    onClick={() => {
                      const machineData = `# Manufacturing Machines Data (RDF/Turtle format)
@prefix mfg: <http://example.org/manufacturing#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

mfg:M001 a mfg:Machine ;
    mfg:machineID "M001" ;
    mfg:machineType "CNC Mill" ;
    mfg:locationName "Production Floor A" ;
    mfg:installDate "2020-01-15"^^xsd:date ;
    mfg:status "Active" ;
    mfg:manufacturer "Haas Automation" ;
    mfg:model "VF-2" .

# ... (Additional machines with similar structure)`;
                      
                      const blob = new Blob([machineData], { type: 'text/turtle' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'manufacturing-machines.ttl';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📥 Download Machines Data (TTL)
                  </button>
                </div>

                {/* Production Data */}
                <div style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ color: '#10b981', marginBottom: '12px', fontSize: '18px' }}>
                    ⚙️ Production Runs (10 runs)
                  </h4>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                    Recent production data with output quantities, quality scores, timestamps, operators, and environmental conditions
                  </div>
                  <button
                    onClick={() => {
                      const productionData = `# Production Data (RDF/Turtle format)
@prefix mfg: <http://example.org/manufacturing#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

mfg:P001 a mfg:ProductionRun ;
    mfg:productionID "P001" ;
    mfg:producedBy mfg:M001 ;
    mfg:timestamp "2024-08-20T08:30:00"^^xsd:dateTime ;
    mfg:outputQuantity 160 ;
    mfg:productType "Component A" ;
    mfg:batchNumber "BATCH-086" ;
    mfg:hasQualityMeasurement mfg:QM001 .

# ... (Additional production runs with similar structure)`;
                      
                      const blob = new Blob([productionData], { type: 'text/turtle' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'production-data.ttl';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📥 Download Production Data (TTL)
                  </button>
                </div>

                {/* Quality Control Data */}
                <div style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '18px' }}>
                    ✅ Quality Control (5 inspections)
                  </h4>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                    Quality inspection results with defect counts, types, inspector details, and inspection outcomes
                  </div>
                  <button
                    onClick={() => {
                      const qualityData = `# Quality Control Data (RDF/Turtle format)
@prefix mfg: <http://example.org/manufacturing#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

mfg:QC001 a mfg:QualityInspection ;
    mfg:qualityID "QC001" ;
    mfg:inspects mfg:P001 ;
    mfg:inspectorID "INS001" ;
    mfg:inspectionDate "2024-08-20T09:30:00"^^xsd:dateTime ;
    mfg:defectCount 0 ;
    mfg:inspectionResult "Pass" ;
    mfg:notes "Excellent quality, no issues detected" .

# ... (Additional quality inspections with similar structure)`;
                      
                      const blob = new Blob([qualityData], { type: 'text/turtle' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'quality-control-data.ttl';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📥 Download Quality Data (TTL)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category Overview */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            {Object.entries(groupedQueries).map(([category, queries]) => (
              <div
                key={category}
                onClick={() => setActiveCategory(activeCategory === category ? 'all' : category)}
                style={{
                  background: activeCategory === category ? categoryColors[category] : '#ffffff',
                  color: activeCategory === category ? 'white' : categoryColors[category],
                  border: `2px solid ${categoryColors[category]}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {categoryIcons[category]}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {category}
                </h3>
                <p style={{ fontSize: '12px', margin: '0', opacity: 0.8 }}>
                  {queries.length} queries
                </p>
              </div>
            ))}
          </div>

          {/* Simple SPARQL Editor */}
          <div className="card" style={{ 
            background: '#ffffff', 
            border: '2px solid #8b5cf6',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <div style={{ borderBottom: '2px solid #f3e8ff', paddingBottom: '20px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '12px' }}>
                ⚡ Quick SPARQL Editor
              </h2>
              <p style={{ color: '#7c3aed', fontSize: '16px', margin: '0', lineHeight: '1.6' }}>
                Write and execute custom SPARQL queries against the manufacturing dataset
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Simple Editor */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '12px'
                }}>
                  <button
                    onClick={() => setCustomQuery(selectedQuery.sparql)}
                    style={{ 
                      background: '#3b82f6', 
                      color: 'white', 
                      fontSize: '12px', 
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📥 Load Selected Query
                  </button>
                  <button
                    onClick={() => {
                      const simpleQuery = `PREFIX mfg: <http://example.org/manufacturing#>

SELECT ?machine ?type WHERE {
  ?machine a mfg:Machine ;
           mfg:machineType ?type .
} LIMIT 3`;
                      setCustomQuery(simpleQuery);
                    }}
                    style={{ 
                      background: '#f59e0b', 
                      color: 'white', 
                      fontSize: '12px', 
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🧪 Load Test Query
                  </button>
                  <button
                    onClick={executeCustomQuery}
                    disabled={loading || !customQuery.trim()}
                    style={{ 
                      background: loading || !customQuery.trim() ? '#9ca3af' : '#8b5cf6', 
                      color: 'white', 
                      fontSize: '12px', 
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading || !customQuery.trim() ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {loading ? '⏳ Executing...' : '▶️ Execute Query'}
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6d28d9', 
                    marginBottom: '6px',
                    fontWeight: 'bold'
                  }}>
                    SPARQL Query Editor:
                  </div>
                  <textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder={`# Enter your SPARQL query here...

PREFIX mfg: <http://example.org/manufacturing#>

SELECT ?machine ?type WHERE {
  ?machine a mfg:Machine ;
           mfg:machineType ?type .
}`}
                    style={{
                      width: '100%',
                      height: '300px',
                      padding: '16px',
                      border: '2px solid #c4b5fd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
                      lineHeight: '1.6',
                      background: '#1e1b4b',
                      color: '#e0e7ff',
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Results Section */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '12px' }}>
                  📊 Query Results {customQueryResults.length > 0 && `(${customQueryResults.length} results)`}
                </h3>
                
                {customQueryError && (
                  <div style={{ 
                    background: '#fee2e2', 
                    border: '1px solid #fca5a5', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ color: '#dc2626', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                      ⚠️ Query Error:
                    </h4>
                    <p style={{ color: '#dc2626', fontSize: '12px', margin: '0' }}>{customQueryError}</p>
                  </div>
                )}
                
                {loading ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '40px',
                    color: '#6b7280'
                  }}>
                    <div style={{ marginRight: '12px', fontSize: '24px' }}>⏳</div>
                    <span style={{ fontSize: '16px' }}>Executing SPARQL query...</span>
                  </div>
                ) : customQueryResults.length > 0 ? (
                  <div style={{ 
                    maxHeight: '350px', 
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px' 
                  }}>
                    <table style={{ 
                      width: '100%', 
                      fontSize: '12px', 
                      borderCollapse: 'collapse'
                    }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                          {Object.keys(customQueryResults[0]).map((key) => (
                            <th key={key} style={{ 
                              border: '1px solid #e2e8f0', 
                              padding: '8px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              color: '#0c4a6e',
                              fontSize: '11px'
                            }}>
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {customQueryResults.map((row, index) => (
                          <tr key={index} style={{ 
                            background: index % 2 === 0 ? '#ffffff' : '#f8fafc' 
                          }}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} style={{ 
                                border: '1px solid #e2e8f0', 
                                padding: '8px',
                                fontSize: '11px',
                                color: '#374151'
                              }}>
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#6b7280', 
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px dashed #d1d5db'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <p style={{ fontSize: '14px', margin: '0' }}>
                      Execute a SPARQL query to see results here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '350px 1fr', 
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Query List */}
            <div className="card" style={{ 
              background: '#ffffff', 
              border: '2px solid #0ea5e9',
              textAlign: 'left',
              maxHeight: '800px',
              overflowY: 'auto'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                🔍 Available Queries {activeCategory !== 'all' && `(${activeCategory})`}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredQueries.map((query) => (
                  <div
                    key={query.id}
                    onClick={() => setSelectedQuery(query)}
                    style={{
                      padding: '12px',
                      border: `2px solid ${selectedQuery.id === query.id ? categoryColors[query.category] : '#e2e8f0'}`,
                      borderRadius: '8px',
                      background: selectedQuery.id === query.id ? categoryColors[query.category] + '10' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h4 style={{ fontWeight: 'bold', color: '#0c4a6e', fontSize: '13px' }}>
                        {categoryIcons[query.category]} {query.title}
                      </h4>
                      <span style={{ 
                        background: categoryColors[query.category], 
                        color: 'white', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '9px', 
                        fontWeight: 'bold'
                      }}>
                        {query.category}
                      </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '11px', lineHeight: '1.4' }}>{query.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Query Editor & Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Query Editor */}
              <div className="card" style={{ 
                background: '#ffffff', 
                border: '2px solid #0ea5e9',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e' }}>
                    {categoryIcons[selectedQuery.category]} {selectedQuery.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => copyToClipboard(selectedQuery.sparql)}
                      className="btn"
                      style={{ 
                        background: '#6b7280', 
                        color: 'white', 
                        fontSize: '12px', 
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      📋 Copy Query
                    </button>
                    <button
                      onClick={() => executeQuery(selectedQuery)}
                      disabled={loading}
                      className="btn"
                      style={{ 
                        background: loading ? '#9ca3af' : categoryColors[selectedQuery.category], 
                        color: 'white',
                        fontSize: '12px', 
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? '⏳ Executing...' : '▶️ Execute Query'}
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  background: '#f1f5f9', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  marginBottom: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ color: '#475569', fontSize: '14px', margin: '0', fontWeight: '500' }}>
                    {selectedQuery.description}
                  </p>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '8px' }}>
                    SPARQL Query:
                  </h4>
                  <pre style={{ 
                    background: '#1f2937', 
                    color: '#f9fafb',
                    padding: '16px', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    overflow: 'auto',
                    border: '1px solid #374151',
                    fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
                    lineHeight: '1.5'
                  }}>
                    {selectedQuery.sparql}
                  </pre>
                </div>
                
                <div style={{ 
                  background: '#dbeafe', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #93c5fd'
                }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', marginBottom: '6px' }}>
                    Expected Results:
                  </h4>
                  <p style={{ fontSize: '12px', color: '#1e3a8a', margin: '0' }}>
                    {selectedQuery.expectedResults}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="card" style={{ 
                background: '#ffffff', 
                border: '2px solid #0ea5e9',
                textAlign: 'left'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                  📊 Query Results {results.length > 0 && `(${results.length} results)`}
                </h3>
                
                {error && (
                  <div style={{ 
                    background: '#fee2e2', 
                    border: '1px solid #fca5a5', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '16px'
                  }}>
                    <h4 style={{ color: '#dc2626', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                      ⚠️ Query Error:
                    </h4>
                    <p style={{ color: '#dc2626', fontSize: '12px', margin: '0' }}>{error}</p>
                  </div>
                )}
                
                {loading ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '60px',
                    color: '#6b7280'
                  }}>
                    <div style={{ marginRight: '12px', fontSize: '24px' }}>⏳</div>
                    <span style={{ fontSize: '16px' }}>Executing SPARQL query...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ 
                      width: '100%', 
                      fontSize: '12px', 
                      borderCollapse: 'collapse'
                    }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {Object.keys(results[0]).map((key) => (
                            <th key={key} style={{ 
                              border: '1px solid #e2e8f0', 
                              padding: '12px 8px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              color: '#0c4a6e',
                              fontSize: '11px',
                              textTransform: 'uppercase'
                            }}>
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row, index) => (
                          <tr key={index} style={{ 
                            background: index % 2 === 0 ? '#ffffff' : '#f8fafc' 
                          }}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} style={{ 
                                border: '1px solid #e2e8f0', 
                                padding: '8px',
                                fontSize: '11px',
                                color: '#374151'
                              }}>
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '60px', 
                    color: '#6b7280', 
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px dashed #d1d5db'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <p style={{ fontSize: '14px', margin: '0' }}>
                      Click "Execute Query" to see results here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingQueriesPage;
