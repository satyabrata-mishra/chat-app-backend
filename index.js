const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express();
const socket = require('socket.io');


app.use(cors());
app.use(express.json());


app.use('/auth', require('./routes/userRoutes'));
app.use('/chat', require('./routes/messageRoutes'));

app.use('/',(req,res)=>{
    res.status(200).send("Hey, I am backend.");
});

mongoose.connect(process.env.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDb Connected.");
}).catch((error) => {
    console.log(error.message);
})


const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started at ${process.env.PORT || 5000}.`);
})

// Socket Part
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
});
