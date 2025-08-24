
// Mock manufacturing data for demonstration
const mockManufacturingData = {
  machines: [
    { machineID: 'M001', machineType: 'CNC Mill', locationName: 'Production Floor A', installDate: '2020-01-15' },
    { machineID: 'M002', machineType: 'Assembly Line', locationName: 'Production Floor B', installDate: '2019-06-20' },
    { machineID: 'M003', machineType: 'Quality Control Station', locationName: 'QC Department', installDate: '2021-03-10' },
    { machineID: 'M004', machineType: 'CNC Lathe', locationName: 'Production Floor A', installDate: '2020-09-05' },
    { machineID: 'M005', machineType: 'Assembly Line', locationName: 'Production Floor C', installDate: '2018-11-12' }
  ],
  production: [
    { productionID: 'P001', machineID: 'M001', timestamp: '2024-01-15T08:00:00', outputQuantity: 150, qualityScore: 96.5 },
    { productionID: 'P002', machineID: 'M002', timestamp: '2024-01-15T09:30:00', outputQuantity: 200, qualityScore: 94.2 },
    { productionID: 'P003', machineID: 'M003', timestamp: '2024-01-15T11:00:00', outputQuantity: 75, qualityScore: 98.7 },
    { productionID: 'P004', machineID: 'M001', timestamp: '2024-01-15T14:00:00', outputQuantity: 180, qualityScore: 97.1 },
    { productionID: 'P005', machineID: 'M004', timestamp: '2024-01-16T08:30:00', outputQuantity: 120, qualityScore: 95.8 },
    { productionID: 'P006', machineID: 'M002', timestamp: '2024-01-16T10:15:00', outputQuantity: 220, qualityScore: 93.4 },
    { productionID: 'P007', machineID: 'M005', timestamp: '2024-01-16T13:45:00', outputQuantity: 190, qualityScore: 96.9 },
    { productionID: 'P008', machineID: 'M003', timestamp: '2024-01-17T09:00:00', outputQuantity: 85, qualityScore: 99.2 },
    { productionID: 'P009', machineID: 'M004', timestamp: '2024-01-17T11:30:00', outputQuantity: 165, qualityScore: 97.6 },
    { productionID: 'P010', machineID: 'M001', timestamp: '2024-01-17T15:20:00', outputQuantity: 175, qualityScore: 95.3 }
  ]
};

