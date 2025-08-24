# 🔧 SPARQL Query Testing Guide

## ✅ **SPARQL Functionality Status: FIXED!**

The SPARQL queries are now working! Here's what I've implemented:

### **🔄 What Was Fixed:**

1. **Real SPARQL Execution**: Replaced mock results with actual query processing
2. **RDF Data Storage**: Created `/api/sparql-uploaded` endpoint to store processed RDF
3. **Query Processing**: Integrated with R2RML pipeline to automatically store generated RDF
4. **Error Handling**: Better error messages and debugging

### **🧪 How to Test SPARQL Queries:**

#### **Step 1: Upload & Process Data**
1. Go to `http://localhost:3000/data-upload`
2. Upload `test-data-machines.csv` (or any CSV/JSON file)
3. Click **"Process R2RML"** - this stores the RDF data for querying

#### **Step 2: Test SPARQL Queries**
After processing, try these queries in the SPARQL interface:

##### **Query 1: All Machines**
```sparql
PREFIX ex: <http://example.org/>
SELECT ?machine ?name ?type WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasType ?type .
} LIMIT 10
```

##### **Query 2: High Efficiency Machines**
```sparql
PREFIX ex: <http://example.org/>
SELECT ?machine ?name ?efficiency WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasEfficiency ?efficiency .
} ORDER BY DESC(?efficiency)
```

##### **Query 3: Operational Status**
```sparql
PREFIX ex: <http://example.org/>
SELECT ?machine ?name ?status WHERE {
  ?machine a ex:Machine ;
           ex:hasName ?name ;
           ex:hasStatus ?status .
  FILTER(?status = "OPERATIONAL")
}
```

### **🔍 Test Results You Should See:**

**Before Upload**: Sample manufacturing data (CNC Machine Alpha, Quality Scanner, etc.)
**After Upload**: Your actual uploaded data converted to RDF format

### **🛠️ Direct API Testing:**

You can also test the SPARQL endpoint directly:

#### **Test Page Available**
- **URL**: `http://localhost:3000/sparql-test.html`
- **Purpose**: Direct API testing with JavaScript
- **Usage**: Click "Test SPARQL Query" button

#### **Manual API Test:**
```bash
curl -X POST http://localhost:3000/api/sparql-uploaded \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=SELECT ?machine ?name WHERE { ?machine a ex:Machine ; ex:hasName ?name . } LIMIT 3"
```

### **📊 Expected SPARQL Results Format:**

```json
{
  "head": {
    "vars": ["machine", "name", "type"]
  },
  "results": {
    "bindings": [
      {
        "machine": { "type": "uri", "value": "http://example.org/machine/M001" },
        "name": { "type": "literal", "value": "CNC Machine Alpha" },
        "type": { "type": "literal", "value": "CNC_MILL" }
      }
    ]
  }
}
```

### **🔧 Troubleshooting:**

#### **If Queries Return Empty Results:**
1. **Check if R2RML was processed**: Look for "Ready for Queries ✓" status
2. **Verify RDF storage**: Upload should trigger automatic RDF storage
3. **Try sample queries**: Start with simple `SELECT ?s ?p ?o` queries

#### **If Getting Errors:**
1. **Check browser console**: Look for network errors or API failures
2. **Verify server logs**: Check terminal for compilation errors
3. **Test endpoint directly**: Use the test page at `/sparql-test.html`

### **🚀 Advanced Testing:**

#### **Test with Different Data Types:**

1. **CSV Upload** → Machine/Equipment queries
2. **JSON Upload** → Product/Inventory queries  
3. **SQL Upload** → Relational data queries

#### **Query Complexity Tests:**

1. **Simple SELECT**: Basic triple patterns
2. **FILTER Operations**: Conditional filtering
3. **ORDER BY**: Result sorting
4. **COUNT/GROUP BY**: Aggregation queries

### **✅ Success Indicators:**

- ✅ **Upload works**: File preview and R2RML generation
- ✅ **Processing works**: Visual pipeline completes all 4 steps
- ✅ **Storage works**: RDF data automatically stored for querying
- ✅ **Queries work**: SPARQL interface returns actual results
- ✅ **Downloads work**: R2RML and RDF files can be downloaded

### **🎯 Production Features:**

The SPARQL implementation now includes:

- ✅ **Real-time query execution**
- ✅ **RDF data persistence** (in-memory for demo)
- ✅ **Standard SPARQL JSON results format**
- ✅ **Error handling and debugging**
- ✅ **Integration with R2RML pipeline**
- ✅ **Sample query library**
- ✅ **Direct API access**

---

## **🏆 SPARQL Queries Are Now Fully Functional!**

The system now provides a **complete semantic data integration pipeline**:

**Upload → R2RML → RDF → Triple Store → SPARQL Queries → Analytics** 🎉
