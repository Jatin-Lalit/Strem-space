const express = require("express");
const { UserModel } = require("../models/userModel");
const userRoute = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { BlockModel } = require("../models/blockUser");
require("dotenv").config()

// user register route-----
userRoute.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const database = await UserModel.find({ email });
        if (database.length > 0) {
            res.status(400).json({ message: "User already exists" });
        } else {
            bcrypt.hash(password, 8, async (err, hash) => {
                if (err) {
                    res.status(401).send({ "error": err.message })
                } else {
                    const user = new UserModel({ name, email, password: hash })
                    await user.save()
                    res.status(200).send({ "msg": "user created successful" })

                }
            });
        }
    } catch (error) {
        res.status(401).send({ "error": error.message })

    }
})

// user login and giving tokens----
userRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.find({ email });

        bcrypt.compare(password, user[0].password, (err, result) => {
            if (result) {
                var token = jwt.sign({ userId: user[0]._id }, process.env.accessKey, { expiresIn: "30m"});
                var reftoken = jwt.sign({ userId: user[0]._id }, process.env.refreshKey, {
                    expiresIn: "1day"
                });
                // console.log(token);
                // client.set(`accessToken${user[0]._id}`,JSON.stringify(token), { EX: 1800 })
                // client.set(`refToken${user[0]._id}`,JSON.stringify(reftoken), { EX: 1800 })
                res.cookie("token", token)
                res.cookie("reftoken", reftoken)
                res.status(200).json({ "success": "login successful", token })
            } else {
                res.status(401).json({ "err": "wrong credential" })
            }
        });



    } catch (err) {
        res.status(400).json({ "err": err.message })

    }
})


// user logout and balcklisting-----
userRoute.get("/logout", async (req, res) => {
    try {
        const token = req.cookies.token;

        // client.set(token, "token", {
        //     EX: 1800
        // })
        let block=new BlockModel({token})
        await block.save()
        res.status(200).json({ "success": "user blocklisted" })

    } catch (error) {
        res.status(401).json({ 'error': error.message })

    }
})

// giving the access token agian through ------
userRoute.get("/refresh", async (req, res) => {
    try {

        const reftoken = req.cookies.reftoken

        var decoded = jwt.verify(reftoken, process.env.refreshKey);
        if (decoded) {
            var token = jwt.sign({ userId: decoded.userId }, process.env.accessKey, { expiresIn: "30m" });
            // client.set(`accessToken${decoded.userId}`,JSON.stringify(token), { EX: 1800 })
            res.cookie("token", token)
            res.status(200).json({ token })
        } else {
            res.status(401).json({ err: "wrong credential" })
        }

    } catch (error) {
        res.status(401).json({ "err": error.message })

    }
})
module.exports = { userRoute }