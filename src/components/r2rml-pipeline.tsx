import React, { useState, useEffect } from 'react';
import { Database, Download, Play, CheckCircle, AlertCircle, FileText, Cpu } from 'lucide-react';

interface R2RMLPipelineProps {
  r2rmlMapping?: string;
  data: any[];
  filename?: string;
}

interface ProcessingResult {
  success: boolean;
  rdf?: string;
  statistics?: {
    totalTriples: number;
    subjects: number;
    predicates: number;
    objects: number;
  };
  error?: string;
  exportData?: {
    filename: string;
    content: string;
    mimeType: string;
  };
}

const R2RMLPipeline: React.FC<R2RMLPipelineProps> = ({ r2rmlMapping, data, filename }) => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: 'Parse R2RML Mapping', icon: FileText, description: 'Analyzing R2RML mapping structure' },
    { name: 'Process Data', icon: Cpu, description: 'Generating RDF triples from data' },
    { name: 'Load Triple Store', icon: Database, description: 'Loading RDF into queryable store' },
    { name: 'Ready for Queries', icon: CheckCircle, description: 'Available for SPARQL analytics' }
  ];

  const processR2RML = async () => {
    if (!r2rmlMapping || !data.length) return;

    setProcessing(true);
    setResult(null);
    setCurrentStep(0);

    try {
      // Step 1: Parse R2RML Mapping
      setCurrentStep(0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Process Data
      setCurrentStep(1);
      const response = await fetch('/api/r2rml-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          r2rmlMapping,
          data,
          format: 'turtle'
        })
      });

      const processResult = await response.json();
      
      if (!processResult.success) {
        throw new Error(processResult.error || 'R2RML processing failed');
      }

      // Step 3: Load into Triple Store
      setCurrentStep(2);
      const tripleStoreResponse = await fetch('/api/triple-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rdfData: processResult.rdf,
          query: 'SELECT * WHERE { ?s ?p ?o } LIMIT 10'
        })
      });

      const tripleStoreResult = await tripleStoreResponse.json();
      
      // Also store in SPARQL endpoint for querying
      await fetch('/api/sparql-uploaded', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rdfData: processResult.rdf,
          datasetId: 'latest',
          originalData: data  // Pass original data for better querying
        })
      });
      
      // Step 4: Complete
      setCurrentStep(3);
      
      setResult({
        success: true,
        rdf: processResult.rdf,
        statistics: processResult.statistics,
        exportData: tripleStoreResult.exportData
      });

    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadRDF = () => {
    if (result?.rdf) {
      const blob = new Blob([result.rdf], { type: 'text/turtle' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename || 'generated'}-rdf-triples.ttl`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadR2RML = () => {
    if (r2rmlMapping) {
      const blob = new Blob([r2rmlMapping], { type: 'text/turtle' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename || 'mapping'}.r2rml.ttl`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* R2RML Mapping Display */}
      {r2rmlMapping && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Generated R2RML Mapping
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              <button
                onClick={processR2RML}
                disabled={processing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: processing ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Play size={16} style={{ marginRight: '0.5rem' }} />
                {processing ? 'Processing...' : 'Process R2RML'}
              </button>
            </div>
          </div>
          <pre style={{
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '200px',
            fontSize: '0.875rem',
            border: '1px solid #e2e8f0'
          }}>
            {r2rmlMapping}
          </pre>
        </div>
      )}

      {/* Processing Pipeline */}
      {processing && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <h5 style={{ fontWeight: '600', color: '#0369a1', marginBottom: '1rem' }}>
            R2RML Processing Pipeline
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: isActive ? '#dbeafe' : isComplete ? '#dcfce7' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isActive ? '#3b82f6' : isComplete ? '#22c55e' : '#e2e8f0'}`
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#3b82f6' : isComplete ? '#22c55e' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    {isActive ? (
                      <Cpu size={20} style={{ color: 'white', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <StepIcon size={20} style={{ color: 'white' }} />
                    )}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: isActive ? '#1e40af' : isComplete ? '#166534' : '#374151'
                    }}>
                      {step.name}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: isActive ? '#3b82f6' : isComplete ? '#22c55e' : '#6b7280'
                    }}>
                      {step.description}
                    </div>
                  </div>
                  {isComplete && (
                    <CheckCircle size={24} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginBottom: '1rem' }}>
          {result.success ? (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #22c55e',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <CheckCircle size={32} style={{ color: '#22c55e', marginRight: '1rem' }} />
                <div>
                  <h5 style={{ fontWeight: '600', color: '#166534', fontSize: '1.2rem' }}>
                    R2RML Processing Complete!
                  </h5>
                  <p style={{ color: '#16a34a', margin: 0 }}>
                    RDF triples generated and loaded into triple store
                  </p>
                </div>
              </div>

              {/* Statistics */}
              {result.statistics && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
                      {result.statistics.totalTriples}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#22c55e' }}>Total Triples</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
                      {result.statistics.subjects}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#22c55e' }}>Subjects</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
                      {result.statistics.predicates}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#22c55e' }}>Predicates</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
                      {result.statistics.objects}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#22c55e' }}>Objects</div>
                  </div>
                </div>
              )}

              {/* Download Options */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={downloadRDF}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <Download size={16} style={{ marginRight: '0.5rem' }} />
                  Download RDF Triples
                </button>
                <button
                  onClick={() => window.open('/api/triple-store?format=turtle')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <Database size={16} style={{ marginRight: '0.5rem' }} />
                  Export from Triple Store
                </button>
              </div>

              {/* RDF Preview */}
              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#166534' }}>
                  View Generated RDF Triples
                </summary>
                <pre style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '300px',
                  fontSize: '0.875rem',
                  border: '1px solid #22c55e',
                  marginTop: '0.5rem'
                }}>
                  {result.rdf}
                </pre>
              </details>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={32} style={{ color: '#ef4444', marginRight: '1rem' }} />
                <div>
                  <h5 style={{ fontWeight: '600', color: '#dc2626', fontSize: '1.2rem' }}>
                    Processing Failed
                  </h5>
                  <p style={{ color: '#dc2626', margin: 0 }}>
                    {result.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default R2RMLPipeline;
