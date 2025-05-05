const BookModel = require('../models/book.model');
const OpinionModel = require('../models/opinion.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();


class OpinionController {
    getAllOpinions = async (req, res, next) => {
        let opinionList = await OpinionModel.find();
        if (!opinionList.length) {
            throw new HttpException(404, 'Opinions not found');
        }

        res.send(opinionList);
    };

    getAllOpinionsByBookId = async (req, res, next) => {
        const { id_user, ...userWithoutId } = req.currentUser;
        const title = req.params.book_title;
        const book = await BookModel.findByTitleAndUser(title, id_user);
        if (!book) {
            throw new HttpException(404, 'Book was not found.');
        }
        const opinions = await OpinionModel.findByBookId(book.id_book);
        if (!opinions) {
            throw new HttpException(404, 'Opinions not found for this user');
        }

        res.send(opinions);
    };


    createOpinion = async (req, res, next) => {
        this.checkValidation(req);
        const { id_user, ...userWithoutId } = req.currentUser;
        const title = req.params.book_title;
        const book = await BookModel.findByTitleAndUser(title, id_user);
        req.body.id_book = book.id_book;
        const result = await OpinionModel.create(req.body);
        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Opinion was created!');
    };

    updateOpinion = async (req, res, next) => {
        this.checkValidation(req);
        const { id_user, ...userWithoutId } = req.currentUser;
        const title = req.params.book_title;
        const book = await BookModel.findByTitleAndUser(title, id_user);
        const opinion = await OpinionModel.findOne({ id_opinion: req.params.id_opinion });
        if (!opinion) {
            throw new HttpException(404, 'Opinion not found');
        }

        if (book.id_author != id_user) {
            throw new HttpException(403, 'You have no rights to change this Opinion');
        }
        const result = await OpinionModel.update(req.body, req.params.id_opinion);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Opinion not found' :
            affectedRows && changedRows ? 'Opinion updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteOpinion = async (req, res, next) => {
        const { id_user, ...userWithoutId } = req.currentUser;
        const title = req.params.book_title;
        const book = await BookModel.findByTitleAndUser(title, id_user);
        const opinion = await OpinionModel.findOne({ id_opinion: req.params.id_opinion });
        console.log(id_user);
        console.log(book.id_author);
        if (!opinion) {
            throw new HttpException(404, 'Opinion not found');
        }
        if (book.id_author != id_user) {
            throw new HttpException(403, 'You have no rights to delete this Opinion');
        }

        const result = await OpinionModel.delete(req.params.id_opinion);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.send('Opinion has been deleted');
    };



    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

}


module.exports = new OpinionController;