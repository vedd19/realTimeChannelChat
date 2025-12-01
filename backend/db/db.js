const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "channelChat"
        })
        console.log("connected to mongoDB")
    } catch (err) {
        console.log("error while connecting to the mongoDB", err)
    }
}

module.exports = connectToDB