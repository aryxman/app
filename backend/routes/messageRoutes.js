const express = require('express');
const router = express.Router();
const CommunicationsLog = require('../models/communicationsLogModel');
const db = require('../config/db');
const axios = require('axios'); 


const generateDeliveryStatus = () => (Math.random() < 0.9 ? 'SENT' : 'FAILED');


router.post('/send-message', (req, res) => {
    const { audience_id, audience_name, communication_name, message } = req.body;

    
    const checkAudienceQuery = 'SELECT * FROM Audiences WHERE id = ?';
    db.query(checkAudienceQuery, [audience_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking audience' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Audience not found' });
        }

        
        const sql = 'INSERT INTO Communications_Log (audience_id, audience_name, communication_name, message) VALUES (?, ?, ?, ?)';
        db.query(sql, [audience_id, audience_name, communication_name, message], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending message' });
            }

            const logId = result.insertId; 
            const status = generateDeliveryStatus();  

            
            axios.post('http://localhost:5000/api/delivery-receipt', {
                communication_log_id: logId,
                status: status
            })
            .then(() => {
                
                res.status(200).json({ message: 'Message sent successfully', logId });
            })
            .catch((error) => {
                console.error('Error updating delivery status:', error);
                res.status(500).json({ message: 'Failed to update delivery status' });
            });
        });
    });
});


router.post('/delivery-receipt', (req, res) => {
    const { communication_log_id, status } = req.body;
    console.log('Received data:', req.body);

    CommunicationsLog.updateStatus(communication_log_id, status, (err, result) => {
        if (err) {
            console.error('Error updating status:', err); 
            return res.status(500).json({ message: 'Error updating delivery status', error: err.message });
        }

        console.log('Update result:', result);  
        res.status(200).json({ message: 'Delivery status updated successfully' });
    });
});



router.get('/past-campaigns', (req, res) => {
    const sql = `
        SELECT * FROM communications_log
        ORDER BY date_sent DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching campaigns' });
        }

        // here
        const totalCampaigns = results.length;
        const sentCampaigns = results.filter(campaign => campaign.status === 'SENT').length;
        const failedCampaigns = results.filter(campaign => campaign.status === 'FAILED').length;

        res.status(200).json({
            campaigns: results,
            stats: {
                totalCampaigns,
                sentCampaigns,
                failedCampaigns
            }
        });
    });
});


module.exports = router;
