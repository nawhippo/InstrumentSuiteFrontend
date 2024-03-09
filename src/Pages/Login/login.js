import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import {useUserContext} from "../../Utility/UserContext";
import Cookies from "js-cookie";
import LoginPagePhoto from '../../Images/loginpage.png';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { updateUser } = useUserContext();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`/api/account/login`, { username, password })
            .then(response => {
                const { jwt } = response.data;
                console.log(jwt);
                if (jwt) {
                    Cookies.set('token', jwt);
                    updateUser(response.data);
                    navigate('/home');
                    console.log("Stored cookie: " + Cookies.get('token'));
                }
            })
            .catch(error => {
                console.error("Login error:", error);
            });
    };

    return (
        <>
            <Container fluid className="d-flex align-items-center g-0" style={{ minHeight: "100vh" }}>
                <Row className="w-100 g-0">
                    <Col lg={6} className="d-flex justify-content-center align-items-center">
                        <Container className="g-5">
                            <Form onSubmit={handleSubmit}>
                                <h2 className="text-center mb-4">Log In</h2>
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 common-btn">Sign in</Button>
                            </Form>
                            <div className="text-center mt-2">
                                Not a member? <a href="/createAccount">Register</a>
                            </div>
                            <ForgotPassword />
                        </Container>
                    </Col>
                    <Col lg={6} className="d-none d-lg-block" style={{ backgroundImage: `url(${LoginPagePhoto})`, backgroundSize: 'cover', minHeight: '100vh',  backgroundPosition: 'center top'}}>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;