import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Card, Col} from "react-bootstrap";

const Note = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchAllNotes();
    }, []);

    const fetchAllNotes = () => {
        axios.get('/getAllNotes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => console.error("There was an error fetching the notes: ", error));
    };

    return (
        <div>
            <h2>Notes</h2>
            {notes.length > 0 ? (
                <ul>
                    {notes.map(note => (
                        <Card>
                            <Col>
                        <li key={note.id}>{note.name} - MIDI: {note.midiNote}</li>
                            </Col>
                        </Card>
                    ))}
                </ul>
            ) : (
                <p>No notes found.</p>
            )}
        </div>
    );
};

export default Note;