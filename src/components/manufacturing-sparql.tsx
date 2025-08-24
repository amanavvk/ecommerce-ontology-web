'use client';

import { useState } from 'react';
import { 
  PlayCircle, 
  Database, 
  Copy, 
  Download,
  ChevronRight,
  Factory,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';

// Simple component replacements
const Card = ({ children, className = '', ...props }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

const CardDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
)

const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: any) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  }
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-8'
  }
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}

const Badge = ({ children, className = '', variant = 'default' }: any) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    outline: 'border border-gray-300 text-gray-700',
    secondary: 'bg-gray-100 text-gray-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Tabs = ({ children, defaultValue, className = '' }: any) => (
  <div className={className}>{children}</div>
)

const TabsList = ({ children, className = '' }: any) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
    {children}
  </div>
)

const TabsTrigger = ({ children, value, className = '' }: any) => (
  <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm ${className}`}>
    {children}
  </button>
)

const TabsContent = ({ children, value, className = '' }: any) => (
  <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
    {children}
  </div>
)

interface ManufacturingQuery {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'analytics' | 'validation' | 'performance';
  sparql: string;
  expectedResults?: string;
}

const manufacturingQueries: ManufacturingQuery[] = [
  {
    id: 'machines-list',
    title: 'List All Machines',
    description: 'Retrieve all machines with their properties',
    category: 'basic',
    sparql: `PREFIX mfg: <http://example.org/manufacturing#>
PREFIX ex: <http://example.org/manufacturing/data/>

SELECT ?machine ?machineID ?type ?location ?installDate WHERE {
  ?machine a mfg:Machine ;
           mfg:machineID ?machineID ;
           mfg:machineType ?type ;
           mfg:locationName ?location ;
           mfg:installDate ?installDate .
} ORDER BY ?machineID`,
    expectedResults: 'List of all machines with their IDs, types, locations, and installation dates'
  },
  {
    id: 'machine-production',
    title: 'Production for Specific Machine',
    description: 'Find all production runs for machine M001',
    category: 'basic',
    sparql: `SELECT ?production ?productionID ?timestamp ?quantity ?qualityScore WHERE {
  <http://example.org/manufacturing/data/machine/M001> mfg:hasProduction ?production .
  ?production mfg:productionID ?productionID ;
              mfg:timestamp ?timestamp ;
              mfg:outputQuantity ?quantity ;
              mfg:hasQualityMeasurement ?qm .
  ?qm mfg:qualityScore ?qualityScore .
} ORDER BY ?timestamp`,
    expectedResults: 'Production runs for machine M001 with quality scores'
  },
  {
    id: 'quality-by-type',
    title: 'Average Quality by Machine Type',
    description: 'Calculate average quality scores grouped by machine type',
    category: 'analytics',
    sparql: `SELECT ?machineType (AVG(?qualityScore) as ?avgQuality) (COUNT(?production) as ?productionCount) WHERE {
  ?machine a mfg:Machine ;
           mfg:machineType ?machineType ;
           mfg:hasProduction ?production .
  ?production mfg:hasQualityMeasurement ?qm .
  ?qm mfg:qualityScore ?qualityScore .
} GROUP BY ?machineType
ORDER BY DESC(?avgQuality)`,
    expectedResults: 'Machine types ranked by average quality with production counts'
  },
  {
    id: 'high-quality-runs',
    title: 'High Quality Production Runs',
    description: 'Find production runs with quality score >= 95',
    category: 'analytics',
    sparql: `SELECT ?production ?machine ?machineType ?qualityScore ?outputQuantity WHERE {
  ?production a mfg:ProductionRun ;
              mfg:producedBy ?machine ;
              mfg:outputQuantity ?outputQuantity ;
              mfg:hasQualityMeasurement ?qm .
  ?machine mfg:machineType ?machineType .
  ?qm mfg:qualityScore ?qualityScore .
  FILTER(?qualityScore >= 95.0)
} ORDER BY DESC(?qualityScore)`,
    expectedResults: 'Production runs with exceptional quality (95+ score)'
  },
  {
    id: 'machine-efficiency',
    title: 'Machine Efficiency Analysis',
    description: 'Calculate output efficiency per machine',
    category: 'performance',
    sparql: `SELECT ?machine ?machineType 
       (SUM(?outputQuantity) as ?totalOutput)
       (COUNT(?production) as ?productionRuns)
       (SUM(?outputQuantity) / COUNT(?production) as ?avgOutput) WHERE {
  ?machine a mfg:Machine ;
           mfg:machineType ?machineType ;
           mfg:hasProduction ?production .
  ?production mfg:outputQuantity ?outputQuantity .
} GROUP BY ?machine ?machineType
ORDER BY DESC(?avgOutput)`,
    expectedResults: 'Machines ranked by average output per production run'
  },
  {
    id: 'validation-check',
    title: 'Data Validation Check',
    description: 'Count entities by type for validation',
    category: 'validation',
    sparql: `SELECT ?type (COUNT(?entity) as ?count) WHERE {
  ?entity a ?type .
  FILTER(?type IN (mfg:Machine, mfg:ProductionRun, mfg:QualityMeasurement))
} GROUP BY ?type`,
    expectedResults: 'Count of each entity type in the knowledge graph'
  }
];

const categoryIcons = {
  basic: <Database className="w-4 h-4" />,
  analytics: <BarChart3 className="w-4 h-4" />,
  validation: <Factory className="w-4 h-4" />,
  performance: <TrendingUp className="w-4 h-4" />
};

const categoryColors = {
  basic: 'bg-blue-50 text-blue-700 border-blue-200',
  analytics: 'bg-green-50 text-green-700 border-green-200',
  validation: 'bg-purple-50 text-purple-700 border-purple-200',
  performance: 'bg-orange-50 text-orange-700 border-orange-200'
};

export default function ManufacturingSPARQL() {
  const [selectedQuery, setSelectedQuery] = useState<ManufacturingQuery>(manufacturingQueries[0]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async (query: ManufacturingQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/sparql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.sparql }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results?.bindings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const groupedQueries = manufacturingQueries.reduce((acc, query) => {
    if (!acc[query.category]) {
      acc[query.category] = [];
    }
    acc[query.category].push(query);
    return acc;
  }, {} as Record<string, ManufacturingQuery[]>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Manufacturing Queries
              </CardTitle>
              <CardDescription>
                Pre-built SPARQL queries for manufacturing data analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="mt-0">
                  <div className="space-y-2 p-4">
                    {[...groupedQueries.basic || [], ...groupedQueries.validation || []].map((query) => (
                      <div
                        key={query.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedQuery.id === query.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedQuery(query)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{query.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{query.description}</p>
                          </div>
                          <Badge className={`ml-2 ${categoryColors[query.category]}`}>
                            {categoryIcons[query.category]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-0">
                  <div className="space-y-2 p-4">
                    {[...groupedQueries.analytics || [], ...groupedQueries.performance || []].map((query) => (
                      <div
                        key={query.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedQuery.id === query.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedQuery(query)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{query.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{query.description}</p>
                          </div>
                          <Badge className={`ml-2 ${categoryColors[query.category]}`}>
                            {categoryIcons[query.category]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Query Editor & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    {categoryIcons[selectedQuery.category]}
                    <span className="ml-2">{selectedQuery.title}</span>
                  </CardTitle>
                  <CardDescription>{selectedQuery.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedQuery.sparql)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => executeQuery(selectedQuery)}
                    disabled={loading}
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    {loading ? 'Running...' : 'Execute'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">SPARQL Query:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto border">
                    <code>{selectedQuery.sparql}</code>
                  </pre>
                </div>
                
                {selectedQuery.expectedResults && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Expected Results:</h4>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {selectedQuery.expectedResults}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Query Results</CardTitle>
              <CardDescription>
                {results.length > 0 ? `Found ${results.length} result(s)` : 'No results yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm">Error: {error}</p>
                </div>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Executing query...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(results[0]).map((key) => (
                          <th key={key} className="border border-gray-200 px-3 py-2 text-left font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-200 px-3 py-2">
                              {typeof value === 'object' ? value?.value || JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Execute" to run the selected query</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
