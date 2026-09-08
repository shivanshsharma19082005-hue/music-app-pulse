const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Allow the frontend (running on a different port/origin) to send
// credentials (cookies) with its requests.
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route');
const playlistRoutes = require('./routes/playlist.route');

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/playlist', playlistRoutes);

module.exports = app;
