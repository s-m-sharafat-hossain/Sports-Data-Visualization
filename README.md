# Sports Data Visualization Dashboard

Full-stack sports analytics dashboard built with **Node.js/Express + TypeScript** (backend) and **React + Vite + TypeScript + Tailwind + Recharts** (frontend).

The app consumes **TheSportsDB** API, adds a caching layer (in-memory + Redis), and is designed to persist richer data in **MongoDB** using Mongoose models. All database-related logic is centralized through a `database` module.

---

## Features

- **Live / upcoming matches** feed with league filter
- **League standings** view (e.g. EPL – league id `4328`)
- **Team analytics**:
  - Recent form line chart (3/1/0 points for W/D/L)
  - Win / Draw / Loss distribution chart
- **Match details** page with core info and hooks for deeper visualizations
- Placeholder pages for **Player Profile** and **Settings** (for future expansion)
- Backend organized with a **central database module** that exposes:
  - Mongo connection helper
  - Redis client
  - All Mongoose models

---

## Tech Stack

### Backend

- Node.js, TypeScript
- Express
- Axios (HTTP client to TheSportsDB)
- Mongoose (MongoDB ODM)
- ioredis (Redis client)
- Helmet, CORS, Morgan (security + logging)

Key backend folders:

- `backend/src/server.ts` – Express app bootstrap
- `backend/src/routes/` – API routes (`leagues`, `matches`, `teams`, ...)
- `backend/src/services/theSportsDb.ts` – TheSportsDB integration + caching
- `backend/src/cache/memoryCache.ts` – Simple in-memory cache
- `backend/src/config/env.ts` – Environment/config loader
- `backend/src/db/` – Low-level Mongo and Redis helpers
- `backend/src/models/` – Mongoose models for users, teams, matches, etc.
- `backend/src/database/index.ts` – **Central database module** that re-exports connection helpers and models

### Frontend

- Vite + React + TypeScript
- React Router
- Tailwind CSS
- Recharts (charts/graphs)

Key frontend folders:

- `frontend/src/main.tsx` – React entry point
- `frontend/src/App.tsx` – Routing + layout shell
- `frontend/src/pages/` – Pages: `HomeDashboard`, `MatchDetails`, `LeagueOverview`, `TeamAnalytics`, `PlayerProfile`, `Settings`
- `frontend/tailwind.config.cjs`, `frontend/src/styles.css` – Styling setup

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm**
- Optional but recommended:
  - **MongoDB** (local or cloud, e.g. MongoDB Atlas)
  - **Redis** (local or cloud service)

The app can start without Mongo/Redis; the backend will log connection errors but continue running, and API responses will rely more heavily on TheSportsDB + in-memory caching.

---

## Environment Variables

Backend uses a `.env` file. There is an example at:

- `backend/.env.example`

Typical `.env` contents:

```env
PORT=4000

THESPORTSDB_API_KEY=YOUR_API_KEY_HERE
THESPORTSDB_BASE_URL=https://www.thesportsdb.com/api/v1/json

MONGO_URI=mongodb://localhost:27017/sports_dashboard
REDIS_URL=redis://localhost:6379
```

Notes:

- If `THESPORTSDB_API_KEY` is omitted, the backend falls back to TheSportsDB test key `'1'` (limited data).
- Adjust `MONGO_URI` / `REDIS_URL` if you are using cloud services.

---

## Installation & Running

### 1) Backend

From project root:

```bash
cd backend
npm install
```

Create your `.env`:

```bash
cp .env.example .env   # or manually create .env and copy the contents
```

Then start the backend dev server:

```bash
npm run dev
```

By default, the backend listens on **`http://localhost:4000`**.

Health check:

- `GET http://localhost:4000/api/health` → should return `{ status: 'ok', ... }`.

### 2) Frontend

In a second terminal, from project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will usually start on **`http://localhost:5173`**. It is configured to proxy `/api` requests to the backend on port `4000`.

---

## Using the App

Once both servers are running:

- **Home Dashboard** – `http://localhost:5173/`
  - Fetches live/upcoming matches from `/api/matches/live`.
  - Shows a list of matches and example charts.

- **League Overview** – `http://localhost:5173/league/4328`
  - League standings table and a bar chart of top teams by points.
  - Backend endpoint: `/api/league/:id/standings`.

- **Match Details** – `http://localhost:5173/match/<eventId>`
  - Displays match information for the given event.
  - Backend endpoint: `/api/match/:id`.

- **Team Analytics** – `http://localhost:5173/team/<teamId>`
  - Recent form line chart and W/D/L distribution for a team.
  - Backend endpoint: `/api/team/:id/recent`.

- **Player Profile** – `http://localhost:5173/player/<playerId>`
  - Currently a placeholder for future player stats visualizations.

- **Settings** – `http://localhost:5173/settings`
  - Currently a placeholder for user customization (favorite leagues, themes, etc.).

---

## Database and Caching

### Central database module

To keep database code organized, the backend exposes a single entry point at:

- `backend/src/database/index.ts`

From any backend file, you can import database utilities like this:

```ts
import { connectMongo, mongoose, redis, Match, League, Team } from '../database';
```

This module re-exports:

- `connectMongo` and `mongoose` from `src/db/mongo`
- `redis` from `src/db/redis`
- All Mongoose models from `src/models/*`

### Caching strategy

- **Redis cache** for shared, cross-process caching (if Redis is available).
- **In-memory cache** as a fallback inside the Node process.
- Helper: `backend/src/cache/memoryCache.ts`
- Upstream calls wrapped in `backend/src/services/theSportsDb.ts` using a `fetchWithCache` helper.

---

## NPM Scripts

### Backend (`backend/package.json`)

- `npm run dev`
  - Starts the backend in development mode using `ts-node-dev` and `src/server.ts`.
- `npm run build`
  - Compiles TypeScript to JavaScript in the `dist/` folder.
- `npm run start`
  - Runs the compiled backend from `dist/server.js`.

### Frontend (`frontend/package.json`)

- `npm run dev`
  - Starts the Vite dev server.
- `npm run build`
  - Builds the production frontend bundle.
- `npm run preview`
  - Serves the built frontend locally for preview.

---

## Development Notes

- The project is already wired for **TypeScript** on both backend and frontend.
- If you see type errors like "Cannot find module 'express'" or "Cannot find module 'react'", make sure you have run `npm install` inside both `backend/` and `frontend/`.
- For Node-specific types (like `process`), install Node types in the backend:

  ```bash
  cd backend
  npm install -D @types/node
  ```

- You can evolve the data layer to actually persist and query MongoDB using the provided models in `backend/src/models/` via the central `database` module.

---

## Keeping this README Updated

This README reflects the current structure of your project:

- Backend: Express + TypeScript, `/src/routes`, `/src/services/theSportsDb.ts`, `/src/database`, `/src/models`.
- Frontend: React + Vite + Tailwind + Recharts, with pages under `/src/pages`.

Whenever you add major features (new routes, pages, or visualizations), you can:

- Update the relevant sections manually, **or**
- Ask the assistant to "regenerate the README based on the current project" and it can rewrite the sections to match your latest code.
