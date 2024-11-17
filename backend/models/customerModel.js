




const db = require('../config/db');


const addCustomer = (customer, callback) => {
    const query = 'INSERT INTO Customers (name, email, total_spending, visits, last_visit_date) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [customer.name, customer.email, customer.total_spending, customer.visits, customer.last_visit_date], callback);
};

module.exports = { addCustomer };
