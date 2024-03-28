const fs = require('fs')
const Book = require('../models/Book');

const MAX_IMAGE_SIZE = 4 * 1000 * 1000;

/**
 * retrieve all books
 */
exports.getAllBooks = (request, response, next) => {
    Book.find()
     .then(books => response.status(200).json(books))
     .catch(error => response.status(400).json({ error }));
};

/**
 * manage individual book
 */
exports.createBook = (request, response, next) => {
    const bookObject = JSON.parse(request.body.book);
    delete bookObject._id;
    delete bookObject._userid;

    if (request.file.size > MAX_IMAGE_SIZE_BYTES) {
        return response.status(400).json({ error: `Image size exceeds the limit of ${MAX_IMAGE_SIZE}Mo` });
    }

    const book = new Book({
        ...bookObject,
        userId: request.ath.userId,
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    });

    book.save()
     .then(() => response.status(201).json({ message: 'Book saved !'}))
     .catch(error => response.status(400).json({ error }));
};

exports.editBook = (request, response, next) => {
    const bookObject = request.file ? {
        ...JSON.parse(request.body.book),
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    } : { ...request.body}; 
    delete bookObject._userid;

    if (request.file && request.file.size > MAX_IMAGE_SIZE_BYTES) {
        return response.status(400).json({ error: `Image size exceeds the limit of ${MAX_IMAGE_SIZE}Mo` });
    }

    Book.findOne({ _id: request.params.id })
     .then((book) => {
        if (book.userId != request.auth.userId) {
            response.status(403).json({ message: 'Unauthorized request' });
        } else {
            Book.updateOne({ _id: request.params.id }, { ...bookObject, _id: request.params.id })
            .then(() => response.status(200).json({ message: 'Book modified !' }))
            .catch(error => response.status(400).json({ error }));  
        }
     })
     .catch(error => response.status(400).json({ error })); 
};

exports.deleteBook = (request, response, next) => {
    Book.findOne({ _id: request.params.id })
     .then(book => {
        if (book.userId != request.auth.userId) {
            response.status(403).json({ message: 'Unauthorized request' });
        } else {
            const filename = thing.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: request.params.id })
                 .then(() => response.status(200).json({ message: 'Book deleted !' }))
                 .catch(error => response.status(400).json({ error }));
            })
        }
     })
     .catch(error => response.status(500).json({ error }));
};

exports.getOneBook = (request, response, next) => {
    Book.findOne({ _id: request.params.id })
     .then(book => response.status(200).json(book))
     .catch(error => response.status(404).json({ error }));
};