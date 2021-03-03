const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// route to get voters
router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`
    const params = []

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }

        res.json({
            message: 'success',
            data: rows
        })
    })
})

// route to get single voter by id
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`
    params = [req.params.id]

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        res.json({
            message: 'success',
            data: row
        })
    })
})

// route to add a new voter
router.post('/voter', ({ body }, res) => {

    // prevent blank records from being created with this input check function imported from utils
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.run(sql, params, function(err, data) {
        if(err) {
            res.status(400).json({ error: err.message })
            return
        }

        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        })
    })
})

// route to update email address
router.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    // Prepare statement
    // req.params captures who is being updated, req.body captures what is being updated
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];
  
    // Execute
    db.run(sql, params, function(err, data) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: req.body,
        changes: this.changes
      });
    });
});

// delete route to remove voter from database
router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
    // don't need params array to store the data ?
    db.run(sql, req.params.id, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({ message: 'deleted', changes: this.changes });
    });
  });
  



module.exports = router