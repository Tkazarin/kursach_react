const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinion.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { createOpinionSchema, updateOpinionSchema } = require('../middleware/validators/opinionValidator.middleware');

router.get('/', auth(Role.Admin), awaitHandlerFactory(opinionController.getAllOpinions));

router.get('/:book_title/opinions', auth(), awaitHandlerFactory(opinionController.getAllOpinionsByBookId));

router.post('/:book_title/opinions', createOpinionSchema, auth(), awaitHandlerFactory(opinionController.createOpinion));
//help
router.patch('/:book_title/opinions/:id_opinion', updateOpinionSchema, auth(), awaitHandlerFactory(opinionController.updateOpinion));

router.delete('/:book_title/opinions/:id_opinion', auth(), awaitHandlerFactory(opinionController.deleteOpinion));

module.exports = router;
