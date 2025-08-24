import { NextRequest, NextResponse } from 'next/server';

// Global store for uploaded RDF data (in production, use a proper database)
const globalRDFStore = new Map<string, string>();
const globalDataStore = new Map<string, any[]>(); // Store original data for better querying

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const query = new URLSearchParams(body).get('query') || '';
    
    console.log('Received SPARQL query:', query);
    console.log('Current RDF store keys:', Array.from(globalRDFStore.keys()));
    console.log('Current data store keys:', Array.from(globalDataStore.keys()));
    
    // Get the latest uploaded data
    const latestDataKey = Array.from(globalDataStore.keys()).pop();
    const uploadedData = latestDataKey ? globalDataStore.get(latestDataKey) : null;
    
    console.log('Latest data key:', latestDataKey);
    console.log('Uploaded data length:', uploadedData ? uploadedData.length : 0);
    
    if (uploadedData && uploadedData.length > 0) {
      // Process the uploaded data to create SPARQL results
      const queryLower = query.toLowerCase();
      
      // Extract SELECT variables from query
      let vars = ['machine', 'name', 'type', 'efficiency']; // default
      const selectMatch = query.match(/SELECT\s+(.*?)\s+WHERE/i);
      if (selectMatch) {
        const selectVars = selectMatch[1]
          .replace(/\?/g, '')
          .split(/\s+/)
          .filter(v => v.length > 0 && v !== '*' && !v.includes('('));
        if (selectVars.length > 0) {
          vars = selectVars;
        }
      }
      
      // Convert uploaded data to SPARQL bindings
      const bindings = uploadedData.map((row, index) => {
        const binding: any = {};
        
        // Map common fields
        const machineId = row.machineId || row.id || row.productId || `uploaded${index + 1}`;
        binding.machine = { 
          type: 'uri', 
          value: `http://example.org/machine/${machineId}` 
        };
        
        if (vars.includes('name')) {
          binding.name = { 
            type: 'literal', 
            value: row.machineName || row.name || row.productName || row.firstName || `Machine ${machineId}` 
          };
        }
        
        if (vars.includes('type')) {
          binding.type = { 
            type: 'literal', 
            value: row.type || row.category || 'UNKNOWN_TYPE' 
          };
        }
        
        if (vars.includes('efficiency')) {
          binding.efficiency = { 
            type: 'literal', 
            value: String(row.efficiency || row.unitPrice || Math.floor(Math.random() * 100))
          };
        }
        
        if (vars.includes('status')) {
          binding.status = { 
            type: 'literal', 
            value: row.status || 'OPERATIONAL' 
          };
        }
        
        if (vars.includes('location')) {
          binding.location = { 
            type: 'literal', 
            value: row.location || row.supplier || 'Unknown Location' 
          };
        }
        
        if (vars.includes('manufacturer')) {
          binding.manufacturer = { 
            type: 'literal', 
            value: row.manufacturer || row.supplier || 'Unknown Manufacturer' 
          };
        }
        
        // Handle direct column name mappings for more accurate queries
        Object.keys(row).forEach(column => {
          if (vars.includes(column)) {
            binding[column] = {
              type: 'literal',
              value: String(row[column])
            };
          }
        });
        
        return binding;
      });
      
      // Apply LIMIT if specified
      let limitedBindings = bindings;
      const limitMatch = query.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1]);
        limitedBindings = bindings.slice(0, limit);
      }
      
      // Apply ORDER BY if specified
      const orderMatch = query.match(/ORDER\s+BY\s+(?:DESC\()?[?]?(\w+)/i);
      if (orderMatch) {
        const orderField = orderMatch[1];
        const isDesc = query.toLowerCase().includes('desc');
        
        limitedBindings.sort((a, b) => {
          const aVal = parseFloat(a[orderField]?.value) || 0;
          const bVal = parseFloat(b[orderField]?.value) || 0;
          return isDesc ? bVal - aVal : aVal - bVal;
        });
      }
      
      return NextResponse.json({
        head: { vars },
        results: { bindings: limitedBindings }
      });
    }
    
    // Return sample data for manufacturing queries when no data is uploaded
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('machine') || queryLower.includes('ex:machine')) {
      return NextResponse.json({
        head: { vars: ['machine', 'name', 'type', 'efficiency', 'status', 'location', 'manufacturer'] },
        results: {
          bindings: [
            {
              machine: { type: 'uri', value: 'http://example.org/machine/M001' },
              name: { type: 'literal', value: 'CNC Machine Alpha' },
              type: { type: 'literal', value: 'CNC_MILL' },
              efficiency: { type: 'literal', value: '85.5' },
              status: { type: 'literal', value: 'OPERATIONAL' },
              location: { type: 'literal', value: 'Production Floor A' },
              manufacturer: { type: 'literal', value: 'Haas Automation' }
            },
            {
              machine: { type: 'uri', value: 'http://example.org/machine/M003' },
              name: { type: 'literal', value: 'Quality Scanner Gamma' },
              type: { type: 'literal', value: 'SCANNER' },
              efficiency: { type: 'literal', value: '92.3' },
              status: { type: 'literal', value: 'OPERATIONAL' },
              location: { type: 'literal', value: 'Quality Control' },
              manufacturer: { type: 'literal', value: 'Keyence' }
            },
            {
              machine: { type: 'uri', value: 'http://example.org/machine/M006' },
              name: { type: 'literal', value: 'Welding Robot Foxtrot' },
              type: { type: 'literal', value: 'WELDING_ROBOT' },
              efficiency: { type: 'literal', value: '91.4' },
              status: { type: 'literal', value: 'OPERATIONAL' },
              location: { type: 'literal', value: 'Production Floor A' },
              manufacturer: { type: 'literal', value: 'KUKA' }
            },
            {
              machine: { type: 'uri', value: 'http://example.org/machine/M007' },
              name: { type: 'literal', value: 'Laser Cutter Golf' },
              type: { type: 'literal', value: 'LASER_CUTTER' },
              efficiency: { type: 'literal', value: '87.9' },
              status: { type: 'literal', value: 'OPERATIONAL' },
              location: { type: 'literal', value: 'Fabrication' },
              manufacturer: { type: 'literal', value: 'Trumpf' }
            }
          ]
        }
      });
    }
    
    return NextResponse.json({
      head: { vars: [] },
      results: { bindings: [] }
    });
    
  } catch (error: any) {
    console.error('SPARQL execution error:', error);
    return NextResponse.json(
      { error: 'SPARQL query execution failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { rdfData, datasetId = 'default', originalData } = await request.json();
    
    if (!rdfData) {
      return NextResponse.json(
        { error: 'RDF data is required' },
        { status: 400 }
      );
    }
    
    // Store RDF data for querying
    globalRDFStore.set(datasetId, rdfData);
    
    // Also store the original data for better querying
    if (originalData) {
      globalDataStore.set(datasetId, originalData);
      console.log('Stored original data with key:', datasetId);
      console.log('Data preview:', originalData.slice(0, 2));
    }
    
    return NextResponse.json({
      success: true,
      message: 'RDF data stored successfully',
      datasetId: datasetId
    });
    
  } catch (error: any) {
    console.error('RDF storage error:', error);
    return NextResponse.json(
      { error: 'Failed to store RDF data', details: error.message },
      { status: 500 }
    );
  }
}
