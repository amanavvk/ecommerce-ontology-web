# Docker-Free Production Setup Guide

## Overview
This guide shows how to set up the production environment without Docker Desktop using free, standalone tools.

## Required Free Tools

### 1. Apache Jena Fuseki (SPARQL Server)
- **Download**: https://jena.apache.org/download/
- **Version**: Apache Jena 4.10.0 or later
- **Size**: ~50MB
- **What it does**: Provides SPARQL endpoint for ontology queries

### 2. MySQL Community Server
- **Download**: https://dev.mysql.com/downloads/mysql/
- **Version**: MySQL 8.0 Community Edition
- **Size**: ~400MB
- **What it does**: Stores relational data for R2RML mapping

### 3. R2RML Processor (Java-based)
- **Download**: We'll use a lightweight Java tool
- **Alternative**: Direct SQL to SPARQL conversion scripts

## Step-by-Step Setup

### Step 1: Download and Setup Fuseki
1. Go to https://jena.apache.org/download/
2. Download "apache-jena-fuseki-4.10.0.zip"
3. Extract to `C:\fuseki\`
4. No installation needed - it's portable!

### Step 2: Setup MySQL (Optional - we can use SQLite instead)
For even simpler setup, we'll use SQLite which requires no installation.

### Step 3: Configure the Application
We'll modify the app to work with local tools instead of Docker containers.

## Quick Start (5 minutes)

Let's start with the simplest approach - using existing JSON data and Fuseki.
