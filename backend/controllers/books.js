const fs = require('fs');
const Book = require('../models/Book');

exports.addBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'Livre bien ajouté à la base de données !',
      });
    },
  ).catch(
    (error) => {
      res.status(400).json({
        error,
      });
    },
  );
};

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }); })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.modifyBook = (req, res) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : { ...req.body };

  delete bookObject.userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.rateBook = (req, res) => {
  const userRating = { userId: req.body.userId, grade: req.body.rating };
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      book.ratings.push(userRating);
      const avgRating = book.ratings.reduce((acc, cur) => acc + cur.grade, 0) / book.ratings.length;
      Book.updateOne({ _id: req.params.id }, { averageRating: avgRating })
        .then(
          book.save()
            .then(() => res.status(201).json(book))
            .catch((error) => res.status(400).json({ error })),
        )
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestRatings = (req, res) => {
  Book.find().sort({ averageRating: -1 }).limit(5)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
