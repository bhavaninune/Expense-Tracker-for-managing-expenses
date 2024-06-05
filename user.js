const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  
const router = express.Router();

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ error: "Error hashing password" });
            }
            await User.create({ name, email, password: hash });
            res.status(201).json({ message: "New user created successfully" });
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, 'secretkey');
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: "Email or password is missing" });
        }

        const user = await User.findOne({ where: { email, password } });
        if (user) {
            return res.status(200).json({ message: "User logged in successfully", token: generateAccessToken(user.id, user.name) });
        } else {
            return res.status(404).json({ message: "User does not exist or password is incorrect" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    signup,
    login
};
