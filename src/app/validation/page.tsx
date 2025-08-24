'use client';

import { useState } from 'react';

interface ValidationIssue {
  type: 'error' | 'warning';
  category: string;
  message: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

interface ValidationResult {
  category: string;
  passed: number;
  failed: number;
  warnings: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface ValidationResponse {
  success: boolean;
  results: ValidationResult[];
  issues: ValidationIssue[];
  timestamp: string;
}

export default function ValidationPage() {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = async () => {
    setIsValidating(true);
    setValidationComplete(false);
    setValidationResults([]);
    setValidationIssues([]);
    setError(null);

    try {
      const response = await fetch('/api/ecommerce-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const data: ValidationResponse = await response.json();
      
      if (data.success) {
        setValidationResults(data.results);
        setValidationIssues(data.issues);
        setValidationComplete(true);
      } else {
        throw new Error('Validation failed');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsValidating(false);
    }
  };

  const totalPassed = validationResults.reduce((sum, result) => sum + result.passed, 0);
  const totalFailed = validationResults.reduce((sum, result) => sum + result.failed, 0);
  const totalWarnings = validationResults.reduce((sum, result) => sum + result.warnings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🛒</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-1">
                E-commerce Ontology Validation
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive validation suite for e-commerce semantic data
              </p>
            </div>
          </div>
          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Analyze ontology files, sample data, SPARQL queries, and data relationships to ensure 
            your e-commerce semantic web implementation follows best practices and maintains data integrity.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Control Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Validation Dashboard</h2>
                <p className="text-gray-600">Run comprehensive validation across all e-commerce components</p>
              </div>
              <button
                onClick={runValidation}
                disabled={isValidating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                         disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold 
                         transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl 
                         disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🔍</span>
                    <span>Run Validation Suite</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Validation Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 
                            hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🏗️
                  </div>
                  <h3 className="font-semibold text-gray-800">Ontology Structure</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Validates OWL files, class definitions, property relationships, and namespace declarations
                </p>
                <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/5 rounded-xl transition-colors duration-200"></div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 
                            hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                    📊
                  </div>
                  <h3 className="font-semibold text-gray-800">Sample Data</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Analyzes TTL data quality, format compliance, and business rule validation
                </p>
                <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/5 rounded-xl transition-colors duration-200"></div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200 
                            hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🔍
                  </div>
                  <h3 className="font-semibold text-gray-800">SPARQL Queries</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Validates query syntax, structure, and semantic correctness
                </p>
                <div className="absolute inset-0 bg-purple-400/0 group-hover:bg-purple-400/5 rounded-xl transition-colors duration-200"></div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 border border-amber-200 
                            hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🔗
                  </div>
                  <h3 className="font-semibold text-gray-800">Data Relationships</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Analyzes entity relationships, referential integrity, and data consistency
                </p>
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 rounded-xl transition-colors duration-200"></div>
              </div>
            </div>

            {/* Progress Indicator */}
            {isValidating && (
              <div className="mb-8">
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full animate-pulse"></div>
                </div>
                <p className="text-center text-gray-600 mt-3 font-medium">
                  Running comprehensive validation analysis...
                </p>
              </div>
            )}

            {/* Validation Summary */}
            {validationComplete && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">📈</span>
                  Validation Summary
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-green-500 text-white rounded-xl p-4 shadow-lg">
                      <div className="text-3xl font-bold mb-1">{totalPassed}</div>
                      <div className="text-green-100 font-medium">Passed</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500 text-white rounded-xl p-4 shadow-lg">
                      <div className="text-3xl font-bold mb-1">{totalFailed}</div>
                      <div className="text-red-100 font-medium">Failed</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-amber-500 text-white rounded-xl p-4 shadow-lg">
                      <div className="text-3xl font-bold mb-1">{totalWarnings}</div>
                      <div className="text-amber-100 font-medium">Warnings</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-8 shadow-lg">
              <div className="flex items-center gap-3 text-red-800 mb-2">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-semibold text-lg">Validation Error</h3>
              </div>
              <p className="text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Validation Results Grid */}
          {validationResults.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-8">
              {validationResults.map((result, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 
                           hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ backgroundColor: result.bgColor }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                         style={{ backgroundColor: result.color + '20', color: result.color }}>
                      {result.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{result.category}</h3>
                      <p className="text-gray-600">Validation Results</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">{result.passed}</div>
                        <div className="text-sm text-green-700 font-medium">Passed</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-red-100 rounded-lg p-4 border border-red-200">
                        <div className="text-2xl font-bold text-red-600 mb-1">{result.failed}</div>
                        <div className="text-sm text-red-700 font-medium">Failed</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-amber-100 rounded-lg p-4 border border-amber-200">
                        <div className="text-2xl font-bold text-amber-600 mb-1">{result.warnings}</div>
                        <div className="text-sm text-amber-700 font-medium">Warnings</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Validation Results Table */}
          {validationIssues.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Validation Results</h2>
                    <p className="text-blue-100">Detailed analysis of e-commerce ontology validation</p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📊</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{validationIssues.length}</div>
                        <div className="text-sm text-gray-600 font-medium">Total Issues</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">❌</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {validationIssues.filter(issue => issue.type === 'error').length}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Errors</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">⚠️</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-600">
                          {validationIssues.filter(issue => issue.type === 'warning').length}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Warnings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Table */}
              <div className="p-8">
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                        <th className="text-left py-4 px-6 font-semibold">Issue Type</th>
                        <th className="text-left py-4 px-6 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 font-semibold">Severity</th>
                        <th className="text-left py-4 px-6 font-semibold">Location</th>
                        <th className="text-left py-4 px-6 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {validationIssues.map((issue, index) => (
                        <tr 
                          key={index} 
                          className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'
                          }`}
                        >
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                issue.type === 'error' 
                                  ? 'bg-red-100 border-2 border-red-200' 
                                  : 'bg-amber-100 border-2 border-amber-200'
                              }`}>
                                <span className={`text-lg ${
                                  issue.type === 'error' ? 'text-red-600' : 'text-amber-600'
                                }`}>
                                  {issue.type === 'error' ? '🚨' : '⚠️'}
                                </span>
                              </div>
                              <div>
                                <div className={`font-semibold capitalize ${
                                  issue.type === 'error' ? 'text-red-700' : 'text-amber-700'
                                }`}>
                                  {issue.type}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">
                                  Issue Type
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm">
                                  {issue.category === 'Ontology Structure' ? '🏗️' :
                                   issue.category === 'Sample Data' ? '📊' :
                                   issue.category === 'SPARQL Queries' ? '🔍' :
                                   issue.category === 'Data Relationships' ? '🔗' : '📄'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{issue.category}</div>
                                <div className="text-xs text-gray-500">Validation Category</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                              issue.severity === 'high' 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' :
                              issue.severity === 'medium' 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' :
                                'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                            }`}>
                              <span className="mr-1">
                                {issue.severity === 'high' ? '🔴' : 
                                 issue.severity === 'medium' ? '🟡' : '🔵'}
                              </span>
                              {issue.severity}
                            </span>
                          </td>
                          <td className="py-5 px-6">
                            <div className="bg-gray-800 text-gray-100 px-3 py-2 rounded-lg font-mono text-sm max-w-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-green-400">📁</span>
                                <span className="truncate">{issue.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="max-w-md">
                              <p className="text-gray-700 leading-relaxed text-sm">
                                {issue.message}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isValidating && !validationComplete && validationResults.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full 
                            flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Validate E-commerce Data</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
                Click the "Run Validation Suite" button to analyze your e-commerce ontology files, 
                sample data, and ensure semantic compliance.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  Ontology Files
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  Sample Data
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  SPARQL Queries
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  Relationships
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}