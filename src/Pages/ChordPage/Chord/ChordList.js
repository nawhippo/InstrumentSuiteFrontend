import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chord from './Chord';
import { ListGroup } from 'react-bootstrap';

//fetches all chords from a given instrument

const ChordList = ({ tuningId, refreshChords, editable }) => {
    const [chords, setChords] = useState([]);

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
        <ListGroup>
            {chords.map((chord) => (
                <Chord key={chord.id} chord={chord} refreshChords={() => fetchChords(tuningId)}  editable={editable}/>
            ))}
        </ListGroup>
    );
};

export default ChordList;