const BookModel = require('../models/book.model');
const UserModel = require('../models/user.model')
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();


class BookController {
    getAllBooks = async (req, res, next) => {
        let bookList = await BookModel.find();
        if (!bookList.length) {
            throw new HttpException(404, 'Books not found');
        }

        res.send(bookList);
    };

    getBookById = async (req, res, next) => {
        const book = await BookModel.findOne({ id_book: req.params.id_book });
        if (!book) {
            throw new HttpException(404, 'Book not found');
        }

        res.send(book);
    };

    getAllBooksByUserId = async (req, res, next) => {
        const { id_user, ...userWithoutId } = req.currentUser;
        const books = await BookModel.findByUserId(id_user);
        if (!books) {
            throw new HttpException(404, 'Books not found for this user');
        }

        res.send(books);
    };


    createBook = async (req, res, next) => {
        this.checkValidation(req);
        const { id_user, ...userWithoutId } = req.currentUser;
        req.body.id_author = id_user;
        const result = await BookModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Book was created!');
    };

    updateBook = async (req, res, next) => {
        this.checkValidation(req);
        const { id_user, ...userWithoutId } = req.currentUser;
        console.log("mew");
        const book = await BookModel.findOne({ id_book: req.params.id_book });
        console.log("mewmew");
        if (!book) {
            throw new HttpException(404, 'Book not found');
        }

        if (book.id_author != id_user) {
            throw new HttpException(403, 'You have no rights to delete this book');
        }
        console.log("mewmewmew");
        const result = await BookModel.update(req.body, req.params.id_book);
        console.log("mew");

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Book not found' :
            affectedRows && changedRows ? 'Book updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteBook = async (req, res, next) => {
        const { id_user } = req.currentUser;
        const book = await BookModel.findOne({ id_book: req.params.id_book });
        if (!book) {
            throw new HttpException(404, 'Book not found');
        }

        if (book.id_author != id_user) {
            throw new HttpException(403, 'You have no rights to delete this book');
        }

        const result = await BookModel.delete(req.params.id_book);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.send('Book has been deleted');
    };



    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

}


module.exports = new BookController;