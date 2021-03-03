const express = require('express');

// verbose sets execution mode and can help explain what the app is doing
const sqlite3 = require('sqlite3').verbose()

// add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express()

// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to election database')
})

// GET all candidates at api endpoint (url)
// created so the front end team can loop and parse this object to display a list of candidates
app.get('/api/candidates', (req, res) => {
    // SQL statement is assigned to variable, params is empty array becuase there are no placeholders in SQL statement
    const sql = `SELECT * FROM candidates`;
    const params = [];
    // all method  to get all rows from db - 500 means server error
    db.all(sql, params, (err, rows) => {
        if (err) {
            // send error status in json form
            res.status(500).json({ error: err.message });
            return;
        }

        // send response as json to the browser using res.json
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// API endpoint to get a single candidate
// endpoint has a route parameter that will hold value of ID
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    // assign captured value populated in req.params object with the key id to params
    // it;s an array with a single element
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        // error 400 signifies client error
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
});

// API endpoint to delete candidate
// test using insomnia
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({
        message: 'successfully deleted',
        changes: this.changes
      });
    });
});
  


// response for any other request not found catch all - this needs to be last
app.use((req, res) => {
    res.status(404).end()
})

// Start express.js server on port 3001 after db connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})