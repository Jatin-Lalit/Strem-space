const jwt = require("jsonwebtoken");
const { BlockModel } = require("../models/blockUser");
const { UserModel } = require("../models/userModel");
require("dotenv").config()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const authentication = async (req, res, next) => {
    
    const token = req.cookies.token
    const refreshToken = req.cookies.reftoken
    const isBlacklisted = await BlockModel.find({token})

    if (isBlacklisted) {
        return res.status(401).send('Token is blacklisted');

    }


    if (!token) {
        res.send("Login again")
        return;
    }
    if (token) {
        jwt.verify(token, process.env.accessKey, async (err, decode) => {
            if (decode) {
                req.body.userId = decode.userId;

                const userData= await UserModel.findById({_id:decode.userId})
                req.user=userData
                if(!userData){
                    return res.status(401).json({"err":"unauthorized"})
                }
                next()
            } else {
                const fetchdata = await fetch("https://wild-gold-betta-fez.cyclic.app/users/refresh", {
                    headers: {
                        cookie: `reftoken=${refreshToken}`
                    }
                }).then((res) => res.json())
                if (fetchdata.err) {
                    res.send("login first")
                    return;
                }
                jwt.verify(fetchdata.token, process.env.accessKey, async (err, decode) => {
                    if (decode) {
                        res.cookie("token", fetchdata.token);
                        req.body.userId = decode.userId;
                        const userData= await UserModel.findById({_id:decode.userId})
                        req.user=userData
                        if(!userData){
                            return res.status(401).json({"err":"unauthorized"})
                        }
                        next()
                    } else {
                        res.send("login first")
                        return;
                    }

                })
            }
        })
    } else {
        res.send({ "Msg": "Please login" })
    }
}

module.exports = {
    authentication
}