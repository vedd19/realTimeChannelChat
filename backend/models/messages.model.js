const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channels',
        required: true,
    },
    messages: {
        type: [{
            sender: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            content: {
                type: String,
            },
            senderName: {
                type: String,
                default: "Unknown User"
            }
        }],
        default: [],
    },

}, { timestamps: true });


const MessageModel = mongoose.model('Messages', MessageSchema);

module.exports = MessageModel;