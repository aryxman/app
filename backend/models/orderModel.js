
const db = require('../config/db');


const addOrder = (order, callback) => {
    const query = 'INSERT INTO Orders (customer_id, order_date, amount) VALUES (?, ?, ?)';
    db.query(query, [order.customer_id, order.order_date, order.amount], callback);
};

module.exports = { addOrder };
