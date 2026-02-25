# MovieExplorer — Documentation

A full-stack web application for browsing movies and TV shows powered by the [TMDB API](https://www.themoviedb.org/). Users can explore trending and popular titles, search by keyword, filter by genre, view detailed pages with cast and recommendations, and maintain personal favorites and watched lists after registering an account.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Local Development (without Docker)](#local-development-without-docker)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Features

**Public (no account required)**
- Browse popular and trending movies and TV shows
- Search by keyword across both movies and shows
- Filter by genre
- View full detail pages: overview, runtime, cast, user score, trailer
- See recommended titles on every detail page

**Registered users**
- Add or remove movies from a personal Favorites list
- Mark movies as Watched / Unwatched
- View and manage both lists from the Profile page

---

## Architecture

```
Browser
  └─► :80  Nginx  (reverse proxy — single entry point)
         ├─► /api/*   → backend:3001  (Express REST API)
         │                └─► db-primary:5432  (PostgreSQL — writes)
         │                          └─► db-replica:5432  (PostgreSQL — hot standby)
         └─► /*       → frontend:3000  (Next.js standalone server)
```

All traffic enters through Nginx on port 80. The browser never speaks directly to the backend or the database. The Next.js server also proxies `/api/*` requests to the backend at build-time via `next.config.mjs` rewrites, so no CORS configuration is needed on the client side.

The PostgreSQL cluster uses a **primary-replica** setup (Bitnami image with streaming replication). The backend only writes to and reads from the primary. The replica is a live hot standby that can be promoted if the primary fails.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Component architecture, SSR/SSG, built-in image optimisation |
| Styling | Tailwind CSS | Utility-first, no runtime cost, consistent design tokens |
| Backend | Node.js + Express | Lightweight REST API, same language as frontend |
| ORM | Prisma | Type-safe database access, migration management |
| Database | PostgreSQL | Relational, production-ready, supports streaming replication |
| Auth | JWT (jsonwebtoken) | Stateless, no server-side session storage needed |
| Password hashing | bcryptjs | Industry-standard adaptive hashing |
| Input validation | express-validator | Declarative rules on route level |
| Security | Helmet, CORS, express-rate-limit | HTTP headers, origin control, brute-force protection |
| External API | TMDB REST API v3 | Movie and TV show data, images, metadata |
| HTTP client | axios | Used on the backend to call TMDB |
| Containerisation | Docker + Docker Compose | Reproducible environments, isolated services |
| Proxy | Nginx 1.25 | Reverse proxy, WebSocket support for Next.js |
| CI/CD | GitHub Actions | Automated build and push to DockerHub on merge to main |

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── docker-publish.yml    # CI/CD: build & push images on push to main
├── backend/
│   ├── prisma/
│   │   ├── migrations/           # SQL migration history
│   │   │   └── 0_init/
│   │   └── schema.prisma         # Database schema (source of truth)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js         # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── authController.js # Register / login logic
│   │   │   ├── movieController.js# Movie endpoints
│   │   │   ├── showController.js # TV show endpoints
│   │   │   └── userController.js # Favorites / watched logic
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification middleware
│   │   │   └── errorHandler.js   # Central error handler
│   │   ├── routes/
│   │   │   ├── auth.js           # POST /api/auth/*
│   │   │   ├── movies.js         # GET  /api/movies/*
│   │   │   ├── shows.js          # GET  /api/shows/*
│   │   │   └── users.js          # GET/POST/PUT/DELETE /api/users/*
│   │   ├── services/
│   │   │   └── tmdb.js           # All TMDB API calls
│   │   └── index.js              # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── layout.jsx        # Root layout (Navbar, Footer, AuthProvider)
│   │   │   ├── page.jsx          # Home page (/)
│   │   │   ├── login/page.jsx
│   │   │   ├── register/page.jsx
│   │   │   ├── profile/page.jsx
│   │   │   ├── search/page.jsx
│   │   │   ├── movies/[id]/page.jsx
│   │   │   └── shows/            # TV show pages
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── SearchBanner.jsx
│   │   │   ├── movies/
│   │   │   │   ├── MovieCard.jsx
│   │   │   │   └── MovieGrid.jsx
│   │   │   ├── shows/            # TV show card / grid components
│   │   │   └── ui/
│   │   │       ├── SearchBar.jsx
│   │   │       └── Spinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state (React Context)
│   │   └── lib/
│   │       └── api.js            # All fetch calls + TMDB image helpers
│   ├── next.config.mjs           # Standalone output, image allowlist, API rewrite
│   ├── tailwind.config.js        # Custom TMDB colour tokens
│   └── package.json
├── docker/
│   ├── backend.dockerfile        # Multi-stage: deps → production
│   └── frontend.dockerfile       # Multi-stage: deps → builder → production
├── nginx/
│   └── nginx.conf                # Route /api/* to backend, /* to frontend
├── docker-compose.yaml           # All 5 services wired together
└── .env.example                  # Template for required environment variables
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Docker | 24+ |
| Docker Compose | v2 (included with Docker Desktop) |
| Node.js | 20+ (local dev only) |
| TMDB API key | Free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |

---

## Quick Start with Docker

This is the recommended way to run the full stack.

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/The_Eskimos_Project1.git
cd The_Eskimos_Project1
```

### 2. Create the environment file

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
TMDB_API_KEY=your_real_tmdb_key_here
JWT_SECRET=a_long_random_string   # openssl rand -hex 64
```

The other values have safe defaults that work with the Docker Compose setup.

### 3. Build and start all services

```bash
docker compose up --build
```

This starts five containers:
- `db-primary` — PostgreSQL primary (port not exposed to host)
- `db-replica` — PostgreSQL hot standby
- `backend` — Express API (port not exposed to host)
- `frontend` — Next.js server (port not exposed to host)
- `nginx` — Reverse proxy, listens on **http://localhost:80**

The backend runs `prisma migrate deploy` automatically on startup, so the database schema is always up to date.

### 4. Open the app

```
http://localhost
```

### Stopping

```bash
docker compose down          # stop containers, keep database volumes
docker compose down -v       # stop containers AND delete all data
```

---

## Local Development (without Docker)

Run the backend and frontend directly on your machine. You still need a running PostgreSQL instance.

### Backend

```bash
cd backend
cp ../.env.example .env      # edit DATABASE_URL to point to your local Postgres
npm install
npx prisma migrate dev       # applies migrations and generates the Prisma client
npm run dev                  # starts on http://localhost:3001, auto-restarts on change
```

Available database scripts:

| Script | Description |
|---|---|
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Apply pending migrations (production-safe) |
| `npm run db:migrate:dev` | Create a new migration from schema diff (dev only) |
| `npm run db:studio` | Open Prisma Studio (browser GUI for the database) |

### Frontend

```bash
cd frontend
npm install
npm run dev                  # starts on http://localhost:3000
```

The frontend proxies all `/api/*` requests to `http://localhost:3001` by default (configured in `next.config.mjs`).

---

## Environment Variables

All variables are defined in `.env` at the project root and consumed by Docker Compose. Copy `.env.example` to get started.

| Variable | Required | Default | Description |
|---|---|---|---|
| `TMDB_API_KEY` | **Yes** | — | TMDB v3 API key |
| `JWT_SECRET` | **Yes** | — | Secret for signing JWT tokens. Use a long random string |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime (e.g. `1d`, `7d`, `30d`) |
| `DATABASE_URL` | **Yes** | see example | PostgreSQL connection string |
| `PORT` | No | `3001` | Backend server port |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |
| `POSTGRES_USER` | No | `eskimos` | Database username (Docker Compose) |
| `POSTGRES_PASSWORD` | No | `eskimos_secret` | Database password (Docker Compose) |
| `POSTGRES_DB` | No | `movieexplorer` | Database name (Docker Compose) |
| `POSTGRES_SUPERUSER_PASSWORD` | No | `postgres_secret` | Bitnami superuser password |
| `POSTGRES_REPLICATION_PASSWORD` | No | `replicator_secret` | Password for the replication user |

> **Security note:** Never commit `.env` to version control. The `.gitignore` already excludes it.

---

## Database Schema

Three tables managed by Prisma migrations.

```
User
├── id          Int       (PK, auto-increment)
├── email       String    (unique)
├── password    String    (bcrypt hash, never plaintext)
├── name        String
├── createdAt   DateTime
└── updatedAt   DateTime  (auto-updated on every write)

Favorite
├── id            Int       (PK)
├── userId        Int       (FK → User, CASCADE DELETE)
├── tmdbMovieId   Int       (TMDB numeric ID — no movie data stored locally)
├── addedAt       DateTime
└── UNIQUE (userId, tmdbMovieId)

Watched
├── id            Int       (PK)
├── userId        Int       (FK → User, CASCADE DELETE)
├── tmdbMovieId   Int
├── watched       Boolean   (default true, can be toggled to false)
├── addedAt       DateTime
└── UNIQUE (userId, tmdbMovieId)
```

Only TMDB IDs are stored — no movie data is cached in the database. Full details are always fetched live from TMDB. `CASCADE DELETE` means removing a user account automatically removes all their favorites and watched records.

---

## API Reference

Base URL: `/api` (proxied through Nginx to the backend)

All protected endpoints require the header:
```
Authorization: Bearer <token>
```

Tokens are obtained from the login or register endpoints and should be stored client-side (the frontend uses `localStorage`).

---

### Authentication

#### `POST /api/auth/register`

Create a new account.

**Request body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

Validation rules: email must be valid, password minimum 8 characters, name must not be empty.

**Response `201`:**
```json
{
  "user": { "id": 1, "email": "alice@example.com", "name": "Alice", "createdAt": "..." },
  "token": "<jwt>"
}
```

| Status | Meaning |
|---|---|
| `201` | Account created, token returned |
| `409` | Email already in use |
| `422` | Validation failed (see `errors` array in response) |

---

#### `POST /api/auth/login`

Log in to an existing account.

**Request body:**
```json
{
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

**Response `200`:**
```json
{
  "user": { "id": 1, "email": "alice@example.com", "name": "Alice", "createdAt": "..." },
  "token": "<jwt>"
}
```

| Status | Meaning |
|---|---|
| `200` | Login successful |
| `401` | Invalid credentials (same message for wrong email and wrong password — intentional) |
| `422` | Validation failed |

---

### Movies

All movie endpoints are public — no token required.

| Method | Endpoint | Query params | Description |
|---|---|---|---|
| `GET` | `/api/movies/popular` | `page` (default `1`) | Paginated list of popular movies |
| `GET` | `/api/movies/trending` | `time_window` (`week`\|`day`, default `week`) | Trending movies |
| `GET` | `/api/movies/search` | `q` **(required)**, `page` | Search movies by keyword |
| `GET` | `/api/movies/genres` | — | All TMDB genre IDs and names |
| `GET` | `/api/movies/discover` | `genre` **(required)**, `page` | Discover movies by genre ID(s) — comma-separate for multiple: `?genre=28,12` |
| `GET` | `/api/movies/:id` | — | Full movie details including cast and videos |
| `GET` | `/api/movies/:id/recommendations` | `page` | Movies recommended based on this title |

All responses are TMDB API payloads passed through directly. Paginated responses include `results[]`, `total_pages`, and `total_results`. Pages are capped at 500 (TMDB limit).

---

### TV Shows

All show endpoints are public. They mirror the movie endpoints exactly.

| Method | Endpoint | Query params | Description |
|---|---|---|---|
| `GET` | `/api/shows/popular` | `page` | Popular TV shows |
| `GET` | `/api/shows/trending` | `time_window` | Trending shows |
| `GET` | `/api/shows/search` | `q`, `page` | Search shows by keyword |
| `GET` | `/api/shows/genres` | — | TV genre list |
| `GET` | `/api/shows/discover` | `genre`, `page` | Discover shows by genre |
| `GET` | `/api/shows/:id` | — | Full show details including cast and videos |
| `GET` | `/api/shows/:id/recommendations` | `page` | Recommended shows |

---

### User — protected endpoints

All endpoints below require `Authorization: Bearer <token>`.

#### `GET /api/users/me`

Returns the authenticated user's profile (no password field).

**Response `200`:**
```json
{ "id": 1, "email": "alice@example.com", "name": "Alice", "createdAt": "..." }
```

---

#### Favorites

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/favorites` | List all favorited movies, newest first |
| `POST` | `/api/users/favorites/:movieId` | Add a movie to favorites (idempotent — safe to call twice) |
| `DELETE` | `/api/users/favorites/:movieId` | Remove a movie from favorites (idempotent) |

`GET` response:
```json
[
  { "id": 1, "userId": 1, "tmdbMovieId": 550, "addedAt": "2024-01-15T..." }
]
```

`POST` → `201` with the created/existing record.
`DELETE` → `204 No Content`.

---

#### Watched

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/api/users/watched` | — | List all watched records |
| `PUT` | `/api/users/watched/:movieId` | `{ "watched": true\|false }` | Create or update watched status (upsert) |
| `DELETE` | `/api/users/watched/:movieId` | — | Remove the record entirely |

`PUT` body is optional — omitting `watched` defaults to `true`. Send `{ "watched": false }` to unmark a movie.

---

### Health check

```
GET /health
```

Returns `{ "status": "ok", "timestamp": "..." }`. Used by Docker health checks and monitoring tools.

---

## CI/CD Pipeline

The repository includes a GitHub Actions workflow at `.github/workflows/docker-publish.yml`.

**Trigger:** every push to the `main` branch.

**Steps:**
1. Check out source code
2. Set up Docker Buildx (required for multi-stage builds and layer caching)
3. Log in to DockerHub using repository secrets
4. Build the **backend** image (targeting the `production` stage) and push to DockerHub
5. Build the **frontend** image (with `API_URL=http://backend:3001` build arg) and push to DockerHub

GitHub Actions layer cache (`type=gha`) is enabled — if `package.json` hasn't changed, the `npm install` layer is reused from the previous run, significantly reducing build time.

### Required GitHub repository secrets

Go to: `GitHub repo → Settings → Secrets and variables → Actions → New repository secret`

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your DockerHub username |
| `DOCKERHUB_TOKEN` | DockerHub access token (Settings → Security → New Access Token) |

### Published images

```
<DOCKERHUB_USERNAME>/movieexplorer-backend:latest
<DOCKERHUB_USERNAME>/movieexplorer-frontend:latest
```

### Deploying the latest images on a server

```bash
docker compose pull        # pull the newly published images
docker compose up -d       # restart containers in the background
```
