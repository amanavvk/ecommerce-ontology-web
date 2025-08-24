# README.md

# E-Commerce Ontology Web Application

This project is an E-Commerce Ontology Web Application built using Next.js. It provides a platform for visualizing and interacting with OWL ontologies, executing SPARQL queries, and validating data against SHACL shapes.

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
   git clone <repository-url>
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

## Features

- Visualize OWL ontologies and their relationships.
- Execute SPARQL queries and display results.
- Validate data against SHACL shapes.
- User-friendly interface for managing ontologies and queries.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.