# Commit: XXXXXXX - Authentication setup

## Goal
Implement user authentication for the Acquisitions API, including secure password hashing, input validation, JWT-based sessions delivered via httpOnly cookies, and a layered controller/service/validation architecture.

## Technical Implementation

### 1. Dependency Installation
```bash
npm install bcrypt jsonwebtoken zod
```
- **bcrypt**: Password hashing and comparison
- **jsonwebtoken**: Issuing and verifying JWTs
- **zod**: Runtime input validation

### 2. JWT Utility (`jwt.js`)
A thin wrapper around `jsonwebtoken` with structured error logging:
```javascript
import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-please-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const jwttoken = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error('Failed to authenticate user', e);
      const err = new Error('Failed to authenticate user');
      err.cause = e;
      throw err;
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Failed to verify token', e);
      const err = new Error('Failed to verify token');
      err.cause = e;
      throw err;
    }
  },
};
```

### 3. Input Validation (`src/validations/auth.validation.js`)
Zod schemas for signup and signin:
```javascript
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(255),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signinSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});
```

### 4. Cookie Utility (`src/utils/cookies.js`)
Helpers for setting, clearing, and reading cookies with secure defaults:
```javascript
export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 mins
  }),
  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },
  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },
  get: (req, name) => {
    return req.cookies[name];
  },
};
```

### 5. Auth Service (`src/services/auth.service.js`)
Business logic for password hashing and user creation:
```javascript
import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing the password: ${e}`);
    const error = new Error('Error Hashing');
    error.cause = e;
    throw error;
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser > 0) {
      throw new Error('User already exist');
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: passwordHash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating the user: ${e}`);
    const error = new Error('Error creating the user');
    error.cause = e;
    throw error;
  }
};
```

### 6. Auth Controller (`src/controllers/auth.controller.js`)
Request handler for signup: validates input, creates the user, signs a JWT, and sets it as an httpOnly cookie:
```javascript
import { signupSchema } from '#validations/auth.validation.js';
import { formatValidationError } from '#utils/format.js';
import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { jwttoken } from '../../jwt.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, role, password } = validationResult.data;
    const user = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      message: 'User Registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signup error', e);
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }
    next(e);
  }
};
```

### 7. Auth Routes (`src/routes/auth.routes.js`)
```javascript
import { signup } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in response');
});

router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out response');
});

export default router;
```

### 8. App Integration (`src/app.js`)
Mounted the auth router under the `/api/auth` prefix:
```javascript
import authRoutes from '#routes/auth.routes.js';

// ...middleware setup (helmet, cors, urlencoded, cookieParser, morgan)...

app.use('/api/auth', authRoutes);
```

### 9. Format Utility (`src/utils/format.js`)
Flattens Zod error issues into a human-readable string:
```javascript
export const formatValidationError = errors => {
  if (!errors || !errors.issues) {
    return 'Validation failed';
  }
  if (Array.isArray(errors.issues)) {
    return errors.issues.map(i => i.message).join(', ');
  }
  return JSON.stringify(errors);
};
```

### 10. Editor Configuration (`.vscode/extensions.json`)
Added recommended VS Code extensions to help contributors keep linting/formatting consistent.

## Rationale

### Why bcrypt for Passwords?
- **Adaptive Hashing**: Built-in salt and configurable cost factor resist brute-force attacks
- **Industry Standard**: Battle-tested for password storage
- **No Plaintext**: Passwords are never stored or logged in clear text

### Why JWT in httpOnly Cookies?
- **XSS Protection**: `httpOnly` cookies are inaccessible to client-side JavaScript
- **CSRF Mitigation**: `sameSite: 'strict'` limits cross-site requests
- **Stateless Sessions**: No server-side session store required
- **Secure in Production**: `secure: true` enforced when `NODE_ENV === 'production'`

### Why Zod for Validation?
- **Runtime Safety**: Validates untrusted request bodies
- **Declarative Schemas**: Single source of truth for shape and constraints
- **Clear Errors**: `.issues` provide actionable messages for clients

### Why the Layered Split?
- **Controller**: HTTP concerns (status codes, cookies, responses)
- **Service**: Business logic (hashing, DB writes)
- **Validation**: Input contract enforcement
- This keeps each file focused and testable in isolation, consistent with the project's modular architecture.

## Verification
```bash
# Start the development server
npm run dev

# Register a new user (signup)
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}' \
  -c cookies.txt   # Save the httpOnly token cookie

# Confirm a 201 response with the created user payload
# Inspect logs/ for "User registered successfully" entries
```

## Key Commands Summary
```bash
npm install bcrypt jsonwebtoken zod
# Create jwt.js (JWT sign/verify wrapper)
# Create src/validations/auth.validation.js (Zod schemas)
# Create src/utils/cookies.js (cookie helpers)
# Create src/utils/format.js (validation error formatter)
# Create src/services/auth.service.js (hashPassword, createUser)
# Create src/controllers/auth.controller.js (signup handler)
# Create src/routes/auth.routes.js (auth routes)
# Mount /api/auth in src/app.js
npm run dev   # Verify signup endpoint works