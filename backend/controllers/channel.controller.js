const ChannelModel = require('../models/channels.model')

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
        res.status(201).json({
            success: true,
            data: channel,
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