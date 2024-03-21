const express = require('express');

const app = express();

app.use((request, response, next) => {
    console.log('Request received.');
    next();
});

app.use((request, response, next) => {
    response.status(201);
    next();
});

app.use((request, response, next) => {
    response.json({ message: 'Request received.'});
    next();
});

app.use((request, response) => {
    console.log('Response successfully sent !');
});

module.exports = app;