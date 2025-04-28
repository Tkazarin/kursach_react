const { body } = require('express-validator');

exports.createOpinionSchema = [
    body('text')
        .exists().withMessage('Title is required')
        .isLength({ min: 3, max: 500 }).withMessage('Title must be between 1 and 40 characters')
        .isString().withMessage('Title must be a string'),
    body('progress')
        .exists().withMessage('Author is required')
        .isLength({ min: 3, max: 40 }).withMessage('Author must be between 1 and 40 characters')
        .isString().withMessage('Author must be a string')
];

exports.updateBookSchema = [
    body('text')
        .optional()
        .isLength({ min: 3, max: 500 }).withMessage('Title must be between 1 and 40 characters')
        .isString().withMessage('Title must be a string'),
    body('progress')
        .optional()
        .isLength({ min: 3, max: 40 }).withMessage('Author must be between 1 and 40 characters')
        .isString().withMessage('Author must be a string'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['title', 'author', 'size', 'progress', 'raiting', 'file', 'file_img'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];