function executeMockQuery(query: string): any[] {
  const queryLower = query.toLowerCase();
  
  // List All Manufacturing Machines
  if (queryLower.includes('machine') && queryLower.includes('machineid') && queryLower.includes('machinetype')) {
    return mockManufacturingData.machines.map(m => ({
      machine: `http://example.org/manufacturing/data/machine/${m.machineID}`,
      machineID: m.machineID,
      type: m.machineType,
      location: m.locationName,
      installDate: m.installDate
    }));
  }
  
  // Production Summary by Machine
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
        qualityScore: p.qualityScore
      }))
      .sort((a, b) => b.qualityScore - a.qualityScore);
  }
  
  // Machine Efficiency Analysis
  if (queryLower.includes('efficiencyindex') && queryLower.includes('machinecount')) {
    const efficiency = new Map();
    mockManufacturingData.production.forEach(p => {
      const machine = mockManufacturingData.machines.find(m => m.machineID === p.machineID);
      if (machine) {
        if (!efficiency.has(machine.machineType)) {
          efficiency.set(machine.machineType, { 
            machines: new Set(), 
            totalOutput: 0, 
            totalQuality: 0, 
            runs: 0 
          });
        }
        const e = efficiency.get(machine.machineType);
        e.machines.add(p.machineID);
        e.totalOutput += p.outputQuantity;
        e.totalQuality += p.qualityScore;
        e.runs++;
      }
    });
    
    return Array.from(efficiency.entries()).map(([machineType, stats]) => {
      const avgOutputPerRun = stats.totalOutput / stats.runs;
      const avgQuality = stats.totalQuality / stats.runs;
      const efficiencyIndex = (avgOutputPerRun * avgQuality / 100);
      
      return {
        machineType,
        machineCount: stats.machines.size,
        avgOutputPerRun: avgOutputPerRun.toFixed(1),
        avgQuality: avgQuality.toFixed(2),
        efficiencyIndex: efficiencyIndex.toFixed(2)
      };
    }).sort((a, b) => parseFloat(b.efficiencyIndex) - parseFloat(a.efficiencyIndex));
  }
  
  // Recent Production Activity
  if (queryLower.includes('timestamp') && queryLower.includes('2024-01-15')) {
    return mockManufacturingData.production
      .filter(p => p.timestamp >= '2024-01-15T00:00:00')
      .map(p => ({
        productionID: p.productionID,
        machineID: p.machineID,
        timestamp: p.timestamp,
        outputQuantity: p.outputQuantity,
        qualityScore: p.qualityScore
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Data Integrity Validation
  if (queryLower.includes('entitytype') && queryLower.includes('count')) {
    return [
      { entityType: 'Machine', count: mockManufacturingData.machines.length },
      { entityType: 'ProductionRun', count: mockManufacturingData.production.length },
      { entityType: 'QualityMeasurement', count: mockManufacturingData.production.length }
    ];
  }
  
  // Default fallback
  return mockManufacturingData.machines.slice(0, 5).map(m => ({
    machineID: m.machineID,
    machineType: m.machineType,
    locationName: m.locationName,
    installDate: m.installDate
  }));
}

// Mock e-commerce data that matches the exact TTL files in public/data2/
function getEcommerceMockData(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // All Products query - for "product" and "name" but not other specific fields
  if (lowerQuery.includes('product') && lowerQuery.includes('name') && !lowerQuery.includes('productname') && !lowerQuery.includes('price') && !lowerQuery.includes('category')) {
    return [
      { product: 'http://www.example.org/ecommerce#prod1', name: 'iPhone 14 Pro' },
      { product: 'http://www.example.org/ecommerce#prod2', name: 'Samsung Galaxy S23' },
      { product: 'http://www.example.org/ecommerce#prod3', name: 'Dell XPS 13' },
      { product: 'http://www.example.org/ecommerce#prod4', name: 'MacBook Air M2' },
      { product: 'http://www.example.org/ecommerce#prod5', name: 'HP Spectre x360' }
    ];
  }
  
  // All Users query - for "user" and "name" but not other specific fields
  if (lowerQuery.includes('user') && lowerQuery.includes('name') && !lowerQuery.includes('username') && !lowerQuery.includes('email') && !lowerQuery.includes('order')) {
    return [
      { user: 'http://www.example.org/ecommerce#user1', name: 'alice_johnson' },
      { user: 'http://www.example.org/ecommerce#user2', name: 'bob_smith' },
      { user: 'http://www.example.org/ecommerce#user3', name: 'charlie_brown' },
      { user: 'http://www.example.org/ecommerce#user4', name: 'diana_prince' },
      { user: 'http://www.example.org/ecommerce#user5', name: 'edward_norton' }
    ];
  }
  
  // All Orders query - just orders without other details
  if (lowerQuery.includes('order') && !lowerQuery.includes('product') && !lowerQuery.includes('user') && !lowerQuery.includes('placed') && !lowerQuery.includes('contains') && !lowerQuery.includes('price')) {
    return [
      { order: 'http://www.example.org/ecommerce#order1' },
      { order: 'http://www.example.org/ecommerce#order2' },
      { order: 'http://www.example.org/ecommerce#order3' },
      { order: 'http://www.example.org/ecommerce#order4' },
      { order: 'http://www.example.org/ecommerce#order5' }
    ];
  }
  
  // Products in Orders - containsProduct relationship
  if (lowerQuery.includes('order') && lowerQuery.includes('product') && lowerQuery.includes('containsproduct')) {
    return [
      { order: 'http://www.example.org/ecommerce#order1', product: 'http://www.example.org/ecommerce#prod1' },
      { order: 'http://www.example.org/ecommerce#order1', product: 'http://www.example.org/ecommerce#prod2' },
      { order: 'http://www.example.org/ecommerce#order2', product: 'http://www.example.org/ecommerce#prod3' },
      { order: 'http://www.example.org/ecommerce#order2', product: 'http://www.example.org/ecommerce#prod4' },
      { order: 'http://www.example.org/ecommerce#order3', product: 'http://www.example.org/ecommerce#prod5' }
    ];
  }
  
  // Orders with User and Product Details - complex join query
  if (lowerQuery.includes('username') && lowerQuery.includes('productname') && lowerQuery.includes('productprice')) {
    return [
      { order: 'http://www.example.org/ecommerce#order1', userName: 'alice_johnson', productName: 'iPhone 14 Pro', productPrice: '999.99' },
      { order: 'http://www.example.org/ecommerce#order1', userName: 'alice_johnson', productName: 'Samsung Galaxy S23', productPrice: '899.99' },
      { order: 'http://www.example.org/ecommerce#order2', userName: 'bob_smith', productName: 'Dell XPS 13', productPrice: '1299.99' },
      { order: 'http://www.example.org/ecommerce#order2', userName: 'bob_smith', productName: 'MacBook Air M2', productPrice: '1199.99' },
      { order: 'http://www.example.org/ecommerce#order3', userName: 'charlie_brown', productName: 'HP Spectre x360', productPrice: '1399.99' }
    ];
  }
  
  // Users with More Than One Order - group by query with count
  if (lowerQuery.includes('count') && lowerQuery.includes('group by') && lowerQuery.includes('having')) {
    return [
      { userName: 'alice_johnson', orderCount: '3' },
      { userName: 'bob_smith', orderCount: '2' },
      { userName: 'charlie_brown', orderCount: '2' }
    ];
  }
  
  // Products Never Ordered - filter not exists
  if (lowerQuery.includes('filter not exists')) {
    return [
      { product: 'http://www.example.org/ecommerce#prod9', productName: 'Microsoft Surface Pro 9' },
      { product: 'http://www.example.org/ecommerce#prod10', productName: 'Nintendo Switch OLED' }
    ];
  }
  
  // Top Categories by Product Count - group by with count and order by
  if (lowerQuery.includes('category') && lowerQuery.includes('count') && lowerQuery.includes('group by') && lowerQuery.includes('order by')) {
    return [
      { category: 'http://www.example.org/ecommerce#cat2', productCount: '4' },
      { category: 'http://www.example.org/ecommerce#cat3', productCount: '3' },
      { category: 'http://www.example.org/ecommerce#cat4', productCount: '2' },
      { category: 'http://www.example.org/ecommerce#cat1', productCount: '2' },
      { category: 'http://www.example.org/ecommerce#cat5', productCount: '1' }
    ];
  }
  
  // Order Total Value - sum calculation
  if (lowerQuery.includes('sum') && lowerQuery.includes('totalvalue')) {
    return [
      { order: 'http://www.example.org/ecommerce#order1', totalValue: '1899.98' },
      { order: 'http://www.example.org/ecommerce#order2', totalValue: '2499.98' },
      { order: 'http://www.example.org/ecommerce#order3', totalValue: '1399.99' },
      { order: 'http://www.example.org/ecommerce#order4', totalValue: '649.98' },
      { order: 'http://www.example.org/ecommerce#order5', totalValue: '1099.99' }
    ];
  }
  
  // Hierarchical Classification - products with categories and labels
  if (lowerQuery.includes('categorylabel') || (lowerQuery.includes('productname') && lowerQuery.includes('category') && lowerQuery.includes('rdfs:label'))) {
    return [
      { product: 'http://www.example.org/ecommerce#prod1', productName: 'iPhone 14 Pro', category: 'http://www.example.org/ecommerce#cat3', categoryLabel: 'Smartphones' },
      { product: 'http://www.example.org/ecommerce#prod2', productName: 'Samsung Galaxy S23', category: 'http://www.example.org/ecommerce#cat3', categoryLabel: 'Smartphones' },
      { product: 'http://www.example.org/ecommerce#prod3', productName: 'Dell XPS 13', category: 'http://www.example.org/ecommerce#cat2', categoryLabel: 'Computers' },
      { product: 'http://www.example.org/ecommerce#prod4', productName: 'MacBook Air M2', category: 'http://www.example.org/ecommerce#cat2', categoryLabel: 'Computers' },
      { product: 'http://www.example.org/ecommerce#prod5', productName: 'HP Spectre x360', category: 'http://www.example.org/ecommerce#cat2', categoryLabel: 'Computers' }
    ];
  }
  
  // Product Relationships - related products
  if (lowerQuery.includes('related') && lowerQuery.includes('relationtype')) {
    return [
      { product: 'http://www.example.org/ecommerce#prod1', productName: 'iPhone 14 Pro', related: 'http://www.example.org/ecommerce#prod7', relatedName: 'AirPods Pro 2', relationType: 'hasAccessory' },
      { product: 'http://www.example.org/ecommerce#prod3', productName: 'Dell XPS 13', related: 'http://www.example.org/ecommerce#prod4', relatedName: 'MacBook Air M2', relationType: 'isRelatedTo' },
      { product: 'http://www.example.org/ecommerce#prod6', productName: 'Sony WH-1000XM5', related: 'http://www.example.org/ecommerce#prod7', relatedName: 'AirPods Pro 2', relationType: 'isRelatedTo' }
    ];
  }
  
  // Search & Recommendation - contains filter
  if (lowerQuery.includes('contains') && lowerQuery.includes('filter')) {
    return [
      { product: 'http://www.example.org/ecommerce#prod6', productName: 'Sony WH-1000XM5', category: 'http://www.example.org/ecommerce#cat4' },
      { product: 'http://www.example.org/ecommerce#prod7', productName: 'AirPods Pro 2', category: 'http://www.example.org/ecommerce#cat4' }
    ];
  }
  
  // Inventory & Pricing - inventory and price data
  if (lowerQuery.includes('inventory') || (lowerQuery.includes('price') && !lowerQuery.includes('productprice') && !lowerQuery.includes('totalvalue'))) {
    return [
      { product: 'http://www.example.org/ecommerce#prod1', productName: 'iPhone 14 Pro', inventory: '50', price: '999.99' },
      { product: 'http://www.example.org/ecommerce#prod2', productName: 'Samsung Galaxy S23', inventory: '35', price: '899.99' },
      { product: 'http://www.example.org/ecommerce#prod3', productName: 'Dell XPS 13', inventory: '25', price: '1299.99' },
      { product: 'http://www.example.org/ecommerce#prod4', productName: 'MacBook Air M2', inventory: '40', price: '1199.99' },
      { product: 'http://www.example.org/ecommerce#prod5', productName: 'HP Spectre x360', inventory: '15', price: '1399.99' }
    ];
  }
  
  // All Users query with userName - more specific matching
  if (lowerQuery.includes('user') && lowerQuery.includes('username') && !lowerQuery.includes('order') && !lowerQuery.includes('email')) {
    return [
      { user: 'http://www.example.org/ecommerce#user1', userName: 'alice_johnson' },
      { user: 'http://www.example.org/ecommerce#user2', userName: 'bob_smith' },
      { user: 'http://www.example.org/ecommerce#user3', userName: 'charlie_brown' },
      { user: 'http://www.example.org/ecommerce#user4', userName: 'diana_prince' },
      { user: 'http://www.example.org/ecommerce#user5', userName: 'edward_norton' }
    ];
  }
  
  // All Products query with productName - more specific matching
  if (lowerQuery.includes('product') && lowerQuery.includes('productname') && !lowerQuery.includes('category') && !lowerQuery.includes('price') && !lowerQuery.includes('order')) {
    return [
      { product: 'http://www.example.org/ecommerce#prod1', productName: 'iPhone 14 Pro' },
      { product: 'http://www.example.org/ecommerce#prod2', productName: 'Samsung Galaxy S23' },
      { product: 'http://www.example.org/ecommerce#prod3', productName: 'Dell XPS 13' },
      { product: 'http://www.example.org/ecommerce#prod4', productName: 'MacBook Air M2' },
      { product: 'http://www.example.org/ecommerce#prod5', productName: 'HP Spectre x360' }
    ];
  }
  
  // Default fallback - return sample products data from data2
  return [
    { product: 'http://www.example.org/ecommerce#prod1', productName: 'iPhone 14 Pro', productPrice: '999.99' },
    { product: 'http://www.example.org/ecommerce#prod2', productName: 'Samsung Galaxy S23', productPrice: '899.99' },
    { product: 'http://www.example.org/ecommerce#prod3', productName: 'Dell XPS 13', productPrice: '1299.99' },
    { product: 'http://www.example.org/ecommerce#prod4', productName: 'MacBook Air M2', productPrice: '1199.99' },
    { product: 'http://www.example.org/ecommerce#prod5', productName: 'HP Spectre x360', productPrice: '1399.99' }
  ];
}

export async function fetchSparqlResults(query: string) {
  // Check if this is a manufacturing query
  if (query.toLowerCase().includes('manufacturing') || 
      query.toLowerCase().includes('mfg:') || 
      query.toLowerCase().includes('machine') ||
      query.toLowerCase().includes('production')) {
    
    // Use mock data for manufacturing queries
    const results = executeMockQuery(query);
    return { results: { bindings: results } };
  }
  
  // For e-commerce queries, try the real endpoint first (for localhost)
  try {
    const endpoint = 'http://localhost:3030/ecommerce/sparql';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json',
        },
        body: query,
    });
    
    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    // Convert SPARQL JSON results to your expected format
    const bindings = data.results.bindings.map((row: any) => {
        const obj: Record<string, any> = {};
        for (const key in row) {
            obj[key] = row[key].value;
        }
        return obj;
    });
    return { results: { bindings } };
  } catch (error) {
    // If real endpoint fails (like on Vercel), return exact mock data matching TTL files
    const mockData = getEcommerceMockData(query);
    return { 
      results: { 
        bindings: mockData
      } 
    };
  }
}
