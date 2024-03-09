import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useUserContext } from "../../../Utility/UserContext";

const ChordCreator = ({ fretboard }) => {
    const { user } = useUserContext();
    const [chordName, setChordName] = useState('');
    const initialSelectedNotes = fretboard ? Array(fretboard.length).fill(0) : [];
    const [selectedNotes, setSelectedNotes] = useState(initialSelectedNotes);

    const handleSliderChange = (stringIndex, noteIndex) => {
        const updatedSelectedNotes = [...selectedNotes];
        updatedSelectedNotes[stringIndex] = noteIndex;
        setSelectedNotes(updatedSelectedNotes);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newChord = {
            name: chordName,
            notes: selectedNotes.map((noteIndex, stringIndex) => {
                const note = fretboard[stringIndex][noteIndex];
                return {
                    name: note ? note.name : 'Invalid Note'
                };
            }),
            fretPositions: selectedNotes,
            tuningConfigurationId: user.selectedTuning.id,
        };

        try {
            const response = await axios.post('/api/chords', newChord);
            alert(`Chord created successfully: ${response.data.name}`);
            setChordName('');
            setSelectedNotes(Array(fretboard.length).fill(0));
        } catch (error) {
            console.error('Failed to create chord:', error);
            alert('Failed to create chord');
        }
    };
    const noteStyle = {
        display: 'inline-block',
        margin: '0 5px',
        padding: '2px 5px',
    };

    const selectedNoteStyle = {
        ...noteStyle,
        backgroundColor: '#a020f0',
        color: 'white',
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
                <Col sm={10} >
                    <Form.Control  style={{justifySelf: "center"}}
                        type="text"
                        placeholder="Enter chord name"
                        value={chordName}
                        onChange={(e) => setChordName(e.target.value)}
                        required
                    />
                </Col>
            </Form.Group>
            {fretboard.map((string, stringIndex) => (
                <Container key={stringIndex} className="mb-3">
                    <Row>
                        <Col sm={10}>
                            {string.map((note, noteIndex) => (
                                <span
                                    key={noteIndex}
                                    style={selectedNotes[stringIndex] === noteIndex ? selectedNoteStyle : noteStyle}
                                >
                        {note ? note.name : 'Empty'}
                    </span>
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={10}>
                            <Form.Control
                                type="range"
                                min="0"
                                max={string.length - 1}
                                value={selectedNotes[stringIndex]}
                                onChange={(e) => handleSliderChange(stringIndex, parseInt(e.target.value, 10))}
                            />
                        </Col>
                    </Row>
                </Container>
            ))}
            <button className="btn btn-primary common-btn" variant="primary" type="submit">Create Chord</button>
        </Form>
    );
};

export default ChordCreator;