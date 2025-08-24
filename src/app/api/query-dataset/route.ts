import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { datasetId, query } = await request.json();
    
    // Get uploaded dataset
    const uploadedData = (global as any).uploadedData?.[datasetId];
    
    if (!uploadedData) {
      return NextResponse.json({
        error: `Dataset ${datasetId} not found`
      }, { status: 404 });
    }

    // Simple SPARQL-like processing over uploaded data
    const data = uploadedData.data;
    const queryLower = (query || '').toLowerCase();
    
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
      
      if (queryLower.includes('limit')) {
        const limitMatch = query.match(/limit\s+(\d+)/i);
        if (limitMatch) {
          filteredData = data.slice(0, parseInt(limitMatch[1]));
        }
      } else {
        // Default limit for performance
        filteredData = data.slice(0, 50);
      }
      
      // Convert to SPARQL bindings format
      results.results.bindings = filteredData.map(row => {
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
    console.error('Dataset query error:', error);
    return NextResponse.json(
      { error: 'Query failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const uploadedData = (global as any).uploadedData || {};
  const datasets = Object.keys(uploadedData).map(id => ({
    id,
    ...uploadedData[id].metadata,
    recordCount: uploadedData[id].data.length,
    columns: uploadedData[id].data.length > 0 ? Object.keys(uploadedData[id].data[0]) : []
  }));

  return NextResponse.json({
    datasets,
    totalDatasets: datasets.length,
    info: 'Query uploaded datasets with POST { datasetId, query }'
  });
}
