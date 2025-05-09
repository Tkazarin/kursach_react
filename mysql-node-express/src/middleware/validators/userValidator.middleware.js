const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');

exports.createUserSchema = [
    body('username')
        .exists().withMessage('username is required')
        .isLength({ min: 3 }).withMessage('Must be at least 3 chars long'),
    body('name')
        .isAlpha()
        .exists().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Must be at least 3 chars long')
        .isString().withMessage('Name must be a string'),
    body('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('role')
        .optional()
        .isIn([Role.Admin, Role.SuperUser])
        .withMessage('Invalid Role type'),
    body('password')
        .exists().withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 4 }).withMessage('Password must contain at least 4 characters')
        .isLength({ max: 10 }).withMessage('Password can contain max 10 characters'),
    body('confirm_password')
        .exists().withMessage('confirm_password is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field')
];

exports.updateUserSchema = [
    body('username')
        .optional({ nullable: true })
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('name')
        .optional({ nullable: true })
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .optional({ nullable: true })
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('role')
        .optional({ nullable: true })
        .isIn([Role.Admin, Role.SuperUser])
        .withMessage('Invalid Role type'),
    body('password')
        .optional({ nullable: true })
        .isLength({ min: 4 })
        .withMessage('Password must contain at least 4 characters')
        .isLength({ max: 10 })
        .withMessage('Password can contain max 10 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    body('confirm_password')
        .optional({ nullable: true })
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'name'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];