const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createUserSchema, updateUserSchema, validateLogin } = require('../middleware/validators/userValidator.middleware');

// Получить всех пользователей
router.get('/', auth(), awaitHandlerFactory(userController.getAllUsers));

// Узнать текущего пользователя
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser));

// Получить пользователя по ID
router.get('/:id_user', auth(), awaitHandlerFactory(userController.getUserById));

// Создать нового пользователя
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser));

// Обновить пользователя по ID
router.patch('/:id_user', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser));

// Удалить пользователя по ID
router.delete('/:id_user', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser));

// Логин пользователя
router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin));

module.exports = router;