const User = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')


router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(5);
        const password = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: password,
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.post("/login", async (req, res) => {
    try {
        const email = await User.findOne({ email: req.body.email });
        if (!email) {
            res.status(400).send("User doesn't exsist.");
        }
        else {
            const comp = await bcrypt.compare(req.body.password, email.password);
            if (!comp) {
                res.status(400).send("Wrong password");
            }
            else {
                res.status(200).json(email);
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.patch("/updateuser/:email", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true, runValidators: true });
        if (!user) {
            res.status(400).json("Error");
        }
        else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.get("/getusers/:email", async (req, res) => {
    try {
        const user = await User.find({ email: { $ne: req.params.email } }).select(["_id", "name", "email", "image"]);
        res.status(200).json(user);

    } catch (error) {
        res.status(400).send(error.message);
    }
})
module.exports = router;