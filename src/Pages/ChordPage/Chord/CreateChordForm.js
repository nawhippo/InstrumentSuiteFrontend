import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Row, Col } from "react-bootstrap";
const CreateChordForm = () => {
    const [chordName, setChordName] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newChord = {
            name: chordName,
            Notes: notes.split(',').map(name => ({ name: name.trim() }))
        };
        axios.post('/api/chords', newChord)
            .then(response => {
                alert('Chord created successfully!');
                console.log(response.data);
                setChordName('');
                setNotes('');
            })
            .catch(error => {
                alert('Failed to create chord');
                console.error('error:', error);
            });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Col>
                    <Form.Control
                        placeholder="Chord Name"
                        value={chordName}
                        onChange={(e) => setChordName(e.target.value)}
                        required
                    />
                </Col>
                <Col>
                    <Form.Control
                        placeholder="Notes (comma-separated)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        required
                    />
                </Col>
            </Row>
            <button className="btn btn-primary common-btn"  type="submit">Create Chord</button>
        </Form>
    );
};

export default CreateChordForm;