# Music App — backend

Express + MongoDB API: auth (JWT in httpOnly cookies), role-based access (listener vs artist), music, playlists, and likes.

## Setup

```bash
npm install
```

Create a `.env` (see `.env` for the expected keys):

```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random string>
FRONTEND_ORIGIN=http://localhost:5173
```

`FRONTEND_ORIGIN` must match the origin your frontend runs on — it's used for CORS so the browser will accept the auth cookie. It defaults to `http://localhost:5173` (Vite's default dev port).

```bash
node server.js
```

Runs on **http://localhost:3000**.

## API overview

**Auth** — `/api/auth`
- `POST /register` — `{ username, email, password, role? }`
- `POST /login` — `{ username | email, password }`
- `POST /logout`
- `GET /me` — current user (used by the frontend to restore a session)

**Music** — `/api/music`
- `GET /?q=&page=&limit=` — search + paginate
- `GET /:id`
- `POST /` — artist-only, `{ uri, title }`
- `POST /:id/like` — toggle like/unlike
- `GET /liked/me` — current user's liked tracks

**Playlists** — `/api/playlist`
- `POST /` — `{ name, description? }`
- `GET /` — current user's playlists
- `GET /:id` — playlist with populated tracks
- `POST /:id/tracks` — `{ musicId }`
- `DELETE /:id/tracks/:musicId`
- `DELETE /:id`

## Security note

The included `.env` originally shipped with a live MongoDB Atlas password. Rotate that password and never commit real credentials — keep `.env` in `.gitignore`.
