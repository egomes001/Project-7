const express = require('express');
const router = express.Router();

const Book = require('../models/Book');

router.post('/', (request, response, next) => {
    delete request.body._id;
    const book = new Book({
        ...request.body
    });
    book.save()
     .then(() => response.status(201).json({ message: 'Book saved !'}))
     .catch(error => response.status(400).json({ error }));
    next();
});

router.get('/:id', (request, response, next) => {
    Book.findOne({ _id: request.params.id })
     .then(book => response.status(200).json(book))
     .catch(error => response.status(404).json({ error }));
    next();
});

router.put('/:id', (request, response, next) => {
    Book.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
     .then(() => response.status(200).json({ message: 'Book modified !' }))
     .catch(error => response.status(400).json({ error })); 
    next();
});

router.delete('/:id', (request, response, next) => {
    Book.deleteOne({ _id: request.params.id })
     .then(() => response.status(200).json({ message: 'Book deleted !' }))
     .catch(error => response.status(400).json({ error }));
    next();
});

router.get('/', (request, response, next) => {
    Book.find()
     .then(books => response.status(200).json(books))
     .catch(error => response.status(400).json({ error }));
});

module.exports = router;