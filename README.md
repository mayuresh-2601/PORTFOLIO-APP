# Portfolio App — README (Detailed)

A complete and practical README for the Full Stack Portfolio Management System (React + Vite frontend, Express backend).

---

## Live Deployments

- Vercel (Client): https://portfolio-app-tau-lac.vercel.app/
- Render (Backend): https://portfolio-app-mmlr.onrender.com
- GitHub: https://github.com/mayuresh-2601/PORTFOLIO-APP

---

## Project Summary

This repository contains two main apps:

- `client/` — React 18 + Vite frontend (public portfolio + admin UI)
- `server/` — Node.js + Express backend (REST API, authentication, uploads)

Features:

- JWT-based admin authentication
- CRUD for projects, skills, and certificates
- Cloudinary image uploads via backend
- Contact form that stores messages and sends email notifications
- MySQL / TiDB-compatible persistent storage

---

## Table Of Contents

- Live Deployments
- Quick Local Setup
- Environment Variables (examples)
- Database: schema & sample
- Available npm scripts
- API Reference (examples)
- Deployment notes (Vercel + Render)
- Troubleshooting
- Contributing & License

---

## Quick Local Setup (detailed)

1) Clone repository

```bash
git clone https://github.com/mayuresh-2601/PORTFOLIO-APP.git
cd PORTFOLIO-APP
```

2) Backend (server)

```bash
cd server
npm install
# add server/.env (example below)
npm run dev
```

Common backend scripts (run from `server/`):

- `npm run dev` — starts the server with `nodemon` (development)
- `npm start` — production start

3) Frontend (client)

```bash
cd ../client
npm install
# add client/.env (example below)
npm run dev
```

Common frontend scripts (run from `client/`):

- `npm run dev` — starts Vite dev server
- `npm run build` — builds the production bundle
- `npm run preview` — preview built site

Access after startup:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Environment Variables (examples)

Create `server/.env` with:

```env
PORT=5000
DB_HOST=<your-db-host>
DB_PORT=4000
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=portfolio

JWT_SECRET=<a-strong-secret>

CLOUD_NAME=<cloudinary-cloud-name>
CLOUD_API_KEY=<cloudinary-api-key>
CLOUD_API_SECRET=<cloudinary-api-secret>

EMAIL_USER=<email-for-sending>
EMAIL_PASS=<email-app-password-or-api-key>
```

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

Notes:

- Never commit real secrets. Use placeholders in docs and add `.env` to `.gitignore`.

---

## Database: schema & sample

Run the SQL in your MySQL/TiDB instance to create core tables (example simplified):

```sql
CREATE TABLE projects (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT,
	github VARCHAR(512),
	demo VARCHAR(512),
	image VARCHAR(1024),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	level INT DEFAULT 0
);

CREATE TABLE messages (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	message TEXT,
	file_url VARCHAR(1024),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Reference (examples)

Base URL (development): `http://localhost:5000/api`

1) Admin login

POST /api/auth/login

Request body (JSON):

```json
{
	"email": "admin@example.com",
	"password": "your_password"
}
```

Success response:

```json
{
	"success": true,
	"message": "Login successful",
	"token": "<JWT>"
}
```

2) Create a project (protected, multipart/form-data)

POST /api/projects

Headers: `Authorization: Bearer <JWT>`

Form fields: `title`, `description`, `github`, `demo`, `image` (file)

3) Get all projects

GET /api/projects

Response: array of project objects

4) Send contact message

POST /api/messages

Form fields: `name`, `email`, `message`, optional `file`

For full route listings and validation, check `server/routes` and `server/controllers`.

---

## Deployment Notes

Deploying frontend to Vercel

- Create a new Vercel project pointing at the `client/` folder.
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` environment variable in Vercel (point to your backend production URL).

Deploying backend to Render (example)

- Create a new Web Service on Render.
- Connect repo and set the root to `server/`.
- Start command: `npm start` (ensure `PORT` is configured via Render environment settings).
- Add environment variables from `server/.env` (DB, Cloudinary, JWT_SECRET, EMAIL_*).

Docker

- The repo includes Docker configuration that can be used with `docker compose up --build`.

---

## Troubleshooting

- Port conflicts: change `PORT` in `server/.env` and update `VITE_API_URL` locally.
- DB connection errors: verify host, port, user, password, and allowlist network.
- Image upload failures: verify Cloudinary credentials and the upload middleware logs.
- Email sending failures: ensure `EMAIL_USER` and `EMAIL_PASS` are correct and service allows SMTP.

Logs: check server console (`npm run dev`) for stack traces.

---

## Contributing

- Fork the repository and open a PR. Follow branch naming conventions: `feature/*`, `bugfix/*`.
- Run linters and tests (if present) before submitting.

---



- Vercel: https://portfolio-app-tau-lac.vercel.app/
- Render: https://portfolio-app-mmlr.onrender.com
- GitHub: https://github.com/mayuresh-2601/PORTFOLIO-APP

---

## Author & License

Mayuresh Kasar — Full Stack Developer

License: MIT
