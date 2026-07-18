---
title: Secure our API with ARCjet
commit: 38a6b71
date: 2026-07-18
---

Summary
-------

This commit adds ARCjet-based security hardening to the application. ARCjet provides runtime protections and automated hardening rules to reduce attack surface and detect anomalous behavior.

What changed
------------

- Added `src/config/arcjet.js` — ARCjet configuration and initialization.
- Added `src/middleware/security.middleware.js` — middleware for additional security-related HTTP headers and protections.
- Updated `README.md` with a new **Security** section describing how to enable ARCjet in the app bootstrap.

Why
---

Brings a lightweight, configurable runtime security layer that complements existing controls (CORS, helmet, rate-limiting). ARCjet runs early during app bootstrap for maximum coverage.

How to use
----------

1. Keep ARCjet keys and secrets in environment variables (never commit them).
2. Import ARCjet early in `src/app.js` or `src/index.js`:

```js
import './config/arcjet.js';
```

3. Review `src/config/arcjet.js` and customize protections to fit your deployment.

Files
-----

- `src/config/arcjet.js` (new)
- `src/middleware/security.middleware.js` (new)
- `README.md` (updated)

Notes
-----

This commit is intentionally small and focused on bootstrapping ARCjet. Further tuning and environment-specific configuration should follow in future commits.
