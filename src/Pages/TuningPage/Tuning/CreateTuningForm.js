import React, { useState } from 'react';
import axios from 'axios';
import {Card, Col} from "react-bootstrap";
const CreateTuningForm = ({ instrumentId, onSuccess }) => {
    const [tuningName, setTuningName] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const newTuning = {
            name: tuningName,
            notes: notes.split(',').map(note => ({ name: note.trim() })),
            instrumentId: instrumentId,
        };

        axios.post('/api/tuningConfigurations', newTuning)
            .then(response => {
                alert('Tuning created successfully');
                onSuccess(response.data);
            })
            .catch(error => {
                alert('Failed to create tuning');
                console.error('There was an error!', error);
            });
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="tuningName" className="form-label">Tuning Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="tuningName"
                    value={tuningName}
                    onChange={e => setTuningName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes (comma separated)</label>
                <input
                    type="text"
                    className="form-control"
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary common-btn">Create Tuning</button>
        </form>
        </>
    );
};

export default CreateTuningForm;