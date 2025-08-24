import { NextRequest, NextResponse } from 'next/server';

interface UploadedData {
  id: string;
  filename: string;
  type: 'csv' | 'json' | 'sql';
  uploadTime: string;
  records: number;
  processed: boolean;
  r2rmlGenerated: boolean;
  sparqlEndpoint?: string;
}

// Store uploaded data in memory (in production, use database)
let uploadedDatasets: UploadedData[] = [];

// Sample R2RML mapping generator
function generateR2RMLMapping(data: any[], filename: string, type: string): string {
  const baseIRI = "http://example.org/manufacturing#";
  const tableName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  
  if (type === 'csv' || type === 'json') {
    // Auto-detect columns from first row
    const columns = Object.keys(data[0] || {});
    
    return `@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix ex: <${baseIRI}> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:${tableName}Map a rr:TriplesMap ;
  rr:logicalTable [
    rr:tableName "${tableName}"
  ] ;
  rr:subjectMap [
    rr:template "${baseIRI}${tableName}/{${columns[0]}}" ;
    rr:class ex:${tableName.charAt(0).toUpperCase() + tableName.slice(1)}
  ] ;
${columns.map(col => `  rr:predicateObjectMap [
    rr:predicate ex:${col} ;
    rr:objectMap [ rr:column "${col}" ]
  ]`).join(' ;\n')} .`;
  }
  
  return `# R2RML mapping for ${filename} - Manual configuration needed`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const processingType = formData.get('processingType') as string || 'auto';
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name;
    const fileType = filename.split('.').pop()?.toLowerCase() as 'csv' | 'json' | 'sql';
    
    if (!['csv', 'json', 'sql'].includes(fileType)) {
      return NextResponse.json({ 
        error: 'Unsupported file type. Please upload CSV, JSON, or SQL files.' 
      }, { status: 400 });
    }

    // Read file content
    const content = await file.text();
    let parsedData: any[] = [];
    
    try {
      if (fileType === 'json') {
        const jsonData = JSON.parse(content);
        parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else if (fileType === 'csv') {
        // Simple CSV parsing (in production, use proper CSV parser)
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length > 1) {
          const headers = lines[0].split(',').map(h => h.trim());
          parsedData = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            return row;
          });
        }
      } else if (fileType === 'sql') {
        // For SQL files, we'll store them for manual processing
        parsedData = [{ sql: content, type: 'DDL/DML' }];
      }
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Failed to parse file content. Please check file format.' 
      }, { status: 400 });
    }

    // Generate unique ID
    const datasetId = `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate R2RML mapping
    const r2rmlMapping = generateR2RMLMapping(parsedData, filename, fileType);
    
    // Create dataset record
    const dataset: UploadedData = {
      id: datasetId,
      filename,
      type: fileType,
      uploadTime: new Date().toISOString(),
      records: parsedData.length,
      processed: true,
      r2rmlGenerated: true,
      sparqlEndpoint: `/api/dataset/${datasetId}/sparql`
    };
    
    uploadedDatasets.push(dataset);
    
    // Store the actual data (in production, use proper storage)
    (global as any).uploadedData = (global as any).uploadedData || {};
    (global as any).uploadedData[datasetId] = {
      data: parsedData,
      r2rml: r2rmlMapping,
      metadata: dataset
    };

    return NextResponse.json({
      success: true,
      dataset,
      r2rmlMapping,
      preview: parsedData.slice(0, 5), // First 5 records for preview
      analytics: {
        totalRecords: parsedData.length,
        columns: parsedData.length > 0 ? Object.keys(parsedData[0]).length : 0,
        dataTypes: parsedData.length > 0 ? 
          Object.keys(parsedData[0]).reduce((types, key) => {
            const value = parsedData[0][key];
            types[key] = isNaN(Number(value)) ? 'string' : 'number';
            return types;
          }, {} as Record<string, string>) : {}
      }
    });

  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    uploadedDatasets,
    totalDatasets: uploadedDatasets.length,
    supportedFormats: ['CSV', 'JSON', 'SQL'],
    features: [
      'Automatic R2RML mapping generation',
      'Data validation and preview', 
      'SPARQL endpoint creation',
      'Schema analysis and recommendations'
    ]
  });
}
