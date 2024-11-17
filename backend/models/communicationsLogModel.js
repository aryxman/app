const db = require('../config/db');

const CommunicationsLog = {
    
    create: (data, callback) => {
        const sql = `
            INSERT INTO communications_log (audience_id, audience_name, communication_name, message)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [data.audience_id, data.audience_name, data.communication_name, data.message], callback);
    },

    
    updateStatus: (id, status, callback) => {
        const sql = `
            UPDATE communications_log
            SET status = ?, delivery_status = TRUE
            WHERE id = ?
        `;
        db.query(sql, [status, id], callback);
    },

   
    fetchAll: (callback) => {
        const sql = `
            SELECT * FROM communications_log
            ORDER BY date_sent DESC
        `;
        db.query(sql, callback);
    }
};

module.exports = CommunicationsLog;
