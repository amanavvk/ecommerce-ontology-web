// Simple local SPARQL endpoint simulator
import { NextRequest, NextResponse } from 'next/server';

// Sample manufacturing data converted to SPARQL-like responses
const sampleManufacturingData = {
  machines: [
    {
      id: 'M001',
      machineID: 'M001',
      name: 'CNC Machine Alpha',
      type: 'CNC_MACHINE',
      machineType: 'CNC Mill',
      status: 'OPERATIONAL',
      efficiency: 85.5,
      location: 'Production Floor A',
      locationName: 'Production Floor A',
      installDate: '2020-01-15',
      manufacturer: 'Haas Automation',
      model: 'VF-2'
    },
    {
      id: 'M002',
      machineID: 'M002', 
      name: 'Assembly Robot Beta',
      type: 'ROBOT',
      machineType: 'Assembly Line',
      status: 'MAINTENANCE',
      efficiency: 0,
      location: 'Assembly Line 1',
      locationName: 'Production Floor B',
      installDate: '2019-06-20',
      manufacturer: 'Bosch Rexroth',
      model: 'TS2plus'
    },
    {
      id: 'M003',
      machineID: 'M003',
      name: 'Quality Scanner Gamma',
      type: 'SCANNER',
      machineType: 'Quality Control Station',
      status: 'OPERATIONAL', 
      efficiency: 92.3,
      location: 'Quality Control',
      locationName: 'QC Department',
      installDate: '2021-03-10',
      manufacturer: 'Keyence',
      model: 'CV-X100F'
    }
  ],
  products: [
    {
      id: 'prod001',
      name: 'Widget A',
      category: 'Electronics',
      productionTime: 45,
      qualityScore: 4.8,
      quantity: 1250
    },
    {
      id: 'prod002',
      name: 'Component B', 
      category: 'Mechanical',
      productionTime: 30,
      qualityScore: 4.6,
      quantity: 890
    }
  ],
  processes: [
    {
      id: 'proc001',
      name: 'Assembly Process',
      duration: 120,
      efficiency: 88.2,
      equipment: ['eq001', 'eq002']
    },
    {
      id: 'proc002',
      name: 'Quality Check',
      duration: 15,
      efficiency: 95.1,
      equipment: ['eq003']
    }
  ]
};

// Convert data to SPARQL-like results based on query
function processQuery(query: string) {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('equipment') || queryLower.includes('machine')) {
    return {
      head: { vars: ['machine', 'machineID', 'name', 'type', 'status', 'efficiency', 'location', 'installDate'] },
      results: {
        bindings: sampleManufacturingData.machines.map(machine => ({
          machine: { type: 'uri', value: `http://example.org/manufacturing#${machine.id}` },
          machineID: { type: 'literal', value: machine.machineID },
          name: { type: 'literal', value: machine.name },
          type: { type: 'literal', value: machine.machineType },
          status: { type: 'literal', value: machine.status },
          efficiency: { type: 'literal', value: machine.efficiency.toString() },
          location: { type: 'literal', value: machine.locationName },
          installDate: { type: 'literal', value: machine.installDate }
        }))
      }
    };
  }
  
  if (queryLower.includes('product')) {
    return {
      head: { vars: ['product', 'name', 'category', 'productionTime', 'qualityScore', 'quantity'] },
      results: {
        bindings: sampleManufacturingData.products.map(prod => ({
          product: { type: 'uri', value: `http://example.org/manufacturing#${prod.id}` },
          name: { type: 'literal', value: prod.name },
          category: { type: 'literal', value: prod.category },
          productionTime: { type: 'literal', value: prod.productionTime.toString() },
          qualityScore: { type: 'literal', value: prod.qualityScore.toString() },
          quantity: { type: 'literal', value: prod.quantity.toString() }
        }))
      }
    };
  }
  
  if (queryLower.includes('process')) {
    return {
      head: { vars: ['process', 'name', 'duration', 'efficiency'] },
      results: {
        bindings: sampleManufacturingData.processes.map(proc => ({
          process: { type: 'uri', value: `http://example.org/manufacturing#${proc.id}` },
          name: { type: 'literal', value: proc.name },
          duration: { type: 'literal', value: proc.duration.toString() },
          efficiency: { type: 'literal', value: proc.efficiency.toString() }
        }))
      }
    };
  }
  
  // Default response for unknown queries
  return {
    head: { vars: ['subject', 'predicate', 'object'] },
    results: {
      bindings: [
        {
          subject: { type: 'uri', value: 'http://example.org/manufacturing#system' },
          predicate: { type: 'uri', value: 'http://www.w3.org/2000/01/rdf-schema#label' },
          object: { type: 'literal', value: 'Manufacturing System Ready' }
        }
      ]
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const query = new URLSearchParams(body).get('query') || '';
    
    console.log('Local SPARQL Query:', query);
    
    const results = processQuery(query);
    
    return NextResponse.json(results, {
      headers: {
        'Content-Type': 'application/sparql-results+json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Local SPARQL endpoint error:', error);
    return NextResponse.json(
      { error: 'Local SPARQL processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Local SPARQL Endpoint Ready',
    description: 'Docker-free production setup using local data',
    endpoints: {
      query: '/api/local-sparql (POST)',
      status: '/api/local-sparql (GET)'
    },
    sampleQueries: [
      'SELECT * WHERE { ?equipment a :Equipment }',
      'SELECT * WHERE { ?product a :Product }', 
      'SELECT * WHERE { ?process a :Process }'
    ]
  });
}
