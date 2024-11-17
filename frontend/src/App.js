import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AudienceForm from './components/AudienceForm';
import PastCampaigns from './components/Campaigns';
import SendMessageForm from './components/sendMessageForm';
import { GoogleLogin } from '@react-oauth/google';
import './index.css'; 
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [audiences, setAudiences] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAudienceCreated = (newAudience) => {
        setAudiences([...audiences, newAudience]);
        console.log('Audience created:', newAudience);
    };

    const handleLoginSuccess = (response) => {
        setLoading(true);
        if (response.credential) {
            setToken(response.credential);
            setIsLoggedIn(true);
        }
        setLoading(false);
    };

    const handleLoginFailure = () => {
        console.log('Login Failed');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <Container className="h-100 d-flex justify-content-center align-items-center login-container">
                <Row className="w-100">
                    <Col md={6} className="mx-auto">
                        <Card className="shadow-lg p-4 rounded-3">
                            <Card.Body className="text-center">
                                <h1 className="display-4 mb-4">Welcome to CRM App</h1>
                                <p className="lead text-muted mb-4">Please log in to continue</p>
                                
                                
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={handleLoginFailure}
                                    useOneTap
                                    theme="filled_blue"
                                    size="large"
                                />
                                
                                
                                {loading && <Spinner animation="border" variant="primary" />}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Container>
                        <Link to="/" className="navbar-brand">CRM App</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/campaigns" className="nav-link">Campaign Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/send-message" className="nav-link">Start a Campaign</Link>
                                </li>
                            </ul>
                        </div>
                    </Container>
                </nav>

                <Container className="mt-5">
                    <Routes>
                        <Route path="/" element={isLoggedIn ? <AudienceForm onAudienceCreated={handleAudienceCreated} /> : <Navigate to="/login" />} />
                        <Route path="/campaigns" element={<PastCampaigns />} />
                        <Route path="/send-message" element={<SendMessageForm />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
};

export default App;
