const { query } = require("express");
const router = require("express").Router();
const registerValidation = require("../routes/validation").registerValidation;
const loginValidation = require("../routes/validation").loginValidation;
const jobValidation = require("../routes/validation").jobValidation;
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
    console.log("reciving request to /auth");
    next();
});

router.get("/testAPI", (req, res) => {
    return res.send("Hello from /auth");
});


router.post("/register", async (req, res) => {
    let { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }else{
        console.log(req.body);
    }

    let emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exists");

    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });
    try {
        let savedUser = await newUser.save();
        return res.send({
            savedUser,
            msg: "User registered successfully",
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    let { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) return res.status(400).send("Email doesn't exist");
    foundUser.comparePassword(req.body.password, (err, isMatch) => {
        if(err) return res.status(500).send(err);
        if(isMatch) {
            const tokenObject = { _id: foundUser._id, email: foundUser.email };
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            return res.send({ 
                msg: "Logged in successfully",
                token: "JWT " + token,
                user: foundUser,
             });
        }else{
            return res.status(401).send("Wrong password");
        }
    });
    
});

module.exports = router;