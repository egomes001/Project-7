const express = require('express');
const auth = require('auth');
const router = express.Router();

const bookController = require('../controllers/books.controller');

router.get('/', auth, bookController.getAllBooks);
router.post('/', auth, bookController.createBook);

router.get('/:id', auth, bookController.getOneBook);
router.put('/:id', auth, bookController.editBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;