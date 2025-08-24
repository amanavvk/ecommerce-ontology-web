import { NextRequest, NextResponse } from 'next/server';
import { R2RMLProcessor } from '@/lib/r2rml-processor';

export async function POST(request: NextRequest) {
  try {
    const { rdfData, query } = await request.json();

    if (!rdfData) {
      return NextResponse.json(
        { error: 'RDF data is required' },
        { status: 400 }
      );
    }

    const processor = new R2RMLProcessor();
    
    // Load RDF data into processor
    await processor.loadRDF(rdfData);
    
    // If query is provided, execute it
    let queryResults = [];
    if (query) {
      // Parse simple query patterns for demonstration
      // In production, you'd use a full SPARQL engine like Comunica
      queryResults = processor.queryRDF({
        predicate: 'http://example.org/hasType'
      });
    }
    
    // Get statistics
    const stats = processor.getStatistics();
    
    // Prepare export
    const exportData = await processor.exportAsDownload();

    return NextResponse.json({
      success: true,
      statistics: stats,
      queryResults: queryResults,
      exportData: exportData,
      message: 'RDF data loaded successfully into triple store'
    });

  } catch (error: any) {
    console.error('Triple store loading error:', error);
    return NextResponse.json(
      { error: 'Failed to load RDF into triple store', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'turtle';
    
    // Create a sample RDF dataset for testing
    const sampleRDF = `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:machine/M001 a ex:Machine ;
    ex:hasName "CNC Machine Alpha" ;
    ex:hasType "CNC_MILL" ;
    ex:hasLocation "Production Floor A" ;
    ex:hasStatus "OPERATIONAL" ;
    ex:hasEfficiency "85.5"^^xsd:decimal ;
    ex:hasManufacturer "Haas Automation" .

ex:machine/M002 a ex:Machine ;
    ex:hasName "Assembly Robot Beta" ;
    ex:hasType "ROBOT" ;
    ex:hasLocation "Assembly Line 1" ;
    ex:hasStatus "MAINTENANCE" ;
    ex:hasEfficiency "0"^^xsd:decimal ;
    ex:hasManufacturer "Bosch Rexroth" .

ex:machine/M003 a ex:Machine ;
    ex:hasName "Quality Scanner Gamma" ;
    ex:hasType "SCANNER" ;
    ex:hasLocation "Quality Control" ;
    ex:hasStatus "OPERATIONAL" ;
    ex:hasEfficiency "92.3"^^xsd:decimal ;
    ex:hasManufacturer "Keyence" .`;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `rdf-triples-${timestamp}.ttl`;

    return new NextResponse(sampleRDF, {
      headers: {
        'Content-Type': 'text/turtle',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error('RDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to export RDF data' },
      { status: 500 }
    );
  }
}
