const express = require('express');
const router = express.Router();

const bookController = require('../controllers/books');

router.post('/', bookController.createBook);
router.get('/', bookController.getAllBooks);

router.get('/:id', bookController.getOneBook);
router.put('/:id', bookController.editBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;