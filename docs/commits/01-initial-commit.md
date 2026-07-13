# Commit: f051d6e - Initial commit: Base app created

## Goal
Establish a production-ready Express.js project structure with proper folder organization and ES6 module support.

## Technical Implementation

### 1. Project Initialization
```bash
npm init -y
npm install express dotenv
```

### 2. ES6 Module Configuration
Added `"type": "module"` to `package.json` to enable ES6 import/export syntax.

### 3. Folder Structure Creation
Created a modular `src/` directory with the following structure:
```
src/
├── app.js      # Express application setup with middleware
├── server.js   # Server initialization and port binding
├── index.js    # Application entry point
├── config/     # Configuration files
├── controllers/ # Request handlers
├── middleware/  # Custom middleware functions
├── models/     # Database models/schemas
├── routes/     # API route definitions
├── services/   # Business logic layer
├── utils/      # Utility functions
└── validations/ # Input validation rules
```

### 4. File Purposes

**`src/app.js`**
- Configures Express application
- Sets up middleware (Helmet, CORS, body parsers)
- Defines initial routes
- Exports the app instance

**`src/server.js`**
- Imports the app from `app.js`
- Starts the HTTP server on configured port
- Handles server startup/shutdown events

**`src/index.js`**
- Entry point of the application
- Imports configuration and starts the server

## Rationale

### Why Modular Structure?
- **Separation of Concerns**: Each file has a single responsibility
- **Scalability**: Easy to add new features without cluttering existing files
- **Maintainability**: Clear organization makes debugging easier
- **Testability**: Individual components can be tested in isolation

### Why ES6 Modules?
- Modern JavaScript standard
- Better tree-shaking for production builds
- Native support in Node.js 14+
- Cleaner import/export syntax

## Verification
```bash
npm run dev
# Should output: "Listening on http://localhost:3000"
```

Visit `http://localhost:3000` to see the "Hello from Acquisitions API" response.

## Key Commands Summary
```bash
npm init -y                           # Initialize project
npm install express dotenv            # Install dependencies
# Create src/ directory structure
# Configure package.json with "type": "module"
npm run dev                           # Start development server