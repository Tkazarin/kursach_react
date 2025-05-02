const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createBookSchema, updateBookSchema } = require('../middleware/validators/bookValidator.middleware');
const opinionController = require("../controllers/opinion.controller");

router.get('/', auth(Role.Admin), awaitHandlerFactory(bookController.getAllBooks));

router.get('/my-books', auth(), awaitHandlerFactory(bookController.getAllBooksByUserId));

router.get('/:id_book', auth(), awaitHandlerFactory(bookController.getBookById));

router.post('/my-books', auth(), createBookSchema, awaitHandlerFactory(bookController.createBook));

router.patch('/:id_book', auth(), updateBookSchema, awaitHandlerFactory(bookController.updateBook));

router.delete('/:id_book', auth(), awaitHandlerFactory(bookController.deleteBook));

router.get('/book_looker/:book_title', auth(), awaitHandlerFactory(bookController.getBookByTitleAndUser));

module.exports = router;