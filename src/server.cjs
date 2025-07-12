require('dotenv').config();
const express = require('express');
const cors = require('cors')

const app = express();
const PORT = 5000;

// middleware for all routes
app.use(cors())
app.use(express.json());

// setup routes
const openrouter = require('./routes/openrouter.cjs')

// load routes
app.use('/openrouter', openrouter)

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});