const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const { connectDatabase, isDatabaseConnected } = require('./db');
const User = require('./models/users');
const Song = require('./models/songs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const inMemoryUsers = [];
const inMemorySongs = [
    { _id: '1', title: 'Blinding Lights', artist: 'The Weeknd', username: 'seed' },
    { _id: '2', title: 'Flowers', artist: 'Miley Cyrus', username: 'seed' },
    { _id: '3', title: 'Shape of You', artist: 'Ed Sheeran', username: 'seed' },
];

function normalizeSong(songDoc) {
    return {
        _id: String(songDoc._id),
        title: songDoc.title,
        artist: songDoc.artist,
        username: songDoc.username || 'anonymous',
    };
}

function getAuthHeaderToken(req) {
    return req.headers['x-auth'] || '';
}

function requireAuth(req, res, next) {
    const token = getAuthHeaderToken(req);
    if (!token) {
        return res.status(401).json({ auth: 0, message: 'missing token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.authUser = { username: decoded.username };
        return next();
    } catch (error) {
        return res.status(401).json({ auth: 0, message: 'invalid token' });
    }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/hello', (req, res) => {
    res.send('Hello Express');
});

app.get('/api/goodbye', (req, res) => {
    res.send('Goodbye Express');
});

// Keep legacy text endpoints for backward compatibility.
app.get('/hello', (req, res) => {
    res.redirect('/api/hello');
});

app.get('/goodbye', (req, res) => {
    res.redirect('/api/goodbye');
});

app.post('/users', async (req, res) => {
    const { username, password, status } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' });
    }

    if (isDatabaseConnected()) {
        try {
            const existing = await User.findOne({ username });
            if (existing) {
                return res.status(409).json({ message: 'username already exists' });
            }

            const newUser = await User.create({ username, password, status: status ?? 1 });
            return res.status(201).json({ message: 'user saved', id: String(newUser._id) });
        } catch (error) {
            return res.status(500).json({ message: 'user creation failed', error: error.message });
        }
    }

    const duplicate = inMemoryUsers.find((user) => user.username === username);
    if (duplicate) {
        return res.status(409).json({ message: 'username already exists' });
    }
    const newUser = { _id: String(Date.now()), username, password, status: status ?? 1 };
    inMemoryUsers.push(newUser);
    return res.status(201).json({ message: 'user saved (memory mode)', id: newUser._id });
});

app.post('/auth', async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' });
    }

    let user;

    if (isDatabaseConnected()) {
        user = await User.findOne({ username });
    } else {
        user = inMemoryUsers.find((item) => item.username === username);
    }

    if (!user) {
        return res.status(401).json({ message: 'bad username' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'bad password' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '2h' });
    return res.json({ username2: username, token, auth: 1 });
});

app.get('/status', (req, res) => {
    const token = getAuthHeaderToken(req);
    if (!token) {
        return res.status(401).json({ auth: 0, message: 'missing token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ auth: 1, username: decoded.username });
    } catch (error) {
        return res.status(401).json({ auth: 0, message: 'invalid token' });
    }
});

app.get('/api/songs', async (req, res) => {
    if (isDatabaseConnected()) {
        const songs = await Song.find().sort({ createdAt: -1 });
        return res.json(songs.map(normalizeSong));
    }

    return res.json(inMemorySongs);
});

app.post('/api/songs', requireAuth, async (req, res) => {
    const { title, artist } = req.body || {};
    const username = req.authUser?.username || 'anonymous';
    if (!title || !artist) {
        return res.status(400).json({ message: 'title and artist are required' });
    }

    if (isDatabaseConnected()) {
        try {
            const created = await Song.create({ title, artist, username });
            return res.status(201).json(normalizeSong(created));
        } catch (error) {
            return res.status(500).json({ message: 'failed to create song', error: error.message });
        }
    }

    const nextSong = {
        _id: String(Date.now()),
        title,
        artist,
        username,
    };
    inMemorySongs.unshift(nextSong);
    return res.status(201).json(nextSong);
});

app.delete('/api/songs/:id', requireAuth, async (req, res) => {
    const { id } = req.params;

    if (isDatabaseConnected()) {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'invalid song id' });
        }

        const deleted = await Song.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'song not found' });
        }

        return res.json({ message: 'song deleted', id: String(deleted._id) });
    }

    const index = inMemorySongs.findIndex((song) => song._id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'song not found' });
    }

    inMemorySongs.splice(index, 1);
    return res.json({ message: 'song deleted', id });
});

// Keep legacy endpoint for backward compatibility.
app.get('/songs', (req, res) => {
    res.redirect('/api/songs');
});

app.use((_, res) => {
    res.status(404).json({ message: 'route not found' });
});

connectDatabase().finally(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});
