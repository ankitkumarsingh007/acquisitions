# Acquisitions API

A production-ready Express.js API built with modern DevOps practices, featuring a clean architecture, type-safe database operations, and comprehensive logging.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Project Evolution](#project-evolution)
- [API Endpoints](#api-endpoints)

## Overview

This project demonstrates the evolution of a Node.js/Express API from a basic setup to a production-ready application with proper tooling, database integration, and observability.

**Tech Stack:**
- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: Neon Postgres (Serverless)
- **ORM**: Drizzle ORM
- **Logging**: Winston + Morgan
- **Code Quality**: ESLint + Prettier
- **Auth**: JWT (jsonwebtoken) + bcrypt + Zod

## Architecture

```
acquisitions/
├── docs/
│   └── commits/           # Commit history documentation
│       ├── 01-initial-commit.md
│       ├── 02-eslint-prettier.md
│       ├── 03-neon-drizzle.md
│       ├── 04-logger-middleware.md
│       └── 05-authentication.md
├── src/
│   ├── config/           # Configuration files (database, logger)
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database schemas (Drizzle)
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic layer
│   ├── utils/            # Utility functions
│   └── validations/      # Input validation
├── drizzle/              # Database migrations
├── logs/                 # Application logs
├── .env                  # Environment variables
├── package.json
└── README.md
```

### Key Design Decisions

1. **Modular Structure**: Separation of concerns with dedicated folders for each layer
2. **Absolute Imports**: Using Node.js `imports` field for cleaner code
3. **Type-Safe Database**: Drizzle ORM with PostgreSQL
4. **Structured Logging**: Winston for application logs, Morgan for HTTP logs

## Prerequisites

- Node.js 18+ (with ES6 module support)
- npm 9+
- Neon Postgres account (free tier available)

## Installation

```bash
# Clone the repository
git clone https://github.com/ankitkumarsingh007/acquisitions.git
cd acquisitions

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL from Neon
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Database operations
npm run db:generate   # Generate migrations
npm run db:migrate    # Apply migrations
npm run db:studio     # Open Drizzle Studio
```

## Project Evolution

This project was built incrementally through 5 key commits. Each commit represents a significant milestone in the application's evolution.

| Commit | Message | Documentation |
|--------|---------|---------------|
| f051d6e | Initial commit: Base app created | [Read More](docs/commits/01-initial-commit.md) |
| fb78cf5 | Implement ESLint and Prettier | [Read More](docs/commits/02-eslint-prettier.md) |
| 5c6ee7e | Setup Neon Postgres w/ Drizzle | [Read More](docs/commits/03-neon-drizzle.md) |
| 4306b3d | Added logger in APP | [Read More](docs/commits/04-logger-middleware.md) |
| XXXXXXX | Authentication setup | [Read More](docs/commits/05-authentication.md) |
| YYYYYYY | Sign‑in & Sign‑out functionality | [Read More](docs/commits/06-sign-in-out.md) |

### Commit Timeline

1. **Initial Commit** - Established the foundation with Express.js and a modular folder structure
2. **ESLint & Prettier** - Implemented code quality tools for consistency and early error detection
3. **Neon + Drizzle** - Integrated a serverless PostgreSQL database with type-safe ORM
4. **Logger & Middleware** - Added comprehensive logging, security headers, and absolute imports
5. **Authentication** - Added user signup with bcrypt password hashing, Zod validation, and JWT sessions delivered via httpOnly cookies

## API Endpoints

### GET /
Returns a welcome message.

**Response:**
```json
{
  "message": "Hello from Acquisitions API"
}
```

### POST /api/auth/sign-up
Registers a new user, hashes the password with bcrypt, issues a JWT, and sets it as an httpOnly cookie.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "User Registered",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

165 | The **/api/auth/sign-in** endpoint authenticates a user and sets a JWT in an httpOnly cookie. The **/api/auth/sign-out** endpoint clears the authentication cookie.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| LOG_LEVEL | Logging level | info |
| DATABASE_URL | Neon Postgres connection string | - |
| JWT_SECRET | Secret used to sign JWTs | your-secret-key-please-change-this |
| JWT_EXPIRES_IN | JWT expiration duration | 1d |

## Security

### Secure our API with ARCjet

- **Config file**: `src/config/arcjet.js` — ARCjet is included to provide automated security hardening and runtime protections. Review and update this file to match your deployment requirements.
- **Enable**: Import ARCjet early in the app bootstrap (for example in `src/app.js`): `import './config/arcjet.js'` so protections run before other modules.
- **Secrets**: Keep ARCjet secrets and keys in environment variables (do not commit them). Rotate keys regularly and restrict access.

## License

MIT