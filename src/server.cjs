const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.OPENROUTER_API_KEY) {
    console.log('OpenRouter API key failed to load.');
} else {
    console.log('OpenRouter API key successfully loaded.')
}

const express = require('express');
const cors = require('cors')

const app = express();
const PORT = 5000;

// middleware for all routes
app.use(cors())
app.use(express.json());

// setup routes
const openrouter = require('./routes/openrouter.cjs')
const auth = require('./routes/auth.cjs')

// load routes
app.use('/openrouter', openrouter)
app.use('/auth', auth)

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});