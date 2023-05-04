const jwt = require("jsonwebtoken");
const { BlockModel } = require("../models/blockUser");
const { UserModel } = require("../models/userModel");
const fetch = require('node-fetch');
require("dotenv").config()

const auth = async (req, res, next) => {
    const token = req.cookies.token
    const refreshToken = req.cookies.reftoken

    if (await BlockModel.exists({ token })) {
        return res.status(401).send('Login again');
    }

    if (!token) {
        return res.send("Login again");
    }

    try {
        const decode = jwt.verify(token, process.env.accessKey);
        req.body.userId = decode.userId;
        const userData = await UserModel.findById(decode.userId);
        req.user = userData;
        if (!userData) {
            return res.status(401).json({ "err": "unauthorized" });
        }
        next();
    } catch (err) {
        try {
            const fetchdata = await fetch("https://wild-gold-betta-fez.cyclic.app/users/refresh", {
                headers: {
                    cookie: `reftoken=${refreshToken}`
                }
            }).then((res) => res.json())

            if (fetchdata.err) {
                return res.send("login first");
            }

            const decode = jwt.verify(fetchdata.token, process.env.accessKey);
            res.cookie("token", fetchdata.token);
            req.body.userId = decode.userId;
            const userData = await UserModel.findById(decode.userId);
            req.user = userData;
            if (!userData) {
                return res.status(401).json({ "err": "unauthorized" });
            }
            next();
        } catch (err) {
            res.send("login first");
        }
    }
}

module.exports = { auth };
