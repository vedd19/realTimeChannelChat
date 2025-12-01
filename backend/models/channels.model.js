const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true
    },
    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });


const ChannelModel = mongoose.model('Channels', ChannelSchema);

module.exports = ChannelModel;