import React, { useState } from 'react';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 
import DatePicker from 'react-datepicker';  
import 'react-datepicker/dist/react-datepicker.css';  
import { Button, Form, Row, Col, Card, Alert, Container } from 'react-bootstrap';

const AudienceForm = () => {
    const [audienceName, setAudienceName] = useState('');  
    const [conditions, setConditions] = useState([
        { field: 'total_spending', minValue: 0, maxValue: 100000 }
    ]);
    const [createdAudience, setCreatedAudience] = useState(null);  
    const [audienceSize, setAudienceSize] = useState(0);  

    const handleSliderChange = (index, value) => {
        const updatedConditions = [...conditions];
        updatedConditions[index].minValue = value[0];  
        updatedConditions[index].maxValue = value[1];  
        setConditions(updatedConditions);
    };

    const handleDateChange = (index, date, type) => {
        const updatedConditions = [...conditions];
        if (type === 'after') {
            updatedConditions[index].afterDate = date;
        } else if (type === 'before') {
            updatedConditions[index].beforeDate = date;
        }
        setConditions(updatedConditions);
    };

    const addCondition = () => {
        setConditions([...conditions, { field: 'total_spending', minValue: 0, maxValue: 100000 }]);
    };

    const removeCondition = (index) => {
        const updatedConditions = conditions.filter((_, i) => i !== index);
        setConditions(updatedConditions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

       
        const audienceData = {
            name: audienceName || 'Audience 1',  
            conditions: conditions.map(cond => {
                if (cond.field === 'total_spending') {
                    return [
                        { field: cond.field, operator: ">", value: cond.minValue },
                        { field: cond.field, operator: "<", value: cond.maxValue }
                    ];
                } else if (cond.field === 'visits') {
                    return [
                        { field: cond.field, operator: ">", value: cond.minValue },
                        { field: cond.field, operator: "<", value: cond.maxValue }
                    ];
                } else if (cond.field === 'last_visit_date') {
                    const conditionsArray = [];
                    if (cond.afterDate) {
                        conditionsArray.push({ field: cond.field, operator: ">", value: cond.afterDate });
                    }
                    if (cond.beforeDate) {
                        conditionsArray.push({ field: cond.field, operator: "<", value: cond.beforeDate });
                    }
                    return conditionsArray;
                }
            }).flat(),
            logic: 'AND',  
        };

        
        axios.post('http://localhost:5000/api/audiences', audienceData)
            .then(response => {
                console.log('Audience created successfully:', response.data);
                setCreatedAudience(audienceData); 
                setAudienceSize(response.data.size); 
                setTimeout(() => {
                    setCreatedAudience(null); 
                }, 10000);
            })
            .catch(error => {
                console.error('There was an error creating the audience:', error);
            });
    };

    const formatCondition = (condition) => {
        if (condition.field === 'last_visit_date') {
            const after = condition.afterDate ? `After: ${new Date(condition.afterDate).toLocaleDateString()}` : '';
            const before = condition.beforeDate ? `Before: ${new Date(condition.beforeDate).toLocaleDateString()}` : '';
            return `${after} ${before}`.trim();
        }
        return `${condition.operator === '>' ? 'Greater than' : 'Less than'} ${condition.value}`;
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Create Audience</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6} className="mx-auto">
                        <Card className="shadow-sm mb-4">
                            <Card.Body>
                                <Form.Group controlId="audienceName">
                                    <Form.Label>Audience Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={audienceName}
                                        onChange={(e) => setAudienceName(e.target.value)}
                                        placeholder="Enter audience name"
                                    />
                                </Form.Group>

                                {conditions.map((condition, index) => (
                                    <div key={index} className="mt-3">
                                        <Form.Group controlId={`conditionField-${index}`}>
                                            <Form.Label>Field:</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={condition.field}
                                                onChange={(e) => {
                                                    const updatedConditions = [...conditions];
                                                    updatedConditions[index].field = e.target.value;
                                                    setConditions(updatedConditions);
                                                }}
                                            >
                                                <option value="total_spending">Total Spending</option>
                                                <option value="visits">Visits</option>
                                                <option value="last_visit_date">Last Visit Date</option>
                                            </Form.Control>
                                        </Form.Group>

                                        {condition.field === 'total_spending' || condition.field === 'visits' ? (
                                            <Form.Group controlId={`conditionRange-${index}`} className="mt-3">
                                                <Form.Label>Range (Min: {condition.minValue} - Max: {condition.maxValue}):</Form.Label>
                                                <Slider
                                                    range
                                                    min={0}
                                                    max={condition.field === 'total_spending' ? 100000 : 50}
                                                    value={[condition.minValue, condition.maxValue]}
                                                    onChange={(value) => handleSliderChange(index, value)}
                                                />
                                            </Form.Group>
                                        ) : condition.field === 'last_visit_date' ? (
                                            <div>
                                                <Form.Group controlId={`conditionAfter-${index}`} className="mt-3">
                                                    <Form.Label>Last Visit Date (After):</Form.Label>
                                                    <DatePicker
                                                        selected={condition.afterDate}
                                                        onChange={(date) => handleDateChange(index, date, 'after')}
                                                        dateFormat="yyyy/MM/dd"
                                                        placeholderText="Select a date after"
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId={`conditionBefore-${index}`} className="mt-3">
                                                    <Form.Label>Last Visit Date (Before):</Form.Label>
                                                    <DatePicker
                                                        selected={condition.beforeDate}
                                                        onChange={(date) => handleDateChange(index, date, 'before')}
                                                        dateFormat="yyyy/MM/dd"
                                                        placeholderText="Select a date before"
                                                    />
                                                </Form.Group>
                                            </div>
                                        ) : null}

                                        <Button variant="danger" className="mt-3" onClick={() => removeCondition(index)}>
                                            Remove Condition
                                        </Button>
                                    </div>
                                ))}

                                <Button variant="primary" className="mt-3" onClick={addCondition}>
                                    Add Condition
                                </Button>
                                <Button variant="success" type="submit" className="mt-3 ml-2">
                                    Create Audience
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>

            
            {createdAudience && (
                <Card className="mt-4">
                    <Card.Body className="bg-opacity-75" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
                        <h5 className="text-center">Audience Created Successfully!</h5>
                        <p><strong>Audience Name:</strong> {createdAudience.name}</p>
                        <p><strong>Audience Size:</strong> {audienceSize}</p>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AudienceForm;
