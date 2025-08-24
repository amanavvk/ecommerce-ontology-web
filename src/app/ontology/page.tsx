import React from 'react';
import OntologyViewer from '../../components/ontology-viewer';

const OntologyPage = () => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 50%, #2563eb 100%)',
            padding: '40px 20px'
        }}>
            <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
                <div className="card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ 
                        fontSize: '48px', 
                        fontWeight: 'bold', 
                        marginBottom: '24px', 
                        color: '#1e40af',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        E-Commerce <span style={{ color: '#2563eb' }}>Ontology Viewer</span>
                    </h1>
                    
                    <div style={{ 
                        background: '#f8fafc', 
                        borderRadius: '16px', 
                        padding: '32px',
                        border: '2px solid #3b82f6',
                        minHeight: '400px'
                    }}>
                        <OntologyViewer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OntologyPage;