"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone';

type Node = { id: string; label: string; group: string; title?: string };
type Edge = {
    from: string;
    to: string;
    label: string;
    arrows: string;
    color?: { color: string };
    width?: number;
    dashes?: boolean;
};

const ManufacturingOntologyViewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState('');
    const [selectedView, setSelectedView] = useState('full');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ontologyData, setOntologyData] = useState<any>(null);

    useEffect(() => {
        async function fetchOntologyData() {
            try {
                setLoading(true);
                const response = await fetch('/api/manufacturing-ontology');
                if (!response.ok) {
                    throw new Error('Failed to fetch ontology data');
                }
                const data = await response.json();
                setOntologyData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching ontology:', err);
                setError('Failed to load manufacturing ontology from OWL file.');
                // Simple fallback data
                setOntologyData({
                    classes: [
                        { id: 'Machine', label: 'Machine', group: 'class', title: 'Manufacturing machine or equipment' },
                        { id: 'ProductionRun', label: 'Production Run', group: 'class', title: 'A production run' },
                    ],
                    objectProperties: [],
                    dataProperties: [],
                    individuals: [],
                    relationships: []
                });
            } finally {
                setLoading(false);
            }
        }
        
        fetchOntologyData();
    }, []);

    useEffect(() => {
        if (!containerRef.current || !ontologyData || loading) return;

        // Build the visualization data from the ontology
        const allNodes: Node[] = [
            ...ontologyData.classes.map((cls: any) => ({
                id: cls.id,
                label: cls.label,
                group: cls.group,
                title: cls.title
            })),
            ...ontologyData.objectProperties.map((prop: any) => ({
                id: prop.id,
                label: prop.label,
                group: prop.group,
                title: prop.title
            })),
            ...ontologyData.dataProperties.map((prop: any) => ({
                id: prop.id,
                label: prop.label,
                group: prop.group,
                title: prop.title
            })),
            ...ontologyData.individuals.map((ind: any) => ({
                id: ind.id,
                label: ind.label,
                group: ind.group,
                title: ind.title
            }))
        ];

        const allEdges: Edge[] = ontologyData.relationships;

        const manufacturingData = {
            nodes: allNodes,
            edges: allEdges
        };

        // Filter data based on selected view
        let filteredNodes = manufacturingData.nodes;
        let filteredEdges = manufacturingData.edges;

        if (selectedView === 'schema') {
            filteredNodes = manufacturingData.nodes.filter(n => 
                n.group === 'class' || n.group === 'objectProperty' || n.group === 'dataProperty'
            );
            filteredEdges = manufacturingData.edges.filter(e => 
                filteredNodes.some(n => n.id === e.from) && filteredNodes.some(n => n.id === e.to)
            );
        } else if (selectedView === 'instances') {
            filteredNodes = manufacturingData.nodes.filter(n => 
                n.group === 'class' || n.group === 'individual'
            );
            filteredEdges = manufacturingData.edges.filter(e => 
                filteredNodes.some(n => n.id === e.from) && filteredNodes.some(n => n.id === e.to)
            );
        }

        // Apply text filter
        if (filter) {
            filteredNodes = filteredNodes.filter(n => 
                n.label.toLowerCase().includes(filter.toLowerCase())
            );
            filteredEdges = filteredEdges.filter(e => 
                filteredNodes.some(n => n.id === e.from) && filteredNodes.some(n => n.id === e.to)
            );
        }

        const data = { 
            nodes: filteredNodes, 
            edges: filteredEdges 
        };

        const options = {
            groups: {
                class: {
                    shape: 'box',
                    color: { background: '#dbeafe', border: '#3b82f6' },
                    font: { color: '#1e40af', size: 14, face: 'Arial Black' },
                    borderWidth: 3,
                    margin: 10
                },
                objectProperty: {
                    shape: 'ellipse',
                    color: { background: '#dcfce7', border: '#10b981' },
                    font: { color: '#065f46', size: 12, face: 'Arial' },
                    borderWidth: 2
                },
                dataProperty: {
                    shape: 'diamond',
                    color: { background: '#fef3c7', border: '#f59e0b' },
                    font: { color: '#92400e', size: 10, face: 'Arial' },
                    borderWidth: 2
                },
                individual: {
                    shape: 'circle',
                    color: { background: '#fae8ff', border: '#8b5cf6' },
                    font: { color: '#6b21a8', size: 11, face: 'Arial' },
                    borderWidth: 2
                }
            },
            physics: {
                enabled: true,
                stabilization: { iterations: 100 },
                barnesHut: {
                    gravitationalConstant: -8000,
                    centralGravity: 0.3,
                    springLength: 120,
                    springConstant: 0.04,
                    damping: 0.09
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                hideEdgesOnDrag: false,
                hideNodesOnDrag: false
            },
            layout: {
                improvedLayout: true,
                hierarchical: {
                    enabled: selectedView === 'schema',
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 150,
                    nodeSpacing: 200
                }
            }
        };

        const network = new Network(containerRef.current, data, options);

        // Add click event listener
        network.on('selectNode', (event) => {
            const nodeId = event.nodes[0];
            const node = filteredNodes.find(n => n.id === nodeId);
            if (node) {
                console.log('Selected node:', node);
            }
        });

        return () => {
            if (network) {
                network.destroy();
            }
        };
    }, [filter, selectedView, ontologyData, loading]);

    if (loading) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading Manufacturing Ontology...</div>
                    <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Parsing manufacturing.owl file</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Error message */}
            {error && (
                <div style={{ 
                    padding: '12px', 
                    background: '#fef2f2', 
                    border: '1px solid #fecaca',
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    color: '#dc2626'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Controls */}
            <div style={{ 
                padding: '16px', 
                background: '#f8fafc', 
                borderRadius: '8px', 
                marginBottom: '16px',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginRight: '8px' }}>
                            View:
                        </label>
                        <select 
                            value={selectedView} 
                            onChange={(e) => setSelectedView(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                background: 'white'
                            }}
                        >
                            <option value="full">Full Ontology</option>
                            <option value="schema">Schema Only</option>
                            <option value="instances">Classes & Instances</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginRight: '8px' }}>
                            Filter:
                        </label>
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Search nodes..."
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                width: '200px'
                            }}
                        />
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        💙 Classes • 💚 Object Properties • 💛 Data Properties • 💜 Individuals
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ 
                padding: '12px', 
                background: '#f1f5f9', 
                borderRadius: '8px', 
                marginBottom: '16px',
                fontSize: '12px',
                color: '#374151'
            }}>
                <strong>Manufacturing Ontology from manufacturing.owl:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '8px' }}>
                    <div>🏭 <strong>Classes:</strong> Loaded from OWL file</div>
                    <div>🔗 <strong>Object Properties:</strong> Domain/Range relationships</div>
                    <div>📊 <strong>Data Properties:</strong> Attribute definitions</div>
                    <div>⚙️ <strong>Individuals:</strong> Named instances</div>
                </div>
            </div>

            {/* Visualization Container */}
            <div 
                ref={containerRef} 
                style={{ 
                    width: '100%', 
                    height: '600px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '8px',
                    background: 'white'
                }} 
            />
        </div>
    );
};

export default ManufacturingOntologyViewer;
