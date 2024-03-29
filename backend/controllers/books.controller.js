const fs = require('fs')
const Book = require('../models/Book');

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
    const userId = request.auth.userId;
    const grade = bookObject.ratings[0].grade;

    const imageUrl = `${request.protocol}://${request.get('host')}/images/${request.file.filename}`;

    const book = new Book({
        userId: userId,
        title: bookObject.title,
        author: bookObject.author,
        year: bookObject.year,
        genre: bookObject.genre,
        imageUrl: imageUrl,
        ratings: [{ userId: userId, grade: grade }],
        averageRating: bookObject.averageRating
    });

    book.save()
     .then(() => {
         response.status(201).json({ message: 'Book saved !'});
     })
     .catch(error => {
         if (request.file) {
             fs.unlink(request.file.path, (err) => {
                 if (err) {
                     console.error("Error deleting image:", err);
                 }
                 console.log("Image deleted");
             });
         }
         response.status(400).json({ error });
     });
};


exports.editBook = (request, response, next) => {
    const bookObject = request.file ? {
        ...JSON.parse(request.body.book),
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    } : { ...request.body}; 
    delete bookObject._userid;

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
            const filename = book.imageUrl.split('/images')[1];
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