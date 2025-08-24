'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ValidationResult {
  category: string;
  passed: number;
  failed: number;
  warnings: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface ValidationIssue {
  type: 'error' | 'warning';
  category: string;
  message: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

export default function ManufacturingValidation() {
  const router = useRouter();
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  const runValidation = async () => {
    setIsValidating(true);
    setValidationComplete(false);
    
    try {
      const response = await fetch('/api/manufacturing-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Validation API request failed');
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        setIssues(data.issues);
        setValidationComplete(true);
      } else {
        throw new Error(data.error || 'Validation failed');
      }
    } catch (error) {
      console.error('Validation error:', error);
      // Fallback to show error
      setResults([
        {
          category: 'Validation Error',
          passed: 0,
          failed: 1,
          warnings: 0,
          icon: '❌',
          color: '#dc2626',
          bgColor: '#fef2f2'
        }
      ]);
      setIssues([
        {
          type: 'error',
          category: 'System Error',
          message: `Validation system error: ${error instanceof Error ? error.message : String(error)}`,
          location: 'Validation API',
          severity: 'high'
        }
      ]);
      setValidationComplete(true);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    // Auto-run validation on page load
    runValidation();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getIssueIcon = (type: string) => {
    return type === 'error' ? '❌' : '⚠️';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)',
      padding: '40px 20px'
    }}>
      <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <div className="card" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#0c4a6e',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              margin: 0
            }}>
              🔧 Manufacturing Data Validation
            </h1>
            <button 
              className="btn"
              style={{ background: '#64748b', color: 'white' }}
              onClick={() => router.push('/manufacturing')}
            >
              ← Back to Manufacturing
            </button>
          </div>
          
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '32px',
            border: '2px solid #0ea5e9',
            textAlign: 'left'
          }}>
            {/* Validation Controls */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                🎯 Data Validation Suite
              </h2>
              <p style={{ fontSize: '16px', color: '#075985', marginBottom: '24px' }}>
                Real-time validation of R2RML mappings, ontology files, sample data, and schema compliance
              </p>
              
              <button 
                className="btn btn-primary"
                style={{ 
                  background: isValidating ? '#6b7280' : '#0ea5e9',
                  fontSize: '16px',
                  padding: '12px 24px',
                  marginBottom: '16px'
                }}
                onClick={runValidation}
                disabled={isValidating}
              >
                {isValidating ? '🔄 Validating...' : '🚀 Run Full Validation'}
              </button>

              {isValidating && (
                <div style={{ 
                  background: '#f0f9ff', 
                  border: '2px solid #0ea5e9',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '16px'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
                  <div style={{ color: '#0c4a6e', fontWeight: 'bold' }}>
                    Validation in progress...
                  </div>
                  <div style={{ fontSize: '14px', color: '#075985', marginTop: '4px' }}>
                    Analyzing R2RML files, ontology structure, and sample data integrity
                  </div>
                </div>
              )}
            </div>

            {/* Validation Results */}
            {validationComplete && (
              <>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '20px' }}>
                    📊 Validation Results Summary
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '16px'
                  }}>
                    {results.map((result, index) => (
                      <div 
                        key={index}
                        className="card" 
                        style={{ 
                          background: result.bgColor, 
                          border: `2px solid ${result.color}`,
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>{result.icon}</div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: result.color, marginBottom: '12px' }}>
                          {result.category}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                              {result.passed}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Passed</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                              {result.failed}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Failed</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
                              {result.warnings}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Warnings</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues List */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '20px' }}>
                    🚨 Issues & Recommendations
                  </h2>
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                  }}>
                    {issues.map((issue, index) => (
                      <div 
                        key={index}
                        style={{ 
                          padding: '20px',
                          borderBottom: index < issues.length - 1 ? '1px solid #e5e7eb' : 'none',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        <div style={{ fontSize: '24px' }}>{getIssueIcon(issue.type)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ 
                              fontSize: '12px',
                              fontWeight: 'bold',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: issue.type === 'error' ? '#fef2f2' : '#fefbf2',
                              color: issue.type === 'error' ? '#dc2626' : '#f59e0b'
                            }}>
                              {issue.type.toUpperCase()}
                            </span>
                            <span style={{ 
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: '#f3f4f6',
                              color: '#374151'
                            }}>
                              {issue.category}
                            </span>
                            <span style={{ 
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: getSeverityColor(issue.severity)
                            }}>
                              {issue.severity.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                            {issue.message}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            📍 {issue.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validation Categories */}
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '20px' }}>
                    🔍 Validation Categories
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                    gap: '20px'
                  }}>
                    <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0ea5e9' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '12px' }}>
                        🗂️ R2RML Mapping Validation
                      </h3>
                      <ul style={{ color: '#075985', fontSize: '14px', lineHeight: '1.8' }}>
                        <li>Mapping syntax validation</li>
                        <li>Subject-predicate-object consistency</li>
                        <li>URI template validation</li>
                        <li>Data type mapping verification</li>
                      </ul>
                    </div>

                    <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '12px' }}>
                        🔍 Data Integrity Checks
                      </h3>
                      <ul style={{ color: '#064e3b', fontSize: '14px', lineHeight: '1.8' }}>
                        <li>Foreign key constraint validation</li>
                        <li>Referential integrity checks</li>
                        <li>Null value validation</li>
                        <li>Duplicate detection</li>
                      </ul>
                    </div>

                    <div className="card" style={{ background: '#ede9fe', border: '2px solid #8b5cf6' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '12px' }}>
                        📋 Schema Validation
                      </h3>
                      <ul style={{ color: '#581c87', fontSize: '14px', lineHeight: '1.8' }}>
                        <li>Ontology structure validation</li>
                        <li>Required property checks</li>
                        <li>Class hierarchy validation</li>
                        <li>Property domain/range validation</li>
                      </ul>
                    </div>

                    <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>
                        ✅ Data Quality Metrics
                      </h3>
                      <ul style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.8' }}>
                        <li>Completeness analysis</li>
                        <li>Accuracy validation</li>
                        <li>Consistency checks</li>
                        <li>Outlier detection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px'
              }}>
                <button 
                  className="btn btn-primary"
                  style={{ background: '#0ea5e9' }}
                  onClick={() => router.push('/manufacturing/analytics')}
                >
                  📊 View Analytics
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ background: '#10b981' }}
                  onClick={() => router.push('/manufacturing/queries')}
                >
                  🔍 Run Queries
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ background: '#8b5cf6' }}
                  onClick={() => router.push('/data-upload')}
                >
                  📤 Upload Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
