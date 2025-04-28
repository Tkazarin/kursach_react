const { body } = require('express-validator');

exports.createOpinionSchema = [
    body('title')
        .exists().withMessage('Title is required')
        .isLength({ min: 3, max: 40 }).withMessage('Title must be between 1 and 40 characters')
        .isString().withMessage('Title must be a string'),
    body('author')
        .exists().withMessage('Author is required')
        .isLength({ min: 3, max: 40 }).withMessage('Author must be between 1 and 40 characters')
        .isString().withMessage('Author must be a string'),
    body('size')
        .optional()
        .isInt().withMessage('Size must be an integer'),
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 300 }).withMessage('Description must be at most 300 characters'),
    body('progress')
        .optional()
        .isInt().withMessage('Size  must be an integer')
        .custom((value, { req }) => {
            if (req.body.size !== undefined && parseInt(value, 10) > parseInt(req.body.size, 10)) {
                throw new Error('Progress must be less than or equal to size');
            }
            return true;
        }),
    body('raiting')
        .optional()
        .matches(/^(10|[1-9])$/, 'g')
        .withMessage('Raiting mist be an integer'),
    body('file_img')
        .optional,
    body('file')
        .optional()
];

exports.updateBookSchema = [
    body('title')
        .optional()
        .isLength({ min: 3 }).withMessage('Must be at least 3 chars long')
        .isString().withMessage('Author must be a string'),
    body('author')
        .optional()
        .isLength({ min: 3 }).withMessage('Must be at least 3 chars long')
        .isString().withMessage('Author must be a string'),
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 300 }).withMessage('Description must be at most 300 characters'),
    body('size')
        .optional()
        .isInt().withMessage('Size  must be an integer'),
    body('progress')
        .optional()
        .isInt().withMessage('Size  must be an integer')
        .custom((value, { req }) => {
            if (req.body.size !== undefined && parseInt(value, 10) > parseInt(req.body.size, 10)) {
                throw new Error('Progress must be less than or equal to size');
            }
            return true;
        }),
    body('raiting')
        .optional()
        .matches(/^(10|[1-9])$/, 'g')
        .withMessage('Raiting mist be an integer'),
    body('file_img')
        .optional(),
    body('file')
        .optional(),
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