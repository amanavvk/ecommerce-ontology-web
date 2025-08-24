# R2RML Manufacturing Data Integration Case Study

## Overview
This project demonstrates the integration of legacy manufacturing databases with modern IoT systems using R2RML (RDB to RDF Mapping Language). The solution bridges relational production data with semantic web technologies for enhanced analytics and interoperability.

## Project Structure
```
r2rml-manufacturing/
├── ontology/
│   └── manufacturing-ontology.owl      # Manufacturing domain ontology
├── mappings/
│   └── manufacturing-mappings.ttl      # R2RML mapping rules
├── sample-data/
│   ├── sample-database.sql            # Sample SQL data
│   └── expected-output.ttl            # Expected RDF output
├── documentation/
│   ├── analysis-process.md            # Detailed analysis documentation
│   ├── mapping-rationale.md           # Mapping design decisions
│   └── integration-guide.md           # Implementation guide
├── validation/
│   ├── test-queries.sparql           # SPARQL test queries
│   └── validation-results.md         # Test results
└── README.md                         # This file
```

## Database Schema
The legacy manufacturing system contains two main tables:

### Production Table
- **ProductionID**: Unique identifier for each production run
- **MachineID**: Reference to the machine used
- **Timestamp**: When the production occurred
- **Output_Quantity**: Number of units produced
- **Quality_Score**: Quality metric (0-100)

### Machine Table
- **MachineID**: Unique machine identifier
- **Type**: Machine category/model
- **Location**: Physical location in facility
- **InstallDate**: Installation date

## Semantic Integration Goals
1. **Historical Data Access**: Query legacy data using SPARQL
2. **IoT Compatibility**: Seamless integration with modern IoT systems
3. **Advanced Analytics**: Enable ML/AI on combined datasets
4. **Standardization**: Common vocabulary for manufacturing concepts

## Quick Start
1. Review the ontology design in `ontology/manufacturing-ontology.owl`
2. Examine R2RML mappings in `mappings/manufacturing-mappings.ttl`
3. Test with sample data using the validation queries
4. Follow the integration guide for deployment

## Technologies Used
- **R2RML**: W3C standard for RDB to RDF mapping
- **OWL 2**: Ontology definition language
- **SPARQL**: Query language for RDF data
- **Apache Jena**: Java framework for semantic web applications

## Business Value
- **Data Integration**: Unify legacy and modern data sources
- **Analytics Enhancement**: Enable semantic queries and reasoning
- **IoT Readiness**: Prepare data for modern IoT architectures
- **Future-Proofing**: Standardized approach for data evolution
