# Commit: 5c6ee7e - Setup Neon Postgres w/ Drizzle

## Goal
Integrate a serverless PostgreSQL database (Neon) with a type-safe ORM (Drizzle) for scalable and secure data management.

## Technical Implementation

### 1. Dependency Installation
```bash
npm install @neon/database-serverless drizzle-orm
npm install -D drizzle-kit
```

### 2. Environment Configuration (`.env`)
```env
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database Configuration
DATABASE_URL="postgresql://..."  # From Neon dashboard
```

### 3. Drizzle Configuration (`drizzle.config.js`)
```javascript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});
```

### 4. Database Connection (`src/config/database.js`)
```javascript
import { neon } from '@neon/database-serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
export { sql };
```

### 5. User Model (`src/models/user.model.js`)
```javascript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});
```

### 6. Package.json Scripts
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Rationale

### Why Neon Postgres?
- **Serverless**: No need to manage database infrastructure
- **Scalable**: Automatically scales based on workload
- **Branching**: Database branches for development environments
- **Free Tier**: Generous free tier for development

### Why Drizzle ORM?
- **Type-Safe**: Full TypeScript support with type inference
- **SQL-like**: Familiar syntax for SQL developers
- **Lightweight**: Minimal overhead compared to Prisma
- **Migration System**: Built-in migration management

### Why This Architecture?
- **Separation**: Database logic isolated in `config/` and `models/`
- **Environment Variables**: Secure credential management
- **Migrations**: Version-controlled database schema changes

## Verification
```bash
# Generate migration files
npm run db:generate

# Apply migrations to Neon database
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

Check the Neon dashboard to verify the `users` table was created.

## Key Commands Summary
```bash
npm install @neon/database-serverless drizzle-orm
npm install -D drizzle-kit
# Create .env with DATABASE_URL
# Create drizzle.config.js
# Create src/config/database.js
# Create src/models/user.model.js
npm run db:generate    # Generate SQL migrations
npm run db:migrate     # Apply migrations to database