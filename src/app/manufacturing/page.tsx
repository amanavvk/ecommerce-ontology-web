'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ManufacturingOntologyViewer = dynamic(() => import('@/components/manufacturing-ontology-viewer'), {
  loading: () => <p>Loading ontology visualization...</p>,
  ssr: false
});

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactElement;
}

export default function ManufacturingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '🏭',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🏭</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
            Manufacturing Ontology
          </h2>
          <p style={{ fontSize: '18px', color: '#075985', marginBottom: '32px', lineHeight: '1.6' }}>
            Complete R2RML-based manufacturing data integration with semantic validation, 
            machine learning analytics, and real-time production monitoring.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginTop: '32px'
          }}>
            <div className="card" style={{ background: '#dbeafe', border: '2px solid #3b82f6' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                Machine Management
              </h3>
              <p style={{ fontSize: '14px', color: '#1e3a8a' }}>
                Track machines, equipment, and production lines with detailed specifications
              </p>
            </div>
            
            <div className="card" style={{ background: '#dcfce7', border: '2px solid #10b981' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '8px' }}>
                Production Analytics
              </h3>
              <p style={{ fontSize: '14px', color: '#064e3b' }}>
                Analyze production runs, quality metrics, and efficiency patterns
              </p>
            </div>
            
            <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
                Quality Control
              </h3>
              <p style={{ fontSize: '14px', color: '#78350f' }}>
                Monitor quality measurements and validation across all processes
              </p>
            </div>
            
            <div className="card" style={{ background: '#ede9fe', border: '2px solid #8b5cf6' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '8px' }}>
                Performance Optimization
              </h3>
              <p style={{ fontSize: '14px', color: '#581c87' }}>
                Optimize production efficiency using semantic data insights
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'r2rml',
      label: 'R2RML Mapping',
      icon: '🗂️',
      content: (
        <div style={{ textAlign: 'left' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🗂️</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '8px' }}>
              R2RML Data Mapping
            </h2>
            <p style={{ fontSize: '16px', color: '#075985' }}>
              Relational database to RDF mapping for manufacturing data
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px'
          }}>
            <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0ea5e9' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                📋 Mapping Overview
              </h3>
              <ul style={{ color: '#075985', fontSize: '14px', lineHeight: '1.8' }}>
                <li><strong>Machines Table</strong> → Machine Class</li>
                <li><strong>Production Runs</strong> → Production Events</li>
                <li><strong>Quality Metrics</strong> → Quality Measurements</li>
                <li><strong>Maintenance Records</strong> → Maintenance Events</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0ea5e9' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                ⚡ Key Features
              </h3>
              <ul style={{ color: '#075985', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Automatic URI generation</li>
                <li>Data type validation</li>
                <li>Relationship mapping</li>
                <li>Incremental updates</li>
              </ul>
            </div>
          </div>
          
          <div style={{ marginTop: '32px' }}>
            <div className="card" style={{ background: '#f8fafc', border: '2px solid #64748b' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
                📝 Sample R2RML Mapping
              </h3>
              <pre style={{ 
                background: '#f1f5f9', 
                padding: '16px', 
                borderRadius: '8px', 
                fontSize: '12px', 
                overflow: 'auto',
                border: '1px solid #cbd5e1',
                fontFamily: 'monospace',
                color: '#374151'
              }}>
{`@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix mfg: <http://example.org/manufacturing#> .

<#MachineMap> a rr:TriplesMap ;
  rr:logicalTable [ rr:tableName "machines" ] ;
  rr:subjectMap [
    rr:template "http://example.org/manufacturing/data/machine/{machine_id}" ;
    rr:class mfg:Machine
  ] ;
  rr:predicateObjectMap [
    rr:predicate mfg:machineID ;
    rr:objectMap [ rr:column "machine_id" ]
  ] .`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: '✅',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>✅</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
            Data Validation
          </h2>
          <p style={{ fontSize: '18px', color: '#075985', marginBottom: '32px', lineHeight: '1.6' }}>
            Comprehensive validation tools for manufacturing data integrity and semantic consistency.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginTop: '32px'
          }}>
            <div className="card" style={{ background: '#dcfce7', border: '2px solid #10b981', textAlign: 'left' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', textAlign: 'center' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '12px' }}>
                Schema Validation
              </h3>
              <ul style={{ fontSize: '14px', color: '#064e3b', lineHeight: '1.6' }}>
                <li>OWL consistency checking</li>
                <li>SHACL constraint validation</li>
                <li>Data type verification</li>
                <li>Cardinality constraints</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: '#dbeafe', border: '2px solid #3b82f6', textAlign: 'left' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', textAlign: 'center' }}>📊</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px' }}>
                Data Quality
              </h3>
              <ul style={{ fontSize: '14px', color: '#1e3a8a', lineHeight: '1.6' }}>
                <li>Completeness analysis</li>
                <li>Accuracy validation</li>
                <li>Duplicate detection</li>
                <li>Range validation</li>
              </ul>
            </div>
            
            <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b', textAlign: 'left' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', textAlign: 'center' }}>⚠️</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '12px' }}>
                Error Reporting
              </h3>
              <ul style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.6' }}>
                <li>Detailed error logs</li>
                <li>Validation reports</li>
                <li>Issue categorization</li>
                <li>Fix recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'demo',
      label: 'Live Demo',
      icon: '🎮',
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🎮</div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '16px' }}>
            Interactive Demo
          </h2>
          <p style={{ fontSize: '18px', color: '#075985', marginBottom: '32px', lineHeight: '1.6' }}>
            Explore manufacturing data with real-time queries and visual analytics.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginTop: '32px'
          }}>
            <div className="card" style={{ background: '#ede9fe', border: '2px solid #8b5cf6' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b21a8', marginBottom: '8px' }}>
                Query Interface
              </h3>
              <p style={{ fontSize: '14px', color: '#581c87' }}>
                Interactive SPARQL queries for manufacturing data exploration
              </p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '16px', background: '#8b5cf6' }}
                onClick={() => router.push('/manufacturing/queries')}
              >
                Open Queries →
              </button>
            </div>
            
            <div className="card" style={{ background: '#ecfdf5', border: '2px solid #10b981' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📈</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '8px' }}>
                Analytics Dashboard
              </h3>
              <p style={{ fontSize: '14px', color: '#064e3b' }}>
                Real-time production metrics and performance insights
              </p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '16px', background: '#10b981' }}
                onClick={() => router.push('/manufacturing/analytics')}
              >
                View Dashboard →
              </button>
            </div>
            
            <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔧</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
                Validation Tools
              </h3>
              <p style={{ fontSize: '14px', color: '#78350f' }}>
                Data quality validation and error detection tools
              </p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '16px', background: '#f59e0b' }}
                onClick={() => router.push('/manufacturing/validation')}
              >
                Run Validation →
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ontology',
      label: 'Ontology Visualization',
      icon: '🔗',
      content: (
        <div style={{ textAlign: 'left' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔗</div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '8px' }}>
              Manufacturing Ontology Graph
            </h2>
            <p style={{ fontSize: '16px', color: '#075985' }}>
              Interactive visualization of manufacturing classes, properties, and relationships
            </p>
          </div>
          
          <ManufacturingOntologyViewer />
        </div>
      )
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)',
      padding: '40px 20px'
    }}>
      
      <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <div className="card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '24px', 
            color: '#0c4a6e',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Manufacturing <span style={{ color: '#0284c7' }}>Ontology Platform</span>
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#075985', 
            marginBottom: '32px', 
            lineHeight: '1.8' 
          }}>
            Semantic manufacturing data integration with R2RML mapping, SPARQL analytics, and comprehensive validation.
          </p>

          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn"
                style={{
                  background: activeTab === tab.id ? '#0284c7' : '#e0f2fe',
                  color: activeTab === tab.id ? 'white' : '#0c4a6e',
                  border: activeTab === tab.id ? '2px solid #0284c7' : '2px solid #0ea5e9',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            padding: '32px',
            border: '2px solid #0ea5e9',
            minHeight: '400px'
          }}>
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
