# Music App — frontend

A small React + Tailwind CSS client for the Spotify-style backend (login/register, browse & search tracks, playlists, liked songs, and artist uploads).

## Setup

```bash
npm install
npm run dev
```

This starts the Vite dev server on **http://localhost:5173**.

Make sure the backend is running too (see the backend's own README), and that its `FRONTEND_ORIGIN` env var matches this dev server's origin (`http://localhost:5173` by default — already the backend's default).

## Configuration

The API base URL lives in `.env`:

```
VITE_API_BASE=http://localhost:3000/api
```

Change this if your backend runs on a different port.

## What's included

- **Auth** — login/register with role selection (listener vs artist), session restored on refresh via `GET /api/auth/me`
- **Browse** — search by title, paginated track list, like/unlike
- **Playlists** — create, view, add/remove tracks, delete
- **Liked songs** — everything you've liked, in one place
- **Upload** — visible only to users with the `artist` role, publishes a new track

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.
