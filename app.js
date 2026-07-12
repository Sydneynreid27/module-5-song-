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

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
