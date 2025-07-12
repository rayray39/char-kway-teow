const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// dummy users (replace with users in database in the future)
// the hashed version of the password, with salt added, is stored in the database
const users = [
    {id: 1, email: 'admin@test.com', hashedPassword: bcrypt.hashSync("password", bcrypt.genSaltSync(10))},
    {id: 2, email: 'test@example.com', hashedPassword: bcrypt.hashSync("testing", bcrypt.genSaltSync(10))}
]

const secret = process.env.JWT_SECRET;

router.post('/sign-in', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing credentials.' })
    }

    // look for the user with matching email
    const signInUser = users.find((user) => user.email === email)
    if (!signInUser) {
        return res.status(404).json({ message: 'User not found.' })
    }

    // verify password
    const isPasswordValid = bcrypt.compareSync(password, signInUser.hashedPassword)
    if (!isPasswordValid) {
        return res.status(403).json({ message: 'Invalid user credentials.' })
    }

    // generate json web token
    const token = jwt.sign(
        {
            id: signInUser.id,
            email: signInUser.email
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