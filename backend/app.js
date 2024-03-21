const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/Book')

mongoose.connect('mongodb+srv://dbUser:FBQa6SLTYNbQmEzl@cluster0.ijofa9c.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB failed !'))
  .catch(() => console.log('Connection to MongoDB successful !'));

const app = express();

// new way, old way was "body-parser"
// allow the use of request.body
app.use(express.json());

// No route specified because we want the middleware to be appplied to every routes of the server
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/books', (request, response, next) => {
    delete request.body._id;
    const book = new Book({
        ...request.body
    });
    thing.save()
    .then(() => response.status(201).json({ message: 'Book saved !'}))
    .catch(error => response.status(400).json({ error }));
});

app.get('/api/books', (request, response, next) => {
    Book.find()
        .then(books => response.status(200).json(books))
        .catch(error => response.status(400).json({ error }));
});

module.exports = app;