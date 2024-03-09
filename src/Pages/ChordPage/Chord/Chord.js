import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button } from "react-bootstrap";
import DeleteChordButton from './DeleteChordButton';
import axios from "axios";

const Chord = ({ chordId, chord, refreshChords, editable, isSelected, isMarkedForRemoval }) => {
    const [currentChord, setCurrentChord] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (chordId) {
            console.log("fetching chord")
            axios.get(`/api/chords/${chordId}`)
                .then(response => setCurrentChord(response.data))
                .catch(error => console.error(error));
        }
        if(chord) {
            setCurrentChord(chord);
        }
    }, [chordId]);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleEdit = () => console.log("Edit functionality not implemented yet.");
    const chordStyle = isMarkedForRemoval ? { backgroundColor: '#8B0000' } : isSelected ? {backgroundColor: '#006400' } : {};

    if (!currentChord) {
        return <div>Loading...</div>; // Or any other placeholder
    }

    return (
        <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="mb-3" style={chordStyle}>
            <Card.Header>{currentChord && currentChord.name}</Card.Header>
            <Card.Body>
                <Row>
                    {currentChord.notes.map((note, index) => (
                        <Col key={index}>
                            <div>{note.name}</div>
                            <div>{currentChord.fretPositions[index]}</div>
                        </Col>
                    ))}
                </Row>
                {isHovering && editable && (
                    <div className="mt-2">
                        <Button variant="info" onClick={handleEdit} className="me-2">Edit</Button>
                        <DeleteChordButton chordId={chordId} onSuccess={refreshChords} />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default Chord;