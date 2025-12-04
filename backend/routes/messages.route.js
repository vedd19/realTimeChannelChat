const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const messageController = require('../controllers/message.controller');

router.get('/get-msg-history', authMiddleware.authMiddleware, messageController.getMessageHistory);
router.post('/set-msg-to-db', authMiddleware.authMiddleware, messageController.setMessageDataToDB);
router.get("/msg-history/:channelId", authMiddleware.authMiddleware, messageController.getMessageHistory)

module.exports = router;