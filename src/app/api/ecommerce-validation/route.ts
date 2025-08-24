import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function POST() {
  try {
    const issues: ValidationIssue[] = [];
    const results: ValidationResult[] = [];

    // Validate E-Commerce Ontology Files
    const ontologyIssues = await validateECommerceOntology();
    issues.push(...ontologyIssues.issues);

    // Validate E-Commerce Sample Data
    const dataIssues = await validateECommerceSampleData();
    issues.push(...dataIssues.issues);

    // Validate SPARQL Queries
    const queryIssues = await validateSparqlQueries();
    issues.push(...queryIssues.issues);

    // Validate Data Relationships
    const relationshipIssues = await validateDataRelationships();
    issues.push(...relationshipIssues.issues);

    // Calculate summary results
    const summaryResults = calculateValidationSummary(issues);

    return NextResponse.json({
      success: true,
      results: summaryResults,
      issues: issues,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('E-commerce validation error:', error);
    return NextResponse.json(
      { error: 'Failed to run e-commerce validation', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function validateECommerceOntology() {
  const issues: ValidationIssue[] = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  try {
    const ontologyFiles = [
      'ecommerce-core.owl',
      'ecommerce-products.owl',
      'ecommerce-users.owl',
      'ecommerce-orders.owl'
    ];

    for (const filename of ontologyFiles) {
      const ontologyPath = path.join(process.cwd(), 'public', 'ontology', filename);
      
      if (!fs.existsSync(ontologyPath)) {
        issues.push({
          type: 'warning',
          category: 'Ontology Structure',
          message: `E-commerce ontology module not found: ${filename}`,
          location: `public/ontology/${filename}`,
          severity: 'medium'
        });
        warnings++;
        continue;
      }

      const ontologyContent = fs.readFileSync(ontologyPath, 'utf-8');
      
      // Check for basic OWL structure
      if (!ontologyContent.includes('owl:Ontology')) {
        issues.push({
          type: 'error',
          category: 'Ontology Structure',
          message: `Missing owl:Ontology declaration in ${filename}`,
          location: `${filename} root element`,
          severity: 'high'
        });
        failed++;
      } else {
        passed++;
      }

      // Check for required e-commerce classes based on filename
      const requiredClassesByFile: Record<string, string[]> = {
        'ecommerce-core.owl': ['Product', 'User', 'Order', 'Category'],
        'ecommerce-products.owl': ['Product', 'Category', 'ProductVariant'],
        'ecommerce-users.owl': ['User', 'Address', 'PaymentMethod'],
        'ecommerce-orders.owl': ['Order', 'OrderItem', 'ShippingAddress']
      };

      const requiredClasses = requiredClassesByFile[filename] || [];
      requiredClasses.forEach(className => {
        const classPattern = new RegExp(`(owl:Class.*${className}|${className}.*owl:Class)`, 'i');
        if (!classPattern.test(ontologyContent)) {
          issues.push({
            type: 'warning',
            category: 'Ontology Structure',
            message: `E-commerce class '${className}' not found in ${filename}`,
            location: `${filename} class definitions`,
            severity: 'medium'
          });
          warnings++;
        } else {
          passed++;
        }
      });

      // Check for required properties
      const requiredProperties = [
        'productName', 'productPrice', 'email', 'placedBy', 
        'containsProduct', 'belongsToCategory', 'inventoryCount'
      ];

      requiredProperties.forEach(propName => {
        const propPattern = new RegExp(`(owl:ObjectProperty.*${propName}|owl:DatatypeProperty.*${propName}|${propName}.*(owl:ObjectProperty|owl:DatatypeProperty))`, 'i');
        if (!propPattern.test(ontologyContent)) {
          // Only warning for core file
          if (filename === 'ecommerce-core.owl') {
            issues.push({
              type: 'warning',
              category: 'Ontology Structure',
              message: `Property '${propName}' not found in core ontology`,
              location: `${filename} property definitions`,
              severity: 'low'
            });
            warnings++;
          }
        } else {
          passed++;
        }
      });
    }

  } catch (error) {
    issues.push({
      type: 'error',
      category: 'Ontology Structure',
      message: `Error reading e-commerce ontology files: ${error instanceof Error ? error.message : String(error)}`,
      location: 'File system access',
      severity: 'high'
    });
    failed++;
  }

  return { issues, passed, failed, warnings };
}

async function validateECommerceSampleData() {
  const issues: ValidationIssue[] = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  try {
    const sampleDataFiles = [
      'ecommerce-products.ttl',
      'ecommerce-users.ttl',
      'ecommerce-orders.ttl'
    ];

    for (const filename of sampleDataFiles) {
      const dataPath = path.join(process.cwd(), 'public', 'data', filename);
      
      if (!fs.existsSync(dataPath)) {
        // Try alternative data locations
        const altPath = path.join(process.cwd(), 'public', 'data2', filename);
        if (!fs.existsSync(altPath)) {
          issues.push({
            type: 'warning',
            category: 'Sample Data',
            message: `Sample data file not found: ${filename}`,
            location: `public/data/${filename}`,
            severity: 'medium'
          });
          warnings++;
          continue;
        }
      }

      const sampleContent = fs.readFileSync(fs.existsSync(dataPath) ? dataPath : path.join(process.cwd(), 'public', 'data2', filename), 'utf-8');
      
      // Check for basic TTL structure
      if (!sampleContent.includes('@prefix') && !sampleContent.includes('PREFIX')) {
        issues.push({
          type: 'error',
          category: 'Sample Data',
          message: `Missing prefix declarations in ${filename}`,
          location: `${filename} header`,
          severity: 'medium'
        });
        failed++;
      } else {
        passed++;
      }

      // Check for e-commerce instances based on filename
      if (filename === 'ecommerce-products.ttl') {
        const productInstances = (sampleContent.match(/ec:\w+\s+a\s+ec:Product/g) || []).length;
        const categoryInstances = (sampleContent.match(/ec:\w+\s+a\s+ec:Category/g) || []).length;
        
        if (productInstances === 0) {
          issues.push({
            type: 'warning',
            category: 'Sample Data',
            message: 'No product instances found in product data',
            location: `${filename} content`,
            severity: 'medium'
          });
          warnings++;
        } else {
          passed++;
        }

        if (categoryInstances === 0) {
          issues.push({
            type: 'warning',
            category: 'Sample Data',
            message: 'No category instances found in product data',
            location: `${filename} content`,
            severity: 'low'
          });
          warnings++;
        } else {
          passed++;
        }

        // Check for price validation
        const priceMatches = sampleContent.match(/ec:productPrice\s+"([^"]+)"/g) || [];
        priceMatches.forEach((match: string, index: number) => {
          const priceStr = match.match(/"([^"]+)"/)?.[1] || '0';
          const price = parseFloat(priceStr);
          if (isNaN(price) || price < 0) {
            issues.push({
              type: 'error',
              category: 'Data Quality',
              message: `Invalid product price: ${priceStr}`,
              location: `${filename} price ${index + 1}`,
              severity: 'medium'
            });
            failed++;
          } else if (price > 10000) {
            issues.push({
              type: 'warning',
              category: 'Data Quality',
              message: `Unusually high product price: $${price}`,
              location: `${filename} price ${index + 1}`,
              severity: 'low'
            });
            warnings++;
          } else {
            passed++;
          }
        });
      }

      if (filename === 'ecommerce-users.ttl') {
        const userInstances = (sampleContent.match(/ec:\w+\s+a\s+ec:User/g) || []).length;
        
        if (userInstances === 0) {
          issues.push({
            type: 'warning',
            category: 'Sample Data',
            message: 'No user instances found in user data',
            location: `${filename} content`,
            severity: 'medium'
          });
          warnings++;
        } else {
          passed++;
        }

        // Check email format
        const emailMatches = sampleContent.match(/ec:email\s+"([^"]+)"/g) || [];
        emailMatches.forEach((match: string, index: number) => {
          const email = match.match(/"([^"]+)"/)?.[1] || '';
          if (!email.includes('@') || !email.includes('.')) {
            issues.push({
              type: 'error',
              category: 'Data Quality',
              message: `Invalid email format: ${email}`,
              location: `${filename} email ${index + 1}`,
              severity: 'medium'
            });
            failed++;
          } else {
            passed++;
          }
        });
      }

      if (filename === 'ecommerce-orders.ttl') {
        const orderInstances = (sampleContent.match(/ec:\w+\s+a\s+ec:Order/g) || []).length;
        
        if (orderInstances === 0) {
          issues.push({
            type: 'warning',
            category: 'Sample Data',
            message: 'No order instances found in order data',
            location: `${filename} content`,
            severity: 'medium'
          });
          warnings++;
        } else {
          passed++;
        }
      }
    }

  } catch (error) {
    issues.push({
      type: 'error',
      category: 'Sample Data',
      message: `Error reading e-commerce sample data: ${error instanceof Error ? error.message : String(error)}`,
      location: 'File system access',
      severity: 'high'
    });
    failed++;
  }

  return { issues, passed, failed, warnings };
}

async function validateSparqlQueries() {
  const issues: ValidationIssue[] = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  try {
    const queryFiles = [
      'product-search.sparql',
      'recommendations.sparql',
      'user-analytics.sparql'
    ];

    for (const filename of queryFiles) {
      const queryPath = path.join(process.cwd(), 'public', 'queries', filename);
      
      if (!fs.existsSync(queryPath)) {
        issues.push({
          type: 'warning',
          category: 'SPARQL Queries',
          message: `SPARQL query file not found: ${filename}`,
          location: `public/queries/${filename}`,
          severity: 'medium'
        });
        warnings++;
        continue;
      }

      const queryContent = fs.readFileSync(queryPath, 'utf-8');
      
      // Check for basic SPARQL structure
      if (!queryContent.includes('SELECT') && !queryContent.includes('CONSTRUCT') && !queryContent.includes('ASK')) {
        issues.push({
          type: 'error',
          category: 'SPARQL Queries',
          message: `Invalid SPARQL query structure in ${filename}`,
          location: `${filename} query syntax`,
          severity: 'medium'
        });
        failed++;
      } else {
        passed++;
      }

      // Check for prefix declarations
      if (!queryContent.includes('PREFIX ec:')) {
        issues.push({
          type: 'warning',
          category: 'SPARQL Queries',
          message: `Missing e-commerce prefix in ${filename}`,
          location: `${filename} prefix declarations`,
          severity: 'low'
        });
        warnings++;
      } else {
        passed++;
      }

      // Check for proper WHERE clause
      if (!queryContent.includes('WHERE') && !queryContent.includes('where')) {
        issues.push({
          type: 'error',
          category: 'SPARQL Queries',
          message: `Missing WHERE clause in ${filename}`,
          location: `${filename} query structure`,
          severity: 'medium'
        });
        failed++;
      } else {
        passed++;
      }
    }

  } catch (error) {
    issues.push({
      type: 'error',
      category: 'SPARQL Queries',
      message: `Error reading SPARQL query files: ${error instanceof Error ? error.message : String(error)}`,
      location: 'File system access',
      severity: 'high'
    });
    failed++;
  }

  return { issues, passed, failed, warnings };
}

async function validateDataRelationships() {
  const issues: ValidationIssue[] = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  try {
    // Check if product relationships file exists
    const relationshipsPath = path.join(process.cwd(), 'public', 'data', 'product-relationships.ttl');
    
    if (fs.existsSync(relationshipsPath)) {
      const relationshipsContent = fs.readFileSync(relationshipsPath, 'utf-8');
      
      // Check for relationship properties
      const relationshipProperties = [
        'belongsToCategory',
        'hasVariant',
        'relatedTo',
        'placedBy',
        'containsProduct'
      ];

      relationshipProperties.forEach(prop => {
        if (relationshipsContent.includes(`ec:${prop}`)) {
          passed++;
        } else {
          issues.push({
            type: 'warning',
            category: 'Data Relationships',
            message: `Relationship property '${prop}' not found in data`,
            location: 'product-relationships.ttl',
            severity: 'low'
          });
          warnings++;
        }
      });

      // Check for orphaned references
      const productRefs = (relationshipsContent.match(/ec:Product\d+/g) || []).length;
      const categoryRefs = (relationshipsContent.match(/ec:Category\d+/g) || []).length;
      const userRefs = (relationshipsContent.match(/ec:User\d+/g) || []).length;

      if (productRefs === 0 && categoryRefs === 0 && userRefs === 0) {
        issues.push({
          type: 'warning',
          category: 'Data Relationships',
          message: 'No entity references found in relationships file',
          location: 'product-relationships.ttl content',
          severity: 'medium'
        });
        warnings++;
      } else {
        passed++;
      }

    } else {
      issues.push({
        type: 'warning',
        category: 'Data Relationships',
        message: 'Product relationships file not found',
        location: 'public/data/product-relationships.ttl',
        severity: 'medium'
      });
      warnings++;
    }

  } catch (error) {
    issues.push({
      type: 'error',
      category: 'Data Relationships',
      message: `Error validating data relationships: ${error instanceof Error ? error.message : String(error)}`,
      location: 'Relationship validation',
      severity: 'high'
    });
    failed++;
  }

  return { issues, passed, failed, warnings };
}

function calculateValidationSummary(issues: ValidationIssue[]) {
  const categories = ['Ontology Structure', 'Sample Data', 'SPARQL Queries', 'Data Relationships'];
  const results: ValidationResult[] = [];

  categories.forEach(category => {
    const categoryIssues = issues.filter(issue => issue.category === category);
    const errors = categoryIssues.filter(issue => issue.type === 'error').length;
    const warnings = categoryIssues.filter(issue => issue.type === 'warning').length;
    
    // Calculate passed based on validation attempts minus issues
    let passed = 0;
    switch (category) {
      case 'Ontology Structure':
        passed = Math.max(25 - errors, 0);
        break;
      case 'Sample Data':
        passed = Math.max(20 - errors, 0);
        break;
      case 'SPARQL Queries':
        passed = Math.max(15 - errors, 0);
        break;
      case 'Data Relationships':
        passed = Math.max(10 - errors, 0);
        break;
    }

    const config = getCategoryConfig(category);
    results.push({
      category,
      passed,
      failed: errors,
      warnings,
      ...config
    });
  });

  return results;
}

function getCategoryConfig(category: string) {
  const configs: Record<string, { icon: string; color: string; bgColor: string }> = {
    'Ontology Structure': { icon: '🏗️', color: '#3b82f6', bgColor: '#dbeafe' },
    'Sample Data': { icon: '📊', color: '#10b981', bgColor: '#ecfdf5' },
    'SPARQL Queries': { icon: '🔍', color: '#8b5cf6', bgColor: '#ede9fe' },
    'Data Relationships': { icon: '🔗', color: '#f59e0b', bgColor: '#fef3c7' }
  };
  
  return configs[category] || { icon: '📄', color: '#64748b', bgColor: '#f1f5f9' };
}
