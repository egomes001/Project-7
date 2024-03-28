const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

const bookController = require('../controllers/books.controller');

router.get('/', auth, bookController.getAllBooks);
router.post('/', auth, multer, bookController.createBook);

router.get('/:id', auth, bookController.getOneBook);
router.put('/:id', auth, bookController.editBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;