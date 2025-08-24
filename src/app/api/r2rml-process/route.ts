import { NextRequest, NextResponse } from 'next/server';
import { R2RMLProcessor } from '@/lib/r2rml-processor';

export async function POST(request: NextRequest) {
  try {
    const { r2rmlMapping, data, format = 'turtle' } = await request.json();

    if (!r2rmlMapping || !data) {
      return NextResponse.json(
        { error: 'R2RML mapping and data are required' },
        { status: 400 }
      );
    }

    const processor = new R2RMLProcessor();
    
    // Parse R2RML mapping
    const mappings = await processor.parseR2RMLMapping(r2rmlMapping);
    
    // Process data to generate RDF
    const rdfOutput = await processor.processDataWithMapping(data, mappings);
    
    // Load RDF into processor store for querying
    await processor.loadRDF(rdfOutput);
    
    // Get statistics
    const stats = processor.getStatistics();

    return NextResponse.json({
      success: true,
      rdf: rdfOutput,
      statistics: stats,
      mappingsCount: mappings.length,
      format: format
    });

  } catch (error: any) {
    console.error('R2RML processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process R2RML mapping', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const datasetId = url.searchParams.get('datasetId') || 'latest';
    
    // Return example R2RML mapping for download
    const exampleMapping = `@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:TriplesMap a rr:TriplesMap ;
    rr:logicalTable [ rr:tableName "machines" ] ;
    rr:subjectMap [
        rr:template "http://example.org/machine/{machineId}" ;
        rr:class ex:Machine
    ] ;
    rr:predicateObjectMap [
        rr:predicate ex:hasName ;
        rr:objectMap [ rr:column "machineName" ]
    ] ;
    rr:predicateObjectMap [
        rr:predicate ex:hasType ;
        rr:objectMap [ rr:column "type" ]
    ] ;
    rr:predicateObjectMap [
        rr:predicate ex:hasLocation ;
        rr:objectMap [ rr:column "location" ]
    ] ;
    rr:predicateObjectMap [
        rr:predicate ex:hasStatus ;
        rr:objectMap [ rr:column "status" ]
    ] ;
    rr:predicateObjectMap [
        rr:predicate ex:hasEfficiency ;
        rr:objectMap [ 
            rr:column "efficiency" ;
            rr:datatype xsd:decimal
        ]
    ] .`;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `r2rml-mapping-${datasetId}-${timestamp}.ttl`;

    return new NextResponse(exampleMapping, {
      headers: {
        'Content-Type': 'text/turtle',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error('R2RML download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate R2RML mapping download' },
      { status: 500 }
    );
  }
}
