const express = require('express');
const router = express.Router();
const { addOrder } = require('../models/orderModel');


router.post('/orders', (req, res) => {
    const order = {
        customer_id: req.body.customer_id,
        order_date: req.body.order_date,
        amount: req.body.amount,
    };

    addOrder(order, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Order added successfully', orderId: result.insertId });
        }
    });
});

module.exports = router;
