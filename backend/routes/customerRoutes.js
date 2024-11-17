const express = require('express');
const router = express.Router();
const { addCustomer } = require('../models/customerModel');

router.post('/customers', (req, res) => {
    const customer = {
        name: req.body.name,
        email: req.body.email,
        total_spending: req.body.total_spending || 0,
        visits: req.body.visits || 0,
        last_visit_date: req.body.last_visit_date || null,
    };

    addCustomer(customer, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Customer added successfully', customerId: result.insertId });
        }
    });
});

module.exports = router;
