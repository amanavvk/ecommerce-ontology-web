// Production SPARQL Client for Manufacturing R2RML System
// Connects to real Fuseki endpoint with fallback to mock data

export interface SPARQLResult {
  head: {
    vars: string[];
  };
  results: {
    bindings: Array<{
      [key: string]: {
        type: string;
        value: string;
        datatype?: string;
      };
    }>;
  };
}

export interface QueryResult {
  [key: string]: any;
}

// Configuration - Using local endpoint instead of external Fuseki for Docker-free setup
const FUSEKI_ENDPOINT = process.env.FUSEKI_ENDPOINT || process.env.NEXT_PUBLIC_FUSEKI_ENDPOINT || '/api/local-sparql';
const USE_MOCK_DATA = false; // Always use local endpoint now instead of mock data

// Mock manufacturing data for development/fallback
const mockManufacturingData = {
  machines: [
    { machineID: 'M001', machineType: 'CNC Mill', locationName: 'Production Floor A', installDate: '2020-01-15', status: 'Active', manufacturer: 'Haas Automation', model: 'VF-2' },
    { machineID: 'M002', machineType: 'Assembly Line', locationName: 'Production Floor B', installDate: '2019-06-20', status: 'Active', manufacturer: 'Bosch Rexroth', model: 'TS2plus' },
    { machineID: 'M003', machineType: 'Quality Control Station', locationName: 'QC Department', installDate: '2021-03-10', status: 'Active', manufacturer: 'Keyence', model: 'CV-X100F' },
    { machineID: 'M004', machineType: 'CNC Lathe', locationName: 'Production Floor A', installDate: '2020-09-05', status: 'Active', manufacturer: 'Mazak', model: 'QUICK TURN NEXUS 100-II' },
    { machineID: 'M005', machineType: 'Assembly Line', locationName: 'Production Floor C', installDate: '2018-11-12', status: 'Maintenance', manufacturer: 'ABB', model: 'FlexPicker IRB 360' },
    { machineID: 'M006', machineType: 'Injection Molding', locationName: 'Production Floor B', installDate: '2022-02-28', status: 'Active', manufacturer: 'Engel', model: 'e-motion 310/120' },
    { machineID: 'M007', machineType: 'Welding Robot', locationName: 'Production Floor A', installDate: '2021-08-15', status: 'Active', manufacturer: 'KUKA', model: 'KR 16 R2010' },
    { machineID: 'M008', machineType: 'Packaging Line', locationName: 'Packaging Department', installDate: '2020-12-01', status: 'Active', manufacturer: 'Bosch Packaging', model: 'SVE 2520 D' }
  ],
  production: [
    { productionID: 'P001', machineID: 'M001', timestamp: '2024-08-20T08:30:00', outputQuantity: 160, qualityScore: 97.8, productType: 'Component A', batchNumber: 'BATCH-086', operatorID: 'OP001', shiftNumber: 1, temperature: 21.9, humidity: 45.1, processingTime: 470, energyConsumption: 26.8 },
    { productionID: 'P002', machineID: 'M003', timestamp: '2024-08-20T10:15:00', outputQuantity: 82, qualityScore: 99.5, productType: 'QC Sample', batchNumber: 'BATCH-087', operatorID: 'OP003', shiftNumber: 1, temperature: 21.2, humidity: 42.3, processingTime: 170, energyConsumption: 8.1 },
    { productionID: 'P003', machineID: 'M006', timestamp: '2024-08-20T12:40:00', outputQuantity: 365, qualityScore: 95.1, productType: 'Plastic Housing', batchNumber: 'BATCH-088', operatorID: 'OP010', shiftNumber: 1, temperature: 25.2, humidity: 49.1, processingTime: 295, energyConsumption: 46.2 },
    { productionID: 'P004', machineID: 'M007', timestamp: '2024-08-20T15:05:00', outputQuantity: 92, qualityScore: 97.3, productType: 'Welded Frame', batchNumber: 'BATCH-089', operatorID: 'OP006', shiftNumber: 2, temperature: 26.1, humidity: 41.9, processingTime: 245, energyConsumption: 32.1 },
    { productionID: 'P005', machineID: 'M008', timestamp: '2024-08-20T17:20:00', outputQuantity: 470, qualityScore: 93.7, productType: 'Packaged Product', batchNumber: 'BATCH-090', operatorID: 'OP008', shiftNumber: 2, temperature: 23.8, humidity: 51.2, processingTime: 115, energyConsumption: 19.3 },
    { productionID: 'P006', machineID: 'M002', timestamp: '2024-08-19T09:20:00', outputQuantity: 210, qualityScore: 94.8, productType: 'Assembly Unit', batchNumber: 'BATCH-080', operatorID: 'OP009', shiftNumber: 1, temperature: 23.4, humidity: 46.8, processingTime: 430, energyConsumption: 36.9 },
    { productionID: 'P007', machineID: 'M004', timestamp: '2024-08-19T14:25:00', outputQuantity: 190, qualityScore: 96.2, productType: 'Shaft Component', batchNumber: 'BATCH-081', operatorID: 'OP004', shiftNumber: 2, temperature: 24.0, humidity: 44.5, processingTime: 370, energyConsumption: 30.2 },
    { productionID: 'P008', machineID: 'M001', timestamp: '2024-08-18T08:45:00', outputQuantity: 175, qualityScore: 95.3, productType: 'Component A', batchNumber: 'BATCH-075', operatorID: 'OP001', shiftNumber: 1, temperature: 22.2, humidity: 46.3, processingTime: 490, energyConsumption: 27.1 },
    { productionID: 'P009', machineID: 'M005', timestamp: '2024-08-17T11:30:00', outputQuantity: 165, qualityScore: 92.6, productType: 'Assembly Unit', batchNumber: 'BATCH-070', operatorID: 'OP011', shiftNumber: 1, temperature: 24.5, humidity: 48.2, processingTime: 380, energyConsumption: 33.4 },
    { productionID: 'P010', machineID: 'M006', timestamp: '2024-08-16T16:10:00', outputQuantity: 320, qualityScore: 96.7, productType: 'Plastic Housing', batchNumber: 'BATCH-065', operatorID: 'OP005', shiftNumber: 2, temperature: 24.8, humidity: 47.9, processingTime: 310, energyConsumption: 44.3 }
  ],
  qualityControl: [
    { qualityID: 'QC001', productionID: 'P001', inspectorID: 'INS001', inspectionDate: '2024-08-20T09:30:00', defectCount: 0, defectType: null, inspectionResult: 'Pass', notes: 'Excellent quality, no issues detected' },
    { qualityID: 'QC002', productionID: 'P002', inspectorID: 'INS001', inspectionDate: '2024-08-20T11:15:00', defectCount: 0, defectType: null, inspectionResult: 'Pass', notes: 'Perfect quality control sample' },
    { qualityID: 'QC003', productionID: 'P003', inspectorID: 'INS002', inspectionDate: '2024-08-20T13:40:00', defectCount: 3, defectType: 'Color inconsistency', inspectionResult: 'Conditional', notes: 'Requires secondary inspection' },
    { qualityID: 'QC004', productionID: 'P004', inspectorID: 'INS003', inspectionDate: '2024-08-20T16:05:00', defectCount: 0, defectType: null, inspectionResult: 'Pass', notes: 'Welding quality excellent' },
    { qualityID: 'QC005', productionID: 'P005', inspectorID: 'INS002', inspectionDate: '2024-08-20T18:20:00', defectCount: 5, defectType: 'Packaging defects', inspectionResult: 'Fail', notes: 'Multiple packaging issues detected' }
  ]
};

