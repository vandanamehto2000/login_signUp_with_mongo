const mongoose = require("mongoose");
const User = require("../models/user")
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

// signUp
router.post("/signUp", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.json({ message: "This email is already exists, please login your account" })
    } else {
        const saltRound = 10;
        const password = req.body.password;
        const encryptedPassword = await bcrypt.hash(password, saltRound);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword
        })
        user
            .save(user)
            .then(data => {
                res.json({ message: "you have register successfully", data })
            })
            .catch(err => {
                res.json(err)
            })
    }

})

// login
router.post("/login", async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ message: "This email is incorrect" })
    }

    const secretKey = process.env.SECRETKEY;

    let comparePassword = await bcrypt.compare(req.body.password, user.password);
    if (comparePassword) {
        const token = jwt.sign({ email: req.body.email }, secretKey);
        res.cookie('Token', token)
        res.json({ message: "login successfully" })
    } else {
        res.json({ message: "password does not match" })
    }

})

//verify
router.get("/verify", (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer") || !req.headers.authorization.split(' ')[1]) {
        return res.json({ message: "please provide the token" })
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, "vandana");
    res.json({ message: "fatch successfully", decoded })
})

// logout
router.get("/logout", (req, res) => {
    res.clearCookie('Token');
    res.json({
        message: 'your account has logout'
    });
})

module.exports = router;