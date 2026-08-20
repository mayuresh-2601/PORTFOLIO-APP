# Security Notes

## Authentication

Admin authentication uses bcrypt password verification and JWTs. The browser never receives the JWT as JSON and never stores it in `localStorage`; the API sets it as an HttpOnly cookie. Production cookies are Secure and use `SameSite=None` because the Vercel frontend and Render backend are different sites.

## CSRF

Because the browser session is cookie-based, authenticated state-changing requests must send `X-CSRF-Token`. The matching token is stored in a non-HttpOnly cookie and compared using a timing-safe equality check.

## Abuse controls

- Login: 5 attempts / 15 minutes / IP.
- Contact: 5 submissions / 10 minutes / IP.
- AI: 10 requests / minute / IP.

These limits are in-memory and therefore intended for the current single-instance deployment. Use Redis for horizontally scaled deployments.

## Browser/API hardening

- Helmet security headers.
- Strict CORS allowlist.
- `x-powered-by` disabled.
- Request body limits.
- Parameterized SQL queries.
- Restricted upload types and size.
- Escaped HTML in generated email notifications.

## Secrets

Never commit `.env` files, API keys, passwords, JWT secrets, Cloudinary secrets, database credentials, or email app passwords. If a secret has ever been committed to Git or shared in an archive, rotate it at the provider. The release ZIP intentionally excludes Git history and all real `.env` files.

## Public system telemetry

The `/api/system` endpoint remains public because it is a portfolio demonstration of live DevOps telemetry. If this application becomes a real production product, restrict or remove detailed host/runtime metadata.
