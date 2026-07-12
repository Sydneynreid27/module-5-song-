const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'song-frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'song-frontend', 'index.html'));
});

app.get('/hello', (req, res) => {
    res.send('Hello Express');
});

app.get('/goodbye', (req, res) => {
    res.send('Goodbye Express');
});

app.get('/songs', (req, res) => {

    const songs = [
        {
            title: "Blinding Lights",
            artist: "The Weeknd"
        },
        {
            title: "Flowers",
            artist: "Miley Cyrus"
        },
        {
            title: "Shape of You",
            artist: "Ed Sheeran"
        }
    ];

    res.json(songs);

});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
