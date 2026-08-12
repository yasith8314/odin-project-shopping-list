# GameScout

GameScout is a full-stack free-to-play game discovery application. Authenticated
users can explore titles from the FreeToGame catalogue, filter and sort results,
view game details, maintain a local wishlist, and save favourites to their
account.

## Features

- Account signup and login using JWT authentication and hashed passwords.
- Game discovery sections for best sellers, all-time popular games, and recent
  releases.
- Debounced search plus platform, genre, and release-date/name sorting filters.
  Active filters are stored in the URL so a filtered view can be shared.
- Game-detail modal with screenshots, platform icons, share/copy-link support,
  keyboard dismissal, and focus return.
- Persistent local wishlist and recently viewed games (stored in browser local
  storage).
- Server-persisted favourites for signed-in users.
- One 1–5-star review and written comment per user per game, with editing and
  deletion controls for the review owner.
- Toast feedback, loading skeletons, retry/error states, and a global React
  error boundary.
- Client caching with TanStack Query and a 10-minute in-memory cache for
  FreeToGame responses in the backend.
- First-party analytics for game views, searches, and filter selections; it
  stores only the signed-in user, event type, optional game ID, and limited
  event metadata.
- Social follows, public shareable game lists, threaded game discussions,
  administrator moderation/statistics, and installable offline-capable PWA
  support.

## Architecture

```text
React + Vite frontend
        |
        | /api (Vite proxy in development, Nginx proxy in Docker)
        v
Express API ─────────────── MySQL (users and preferences)
        |
        v
FreeToGame API (catalogue and game details)
```

The browser only calls the local `/api` endpoint. The Express server validates
the requested catalogue path, proxies it to FreeToGame, and caches successful
responses. This keeps the external API URL out of the client request flow and
reduces repeat requests.

## Technology

- Frontend: React 19, React Router, Vite, Axios, TanStack Query, React Icons
- Backend: Node.js, Express, MySQL (`mysql2`), JWT, bcrypt
- Operations: Docker Compose, Nginx, GitHub Actions

## Prerequisites

- Node.js 24 or later
- MySQL 8+ for local development, or Docker Desktop for the containerized setup
- An internet connection to retrieve catalogue data from FreeToGame

## Run locally

1. Create the database and table:

   ```sh
   mysql -u root -p < backend/schema.sql
   ```

   The backend applies versioned migrations automatically at startup. To apply
   the current migrations manually instead, run:

   ```sh
   mysql -u root -p gameapp < backend/migrations/001_create_reviews.sql
   mysql -u root -p gameapp < backend/migrations/002_create_analytics_events.sql
   ```

2. Create the backend environment file:

   ```sh
   cp backend/.env.example backend/.env
   ```

   On PowerShell, use:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

3. Update `backend/.env` with your MySQL credentials and a long, unique
   `JWT_SECRET`.

4. Install and start the backend:

   ```sh
   cd backend
   npm install
   npm start
   ```

5. In a second terminal, install and start the frontend:

   ```sh
   cd shopping_list
   npm install
   npm run dev
   ```

Open the URL printed by Vite (normally `http://localhost:5173`). During local
development Vite forwards `/api` requests to `http://localhost:5000`.

## Configuration

Backend variables are documented in [`backend/.env.example`](backend/.env.example).
`VITE_API_URL` is the frontend's optional build-time variable.

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | Express server port | `5000` |
| `JWT_SECRET` | Secret used to sign login tokens | Required |
| `MYSQL_HOST` | MySQL host | Required |
| `MYSQL_PORT` | MySQL port | MySQL default |
| `MYSQL_USER` | MySQL user | Required |
| `MYSQL_PASSWORD` | MySQL password | Required |
| `MYSQL_DATABASE` | Database name | `gameapp` |
| `VITE_API_URL` | Optional API base URL for a separately hosted API | `/api` |

Set `VITE_API_URL` only when the frontend and backend use different origins.
For the standard local and Docker setups, leave it unset.

## Run with Docker

Docker Compose starts MySQL, the Express API, and the built React application
served by Nginx:

```sh
docker compose up --build
```

Then open `http://localhost:5173`. The API is also exposed at
`http://localhost:5000` for direct development use.

Before using this outside local development, replace the example MySQL password
and `JWT_SECRET` in [`docker-compose.yml`](docker-compose.yml). The MySQL data
is retained in the named `mysql-data` volume. To stop the stack, run
`docker compose down`.

The backend waits for MySQL to be healthy, then applies any pending files in
`backend/migrations/`. Existing Docker volumes therefore receive the reviews
and analytics tables after the backend is restarted.

## API overview

All endpoints are prefixed with `/api`. Protected routes require:

```http
Authorization: Bearer <token>
```

| Method | Route | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Create an account and return a token. Passwords require at least 8 characters. |
| `POST` | `/auth/login` | No | Sign in and return a token. |
| `GET` | `/preferences` | Yes | Get the current user's favourites and display preferences. |
| `PUT` | `/preferences` | Yes | Update `favorites`, `platform`, and/or `theme`. |
| `POST` | `/preferences/favorites/toggle` | Yes | Toggle a positive integer `gameId` in favourites. |
| `GET` | `/preferences/favorites/check/:gameId` | Yes | Check whether a game is favourited. |
| `GET` | `/reviews?gameId=...` | No | Get a game's reviews and rating summary. |
| `POST` | `/reviews` | Yes | Publish one review for a game. Requires `gameId`, `rating` (1–5), and `comment`. |
| `PUT` | `/reviews/:reviewId` | Yes | Edit the signed-in user's review. |
| `DELETE` | `/reviews/:reviewId` | Yes | Delete the signed-in user's review. |
| `POST` | `/analytics/events` | Yes | Record a supported product-analytics event. |
| `POST/DELETE` | `/social/follow/:userId` | Yes | Follow or unfollow another user. |
| `GET` | `/social/following` | Yes | List followed users. |
| `POST` | `/social/lists` | Yes | Create a public list from up to ten game IDs. |
| `GET` | `/social/lists/:token` | No | View a public shared list. |
| `GET/POST` | `/social/comments` | Read/write | Read or add threaded game comments. |
| `GET` | `/admin/stats` | Admin | View users, reviews, analytics, and daily-active-user counts. |
| `GET/DELETE` | `/admin/reviews/:id` | Admin | Moderate reviews. |
| `POST` | `/admin/cache/refresh` | Admin | Clear the FreeToGame proxy cache. |
| `GET` | `/games?query=...` | No | Retrieve an allowed FreeToGame catalogue or detail query through the cache. |

Example game request:

```text
GET /api/games?query=games%3Fcategory%3Dmmorpg%26sort-by%3Dpopularity
```

## Quality checks

From `shopping_list`:

```sh
npm run lint
npm run build
```

The GitHub Actions workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
runs frontend linting/building and backend syntax checks for pushes and pull
requests.

## PWA

The frontend includes a web manifest and service worker. Production builds are
installable from supporting browsers and cache the application shell for repeat
visits. API calls remain network-only so user data is never served from stale
offline cache. The first administrator account must have its `users.role` set
to `admin` directly in MySQL before `/admin` is available.

## Project layout

```text
backend/             Express server, authentication, preferences, reviews, and schema
backend/migrations/  SQL migrations for existing databases
shopping_list/       React application and production Nginx configuration
.github/workflows/   Continuous-integration workflow
docker-compose.yml   Full local container stack
```
