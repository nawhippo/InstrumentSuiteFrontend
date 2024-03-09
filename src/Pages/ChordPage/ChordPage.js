import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { useUserContext } from '../../Utility/UserContext';
import Chord from "./Chord/Chord";
import FretboardGenerator from "./Fretboard/FretboardGenerator";
import ChordCreator from "./Fretboard/ChordCreator";
import ChordList from "./Chord/ChordList"; // Make sure this path is correct

const ChordPage = () => {
    const [chords, setChords] = useState([]);
    const { user } = useUserContext();
    const tuningId = user?.selectedTuning?.id;

    useEffect(() => {
        if(tuningId) {
            fetchChords(tuningId);
        }
    }, [tuningId]);

    const fetchChords = async (tuningId) => {
        try {
            const { data } = await axios.get(`/api/chords/byTuning/${tuningId}`);
            setChords(data);
        } catch (error) {
            console.error('Error fetching chords:', error);
        }
    };

    return (
        <Container fluid className="mt-3">
            {tuningId && (
            <Row>
                <Col md={4}>

                    <h2>Chord List for Instrument: {user?.selectedInstrument?.name}, Tuning: {user?.selectedTuning?.name}</h2>
                    <ChordList tuningId={tuningId} editable={true}/>
                </Col>
                <Col md={8}>
                    <h2>Create a Chord</h2>
                    <FretboardGenerator />
                </Col>
            </Row>
            )}
            {!tuningId &&
            <h2>Please select an instrument and a tuning.</h2>
            }
            </Container>
    );
};

export default ChordPage;