const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
import { supabase } from "./utils/supabaseClient";

// dummy users (replace with users in database in the future)
// the hashed version of the password, with salt added, is stored in the database
const users = [
    {id: 1, email: 'admin@test.com', hashedPassword: bcrypt.hashSync("password", bcrypt.genSaltSync(10))},
    {id: 2, email: 'test@example.com', hashedPassword: bcrypt.hashSync("testing", bcrypt.genSaltSync(10))}
]

const secret = process.env.JWT_SECRET;

const isOtpVerified = async (email, otp) => {
    // verifies the user's otp
    console.log("Verifying user's OTP.");
    const {
        data: { session },
        error,
    } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
    })

    if (error) {
        console.log("Error verifying OTP.");
        return false;
    }

    console.log("Successfully verified OTP.");
    return true;
}

router.post('/sign-in', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Missing credentials.' })
    }

    if (!isOtpVerified(email, otp)) {
        return res.status(400).json({ message: 'Incorrect OTP.' })
    }

    // look for user in database

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