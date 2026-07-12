const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the Song App Backend!');
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
