# CHANGELOG — AI + Live System + Security Hardening

This document records the current AI/system features and the security hardening pass applied to the portfolio application.

## Current AI features

- Skill explanations via Google Gemini (`gemini-3.5-flash-lite`).
- Certificate explanations via Google Gemini.
- “Ask AI About Me” grounded in a controlled portfolio context.
- Per-IP AI rate limiting: 10 requests/minute.

## Current live system feature

`/system` displays live CPU, memory, uptime, Docker/bare-Node detection, and deployed Git information from the backend. The frontend refreshes the data every 5 seconds.

## Security hardening added

- JWT moved from browser `localStorage` to an HttpOnly cookie.
- CSRF protection added for authenticated state-changing requests.
- Login, contact, and AI endpoints have per-IP rate limits.
- CORS now requires the configured frontend origin.
- Body-size limits tightened.
- JWT issuer/audience and admin-role checks added.
- Upload MIME type + extension matching added.
- Notification-email HTML now escapes user-controlled content.
- Logout endpoint added.
- Duplicate `ProtectedRoute` implementation consolidated.
- Release archive excludes `.env` files, `node_modules`, and `.git` history.

## Verification

- Backend source passes `node --check`.
- Frontend is linted and built in CI.
- Dockerfiles are linted with Hadolint.
- Docker Compose is validated and the stack is smoke-tested in GitHub Actions.
- CI now requires `/api/projects` to return HTTP 200 instead of treating 404 as success.

## Deployment note

GitHub Actions currently provides CI validation and Docker smoke testing. It does **not** itself perform Render/Vercel deployment unless explicit deployment steps are added later. Render and Vercel remain the documented hosting targets.
