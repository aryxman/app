import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SendMessageForm = () => {
    const [audiences, setAudiences] = useState([]);
    const [selectedAudience, setSelectedAudience] = useState('');
    const [communicationName, setCommunicationName] = useState('');
    const [message, setMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    
    useEffect(() => {
        axios.get('http://localhost:5000/api/audiences')
            .then(response => setAudiences(response.data))
            .catch(error => console.error('Error fetching audiences:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        
        if (!selectedAudience || !communicationName || !message) {
            setStatusMessage('Please fill in all fields');
            return;
        }

        
        const audience = audiences.find(aud => aud.id === parseInt(selectedAudience));

        
        if (!audience) {
            setStatusMessage('Audience not found');
            return;
        }

        const data = {
            audience_id: selectedAudience,  
            audience_name: audience.name,  
            communication_name: communicationName,
            message: message
        };

        
        axios.post('http://localhost:5000/api/send-message', data)
            .then(response => {
                setStatusMessage('Message sent successfully');
            })
            .catch(error => {
                setStatusMessage('Error sending message');
                console.error('Error sending message:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Send Campaign Message</h2>

            
            <form onSubmit={handleSubmit} className="shadow-lg p-4 mb-5 bg-white rounded">
                
                <div className="mb-4">
                    <label className="form-label">Choose Audience:</label>
                    <select
                        className="form-select"
                        value={selectedAudience}
                        onChange={(e) => setSelectedAudience(e.target.value)}
                    >
                        <option value="">Select Audience</option>
                        {audiences.map((audience) => (
                            <option key={audience.id} value={audience.id}>
                                {audience.name}
                            </option>
                        ))}
                    </select>
                </div>

                
                <div className="mb-4">
                    <label className="form-label">Campaign Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={communicationName}
                        onChange={(e) => setCommunicationName(e.target.value)}
                        placeholder="Enter campaign name"
                    />
                </div>

                
                <div className="mb-4">
                    <label className="form-label">Message:</label>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter campaign message"
                    />
                </div>

                
                <button type="submit" className="btn btn-primary w-100">Send Message</button>
            </form>

            
            {statusMessage && (
                <div className="alert alert-info text-center">
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default SendMessageForm;
