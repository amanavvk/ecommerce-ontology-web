"use client";
import React, { useState } from 'react';
import QueryEditor from '../../components/ui/query-editor';
import ResultsTable from '../../components/ui/results-table';

const exampleQueries = [
    {
        label: 'All Products',
        description: 'List all products and their names.',
    query: `SELECT ?product ?name WHERE { ?product a <http://www.example.org/ecommerce#Product> ; <http://www.example.org/ecommerce#productName> ?name . }`
    },
    {
        label: 'All Users',
        description: 'List all users and their usernames.',
    query: `SELECT ?user ?name WHERE { ?user a <http://www.example.org/ecommerce#User> ; <http://www.example.org/ecommerce#userName> ?name . }`
    },
    {
        label: 'All Orders',
        description: 'List all orders.',
    query: `SELECT ?order WHERE { ?order a <http://www.example.org/ecommerce#Order> . }`
    },
    {
        label: 'Products in Orders',
        description: 'Show which products are included in each order.',
    query: `SELECT ?order ?product WHERE { ?order a <http://www.example.org/ecommerce#Order> ; <http://www.example.org/ecommerce#containsProduct> ?product . }`
    },
    // Advanced queries
    {
        label: 'Orders with User and Product Details',
        description: 'Show each order with the user who placed it and product details.',
    query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?order ?userName ?productName ?productPrice\nWHERE {\n  ?order a ec:Order ;\n         ec:placedBy ?user ;\n         ec:containsProduct ?product .\n  ?user ec:userName ?userName .\n  ?product ec:productName ?productName ;\n           ec:productPrice ?productPrice .\n}`
    },
    {
        label: 'Users with More Than One Order',
        description: 'Find users who have placed more than one order.',
    query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?userName (COUNT(?order) AS ?orderCount)\nWHERE {\n  ?order a ec:Order ;\n         ec:placedBy ?user .\n  ?user ec:userName ?userName .\n}\nGROUP BY ?userName\nHAVING (COUNT(?order) > 1)`
    },
    {
        label: 'Products Never Ordered',
        description: 'List products that have never been included in any order.',
    query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?product ?productName\nWHERE {\n  ?product a ec:Product ;\n           ec:productName ?productName .\n  FILTER NOT EXISTS {\n    ?order a ec:Order ;\n           ec:containsProduct ?product .\n  }\n}`
    },
    {
        label: 'Top Categories by Product Count',
        description: 'Show categories with the most products.',
    query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?category (COUNT(?product) AS ?productCount)\nWHERE {\n  ?product a ec:Product ;\n           ec:belongsToCategory ?category .\n}\nGROUP BY ?category\nORDER BY DESC(?productCount)`
    },
    {
        label: 'Order Total Value',
        description: 'Calculate the total value of each order.',
    query: `PREFIX ec: <http://www.example.org/ecommerce#>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nSELECT ?order (SUM(xsd:decimal(?productPrice)) AS ?totalValue)\nWHERE {\n  ?order a ec:Order ;\n         ec:containsProduct ?product .\n  ?product ec:productPrice ?productPrice .\n}\nGROUP BY ?order`
    },
];


// Challenge use case queries
const challengeTabs = [
    {
        label: 'Hierarchical Classification',
        description: 'Explore the product category hierarchy and see which products belong to which categories, including subcategories.',
        query: `PREFIX ec: <http://www.example.org/ecommerce#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?product ?productName ?category ?categoryLabel\nWHERE {\n  ?product a ec:Product ;\n           ec:productName ?productName ;\n           ec:belongsToCategory ?category .\n  OPTIONAL { ?category rdfs:label ?categoryLabel }\n}`
    },
        {
            label: 'Product Relationships',
            description: 'View relationships between products, such as accessories, variants, or related products. Shows how products are connected through business relationships.',
            query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?product ?productName ?related ?relatedName ?relationType\nWHERE {\n  ?product a ec:Product ;\n           ec:productName ?productName .\n  ?product ?relation ?related .\n  ?related a ec:Product ;\n           ec:productName ?relatedName .\n  FILTER(?relation IN (ec:hasAccessory, ec:hasVariant, ec:isRelatedTo))\n  BIND(STRAFTER(STR(?relation), '#') AS ?relationType)\n}\nLIMIT 20`
        },
    {
        label: 'Search & Recommendation',
        description: 'Search for products by keyword and see recommended/similar products (e.g., based on category or relatedness).',
        query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?product ?productName ?category\nWHERE {\n  ?product a ec:Product ;\n           ec:productName ?productName ;\n           ec:belongsToCategory ?category .\n  FILTER(CONTAINS(LCASE(?productName), "shoe"))\n}\nLIMIT 20`
    },
        {
            label: 'Inventory & Pricing',
            description: 'Check inventory levels and pricing for products, including price history if available.',
            query: `PREFIX ec: <http://www.example.org/ecommerce#>\nSELECT ?product ?productName ?inventory ?price\nWHERE {\n  ?product a ec:Product ;\n           ec:productName ?productName .\n  OPTIONAL { ?product ec:inventoryCount ?inventory }\n  OPTIONAL { ?product ec:productPrice ?price }\n}\nLIMIT 20`
        },
];

