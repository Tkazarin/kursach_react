const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/get_url', awaitHandlerFactory(s3Controller.getPresignedUrls));
router.post('/post_url',  awaitHandlerFactory(s3Controller.getPresignedUploadUrls));

module.exports = router;