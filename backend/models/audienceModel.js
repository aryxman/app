const db = require('../config/db');


const addAudience = (name, conditions, logic, size, callback) => {
    const query = `INSERT INTO Audiences (name, conditions, logic, size) VALUES (?, ?, ?, ?)`;
    console.log(query, [name, JSON.stringify(conditions), logic, size]);
    db.query(query, [name, JSON.stringify(conditions), logic, size], callback);
};

const getAudienceSize = (conditions, logic, callback) => {
    
   

    let query = 'SELECT COUNT(*) AS size FROM Customers WHERE ';
    const whereClauses = [];

    
    if (conditions && conditions.length > 0) {
        conditions.forEach(({ field, operator, value }) => {
            if (field && operator && value !== undefined) {
                if (field === 'last_visit_date') {
                    whereClauses.push(`DATE(${field}) ${operator} '${value}'`);
                } else {
                    whereClauses.push(`${field} ${operator} ${value}`);
                }
            }
        });
        
        if (whereClauses.length > 0) {
            query += whereClauses.join(` ${logic} `);
        } else {
            return callback(new Error('Invalid or empty conditions.'));
        }
    } else {
        return callback(new Error('Conditions array is empty or undefined.'));
    }

    db.query(query, [], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].size);
    });
};

module.exports = { addAudience, getAudienceSize };