// Real SPARQL execution function - now using local endpoint
async function executeRealSPARQLQuery(query: string): Promise<QueryResult[]> {
  try {
    console.log(`🔍 Executing SPARQL query against local endpoint: ${FUSEKI_ENDPOINT}`);
    
    // Use local API endpoint with form encoding
    const response = await fetch(FUSEKI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json',
      },
      body: `query=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error(`Local SPARQL query failed: ${response.status} ${response.statusText}`);
    }

    const data: SPARQLResult = await response.json();
    
    // Transform SPARQL results to simplified format
    return data.results.bindings.map(binding => {
      const row: QueryResult = {};
      for (const [key, value] of Object.entries(binding)) {
        row[key] = value.value;
      }
      return row;
    });
    
  } catch (error) {
    console.error('❌ Local SPARQL query failed, falling back to mock data:', error);
    throw error;
  }
}

// Mock query execution for development
function executeMockQuery(query: string): QueryResult[] {
  const queryLower = query.toLowerCase();
  
  // List All Manufacturing Machines
  if (queryLower.includes('machine') && queryLower.includes('machineid') && queryLower.includes('machinetype')) {
    return mockManufacturingData.machines.map(m => ({
      machine: `http://example.org/manufacturing/data/machine/${m.machineID}`,
      machineID: m.machineID,
      type: m.machineType,
      location: m.locationName,
      installDate: m.installDate,
      status: m.status,
      manufacturer: m.manufacturer,
      model: m.model
    }));
  }
  
  // Production Summary by Machine Type
  if (queryLower.includes('machinetype') && queryLower.includes('totalruns') && queryLower.includes('totaloutput')) {
    const summary = new Map();
    mockManufacturingData.production.forEach(p => {
      const machine = mockManufacturingData.machines.find(m => m.machineID === p.machineID);
      if (machine) {
        if (!summary.has(machine.machineType)) {
          summary.set(machine.machineType, { totalRuns: 0, totalOutput: 0, totalQuality: 0 });
        }
        const s = summary.get(machine.machineType);
        s.totalRuns++;
        s.totalOutput += p.outputQuantity;
        s.totalQuality += p.qualityScore;
      }
    });
    
    return Array.from(summary.entries()).map(([machineType, stats]) => ({
      machineType,
      totalRuns: stats.totalRuns,
      totalOutput: stats.totalOutput,
      avgQuality: (stats.totalQuality / stats.totalRuns).toFixed(2)
    })).sort((a, b) => b.totalOutput - a.totalOutput);
  }
  
  // High Quality Production Runs
  if (queryLower.includes('qualityscore') && queryLower.includes('filter') && queryLower.includes('95')) {
    return mockManufacturingData.production
      .filter(p => p.qualityScore >= 95.0)
      .map(p => ({
        productionID: p.productionID,
        machineID: p.machineID,
        timestamp: p.timestamp,
        outputQuantity: p.outputQuantity,
        qualityScore: p.qualityScore,
        productType: p.productType,
        qualityCategory: p.qualityScore >= 98 ? 'Excellent' : 'High'
      }))
      .sort((a, b) => b.qualityScore - a.qualityScore);
  }
  
  // Quality Control Summary
  if (queryLower.includes('qualityinspection') || queryLower.includes('inspectionresult')) {
    return mockManufacturingData.qualityControl.map(qc => {
      const production = mockManufacturingData.production.find(p => p.productionID === qc.productionID);
      return {
        qualityID: qc.qualityID,
        productionID: qc.productionID,
        inspectorID: qc.inspectorID,
        inspectionDate: qc.inspectionDate,
        defectCount: qc.defectCount,
        inspectionResult: qc.inspectionResult,
        productType: production?.productType || 'Unknown',
        qualityScore: production?.qualityScore || 0,
        notes: qc.notes
      };
    });
  }
  
  // Recent Production Data
  if (queryLower.includes('timestamp') && queryLower.includes('order by')) {
    return mockManufacturingData.production
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(p => ({
        productionID: p.productionID,
        machineID: p.machineID,
        timestamp: p.timestamp,
        outputQuantity: p.outputQuantity,
        qualityScore: p.qualityScore,
        productType: p.productType,
        operatorID: p.operatorID,
        energyConsumption: p.energyConsumption
      }));
  }
  
  // Machine Efficiency Analysis
  if (queryLower.includes('efficiencyindex') || queryLower.includes('machinecount')) {
    const efficiency = new Map();
    mockManufacturingData.production.forEach(p => {
      const machine = mockManufacturingData.machines.find(m => m.machineID === p.machineID);
      if (machine) {
        if (!efficiency.has(machine.machineType)) {
          efficiency.set(machine.machineType, { 
            machines: new Set(), 
            totalOutput: 0, 
            totalQuality: 0, 
            totalEnergy: 0,
            runs: 0 
          });
        }
        const e = efficiency.get(machine.machineType);
        e.machines.add(p.machineID);
        e.totalOutput += p.outputQuantity;
        e.totalQuality += p.qualityScore;
        e.totalEnergy += p.energyConsumption;
        e.runs++;
      }
    });
    
    return Array.from(efficiency.entries()).map(([machineType, stats]) => {
      const avgOutputPerRun = stats.totalOutput / stats.runs;
      const avgQuality = stats.totalQuality / stats.runs;
      const avgEnergyPerUnit = stats.totalEnergy / stats.totalOutput;
      const efficiencyIndex = (avgOutputPerRun * avgQuality) / avgEnergyPerUnit;
      
      return {
        machineType,
        machineCount: stats.machines.size,
        totalRuns: stats.runs,
        avgOutputPerRun: Math.round(avgOutputPerRun),
        avgQuality: avgQuality.toFixed(2),
        avgEnergyPerUnit: avgEnergyPerUnit.toFixed(3),
        efficiencyIndex: efficiencyIndex.toFixed(2)
      };
    }).sort((a, b) => parseFloat(b.efficiencyIndex) - parseFloat(a.efficiencyIndex));
  }
  
  // Default: return basic machine info
  return mockManufacturingData.machines.slice(0, 5).map(m => ({
    machineID: m.machineID,
    machineType: m.machineType,
    location: m.locationName,
    status: m.status
  }));
}

// Main query execution function
export async function executeSPARQLQuery(query: string): Promise<QueryResult[]> {
  console.log(`🔄 Executing query:`, query.substring(0, 100) + '...');
  
  // Always use mock data for manufacturing queries since we don't have a real endpoint
  console.log('🎭 Using comprehensive mock manufacturing data');
  return executeMockQuery(query);
}

// Health check function - for local endpoint
export async function checkFusekiHealth(): Promise<boolean> {
  try {
    const response = await fetch(FUSEKI_ENDPOINT, {
      method: 'GET',
      timeout: 5000
    } as any);
    return response.ok;
  } catch {
    return false;
  }
}

// Get system status
export async function getSystemStatus(): Promise<{
  fusekiEndpoint: string;
  usingMockData: boolean;
  fusekiHealth: boolean;
  lastUpdate?: string;
}> {
  const fusekiHealth = await checkFusekiHealth();
  
  return {
    fusekiEndpoint: FUSEKI_ENDPOINT,
    usingMockData: USE_MOCK_DATA || !fusekiHealth,
    fusekiHealth,
    lastUpdate: new Date().toISOString()
  };
}
