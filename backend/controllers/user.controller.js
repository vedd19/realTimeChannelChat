const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const body = require('express-validator')
const userModel = require('../models/user.model')

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            "success": false,
            "message": "All fields are required",
            "err": errors.array()
        })
    }

    const { fullName, email, username, password } = req.body

    const emailExists = await userModel.findOne({ email: email })
    if (emailExists) {
        return res.status(409).json({
            "success": false,
            "message": "Email is already registered"
        })
    }

    const usernameExists = await userModel.findOne({ username: username })
    if (usernameExists) {
        return res.status(409).json({
            "success": false,
            "message": "Username is already taken"
        })
    }

    const hashedPassword = await userModel.hashPassword(password);
    // console.log(hashedPassword)

    try {

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            username,
            avatar: `https://avatar.iran.liara.run/username?username=${fullName}`
        });

        // console.log(user, "user")
        // const token = user.generateAuthToken();
        // console.log("token", token)
        // res.cookie(token);

        res.status(201).json({
            success: true,
            // token: token,
            data: user,
            message: "User created successfully",
        })
    }
    catch (err) {
        console.log(err)
    }
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({
            "success": false,
            "message": "Email and password are required"
        })
    }

    const { email, password } = req.body

    const user = await userModel.findOne({ email: email })

    if (!user) {
        return res.status(404).json({
            "success": false,
            "message": "User does not exist with this email"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(401).json({
            "success": false,
            "message": "Invalid password"
        })
    }

    const token = await user.generateAuthToken();

    res.cookie("accessToken", token);

    res.status(200).json({
        "success": true,
        "data": {
            "user": await userModel.findById(user._id).select('-password'),
            "accessToken": token,
        },
        "message": "User logged in successfully"
    })
}

module.exports.logoutUser = (req, res, next) => {

    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({
            "success": false,
            "message": "Invalid access token"
        })
    }

    console.log(token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    console.log(decoded)

    try {

        res.clearCookie("accessToken");
        return res.status(200).json({
            success: true,
            message: "User logged out",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error during logout process",
            error: error
        });
    }
}

module.exports.userProfile = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            "success": false,
            "message": "Invalid access token"
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    // console.log(id)
    const user = await userModel.findById(decoded._id);

    res.status(200).json({
        "success": true,
        "data": user,
        "message": "User fetched successfully"
    })
}

