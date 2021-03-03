const express = require('express');

// add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express()

// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// response for any other request not found catch all - this needs to be last
app.use((req, res) => {
    res.status(404).end()
})

// Start express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})