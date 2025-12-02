const express = require('express')
const router = express.Router();
const { body } = require('express-validator')
const channelController = require('../controllers/channel.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/create-channel', authMiddleware.authMiddleware,
    channelController.createChannel
)
router.post('/get-my-channels', authMiddleware.authMiddleware,
    channelController.getUserChannels
)
router.get('/get-all-channels', authMiddleware.authMiddleware,
    channelController.getAllChannels
)
router.post('/get-joined-channels', authMiddleware.authMiddleware,
    channelController.getUserJoinedChannels
)
router.post('/join-channel', authMiddleware.authMiddleware,
    channelController.joinChannel
)

module.exports = router