# Commit: YYYYYYY - Sign‑in & Sign‑out functionality

## Goal
Add login and logout endpoints to the authentication service. The sign‑in endpoint validates credentials, issues a JWT, and stores it in an httpOnly cookie. The sign‑out endpoint clears the cookie.

## Technical Implementation

### 1. Service Layer
* `comparePassword` – bcrypt comparison helper.
* `authenticateUser` – fetch user by email, validate password, return user.

### 2. Controller Layer
* `signin` – validates request body using `signinSchema`, calls `authenticateUser`, signs JWT, sets cookie, and returns user payload.
* `signout` – clears the authentication cookie.

### 3. Routes
* `POST /sign-in` → `signin`.
* `POST /sign-out` → `signout`.

### 4. Documentation
Updated README to reflect new endpoints and added a new commit entry in the project evolution table.

## Verification
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}' \
  -c cookies.txt

curl -X POST http://localhost:3000/api/auth/sign-out \
  -b cookies.txt
```

Both commands should return a 200 status with appropriate JSON messages.
