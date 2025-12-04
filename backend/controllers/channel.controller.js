const ChannelModel = require('../models/channels.model')
const MessageModel = require('../models/messages.model')

module.exports.createChannel = async (req, res) => {

    console.log(req.body)
    const { channelName, userId } = req.body;

    const channelNameExists = await ChannelModel.findOne({ channelName: channelName })
    if (channelNameExists) {
        return res.status(409).json({
            "success": false,
            "message": "channelName already exists"
        })
    }



    try {
        const channel = await ChannelModel.create({
            channelName,
            members: [userId],
            admin: userId
        });

        const messages = await MessageModel.create({
            channel,
            messages: [],
        });
        res.status(201).json({
            success: true,
            data: channel,
            messages: messages,
            message: "channel created successfully",
        })
    }
    catch (err) {
        return res.status(400).json({
            status: false,
            message: "error while creating channel"
        })

    }
}

module.exports.getUserChannels = async (req, res) => {

    const { userId } = req.body;
    try {
        const channels = await ChannelModel.find({ admin: userId })
        res.status(200).json({
            success: true,
            data: channels,
            message: "fetched channels successfully",
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            data: channels,
            message: "error fetching channels",
        })
    }

}

module.exports.getUserJoinedChannels = async (req, res) => {

    const { userId } = req.body;
    try {
        const channels = await ChannelModel.find({ members: userId })
        res.status(200).json({
            success: true,
            data: channels,
            message: "fetched joined channels successfully",
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            data: channels,
            message: "error fetching joined channels",
        })
    }

}

module.exports.getAllChannels = async (req, res) => {
    try {
        const allChannels = await ChannelModel.find();
        res.status(200).json({
            data: allChannels
        })
    } catch (err) {
        return res.status(400).json({ message: 'error while getting all channels data' })
    }

}

module.exports.joinChannel = async (req, res) => {
    const { userId, channelId } = req.body;
    console.log(channelId, userId)
    try {
        const channel = await ChannelModel.findByIdAndUpdate(channelId,
            { $push: { members: userId } },
            { new: true }
        )
        console.log(channel)

        res.status(200).json({
            data: channel
        })

    } catch (err) {
        return res.status(400).json({ message: 'error while joining channel' })
    }
}

module.exports.leaveChannel = async (req, res) => {
    const { userId, channelId } = req.body;
    console.log("Leaving channel:", channelId, "User:", userId)
    try {
        const channel = await ChannelModel.findByIdAndUpdate(channelId,
            { $pull: { members: userId } },
            { new: true }
        )
        console.log("User left channel:", channel)

        res.status(200).json({
            success: true,
            data: channel,
            message: 'left channel successfully'
        })

    } catch (err) {
        console.log("Error leaving channel:", err)
        return res.status(400).json({ message: 'error while leaving channel' })
    }
}

