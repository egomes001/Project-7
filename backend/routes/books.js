const express = require('express');

const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.get('/bestrating', bookCtrl.getBestRatings);
router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.addBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
