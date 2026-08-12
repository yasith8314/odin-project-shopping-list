# GameScout

GameScout is a full-stack free-to-play game discovery app. Browse games from
the FreeToGame API, search, filter, sort, save favorites, and keep a personal
wishlist.

## Run locally

1. Import [`backend/schema.sql`](backend/schema.sql) into MySQL.
2. Copy `backend/.env.example` to `backend/.env` and fill in your database
   credentials and JWT secret.
3. Start the API: `cd backend && npm start`.
4. Start the frontend: `cd shopping_list && npm run dev`.

Set `VITE_API_URL` when the API is hosted somewhere other than
`http://localhost:5000/api`.
