import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params;
    const datasetId = params.id;
    const body = await request.text();
    const query = new URLSearchParams(body).get('query') || '';
    
    // Get uploaded dataset
    const uploadedData = (global as any).uploadedData?.[datasetId];
    
    if (!uploadedData) {
      return NextResponse.json({
        error: `Dataset ${datasetId} not found`
      }, { status: 404 });
    }

    // Simple SPARQL-like processing over uploaded data
    const data = uploadedData.data;
    const queryLower = query.toLowerCase();
    
    // Transform data to SPARQL-like results
    const results = {
      head: { vars: [] as string[] },
      results: { bindings: [] as any[] }
    };

    if (data && data.length > 0) {
      // Use column names as variables
      const columns = Object.keys(data[0]);
      results.head.vars = columns;
      
      // Filter data based on query (basic implementation)
      let filteredData = data;
      
      if (queryLower.includes('where')) {
        // Basic filtering - in production, use proper SPARQL parser
        if (queryLower.includes('limit')) {
          const limitMatch = query.match(/limit\s+(\d+)/i);
          if (limitMatch) {
            filteredData = data.slice(0, parseInt(limitMatch[1]));
          }
        }
      }
      
      // Convert to SPARQL bindings format
      results.results.bindings = filteredData.slice(0, 100).map(row => {
        const binding: any = {};
        columns.forEach(col => {
          binding[col] = {
            type: 'literal',
            value: String(row[col] || '')
          };
        });
        return binding;
      });
    }

    return NextResponse.json(results, {
      headers: {
        'Content-Type': 'application/sparql-results+json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Dataset SPARQL error:', error);
    return NextResponse.json(
      { error: 'SPARQL query failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteParams) {
  const params = await context.params;
  const datasetId = params.id;
  const uploadedData = (global as any).uploadedData?.[datasetId];
  
  if (!uploadedData) {
    return NextResponse.json({
      error: `Dataset ${datasetId} not found`
    }, { status: 404 });
  }

  return NextResponse.json({
    dataset: uploadedData.metadata,
    recordCount: uploadedData.data.length,
    columns: uploadedData.data.length > 0 ? Object.keys(uploadedData.data[0]) : [],
    r2rmlMapping: uploadedData.r2rml,
    sparqlEndpoint: `/api/dataset/${datasetId}/sparql`,
    sampleQueries: [
      `SELECT * WHERE { ?s ?p ?o } LIMIT 10`,
      `SELECT * WHERE { ?s ?p ?o }`,
      // Generate dynamic queries based on columns
      ...(uploadedData.data.length > 0 ? 
        Object.keys(uploadedData.data[0]).slice(0, 3).map(col => 
          `SELECT ?${col} WHERE { ?s ex:${col} ?${col} } LIMIT 5`
        ) : []
      )
    ]
  });
}
