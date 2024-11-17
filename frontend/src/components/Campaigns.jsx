import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PastCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({ totalCampaigns: 0, sentCampaigns: 0, failedCampaigns: 0 });

    useEffect(() => {
        axios.get('http://localhost:5000/api/past-campaigns')
            .then(response => {
                setCampaigns(response.data.campaigns);
                setStats(response.data.stats);
            })
            .catch(error => console.error('Error fetching campaigns:', error));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Past Campaigns</h2>
            
            
            <div className="row">
                <div className="col-md-12 mb-4">
                    <div className="card bg-light text-dark shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="card-body text-center">
                            <h3 className="display-4">{stats.totalCampaigns}</h3>
                            <p className="lead">Total Campaigns</p>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="row">
                {campaigns.map((campaign) => (
                    <div className="col-md-3 mb-4" key={campaign.id}>
                        <div className="card bg-light text-dark shadow-lg" style={{ borderRadius: '15px', padding: '15px' }}>
                            <h5 className="card-title">{campaign.communication_name}</h5>
                            <p className="card-text">{campaign.message}</p>
                            <p className="card-text"><strong>Audience:</strong> {campaign.audience_name}</p>
                            <p className="card-text"><strong>Date Sent:</strong> {new Date(campaign.date_sent).toLocaleString()}</p>
                            <p className="card-text"><strong>Status:</strong> {campaign.status || 'Pending'}</p>
                        </div>
                    </div>
                ))}
            </div>

            
            <h3 className="text-center mt-5 mb-4">Communication Status of Previous Campaigns</h3>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card" style={{ backgroundColor: 'rgba(23, 162, 184, 0.2)', borderRadius: '15px' }}>
                        <div className="card-body text-center">
                            <h3 className="display-4">{stats.sentCampaigns}</h3>
                            <p className="lead">Sent Campaigns</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.2)', borderRadius: '15px' }}>
                        <div className="card-body text-center">
                            <h3 className="display-4">{stats.failedCampaigns}</h3>
                            <p className="lead">Failed Campaigns</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastCampaigns;
