
const express = require('express')
const dotenv = require("dotenv")
const connecToDB = require('./db/db')
const cors = require('cors');
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


app.get('/', (req, res) => {
    res.send("hello from the server")
})


app.listen(PORT, () => {
    console.log('server is running at PORT ', PORT)
})