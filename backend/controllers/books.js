const Book = require('../models/Book');

exports.createBook = (request, response, next) => {
    const book = new Book({
        userId: request.body.userId,
        title: request.body.title,
        author: request.body.author,
        imageUrl: request.body.imageUrl,
        year: request.body.year,
        genre: request.body.genre,
        ratings: request.body.ratings,
        averageRating: request.body.averageRating  
    });
    book.save().then(
        () => {
            response.status(201).json({
                message: 'Book saved successfully !'
            });
        }
    ).catch(
        (error) => {
            response.status(400).json({
                error: error
            });
        }
    );
};