const QueriesPage = () => {
        const [results, setResults] = useState<Array<Record<string, any>>>([]);
        const [columns, setColumns] = useState<Array<{ header: string; accessor: string }>>([]);
        const [query, setQuery] = useState<string>('');
        const [selectedDescription, setSelectedDescription] = useState<string>('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [activeTab, setActiveTab] = useState<number>(0);

    const handleQuerySubmit = async (q: string) => {
        setLoading(true);
        setError(null);
        setResults([]);
        setColumns([]);
        try {
            const response = await fetch('/api/sparql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: q }),
            });
            if (response.ok) {
                const data = await response.json();
                setResults(data.results.bindings);
                if (data.results.bindings.length > 0) {
                    const firstRow = data.results.bindings[0];
                    setColumns(Object.keys(firstRow).map((key) => ({ header: key, accessor: key })));
                }
            } else {
                const err = await response.text();
                setError(err);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };


    const handleExample = (q: string, desc: string) => {
        setQuery(q);
        setSelectedDescription(desc);
        setResults([]);
        setColumns([]);
        setError(null);
    };

    // Handle tab switch for challenge use cases
    const handleTab = (idx: number) => {
        setActiveTab(idx);
        setQuery(challengeTabs[idx].query);
        setSelectedDescription(challengeTabs[idx].description);
        setResults([]);
        setColumns([]);
        setError(null);
    };

    const handleClear = () => {
        setQuery('');
        setSelectedDescription('');
        setResults([]);
        setColumns([]);
        setError(null);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)',
            padding: '40px 20px'
        }}>
            <div className="container">
                <div className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 style={{ 
                        fontSize: '36px', 
                        fontWeight: 'bold', 
                        marginBottom: '24px', 
                        color: '#1e40af',
                        textAlign: 'center'
                    }}>
                        E-commerce Ontology <span style={{ color: '#3b82f6' }}>Challenge Explorer</span>
                    </h1>
                    
                    {/* Challenge Use Case Tabs */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '12px', 
                            justifyContent: 'center', 
                            marginBottom: '24px' 
                        }}>
                            {challengeTabs.map((tab, idx) => (
                                <button
                                    key={tab.label}
                                    className={activeTab === idx ? 'btn btn-primary' : 'btn'}
                                    style={{
                                        minWidth: '200px',
                                        marginBottom: '8px',
                                        background: activeTab === idx ? '#1d4ed8' : '#e5e7eb',
                                        color: activeTab === idx ? 'white' : '#374151',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => handleTab(idx)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="card" style={{ 
                            background: '#eff6ff', 
                            border: '2px solid #3b82f6',
                            borderLeft: '4px solid #3b82f6'
                        }}>
                            <strong style={{ color: '#1d4ed8' }}>Use Case:</strong> {challengeTabs[activeTab].description}
                        </div>
                    </div>
                    
                    {/* Query Editor */}
                    <div className="card" style={{ 
                        background: '#f8fafc', 
                        border: '1px solid #cbd5e1',
                        marginBottom: '24px'
                    }}>
                        <QueryEditor
                            onQuerySubmit={handleQuerySubmit}
                            query={query}
                            setQuery={setQuery}
                            loading={loading}
                        />
                    </div>
                    
                    {/* Error and Loading States */}
                    {error && (
                        <div className="card" style={{ 
                            background: '#fee2e2', 
                            border: '2px solid #dc2626',
                            borderLeft: '4px solid #dc2626',
                            color: '#991b1b',
                            fontWeight: 'bold',
                            marginBottom: '16px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    {loading && (
                        <div className="card" style={{ 
                            background: '#dbeafe', 
                            border: '2px solid #3b82f6',
                            borderLeft: '4px solid #3b82f6',
                            color: '#1d4ed8',
                            fontWeight: 'bold',
                            marginBottom: '16px'
                        }}>
                            Loading results...
                        </div>
                    )}
                    
                    {/* Results */}
                    <div className="card">
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1d4ed8' }}>
                            Results Preview
                        </h2>
                        {results.length === 0 && !loading && !error ? (
                            <div style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '32px' }}>
                                No results to display. Run a query to see results here.
                            </div>
                        ) : (
                            <ResultsTable data={results} columns={columns} />
                        )}
                    </div>
                    
                    {/* Example queries section */}
                    <details style={{ marginTop: '48px' }}>
                        <summary style={{ 
                            cursor: 'pointer', 
                            color: '#1d4ed8', 
                            fontWeight: 'bold', 
                            fontSize: '18px',
                            marginBottom: '16px'
                        }}>
                            Show Example Queries
                        </summary>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: '16px', 
                                justifyContent: 'center', 
                                marginBottom: '8px' 
                            }}>
                                {exampleQueries.map((ex) => (
                                    <button
                                        key={ex.label}
                                        className="btn btn-primary"
                                        title={ex.description}
                                        onClick={() => handleExample(ex.query, ex.description)}
                                        style={{ minWidth: '170px', marginBottom: '8px' }}
                                    >
                                        {ex.label}
                                    </button>
                                ))}
                                <button
                                    className="btn"
                                    onClick={handleClear}
                                    style={{ 
                                        minWidth: '170px', 
                                        marginBottom: '8px',
                                        background: '#e5e7eb',
                                        color: '#374151'
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                            {selectedDescription && (
                                <div className="card" style={{ 
                                    background: '#eff6ff', 
                                    border: '2px solid #3b82f6',
                                    borderLeft: '4px solid #3b82f6',
                                    marginTop: '16px'
                                }}>
                                    <strong>Template Description:</strong> {selectedDescription}
                                </div>
                            )}
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default QueriesPage;