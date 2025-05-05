const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createUserSchema, updateUserSchema, validateLogin } = require('../middleware/validators/userValidator.middleware');

router.get('/', auth(), awaitHandlerFactory(userController.getAllUsers));

router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser));

router.get('/:id_user', auth(), awaitHandlerFactory(userController.getUserById));

router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser));

router.patch('/:id_user', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser));

router.delete('/:id_user', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser));

router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin));

module.exports = router;