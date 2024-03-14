import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Alert } from 'react-bootstrap';
import InstrumentSelector from "./InstrumentSelector";
import TuningSelector from "./TuningSelector";
import { useUserContext } from "../../Utility/UserContext";
import "./navigation.css";

const Navigation = () => {
    const { user } = useUserContext();

    useEffect(() => {
        if (user && user.selectedTuning && user.selectedInstrument) {
            console.log(user.selectedTuning, user.selectedInstrument);
        }
    }, [user, user?.selectedTuning, user?.selectedInstrument]);

    const hasRequiredSelections = user?.selectedTuning && user?.selectedInstrument;

    return (
        <Navbar bg="dark" expand="lg" variant="dark" style={{ minHeight: "80px", padding: "10px 0", position: "relative" }}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="font-weight-bold" style={{ color: "#fff", fontSize: "1.5rem" }}>InstrumentSuite</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" style={{ alignItems: "center" }}>
                        {!user && (
                            <Nav.Link as={Link} to="/login" className="mx-2">Login</Nav.Link>
                        )}
                        {hasRequiredSelections && (
                            <>
                                <Nav.Link as={Link} to="/chords" className="mx-2">Chords</Nav.Link>
                                <Nav.Link as={Link} to="/tuner" className="mx-2">Tuning</Nav.Link>
                                <Nav.Link as={Link} to="/practicePlans" className="mx-2">Practice Plans</Nav.Link>
                            </>
                        )}
                        <div className="d-flex align-items-center mx-2">
                            <InstrumentSelector />
                        </div>
                        <div className="d-flex align-items-center mx-2">
                            <TuningSelector />
                        </div>
                        {user && (
                            <Nav.Link as={Link} to="/logout" className="mx-2">Logout</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
                {!hasRequiredSelections && (
                    <Alert variant="info" style={{ position: 'absolute', top: '100%', right: '0', left: '0', margin: '0', borderRadius: '0' }}>
                        Please select an instrument and tuning to get started.
                    </Alert>
                )}
            </Container>
        </Navbar>
    );
};

export default Navigation;