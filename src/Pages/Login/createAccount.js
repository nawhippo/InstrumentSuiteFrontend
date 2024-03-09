import React, { useState } from 'react';
import axios from 'axios';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import LoginPagePhoto from "../../Images/instrumentPageImage.jpg";


const CreateAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmitClick = (event) => {
        event.preventDefault();
        axios.post('/api/account/createAccount', formData)
            .then(response => {
                console.log(response.data);
                setSuccess('Account created successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.message);
            });
    };

    return (
        <Container fluid className="d-flex align-items-center g-0">
            <Row className="w-100 g-0">
                <Col lg={6} className="d-flex justify-content-center align-items-center">
                    <Container className="g-5">
                        <Form onSubmit={handleSubmitClick}>
                            <h2 className="text-center mb-4">Create Account</h2>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <Form.Text className="text-muted"/>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            {error && <div className="error">{error}</div>}
                            {success && <div className="success">{success}</div>}
                            <Button variant="primary" className="w-100 common-btn" type="submit">
                                Create Account
                            </Button>
                        </Form>
                    </Container>
                </Col>
                <Col lg={6} className="d-none d-lg-block" style={{ backgroundImage: `url(${LoginPagePhoto})`, backgroundSize: 'cover', minHeight: '100vh',  backgroundPosition: 'center top'}}>
                </Col>
            </Row>

        </Container>
    );
};

export default CreateAccount;