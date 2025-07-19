const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.JWT_SECRET;

router.post('/sign-in', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Missing credentials.' })
    }

    // generate json web token
    const token = jwt.sign(
        {
            email: email
        },
            secret,
        {
            expiresIn: '1h'
        }
    );

    // return json web token to client
    res.status(200).json({
        message: 'Sign in successful.',
        token,
    });
})

module.exports = router