
const express = require('express')
const dotenv = require("dotenv")
const connecToDB = require('./db/db')
const cors = require('cors');
const userRoutes = require('./routes/user.route')
const channelRoutes = require('./routes/channel.route')
dotenv.config();
const app = express()
connecToDB();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
    origin: "*",
    credentials: true
}))


const PORT = process.env.PORT || 5000

app.use('/api/users', userRoutes)
app.use('/api/channels', channelRoutes)


app.get('/', (req, res) => {
    res.send("hello from the server")
})


app.listen(PORT, () => {
    console.log('server is running at PORT ', PORT)
})