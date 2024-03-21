const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/Book')

mongoose.connect('mongodb+srv://dbUser:FBQa6SLTYNbQmEzl@cluster0.ijofa9c.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful !'))
  .catch(() => console.log('Connection to MongoDB failed !'));

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
    book.save()
     .then(() => response.status(201).json({ message: 'Book saved !'}))
     .catch(error => response.status(400).json({ error }));
    next();
});

app.get('/api/books/:id', (request, response, next) => {
    Book.findOne({ _id: request.params.id })
     .then(book => response.status(200).json(book))
     .catch(error => response.status(404).json({ error }));
    next();
});

app.put('/api/books/:id', (request, response, next) => {
    Book.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
     .then(() => response.status(200).json({ message: 'Book modified !' }))
     .catch(error => response.status(400).json({ error })); 
    next();
});

app.delete('/api/books/:id', (request, response, next) => {
    Book.deleteOne({ _id: request.params.id })
     .then(() => response.status(200).json({ message: 'Book deleted !' }))
     .catch(error => response.status(400).json({ error }));
    next();
});

app.get('/api/books', (request, response, next) => {
    Book.find()
     .then(books => response.status(200).json(books))
     .catch(error => response.status(400).json({ error }));
});

module.exports = app;