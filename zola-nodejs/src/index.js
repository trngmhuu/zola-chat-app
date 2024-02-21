require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const db = require('../config/db');
const socket = require("socket.io");

const app = express();

db.connect();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

const server = app.listen(process.env.PORT, ()=> {
    console.log(`Server started successfully on port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
});