# Fixed Release Notes

## Security
- JWT admin session moved from localStorage to HttpOnly cookies.
- CSRF protection added for authenticated state-changing requests.
- Login, contact, and AI rate limits added.
- Strict CORS allowlist enforced.
- Request body limits tightened.
- JWT issuer/audience/admin-role checks enforced.
- Upload MIME type + extension matching added.
- Email HTML output escapes user input.
- Docker Compose no longer exposes MySQL directly to the host.
- `no-new-privileges` enabled for Compose services.

## Cleanup
- Removed duplicate ProtectedRoute implementation.
- Removed real `.env` files from the release.
- Removed `.git` history from the release archive.
- Updated README, changelog, fixes, security notes, and presentation to match the current implementation.
- Corrected CI so `/api/projects` must return 200 instead of accepting 404.
- Renamed the workflow from CI/CD to CI because deployment is still performed by the hosting providers.

## Important
The original archive contained credentials. Treat those credentials as compromised and rotate them at their providers before using the fixed project in production.
