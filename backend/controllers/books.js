const Book = require('../models/Book');

exports.createBook = (request, response, next) => {
    delete request.body._id;
    const book = new Book({
        ...request.body
    });
    book.save()
    .then(() => response.status(201).json({ message: 'Book saved !'}))
    .catch(error => response.status(400).json({ error }));
};