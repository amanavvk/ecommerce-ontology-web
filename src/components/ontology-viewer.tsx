"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone';

type Node = { id: string; label: string; group: string };
type Edge = {
    from: string;
    to: string;
    label: string;
    arrows: string;
    color?: { color: string };
    width?: number;
    dashes?: boolean;
};

const OntologyViewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<Network | null>(null);
    const [filter, setFilter] = useState('');
    const [dropdownValue, setDropdownValue] = useState('');
    const [allLabels, setAllLabels] = useState<string[]>([]);

    useEffect(() => {
        async function fetchAndVisualize() {
            // SPARQL endpoint
            const endpoint = 'http://localhost:3030/ecommerce/sparql';
            const prefixes = 'PREFIX ec: <http://www.example.org/ecommerce#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ';
            
            // Optimized queries with limits for performance
            const classQuery = `${prefixes}\nSELECT DISTINCT ?class WHERE { ?class a owl:Class . FILTER(STRSTARTS(STR(?class), 'http://www.example.org/ecommerce#')) }`;
            const objPropQuery = `${prefixes}\nSELECT DISTINCT ?prop WHERE { ?prop a owl:ObjectProperty . FILTER(STRSTARTS(STR(?prop), 'http://www.example.org/ecommerce#')) } LIMIT 15`;
            const dtPropQuery = `${prefixes}\nSELECT DISTINCT ?prop WHERE { ?prop a owl:DatatypeProperty . FILTER(STRSTARTS(STR(?prop), 'http://www.example.org/ecommerce#')) } LIMIT 10`;
            const indQuery = `${prefixes}\nSELECT DISTINCT ?ind ?type WHERE { ?ind a ?type . ?type a owl:Class . FILTER(STRSTARTS(STR(?ind), 'http://www.example.org/ecommerce#')) } LIMIT 30`;
            const relQuery = `${prefixes}\nSELECT DISTINCT ?sub ?prop ?obj WHERE { ?sub ?prop ?obj . ?prop a owl:ObjectProperty . FILTER(STRSTARTS(STR(?prop), 'http://www.example.org/ecommerce#')) } LIMIT 50`;
            const dtRelQuery = `${prefixes}\nSELECT DISTINCT ?sub ?prop ?val WHERE { ?sub ?prop ?val . ?prop a owl:DatatypeProperty . FILTER(STRSTARTS(STR(?prop), 'http://www.example.org/ecommerce#')) } LIMIT 25`;
            const subClassQuery = `${prefixes}\nSELECT DISTINCT ?child ?parent WHERE { ?child rdfs:subClassOf ?parent . FILTER(STRSTARTS(STR(?child), 'http://www.example.org/ecommerce#')) FILTER(STRSTARTS(STR(?parent), 'http://www.example.org/ecommerce#')) }`;

            async function runQuery(query: string) {
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/sparql-query',
                            'Accept': 'application/sparql-results+json',
                        },
                        body: query,
                    });
                    if (!res.ok) return [];
                    const data = await res.json();
                    return data.results.bindings;
                } catch (error) {
                    console.warn('Query failed:', error);
                    return [];
                }
            }

            // Fetch all ontology elements
            const [classes, objProps, dtProps, inds, rels, dtRels, subClasses] = await Promise.all([
                runQuery(classQuery),
                runQuery(objPropQuery),
                runQuery(dtPropQuery),
                runQuery(indQuery),
                runQuery(relQuery),
                runQuery(dtRelQuery),
                runQuery(subClassQuery),
            ]);

            // Build nodes
            const nodes: Node[] = [];
            const nodeIds = new Set<string>();
            
            // Classes
            for (const c of classes) {
                const id = c.class.value;
                if (!nodeIds.has(id)) {
                    nodes.push({ id, label: id.split('#').pop() || id, group: 'class' });
                    nodeIds.add(id);
                }
            }
            
            // Object properties
            for (const p of objProps) {
                const id = p.prop.value;
                if (!nodeIds.has(id)) {
                    nodes.push({ id, label: id.split('#').pop() || id, group: 'objectProperty' });
                    nodeIds.add(id);
                }
            }
            
            // Datatype properties
            for (const p of dtProps) {
                const id = p.prop.value;
                if (!nodeIds.has(id)) {
                    nodes.push({ id, label: id.split('#').pop() || id, group: 'datatypeProperty' });
                    nodeIds.add(id);
                }
            }
            
            // Individuals (limited for performance)
            for (const i of inds) {
                const id = i.ind.value;
                if (!nodeIds.has(id)) {
                    nodes.push({ id, label: id.split('#').pop() || id, group: 'individual' });
                    nodeIds.add(id);
                }
            }
            
            // Set allLabels for dropdown
            const labelSet = new Set(nodes.map(n => n.label));
            setAllLabels(Array.from(labelSet).sort());

            // Build edges
            const edges: Edge[] = [];
            
            // Subclass relationships (highest priority)
            for (const s of subClasses) {
                const from = s.child.value;
                const to = s.parent.value;
                if (nodeIds.has(from) && nodeIds.has(to)) {
                    edges.push({ from, to, label: 'subClassOf', arrows: 'to', color: { color: '#6366f1' }, dashes: true });
                }
            }
            
            // Object property relationships
            for (const r of rels) {
                const from = r.sub.value;
                const to = r.obj.value;
                const label = r.prop.value.split('#').pop() || r.prop.value;
                if (nodeIds.has(from) && nodeIds.has(to)) {
                    edges.push({ from, to, label, arrows: 'to' });
                }
            }
            
            // Datatype relationships (limited)
            for (const r of dtRels) {
                const from = r.sub.value;
                const val = r.val.value;
                const label = r.prop.value.split('#').pop() || r.prop.value;
                const litNodeId = `${from}_${label}_${val}`;
                if (!nodeIds.has(litNodeId)) {
                    nodes.push({ id: litNodeId, label: val.length > 15 ? val.substring(0, 15) + '...' : val, group: 'literal' });
                    nodeIds.add(litNodeId);
                }
                edges.push({ from, to: litNodeId, label, arrows: 'to' });
            }

            // Filter nodes and edges if filter is set
            let filteredNodes = nodes;
            let filteredEdges = edges;
            let effectiveFilter = filter;
            if (dropdownValue) {
                effectiveFilter = dropdownValue;
            }
            if (effectiveFilter.trim()) {
                const filterLower = effectiveFilter.trim().toLowerCase();
                filteredNodes = nodes.filter(n => n.label.toLowerCase().includes(filterLower));
                const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
                filteredEdges = edges.filter(e => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));
            }

            // Destroy existing network
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }

            // Render network with optimized settings
            if (containerRef.current) {
                networkRef.current = new Network(
                    containerRef.current,
                    { nodes: filteredNodes, edges: filteredEdges },
                    {
                        nodes: {
                            shape: 'ellipse',
                            font: { size: 16 },
                            shadow: false, // Disable for performance
                        },
                        edges: {
                            font: { align: 'top' },
                            color: { color: '#888' },
                            shadow: false, // Disable for performance
                        },
                        groups: {
                            class: { color: { background: '#dbeafe', border: '#2563eb' } },
                            objectProperty: { color: { background: '#fef9c3', border: '#f59e42' } },
                            datatypeProperty: { color: { background: '#f3e8ff', border: '#a21caf' } },
                            individual: { color: { background: '#dcfce7', border: '#22c55e' } },
                            literal: { color: { background: '#fca5a5', border: '#b91c1c' } },
                        },
                        physics: {
                            enabled: true,
                            stabilization: { iterations: 100 }, // Reduced for faster loading
                            barnesHut: {
                                gravitationalConstant: -8000,
                                centralGravity: 0.3,
                                springLength: 95,
                                springConstant: 0.04,
                                damping: 0.09
                            }
                        },
                        height: '500px',
                    }
                );
                
                // Stop physics after stabilization for better performance
                networkRef.current.once('stabilizationIterationsDone', () => {
                    if (networkRef.current) {
                        networkRef.current.setOptions({ physics: { enabled: false } });
                    }
                });
            }
        }
        
        fetchAndVisualize();
        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, [filter, dropdownValue]);

    return (
        <div className="ontology-viewer">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">E-Commerce Ontology Structure</h1>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filter nodes by label..."
                    value={filter}
                    onChange={e => {
                        setFilter(e.target.value);
                        setDropdownValue('');
                    }}
                    className="flex-1 p-3 border-2 border-blue-200 rounded-xl bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow"
                />
                <select
                    value={dropdownValue}
                    onChange={e => {
                        setDropdownValue(e.target.value);
                        setFilter('');
                    }}
                    className="p-3 border-2 border-blue-200 rounded-xl bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow min-w-[200px]"
                >
                    <option value="">Select node label...</option>
                    {allLabels.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
            </div>
            <div 
                ref={containerRef} 
                style={{ 
                    width: '100%',
                    height: '500px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }} 
            />
            <p className="mt-4 text-blue-600 text-center">This visualization shows the E-Commerce ontology structure: classes, properties, products, categories, and their relationships.</p>
        </div>
    );
};

export default OntologyViewer;