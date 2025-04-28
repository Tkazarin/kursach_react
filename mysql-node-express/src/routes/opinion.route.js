const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinion.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createBookSchema, updateBookSchema } = require('../middleware/validators/bookValidator.middleware');

// Получить все мнения по книге
router.get('/', auth(Role.Admin), awaitHandlerFactory(opinionController.getAllOpinions));

// Получить одно мнение по id_opinion
router.get('/:book_title/opinions', auth(), awaitHandlerFactory(opinionController.getAllOpinionsByBookId));

// Создать мнение
router.post('/:book_title/opinions', auth(), awaitHandlerFactory(opinionController.createOpinion));

// Обновить мнение
router.patch('/:book_title/opinions/:id_opinion', auth(), awaitHandlerFactory(opinionController.updateOpinion));

// Удалить мнение
router.delete('/:book_title/opinions/:id_opinion', auth(), awaitHandlerFactory(opinionController.deleteOpinion));

module.exports = router;
