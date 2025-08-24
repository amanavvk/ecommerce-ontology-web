'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Database, Cpu, CheckCircle, AlertCircle, Download } from 'lucide-react';
import R2RMLPipeline from '@/components/r2rml-pipeline';
import SPARQLQueryInterface from '@/components/sparql-query-interface';

interface UploadResult {
  success: boolean;
  dataset?: any;
  r2rmlMapping?: string;
  preview?: any[];
  analytics?: any;
  error?: string;
}

const DataUploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('processingType', 'auto');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadR2RML = () => {
    if (uploadResult?.r2rmlMapping) {
      const blob = new Blob([uploadResult.r2rmlMapping], { type: 'text/turtle' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${uploadResult.dataset?.filename || 'mapping'}.r2rml.ttl`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            Data Upload & R2RML Processing
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Upload your manufacturing data (CSV, JSON, SQL) and automatically generate R2RML mappings for semantic integration
          </p>
        </div>

        {/* R2RML Case Study Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
            🏭 R2RML Manufacturing Case Study
          </h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Integration of Legacy Manufacturing Database with Modern IoT Systems
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Database Schema */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f8faff', borderRadius: '12px', border: '2px solid #667eea' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Database size={20} style={{ marginRight: '0.5rem' }} />
                Source Database
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
                <strong>Machine Table:</strong><br />
                MachineID, Type, Location, InstallDate<br /><br />
                <strong>Production Table:</strong><br />
                ProductionID, MachineID, Timestamp, Output_Quantity, Quality_Score<br /><br />
                <strong>Sample Data:</strong> 8 machines, 20+ production runs
              </div>
            </div>

            {/* R2RML Mappings */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f0fff4', borderRadius: '12px', border: '2px solid #10b981' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <FileText size={20} style={{ marginRight: '0.5rem' }} />
                R2RML Mappings
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
                <strong>Entity Mappings:</strong><br />
                Machine → mfg:Machine<br />
                Production → mfg:ProductionRun<br /><br />
                <strong>Advanced Features:</strong><br />
                • Conditional mappings<br />
                • Aggregate calculations<br />
                • IoT integration points
              </div>
            </div>

            {/* Generated RDF */}
            <div style={{ padding: '1.5rem', backgroundColor: '#fffbf0', borderRadius: '12px', border: '2px solid #f59e0b' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Cpu size={20} style={{ marginRight: '0.5rem' }} />
                RDF Output
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
                <strong>Generated Triples:</strong><br />
                • 8 Machine entities<br />
                • 20 Production runs<br />
                • 17 Quality measurements<br />
                • 156+ total triples<br /><br />
                <strong>Queryable via SPARQL</strong>
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
              R2RML Integration Process
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <Database size={32} style={{ color: '#667eea', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>Legacy Database</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>SQL Tables</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: '#d1d5db' }}>→</div>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <FileText size={32} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>R2RML Mappings</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Transformation Rules</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: '#d1d5db' }}>→</div>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <Cpu size={32} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>RDF Triples</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Semantic Data</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: '#d1d5db' }}>→</div>
              <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                <CheckCircle size={32} style={{ color: '#8b5cf6', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>SPARQL Queries</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Analytics & IoT</div>
              </div>
            </div>
          </div>

          {/* Download Sample Files */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <button 
              style={{
                padding: '1rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onClick={() => window.open('/data/sample-manufacturing-db.sql', '_blank')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a67d8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
            >
              <Download size={20} style={{ marginRight: '0.5rem' }} />
              Sample Database SQL
            </button>
            <button 
              style={{
                padding: '1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onClick={() => window.open('/r2rml/manufacturing-mappings.ttl', '_blank')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              <Download size={20} style={{ marginRight: '0.5rem' }} />
              R2RML Mappings
            </button>
            <button 
              style={{
                padding: '1rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onClick={() => window.open('/data/sample-output.ttl', '_blank')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
            >
              <Download size={20} style={{ marginRight: '0.5rem' }} />
              Sample RDF Output
            </button>
            <button 
              style={{
                padding: '1rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onClick={() => window.open('/docs/R2RML-Integration-Process.md', '_blank')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            >
              <Download size={20} style={{ marginRight: '0.5rem' }} />
              Process Documentation
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div
            style={{
              border: dragActive ? '3px dashed #667eea' : '3px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: dragActive ? '#f8faff' : '#f8fafc',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              accept=".csv,.json,.sql"
              onChange={handleFileInput}
            />
            
            {uploading ? (
              <div>
                <Cpu size={48} style={{ color: '#667eea', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '1.2rem', color: '#4a5568', fontWeight: '600' }}>
                  Processing your data...
                </p>
                <p style={{ color: '#718096' }}>
                  Analyzing structure and generating R2RML mappings
                </p>
              </div>
            ) : (
              <div>
                <Upload size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                <p style={{ fontSize: '1.2rem', color: '#4a5568', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Drop your data file here or click to browse
                </p>
                <p style={{ color: '#718096' }}>
                  Supports CSV, JSON, and SQL files
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {uploadResult.success ? (
              <div>
                {/* Success Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <CheckCircle size={32} style={{ color: '#10b981', marginRight: '1rem' }} />
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                      Data Processed Successfully!
                    </h3>
                    <p style={{ color: '#6b7280' }}>
                      {uploadResult.dataset?.filename} - {uploadResult.analytics?.totalRecords} records
                    </p>
                  </div>
                </div>

                {/* Analytics */}
                {uploadResult.analytics && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                        {uploadResult.analytics.totalRecords}
                      </div>
                      <div style={{ color: '#6b7280' }}>Total Records</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                        {uploadResult.analytics.columns}
                      </div>
                      <div style={{ color: '#6b7280' }}>Columns Detected</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                        ✓
                      </div>
                      <div style={{ color: '#6b7280' }}>R2RML Generated</div>
                    </div>
                  </div>
                )}

                {/* Data Preview */}
                {uploadResult.preview && uploadResult.preview.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                      Data Preview (First 5 Records)
                    </h4>
                    <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                          <tr>
                            {Object.keys(uploadResult.preview[0]).map(key => (
                              <th key={key} style={{ 
                                padding: '0.75rem', 
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
                          {uploadResult.preview.map((row, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td key={cellIndex} style={{ 
                                  padding: '0.75rem',
                                  color: '#6b7280'
                                }}>
                                  {String(value).substring(0, 50)}
                                  {String(value).length > 50 ? '...' : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* R2RML Mapping */}
                {uploadResult.r2rmlMapping && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        Generated R2RML Mapping
                      </h4>
                      <button
                        onClick={downloadR2RML}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        <Download size={16} style={{ marginRight: '0.5rem' }} />
                        Download R2RML
                      </button>
                    </div>
                    <pre style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontSize: '0.875rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      {uploadResult.r2rmlMapping}
                    </pre>
                  </div>
                )}

                {/* R2RML Processing Pipeline */}
                <R2RMLPipeline
                  r2rmlMapping={uploadResult.r2rmlMapping}
                  data={uploadResult.preview || []}
                  filename={uploadResult.dataset?.filename}
                />

                {/* Next Steps */}
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <h5 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
                    ✅ Complete R2RML Processing Pipeline:
                  </h5>
                  <ul style={{ color: '#1e40af', paddingLeft: '1.5rem' }}>
                    <li>✓ R2RML mapping generated automatically</li>
                    <li>✓ Built-in R2RML processor (equivalent to D2RQ/RML-Mapper)</li>
                    <li>✓ RDF triples generated and loaded into triple store</li>
                    <li>✓ SPARQL querying interface available below</li>
                    <li>✓ Download options for R2RML and RDF files</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={32} style={{ color: '#ef4444', marginRight: '1rem' }} />
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                    Upload Failed
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {uploadResult.error || 'An unexpected error occurred'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SPARQL Query Interface */}
        <SPARQLQueryInterface 
          rdfLoaded={uploadResult?.success || false}
          tripleCount={uploadResult?.preview?.length || 0}
          uploadedData={uploadResult?.preview || []}
        />

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '3rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white'
          }}>
            <FileText size={32} style={{ marginBottom: '1rem', color: '#fbbf24' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Multiple Formats
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Supports CSV, JSON, and SQL files with automatic structure detection
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white'
          }}>
            <Database size={32} style={{ marginBottom: '1rem', color: '#34d399' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              R2RML Generation
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Automatically creates R2RML mappings for semantic data integration
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white'
          }}>
            <Cpu size={32} style={{ marginBottom: '1rem', color: '#a78bfa' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Smart Analysis
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Analyzes data types, relationships, and recommends ontology mappings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploadPage;
