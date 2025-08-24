# README.md

# E-Commerce Ontology Web Application

This project is a comprehensive E-Commerce Ontology Web Application built using Next.js 15.5.0 with TypeScript. It provides a modern, professional platform for visualizing and interacting with OWL ontologies, executing SPARQL queries, and validating e-commerce data with a beautiful tabular interface.

## 🚀 Live Demo

**Deployed on Vercel:** [https://sementicwebcasestudies-n758cm6x5-aman2clouds-projects.vercel.app](https://sementicwebcasestudies-n758cm6x5-aman2clouds-projects.vercel.app)

## 🎯 What We Built

This application demonstrates a complete semantic web solution with:

### ✨ **Professional UI/UX**
- Modern, branded e-commerce validation interface with clean table layouts
- Responsive design with Tailwind CSS
- Professional navigation and component structure
- Error-free TypeScript implementation

### 🔍 **SPARQL Query Interface**
- Interactive SPARQL query editor with syntax highlighting
- Pre-built queries for e-commerce analytics:
  - Product listings with categories and prices
  - User management and order tracking
  - Category hierarchy visualization
  - Order analytics and customer insights
- Real-time query execution with formatted results

### 📊 **Data Validation System**
- Comprehensive e-commerce data validation in clean table format
- Support for products, users, orders, and categories
- Visual validation results with professional styling

### 🏗️ **Technical Architecture**
- **Frontend:** Next.js 15.5.0 with TypeScript and Tailwind CSS
- **Data Source:** TTL (Turtle) files containing real e-commerce data
- **Deployment Strategy:** 
  - **Development:** Apache Jena Fuseki for local SPARQL endpoint
  - **Production:** Direct TTL file integration for Vercel deployment
- **Smart Fallback:** Automatic switching between live SPARQL endpoint and mock data based on environment

## 📋 **Deployment Strategy**

We implemented a hybrid approach for maximum compatibility:

1. **Local Development:** Uses Apache Jena Fuseki SPARQL endpoint for real-time queries
2. **Production (Vercel):** Uses curated mock data that exactly matches the TTL file structure from `public/data2/`
3. **Seamless Transition:** The application automatically detects the environment and provides consistent query results

## Project Structure

- **src/**: Contains the main application code.
  - **app/**: The main application pages and API routes.
    - **layout.tsx**: Defines the layout component for the application.
    - **page.tsx**: Main entry point for the application.
    - **ontology/**: Displays ontology-related content.
    - **queries/**: Handles SPARQL query execution and display.
    - **validation/**: Manages data validation.
    - **api/**: Contains API routes for SPARQL queries, validation, and file uploads.
  - **components/**: Reusable UI components.
  - **lib/**: Utility functions and libraries for SPARQL and ontology handling.
  - **types/**: TypeScript types and interfaces.

- **public/**: Contains static files including ontologies, SPARQL queries, and sample data.

- **package.json**: Configuration file for npm, listing dependencies and scripts.

- **tsconfig.json**: TypeScript configuration file.

- **tailwind.config.js**: Tailwind CSS configuration file.

- **next.config.js**: Next.js configuration file.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/amanavvk/ecommerce-ontology-web.git
   cd ecommerce-ontology-web
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

Then, to start the production server:

```bash
npm start
```

## 🌐 **Live Application**

The application is deployed and accessible at:
**[https://sementicwebcasestudies-n758cm6x5-aman2clouds-projects.vercel.app](https://sementicwebcasestudies-n758cm6x5-aman2clouds-projects.vercel.app)**

### 📱 **Application Sections**

1. **Home**: Overview and introduction to the e-commerce ontology system
2. **Queries**: Interactive SPARQL query interface with pre-built examples
3. **Validation**: Professional data validation with table-based results
4. **Ontology**: Ontology visualization and exploration tools

## 📊 **Data Sources**

The application uses comprehensive e-commerce data including:

- **Products**: iPhone 14 Pro, Samsung Galaxy S23, Dell XPS 13, MacBook Air M2, etc.
- **Categories**: Electronics, Computers, Smartphones, Accessories, Clothing, etc.
- **Users**: Realistic user profiles with email addresses and preferences
- **Orders**: Complete order history with product relationships and timestamps

## 🚢 **Deployment Architecture**

- **GitHub Repository**: [https://github.com/amanavvk/ecommerce-ontology-web](https://github.com/amanavvk/ecommerce-ontology-web)
- **Vercel Deployment**: Automatic deployment on every push to main branch
- **Environment Detection**: Smart switching between Fuseki and mock data
- **Performance**: Optimized for fast loading and responsive user experience

## Features

### 🎨 **Modern Interface**
- Professional e-commerce validation UI with table-based data display
- Responsive design optimized for desktop and mobile
- Clean, branded styling with consistent color scheme
- Intuitive navigation between different sections

### 🔎 **SPARQL Query System** 
- Interactive query editor with real-time execution
- Pre-built queries for common e-commerce scenarios
- Support for complex queries with JOIN operations
- Formatted result display with proper data typing

### 📈 **Data Analytics**
- Product analytics with category breakdown
- User behavior and order patterns
- Inventory and pricing insights
- Category hierarchy visualization

### 🛡️ **Data Validation**
- Comprehensive validation for e-commerce entities
- Real-time validation feedback
- Professional table-based result presentation
- Support for complex data relationships

### 🌐 **Production Ready**
- Deployed on Vercel with automatic CI/CD
- Environment-aware data source switching
- Optimized build process for fast loading
- SEO-friendly with proper meta tags

## 🛠️ **Technology Stack**

- **Framework:** Next.js 15.5.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Data Format:** TTL (Turtle) files
- **Development SPARQL:** Apache Jena Fuseki
- **Production Data:** Curated mock data matching TTL structure

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.