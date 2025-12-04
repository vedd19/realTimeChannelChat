
const express = require('express')
const dotenv = require("dotenv")
const connecToDB = require('./db/db')
const cors = require('cors');
const { createServer } = require('http')
const { Server } = require('socket.io')


const userRoutes = require('./routes/user.route')
const channelRoutes = require('./routes/channel.route')
const MessageRoutes = require('./routes/messages.route');
const ChannelModel = require('./models/channels.model');
const MessageModel = require('./models/messages.model');
dotenv.config();
const app = express()
connecToDB();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log("A user connected", socket.id);


    socket.on("enter_channel", ({ channelId, userName }) => {
        socket.join(channelId);
        socket.channelId = channelId;
        socket.userName = userName;
        console.log(`Socket ${socket.id} joined channel ${channelId} with user: ${userName}`);


        const onlineUsers = io.sockets.adapter.rooms.get(channelId);
        const userList = Array.from(onlineUsers || []).map(socketId => {
            const userSocket = io.sockets.sockets.get(socketId);
            return {
                socketId: socketId,
                fullName: userSocket.userName || "Unknown User"
            };
        });

        io.to(channelId).emit("online_users", userList);
    });

    socket.on("send_message", async ({ channelId, senderId, content, name }) => {

        socket.userName = name;

        const msg = await MessageModel.findOneAndUpdate({ channel: channelId }, {
            $push: {
                messages: {
                    sender: senderId,
                    content: content,
                    senderName: name
                }
            }
        }, { new: true });

        try {
            console.log("sending message to channel:", channelId);
            io.to(channelId).emit("receive_message", msg);
            console.log("message sent successfully");

        } catch (err) {
            console.log("Error sending message:", err)
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        if (socket.channelId) {
            const onlineUsers = io.sockets.adapter.rooms.get(socket.channelId);
            const userList = Array.from(onlineUsers || []).map(socketId => {
                const userSocket = io.sockets.sockets.get(socketId);
                return {
                    socketId: socketId,
                    fullName: userSocket.userName || "Unknown User"
                };
            });
            io.to(socket.channelId).emit("online_users", userList);
        }
    });

});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
    origin: "*",
    credentials: true
}))


const PORT = process.env.PORT || 5000

app.use('/api/users', userRoutes)
app.use('/api/channels', channelRoutes)
app.use('/api/messages', MessageRoutes)


app.get('/', (req, res) => {
    res.send("hello from the server")
})


httpServer.listen(PORT, () => {
    console.log('server is running at PORT ', PORT)
})