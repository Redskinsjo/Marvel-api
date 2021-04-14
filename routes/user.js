const express = require("express");
const User = require("../models/User");
const sha256 = require("crypto-js/sha256");
const base64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { firstname, fullname, email, password } = req.fields;

    try {
        if (email && password) {
            const userExistAlready = await User.findOne({ email });
            if (!userExistAlready) {
                const token = uid2(16);
                const salt = uid2(16);
                const hash = sha256(password + salt);
                res.status(200).json({ hash, password, salt });
            } else {
                res.status(400).json({ error: "User exists already" });
            }
        } else {
            res.status(400).json({
                error: "The email and the password must be specified",
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.response });
    }

    // try {
    //     if (!body.email) {
    //         res.status(400).json({ error: "Missing an email" });
    //     } else if (!body.fullname) {
    //         res.status(400).json({ error: "Missing a name" });
    //     } else if (!body.password) {
    //         res.status(400).json({ error: "Missing a password" });
    //     } else {
    //         const { email, fullname, password } = body;
    //         const isExist = await User.findOne({ email });
    //         if (isExist) {
    //             res.status(400).json({
    //                 error: "User already exists with this email",
    //             });
    //         } else {
    //             const token = uid2(64);
    //             const salt = uid2(64);
    //             const hash = sha256(password + salt).toString(base64);
    //             const newUser = {
    //                 email,
    //                 account: {
    //                     fullname,
    //                     phone: body.phone || null,
    //                 },
    //                 token,
    //                 hash,
    //                 salt,
    //             };

    //             await newUser.save();
    //             res.status(200).json({
    //                 _id: newUser._id,
    //                 token,
    //                 email,
    //                 account: newUser.account,
    //             });
    //         }
    //     }
    // } catch (error) {
    //     res.status(400).json(error.response);
    // }
});

router.post("/signin", async (req, res) => {
    const body = req.fields;
    try {
        if (!body.email) {
            res.status(400).json({ error: "Missing an email" });
        } else if (!body.password) {
            res.status(400).json({ error: "Missing a password" });
        } else {
            const { email, password } = body;
            const isExist = await User.findOne({ email }).select("-hash -salt");
            if (!isExist) {
                res.status(400).json({
                    error: "Any account existing with this email",
                });
            } else {
                const potential = sha256(password + isExist.salt).toString(
                    base64
                );
                const isSignedIn = false;
                if (potential === isExist.hash) isSignedIn = true;
                if (!isSignedIn) {
                    res.status(400).json({
                        error: "Unauthorized. Wrong password",
                    });
                } else {
                    res.status(200).json(isExist);
                }
            }
        }
    } catch (error) {
        res.status(400).json({ error: error.response });
    }
});

module.exports = router;
