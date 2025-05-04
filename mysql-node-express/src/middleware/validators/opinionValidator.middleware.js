const { body } = require('express-validator');

exports.createOpinionSchema = [
    body('text')
        .exists().withMessage('Text is required')
        .isLength({ min: 3, max: 500 }).withMessage('Title must be between 1 and 40 characters')
        .isString().withMessage('Text must be a string'),
    body('progress')
        .optional({ nullable: true })
        .isInt().withMessage('Progress must be an integer'),
];

exports.updateOpinionSchema = [
    body('text')
        .optional({ nullable: true })
        .isLength({ min: 3, max: 500 }).withMessage('Title must be between 1 and 40 characters')
        .isString().withMessage('Text must be a string'),
    body('progress')
        .optional({ nullable: true })
        .isInt().withMessage('Progress must be an integer'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['text', 'progress'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];