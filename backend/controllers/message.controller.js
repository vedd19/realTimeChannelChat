const MessageModel = require('../models/messages.model');

module.exports.getMessageHistory = async (req, res) => {
    const { channelId } = req.body;
    try {
        const messages = await MessageModel.findOne({ channel: channelId })
        res.status(200).json({ data: messages });
    } catch (err) {
        return res.status(400).json({ message: "error while getting messages", error: err.array() })
    }
}

module.exports.setMessageDataToDB = async (req, res) => {
    const { channelId, userId, content } = req.body;
    try {
        const messages = await MessageModel.findOneAndUpdate({ channel: channelId },
            {
                sender: userId,
                content,
            })
        res.status(200).json({ data: messages });
    } catch (err) {
        return res.status(400).json({ message: "error while updating messages", error: err.array() })
    }
}

module.exports.getMessageHistory = async (req, res) => {

    const messages = await MessageModel.findOne({ channel: req.params.channelId })
        .populate("messages");



    res.json(messages);
};