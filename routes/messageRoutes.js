const Message = require('../models/Messages');
const express = require('express');
const router = express.Router();

router.post("/addmsg", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: message,
            users: [from, to],
            sender: from,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/getmsg", async (req, res) => {
    try {
        const { from, to } = req.body;
        const message = await Message.find({ users: { $all: [from, to] } }).sort({ updatedAt: 1 });
        const projectMessages = message.map((msg)=>{
            return {
                fromSelf:msg.sender.toString()===from,
                message:msg.message
            };
        });
        res.status(200).json(projectMessages);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;