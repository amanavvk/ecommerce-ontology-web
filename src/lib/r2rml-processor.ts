// R2RML Processor - Equivalent to D2RQ/RML-Mapper functionality
import { Parser as N3Parser, Store as N3Store, DataFactory, Writer as N3Writer } from 'n3';

export interface R2RMLMapping {
  subjectTemplate: string;
  predicateObjectMaps: Array<{
    predicate: string;
    objectColumn?: string;
    objectValue?: string;
    datatype?: string;
  }>;
  logicalTable: {
    tableName?: string;
    sqlQuery?: string;
  };
}

export interface DataRow {
  [key: string]: any;
}

export class R2RMLProcessor {
  private store: N3Store;
  private baseIRI: string;

  constructor(baseIRI: string = 'http://example.org/') {
    this.store = new N3Store();
    this.baseIRI = baseIRI;
  }

  /**
   * Parse R2RML mapping from Turtle/N3 format
   */
  async parseR2RMLMapping(r2rmlTurtle: string): Promise<R2RMLMapping[]> {
    const parser = new N3Parser();
    const store = new N3Store();
    
    return new Promise((resolve, reject) => {
      parser.parse(r2rmlTurtle, (error, quad, prefixes) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (quad) {
          store.addQuad(quad);
        } else {
          // Parsing complete, extract mappings
          const mappings = this.extractMappingsFromStore(store);
          resolve(mappings);
        }
      });
    });
  }

  /**
   * Extract R2RML mappings from RDF store
   */
  private extractMappingsFromStore(store: N3Store): R2RMLMapping[] {
    const mappings: R2RMLMapping[] = [];
    const { namedNode } = DataFactory;
    
    // Find all TriplesMap subjects
    const triplesMaps = store.getSubjects(
      namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      namedNode('http://www.w3.org/ns/r2rml#TriplesMap'),
      null
    );

    triplesMaps.forEach(triplesMap => {
      const mapping: R2RMLMapping = {
        subjectTemplate: '',
        predicateObjectMaps: [],
        logicalTable: {}
      };

      // Get subject map
      const subjectMaps = store.getObjects(triplesMap, namedNode('http://www.w3.org/ns/r2rml#subjectMap'), null);
      if (subjectMaps.length > 0) {
        const templates = store.getObjects(subjectMaps[0], namedNode('http://www.w3.org/ns/r2rml#template'), null);
        if (templates.length > 0) {
          mapping.subjectTemplate = templates[0].value;
        }
      }

      // Get logical table
      const logicalTables = store.getObjects(triplesMap, namedNode('http://www.w3.org/ns/r2rml#logicalTable'), null);
      if (logicalTables.length > 0) {
        const tableNames = store.getObjects(logicalTables[0], namedNode('http://www.w3.org/ns/r2rml#tableName'), null);
        if (tableNames.length > 0) {
          mapping.logicalTable.tableName = tableNames[0].value;
        }
      }

      // Get predicate-object maps
      const predicateObjectMaps = store.getObjects(triplesMap, namedNode('http://www.w3.org/ns/r2rml#predicateObjectMap'), null);
      predicateObjectMaps.forEach(pom => {
        const predicates = store.getObjects(pom, namedNode('http://www.w3.org/ns/r2rml#predicate'), null);
        const objectMaps = store.getObjects(pom, namedNode('http://www.w3.org/ns/r2rml#objectMap'), null);
        
        if (predicates.length > 0 && objectMaps.length > 0) {
          const columns = store.getObjects(objectMaps[0], namedNode('http://www.w3.org/ns/r2rml#column'), null);
          const constants = store.getObjects(objectMaps[0], namedNode('http://www.w3.org/ns/r2rml#constant'), null);
          
          mapping.predicateObjectMaps.push({
            predicate: predicates[0].value,
            objectColumn: columns.length > 0 ? columns[0].value : undefined,
            objectValue: constants.length > 0 ? constants[0].value : undefined
          });
        }
      });

      mappings.push(mapping);
    });

    return mappings;
  }

  /**
   * Process data with R2RML mappings to generate RDF triples
   */
  async processDataWithMapping(data: DataRow[], r2rmlMapping: R2RMLMapping[]): Promise<string> {
    const { namedNode, literal, quad } = DataFactory;
    const outputStore = new N3Store();

    for (const mapping of r2rmlMapping) {
      for (const row of data) {
        // Generate subject IRI
        const subjectIRI = this.processTemplate(mapping.subjectTemplate, row);
        const subject = namedNode(subjectIRI);

        // Generate predicate-object triples
        for (const pom of mapping.predicateObjectMaps) {
          const predicate = namedNode(pom.predicate);
          
          let objectValue: string;
          if (pom.objectColumn && row[pom.objectColumn] !== undefined) {
            objectValue = String(row[pom.objectColumn]);
          } else if (pom.objectValue) {
            objectValue = pom.objectValue;
          } else {
            continue; // Skip if no value available
          }

          // Determine if object should be IRI or literal
          let object;
          if (objectValue.startsWith('http://') || objectValue.startsWith('https://')) {
            object = namedNode(objectValue);
          } else {
            object = literal(objectValue, pom.datatype);
          }

          outputStore.addQuad(quad(subject, predicate, object));
        }
      }
    }

    // Serialize to Turtle format
    return this.serializeStore(outputStore);
  }

  /**
   * Process template with data row values
   */
  private processTemplate(template: string, data: DataRow): string {
    return template.replace(/\{([^}]+)\}/g, (match, columnName) => {
      const value = data[columnName];
      return value !== undefined ? encodeURIComponent(String(value)) : match;
    });
  }

  /**
   * Serialize RDF store to Turtle format
   */
  private serializeStore(store: N3Store): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new N3Writer({ prefixes: {
        '': this.baseIRI,
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'xsd': 'http://www.w3.org/2001/XMLSchema#'
      }});

      writer.addQuads(store.getQuads(null, null, null, null));
      writer.end((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Load RDF data into internal store for querying
   */
  async loadRDF(rdfData: string): Promise<void> {
    const parser = new N3Parser();
    
    return new Promise((resolve, reject) => {
      parser.parse(rdfData, (error, quad) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (quad) {
          this.store.addQuad(quad);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Execute simple SPARQL-like queries on loaded RDF data
   */
  queryRDF(pattern: { subject?: string; predicate?: string; object?: string }): any[] {
    const { namedNode, literal } = DataFactory;
    
    const subjectNode = pattern.subject ? namedNode(pattern.subject) : null;
    const predicateNode = pattern.predicate ? namedNode(pattern.predicate) : null;
    const objectNode = pattern.object ? 
      (pattern.object.startsWith('http') ? namedNode(pattern.object) : literal(pattern.object)) : null;

    const quads = this.store.getQuads(subjectNode, predicateNode, objectNode, null);
    
    return quads.map(quad => ({
      subject: quad.subject.value,
      predicate: quad.predicate.value,
      object: quad.object.value
    }));
  }

  /**
   * Export current store as downloadable Turtle file
   */
  async exportAsDownload(): Promise<{ filename: string; content: string; mimeType: string }> {
    const turtleContent = await this.serializeStore(this.store);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    return {
      filename: `rdf-export-${timestamp}.ttl`,
      content: turtleContent,
      mimeType: 'text/turtle'
    };
  }

  /**
   * Get statistics about the loaded RDF data
   */
  getStatistics(): {
    totalTriples: number;
    subjects: number;
    predicates: number;
    objects: number;
  } {
    const quads = this.store.getQuads(null, null, null, null);
    const subjects = new Set(quads.map(q => q.subject.value));
    const predicates = new Set(quads.map(q => q.predicate.value));
    const objects = new Set(quads.map(q => q.object.value));

    return {
      totalTriples: quads.length,
      subjects: subjects.size,
      predicates: predicates.size,
      objects: objects.size
    };
  }
}
