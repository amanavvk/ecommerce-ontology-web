import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Read the manufacturing.owl file
        const owlFilePath = path.join(process.cwd(), 'public', 'ontology', 'manufacturing.owl');
        const owlContent = fs.readFileSync(owlFilePath, 'utf8');
        
        // Since the OWL file is in XML/RDF format and N3 parser has issues with it,
        // let's manually extract the key information for now
        const classes = extractClasses(owlContent);
        const objectProperties = extractObjectProperties(owlContent);
        const dataProperties = extractDataProperties(owlContent);
        const individuals: any[] = []; // No individuals defined in the OWL file yet
        const relationships = buildRelationships(objectProperties, dataProperties);
        
        return NextResponse.json({
            classes,
            objectProperties,
            dataProperties,
            individuals,
            relationships
        });
        
    } catch (error) {
        console.error('Error parsing manufacturing ontology:', error);
        return NextResponse.json({ error: 'Failed to parse manufacturing ontology' }, { status: 500 });
    }
}

function extractClasses(owlContent: string): any[] {
    const classes: any[] = [];
    
    // Extract class declarations using regex
    const classRegex = /<owl:Class rdf:about="([^"]+)"[^>]*>/g;
    let match;
    
    while ((match = classRegex.exec(owlContent)) !== null) {
        const classUri = match[1];
        const label = extractLabel(owlContent, classUri) || classUri.split('#').pop() || classUri;
        const comment = extractComment(owlContent, classUri);
        
        classes.push({
            id: classUri,
            label: label,
            group: 'class',
            title: comment || `Class: ${label}`
        });
    }
    
    return classes;
}

function extractObjectProperties(owlContent: string): any[] {
    const properties: any[] = [];
    
    // Extract object property declarations
    const propRegex = /<owl:ObjectProperty rdf:about="([^"]+)"[^>]*>/g;
    let match;
    
    while ((match = propRegex.exec(owlContent)) !== null) {
        const propUri = match[1];
        const label = extractLabel(owlContent, propUri) || propUri.split('#').pop() || propUri;
        const comment = extractComment(owlContent, propUri);
        const domain = extractDomain(owlContent, propUri);
        const range = extractRange(owlContent, propUri);
        
        properties.push({
            id: propUri,
            label: label,
            group: 'objectProperty',
            title: comment || `Object Property: ${label}`,
            domain: domain,
            range: range
        });
    }
    
    return properties;
}

function extractDataProperties(owlContent: string): any[] {
    const properties: any[] = [];
    
    // Extract data property declarations
    const propRegex = /<owl:DatatypeProperty rdf:about="([^"]+)"[^>]*>/g;
    let match;
    
    while ((match = propRegex.exec(owlContent)) !== null) {
        const propUri = match[1];
        const label = extractLabel(owlContent, propUri) || propUri.split('#').pop() || propUri;
        const comment = extractComment(owlContent, propUri);
        const domain = extractDomain(owlContent, propUri);
        
        properties.push({
            id: propUri,
            label: label,
            group: 'dataProperty',
            title: comment || `Data Property: ${label}`,
            domain: domain
        });
    }
    
    return properties;
}

function buildRelationships(objectProperties: any[], dataProperties: any[]): any[] {
    const relationships: any[] = [];
    
    // Add object property relationships
    for (const prop of objectProperties) {
        if (prop.domain && prop.range) {
            relationships.push({
                from: prop.domain,
                to: prop.range,
                label: prop.label,
                arrows: 'to',
                color: { color: '#10b981' },
                width: 3
            });
        }
    }
    
    // Add data property relationships
    for (const prop of dataProperties) {
        if (prop.domain) {
            relationships.push({
                from: prop.domain,
                to: prop.id,
                label: 'has',
                arrows: 'to',
                color: { color: '#3b82f6' },
                width: 2,
                dashes: true
            });
        }
    }
    
    return relationships;
}

function extractLabel(owlContent: string, uri: string): string | null {
    const escapedUri = uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const labelRegex = new RegExp(`<owl:[^>]+ rdf:about="${escapedUri}"[^>]*>[\\s\\S]*?<rdfs:label>([^<]+)</rdfs:label>`, 'i');
    const match = labelRegex.exec(owlContent);
    return match ? match[1] : null;
}

function extractComment(owlContent: string, uri: string): string | null {
    const escapedUri = uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const commentRegex = new RegExp(`<owl:[^>]+ rdf:about="${escapedUri}"[^>]*>[\\s\\S]*?<rdfs:comment>([^<]+)</rdfs:comment>`, 'i');
    const match = commentRegex.exec(owlContent);
    return match ? match[1] : null;
}

function extractDomain(owlContent: string, uri: string): string | null {
    const escapedUri = uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const domainRegex = new RegExp(`<owl:[^>]+ rdf:about="${escapedUri}"[^>]*>[\\s\\S]*?<rdfs:domain rdf:resource="([^"]+)"`, 'i');
    const match = domainRegex.exec(owlContent);
    return match ? match[1] : null;
}

function extractRange(owlContent: string, uri: string): string | null {
    const escapedUri = uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rangeRegex = new RegExp(`<owl:[^>]+ rdf:about="${escapedUri}"[^>]*>[\\s\\S]*?<rdfs:range rdf:resource="([^"]+)"`, 'i');
    const match = rangeRegex.exec(owlContent);
    return match ? match[1] : null;
}
