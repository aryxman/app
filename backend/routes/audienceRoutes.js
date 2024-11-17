const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { addAudience, getAudienceSize } = require('../models/audienceModel');


router.post('/audiences', (req, res) => {
    
    const { name, conditions, logic } = req.body;

    if (!name || !conditions || !conditions.length || !logic) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log('Received conditions:', conditions);

    
    getAudienceSize(conditions, logic, (err, size) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to calculate audience size' });
        }

        // db add
        addAudience(name, conditions, logic, size, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to create audience' });
            }

            res.status(201).json({
                message: 'Audience created successfully',
                audienceId: result.insertId,
                size,
            });
        });
    });
});

router.get('/audiences', (req, res) => {
    const sql = 'SELECT id, name FROM Audiences';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching audiences' });
        }

        res.status(200).json(results);
    });
});


module.exports = router;
