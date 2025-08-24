'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const R2RMLCaseStudy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const processSteps = [
    {
      phase: 'Phase 1: Analysis',
      duration: 'Week 1-2',
      tasks: [
        'Database schema analysis',
        'Data profiling and quality assessment',
        'Ontology alignment analysis',
        'Identify mapping patterns'
      ],
      deliverables: ['Schema documentation', 'Data quality report', 'Mapping strategy']
    },
    {
      phase: 'Phase 2: Core Mappings',
      duration: 'Week 3-4',
      tasks: [
        'Implement basic R2RML mappings',
        'Create Machine and Production mappings',
        'Test RDF generation',
        'Validate output quality'
      ],
      deliverables: ['Basic R2RML files', 'Sample RDF output', 'Validation results']
    },
    {
      phase: 'Phase 3: Advanced Features',
      duration: 'Week 5-6',
      tasks: [
        'Implement relationship mappings',
        'Add conditional and aggregate mappings',
        'Performance optimization',
        'IoT integration preparation'
      ],
      deliverables: ['Complete R2RML mappings', 'Performance benchmarks', 'IoT integration plan']
    }
  ];

  const mappingTypes = [
    {
      type: 'Entity Mappings',
      description: 'Direct table-to-class mappings',
      examples: ['Machine → mfg:Machine', 'Production → mfg:ProductionRun'],
      complexity: 'Low'
    },
    {
      type: 'Property Mappings',
      description: 'Column-to-property mappings',
      examples: ['MachineID → mfg:machineID', 'Quality_Score → mfg:qualityScore'],
      complexity: 'Low'
    },
    {
      type: 'Relationship Mappings',
      description: 'Foreign key relationships',
      examples: ['producedBy', 'hasQualityMeasurement'],
      complexity: 'Medium'
    },
    {
      type: 'Derived Mappings',
      description: 'Calculated and conditional mappings',
      examples: ['Efficiency calculations', 'CNC machine specialization'],
      complexity: 'High'
    }
  ];

  const qualityMetrics = [
    { metric: 'Data Completeness', target: '95%', achieved: '97%', status: 'success' },
    { metric: 'Mapping Coverage', target: '100%', achieved: '100%', status: 'success' },
    { metric: 'RDF Validation', target: '100%', achieved: '100%', status: 'success' },
    { metric: 'Performance (rec/sec)', target: '1000', achieved: '1250', status: 'success' },
    { metric: 'Data Quality Score', target: '90%', achieved: '94%', status: 'success' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          R2RML Manufacturing Database Integration Case Study
        </h1>
        <p className="text-lg text-gray-600">
          Legacy Database Integration with Modern IoT Systems using Semantic Technologies
        </p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="mappings">Mappings</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Objectives</CardTitle>
                <CardDescription>Integration goals and scope</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Transform relational manufacturing data to RDF</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Enable semantic interoperability</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Support IoT system integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Maintain data quality and integrity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Database Schema</CardTitle>
                <CardDescription>Legacy relational structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold">Machine Table</h4>
                    <p className="text-sm text-gray-600">MachineID, Type, Location, InstallDate</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold">Production Table</h4>
                    <p className="text-sm text-gray-600">ProductionID, MachineID, Timestamp, Output_Quantity, Quality_Score</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold">Relationships</h4>
                    <p className="text-sm text-gray-600">Machine 1:N Production (via MachineID)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
              <CardDescription>6-week phased approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{step.phase}</h4>
                      <Badge variant="outline">{step.duration}</Badge>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex}>• {task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Analysis Results</CardTitle>
              <CardDescription>Data profiling and quality assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Data Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Machine Records:</span>
                      <span className="font-mono">8 active machines</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Production Records:</span>
                      <span className="font-mono">20 recent runs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Scores:</span>
                      <span className="font-mono">85% coverage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date Range:</span>
                      <span className="font-mono">Aug 20-24, 2025</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quality Issues Identified</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>15% missing quality scores (transport operations)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>Machine type naming variations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>High data integrity (95%+)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Consistent ID patterns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ontology Mapping Analysis</CardTitle>
              <CardDescription>Conceptual mapping between database and ontology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mappingTypes.map((mapping, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{mapping.type}</h4>
                      <Badge variant={mapping.complexity === 'Low' ? 'default' : mapping.complexity === 'Medium' ? 'secondary' : 'destructive'}>
                        {mapping.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{mapping.description}</p>
                    <ul className="space-y-1 text-xs">
                      {mapping.examples.map((example, exIndex) => (
                        <li key={exIndex} className="font-mono text-gray-700">• {example}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>R2RML Mapping Structure</CardTitle>
              <CardDescription>Core mapping components and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Machine Mapping Example</h4>
                  <pre className="text-sm overflow-x-auto">
{`<#MachineMapping>
    rr:logicalTable [ rr:tableName "Machine" ];
    rr:subjectMap [
        rr:template "http://example.org/machine/{MachineID}";
        rr:class mfg:Machine;
    ];
    rr:predicateObjectMap [
        rr:predicate mfg:machineID;
        rr:objectMap [ rr:column "MachineID"; rr:datatype xsd:string ]
    ];`}
                  </pre>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">URI Strategy</h4>
                    <ul className="space-y-1 text-sm">
                      <li><code>http://example.org/machine/{'{MachineID}'}</code></li>
                      <li><code>http://example.org/production/{'{ProductionID}'}</code></li>
                      <li><code>http://example.org/quality/{'{ProductionID}'}</code></li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Template-based URI generation</li>
                      <li>• Data type conversion (XSD)</li>
                      <li>• Relationship preservation</li>
                      <li>• NULL value handling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Mapping Features</CardTitle>
              <CardDescription>Conditional logic, aggregates, and IoT integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Conditional Mappings</h4>
                  <p className="text-sm text-gray-600 mb-2">Type-based specialization</p>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    CNC machines → mfg:CNCMachine
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Aggregate Mappings</h4>
                  <p className="text-sm text-gray-600 mb-2">Calculated metrics</p>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    AVG(Quality_Score) → mfg:efficiency
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">IoT Extensions</h4>
                  <p className="text-sm text-gray-600 mb-2">Real-time sensor data</p>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    sensor_data → mfg:SensorReading
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Process</CardTitle>
              <CardDescription>Step-by-step integration methodology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{step.phase}</h3>
                      <Badge>{step.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Tasks:</h4>
                        <ul className="space-y-1 text-sm">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Deliverables:</h4>
                        <ul className="space-y-1 text-sm">
                          {step.deliverables.map((deliverable, delIndex) => (
                            <li key={delIndex} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance Results</CardTitle>
              <CardDescription>Validation metrics and success criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qualityMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{metric.metric}</h4>
                      <Badge variant={metric.status === 'success' ? 'default' : 'destructive'}>
                        {metric.status === 'success' ? '✓' : '✗'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target:</span>
                        <span className="font-mono">{metric.target}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Achieved:</span>
                        <span className="font-mono font-semibold">{metric.achieved}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated RDF Statistics</CardTitle>
              <CardDescription>Output characteristics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-sm text-gray-600">Machine Entities</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">20</div>
                  <div className="text-sm text-gray-600">Production Runs</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">17</div>
                  <div className="text-sm text-gray-600">Quality Records</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-gray-600">Total Triples</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Deliverables</CardTitle>
              <CardDescription>Complete set of R2RML integration files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Core Files</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">manufacturing-mappings.ttl</div>
                        <div className="text-sm text-gray-600">Complete R2RML mapping file</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">manufacturing.owl</div>
                        <div className="text-sm text-gray-600">Enhanced domain ontology</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">sample-manufacturing-db.sql</div>
                        <div className="text-sm text-gray-600">Source database schema & data</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Documentation</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">R2RML-Integration-Process.md</div>
                        <div className="text-sm text-gray-600">Complete process documentation</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">sample-output.ttl</div>
                        <div className="text-sm text-gray-600">Generated RDF examples</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Implementation Notes</h4>
                <ul className="space-y-1 text-sm">
                  <li>• All files are production-ready and follow industry standards</li>
                  <li>• R2RML mappings are compatible with standard processors (Morph-RDB, Ontop)</li>
                  <li>• Generated RDF validates against the manufacturing ontology</li>
                  <li>• Process documentation includes detailed analysis and best practices</li>
                  <li>• Sample data demonstrates real-world complexity and edge cases</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default R2RMLCaseStudy;
