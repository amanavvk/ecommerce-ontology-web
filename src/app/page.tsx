'use client';
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)',
      padding: '40px 20px'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px', 
            color: '#1e40af',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            📚 Complete Case Study <span style={{ color: '#3b82f6' }}>Deliverables</span>
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#1d4ed8', 
            marginBottom: '24px', 
            lineHeight: '1.8' 
          }}>
            Comprehensive implementation of E-Commerce Ontology and R2RML Manufacturing Integration
          </p>

          <div style={{ 
            background: '#dbeafe', 
            border: '2px solid #93c5fd', 
            borderRadius: '12px', 
            padding: '20px', 
            marginTop: '20px' 
          }}>
            <h2 style={{ color: '#1e40af', fontSize: '24px', marginBottom: '16px' }}>
              🎯 Navigation Guide
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', 
              textAlign: 'left' 
            }}>
              <div>
                <strong style={{ color: '#1d4ed8' }}>📊 Ontology:</strong> <br />
                E-Commerce ontology viewer with graph visualization
              </div>
              <div>
                <strong style={{ color: '#1d4ed8' }}>🔍 Queries:</strong> <br />
                15+ SPARQL queries for product search & recommendations
              </div>
              <div>
                <strong style={{ color: '#1d4ed8' }}>✅ Validation:</strong> <br />
                Data quality checks and constraint validation
              </div>
              <div>
                <strong style={{ color: '#1d4ed8' }}>🏭 Manufacturing:</strong> <br />
                Manufacturing ontology and production analytics
              </div>
              <div>
                <strong style={{ color: '#1d4ed8' }}>📈 Data Upload:</strong> <br />
                R2RML integration and database mapping tools
              </div>
            </div>
          </div>
        </div>

        {/* Case Study 1: E-Commerce */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            color: '#1e40af', 
            marginBottom: '24px',
            borderBottom: '3px solid #3b82f6',
            paddingBottom: '8px'
          }}>
            🛒 Ontology Case Study: E-Commerce Product Classification System
          </h2>
          
          {/* Scenario Description */}
          <div style={{ 
            background: '#f0f9ff', 
            border: '2px solid #7dd3fc', 
            borderRadius: '12px', 
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#0c4a6e', fontSize: '20px', marginBottom: '16px' }}>
              📋 Scenario & Challenge
            </h3>
            <p style={{ color: '#075985', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>Scenario:</strong> You are tasked with developing an ontology for a large-scale e-commerce platform that needs to organize and classify products across multiple categories, manage inventory, and enable smart product recommendations.
            </p>
            <p style={{ color: '#075985', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>Challenge:</strong> Design an ontology that can:
            </p>
            <ol style={{ color: '#075985', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Classify products hierarchically</li>
              <li>Handle product relationships</li>
              <li>Support search and recommendation systems</li>
              <li>Manage inventory and pricing logic</li>
            </ol>
            <p style={{ color: '#075985', lineHeight: '1.8', marginTop: '16px' }}>
              <strong>Requirements:</strong> The ontology should be in OWL format, follow best practices, ensure reuse of ontologies, support scalability, and include explanation on IRI choice. Supporting use case SPARQL queries should be provided along with OWL file.
            </p>
            
            <div style={{ 
              background: '#ecfccb', 
              border: '2px solid #a3e635', 
              borderRadius: '8px', 
              padding: '16px', 
              marginTop: '16px' 
            }}>
              <p style={{ color: '#365314', lineHeight: '1.8', margin: '0', fontSize: '14px' }}>
                <strong>📡 Deployment Note:</strong> Initially developed with Apache Fuseki SPARQL endpoint for local testing. 
                For production deployment on Vercel, the system seamlessly uses data2 TTL files directly to ensure 
                all queries return real data matching your ontology structure.
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ 
              background: '#eff6ff', 
              border: '2px solid #bfdbfe', 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <h3 style={{ color: '#1d4ed8', fontSize: '20px', marginBottom: '16px' }}>
                ✅ Requirements Fulfilled
              </h3>
              <ul style={{ color: '#2563eb', lineHeight: '1.8' }}>
                <li>✅ Hierarchical product classification (20 categories)</li>
                <li>✅ Product relationships (related, compatible, substitutable)</li>
                <li>✅ Search & recommendation systems (15+ SPARQL queries)</li>
                <li>✅ Inventory & pricing logic (100 sample products)</li>
                <li>✅ OWL format with best practices (4 modular files)</li>
                <li>✅ IRI design rationale documentation</li>
                <li>✅ Scalable modular architecture</li>
              </ul>
            </div>
            
            <div style={{ 
              background: '#f0fdf4', 
              border: '2px solid #bbf7d0', 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <h3 style={{ color: '#166534', fontSize: '20px', marginBottom: '16px' }}>
                🎯 Check This - Click Here!
              </h3>
              <div style={{ color: '#15803d', lineHeight: '2.0' }}>
                <Link href="/ontology" style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  textDecoration: 'none', 
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0'
                }}>
                  📊 <strong>View Ontology:</strong> Interactive graph visualization of e-commerce ontology
                </Link>
                <Link href="/queries" style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  textDecoration: 'none', 
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0'
                }}>
                  🔍 <strong>SPARQL Queries:</strong> Execute 15+ use case queries for recommendations
                </Link>
                <Link href="/validation" style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  textDecoration: 'none', 
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0'
                }}>
                  ✅ <strong>Validation:</strong> Data quality checks and constraint validation
                </Link>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#fef3c7', 
            border: '2px solid #fcd34d', 
            borderRadius: '12px', 
            padding: '20px', 
            marginTop: '20px' 
          }}>
            <h3 style={{ color: '#92400e', fontSize: '18px', marginBottom: '12px' }}>
              � Complete Deliverables Available
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', 
              color: '#b45309' 
            }}>
              <div><strong>OWL Files:</strong> 4 modular ontologies</div>
              <div><strong>SPARQL Queries:</strong> 15+ use cases</div>
              <div><strong>Sample Data:</strong> 100 products, 20 categories</div>
              <div><strong>Documentation:</strong> IRI design rationale</div>
              <div><strong>Validation:</strong> Constraint checking</div>
            </div>
          </div>
        </div>

        {/* Case Study 2: R2RML Manufacturing */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            color: '#1e40af', 
            marginBottom: '24px',
            borderBottom: '3px solid #3b82f6',
            paddingBottom: '8px'
          }}>
            🏭 R2RML Case Study: Integration of Legacy Manufacturing Database with Modern IoT Systems
          </h2>
          
          {/* Background Description */}
          <div style={{ 
            background: '#f0f9ff', 
            border: '2px solid #7dd3fc', 
            borderRadius: '12px', 
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#0c4a6e', fontSize: '20px', marginBottom: '16px' }}>
              🏗️ Background & Requirements
            </h3>
            <p style={{ color: '#075985', lineHeight: '1.8', marginBottom: '16px' }}>
              <strong>Background:</strong> A manufacturing facility needs to integrate its legacy relational database containing historical manufacturing data with a new IoT-based monitoring system. The goal is to create RDF mappings using R2RML to enable semantic interoperability.
            </p>
            
            <p style={{ color: '#075985', lineHeight: '1.8', marginBottom: '12px' }}>
              <strong>Sample Tables:</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <code style={{ 
                background: '#dbeafe', 
                padding: '12px', 
                borderRadius: '6px', 
                display: 'block', 
                fontSize: '12px',
                color: '#1e40af'
              }}>
                CREATE TABLE Production (<br />
                &nbsp;&nbsp;ProductionID INT PRIMARY KEY,<br />
                &nbsp;&nbsp;MachineID VARCHAR(50),<br />
                &nbsp;&nbsp;Timestamp DATETIME,<br />
                &nbsp;&nbsp;Output_Quantity INT,<br />
                &nbsp;&nbsp;Quality_Score DECIMAL(5,2)<br />
                );
              </code>
              <code style={{ 
                background: '#dbeafe', 
                padding: '12px', 
                borderRadius: '6px', 
                display: 'block', 
                fontSize: '12px',
                color: '#1e40af'
              }}>
                CREATE TABLE Machine (<br />
                &nbsp;&nbsp;MachineID VARCHAR(50) PRIMARY KEY,<br />
                &nbsp;&nbsp;Type VARCHAR(100),<br />
                &nbsp;&nbsp;Location VARCHAR(100),<br />
                &nbsp;&nbsp;InstallDate DATE<br />
                );
              </code>
            </div>
            <p style={{ color: '#075985', lineHeight: '1.8', marginTop: '16px' }}>
              <strong>Deliverables Required:</strong> R2RML mappings and process document of how to generate mappings and analysis methodology.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ 
              background: '#eff6ff', 
              border: '2px solid #bfdbfe', 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <h3 style={{ color: '#1d4ed8', fontSize: '20px', marginBottom: '16px' }}>
                ✅ R2RML Deliverables Complete
              </h3>
              <ul style={{ color: '#2563eb', lineHeight: '1.8' }}>
                <li>✅ R2RML mapping files (.ttl format)</li>
                <li>✅ Database schema analysis</li>
                <li>✅ Ontology design methodology</li>
                <li>✅ Manufacturing ontology (OWL)</li>
                <li>✅ Process documentation</li>
                <li>✅ IoT integration architecture</li>
                <li>✅ SPARQL query interface</li>
                <li>✅ Sample manufacturing data</li>
              </ul>
            </div>
            
            <div style={{ 
              background: '#f0fdf4', 
              border: '2px solid #bbf7d0', 
              borderRadius: '12px', 
              padding: '20px' 
            }}>
              <h3 style={{ color: '#166534', fontSize: '20px', marginBottom: '16px' }}>
                🎯 Check This - Click Here!
              </h3>
              <div style={{ color: '#15803d', lineHeight: '2.0' }}>
                <Link href="/manufacturing" style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  textDecoration: 'none', 
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0'
                }}>
                  🏭 <strong>Manufacturing Ontology:</strong> View production data structure
                </Link>
                <Link href="/manufacturing/queries" style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  textDecoration: 'none', 
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0'
                }}>
                  ⚡ <strong>SPARQL Editor:</strong> Execute manufacturing queries with sample data
                </Link>
                <Link href="/data-upload" style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  textDecoration: 'none', 
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0'
                }}>
                  📈 <strong>R2RML Integration:</strong> View mappings, process docs & sample data
                </Link>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#fef3c7', 
            border: '2px solid #fcd34d', 
            borderRadius: '12px', 
            padding: '20px', 
            marginTop: '20px' 
          }}>
            <h3 style={{ color: '#92400e', fontSize: '18px', marginBottom: '12px' }}>
              � R2RML Complete Integration Package
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', 
              color: '#b45309' 
            }}>
              <div><strong>R2RML Mappings:</strong> TTL format files</div>
              <div><strong>Process Docs:</strong> Integration methodology</div>
              <div><strong>Sample Data:</strong> 8 machines, 10 production runs</div>
              <div><strong>SPARQL Queries:</strong> Manufacturing analytics</div>
              <div><strong>Ontology:</strong> Manufacturing OWL files</div>
            </div>
          </div>


        </div>

        {/* Quick Start Guide */}
        <div className="card" style={{ background: '#1e40af', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'white' }}>
            🚀 Quick Start Guide - Follow These Steps
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', 
            marginBottom: '24px' 
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>1️⃣</div>
              <Link href="/ontology" style={{ color: 'white', textDecoration: 'none' }}>
                <strong>E-Commerce Ontology</strong><br />
                View customer/product structure
              </Link>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>2️⃣</div>
              <Link href="/queries" style={{ color: 'white', textDecoration: 'none' }}>
                <strong>SPARQL E-Commerce</strong><br />
                Run customer analytics queries
              </Link>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>3️⃣</div>
              <Link href="/manufacturing" style={{ color: 'white', textDecoration: 'none' }}>
                <strong>Manufacturing Ontology</strong><br />
                Explore R2RML case study
              </Link>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>4️⃣</div>
              <Link href="/manufacturing/queries" style={{ color: 'white', textDecoration: 'none' }}>
                <strong>Manufacturing SPARQL</strong><br />
                Execute production queries
              </Link>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>5️⃣</div>
              <Link href="/data-upload" style={{ color: 'white', textDecoration: 'none' }}>
                <strong>R2RML Integration</strong><br />
                View mappings & process docs
              </Link>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>6️⃣</div>
              <Link href="/validation" style={{ color: 'white', textDecoration: 'none' }}>
                <strong>Data Validation</strong><br />
                Check data quality
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Link
              href="/ontology"
              style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '16px 32px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontSize: '18px', 
                fontWeight: 'bold',
                display: 'inline-block',
                transition: 'background 0.3s',
                marginRight: '16px'
              }}
            >
              🎯 Start with E-Commerce
            </Link>
            <Link
              href="/manufacturing"
              style={{ 
                background: '#059669', 
                color: 'white', 
                padding: '16px 32px', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontSize: '18px', 
                fontWeight: 'bold',
                display: 'inline-block',
                transition: 'background 0.3s'
              }}
            >
              🏭 Start with Manufacturing R2RML
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          color: '#1d4ed8', 
          fontSize: '16px' 
        }}>
          <p>
            📄 <strong>Complete Documentation:</strong> 
            <code style={{ 
              background: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              margin: '0 8px' 
            }}>
              COMPLETE_CASE_STUDY_DELIVERABLES.md
            </code>
            | 
            <code style={{ 
              background: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              margin: '0 8px' 
            }}>
              DELIVERABLES_SUMMARY.md
            </code>
          </p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>
            🏆 <strong>100% Complete:</strong> All requirements fulfilled with interactive demonstrations
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;