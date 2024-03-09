import React, { useState } from 'react';
import { Alert, Button, FormControl } from "react-bootstrap";
import axios from "axios";

const ForgotPassword = () => {
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [displayEmailForm, setDisplayEmailForm] = useState(false);
    const [emailField, setEmailField] = useState("");

    const handleButtonClick = () => {
        setDisplayEmailForm(prevState => !prevState);
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post('/nurse/InitiateRecovery', { email: emailField })
            .then(response => {
                setNotification('Please check your email for a recovery link');
            })
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <Button variant="link" onClick={handleButtonClick}>Forgot Password?</Button>
            {error && <Alert variant="danger">Error: {error}</Alert>}
            {notification && <Alert variant="success">{notification}</Alert>}
            {displayEmailForm && (
                <form onSubmit={onFormSubmit} className="mb-3 w-100">
                    <FormControl className="mb-3"
                                 type="text"
                                 placeholder="Please enter your email"
                                 value={emailField}
                                 onChange={(e) => setEmailField(e.target.value)}
                    />
                    <button className="w-100 common-btn btn btn-primary common-btn" type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;