import React from 'react';
import axios from 'axios';
import { Button } from "react-bootstrap";

const DeleteChordButton = ({ id, onSuccess, onError }) => {
    const handleDelete = () => {
        axios({
            method: 'delete',
            url: `/api/chords/${id}`,
            headers: {'Content-Type': 'application/json'}
        })
            .then(() => {
                alert('Chord deleted successfully!');
                if (onSuccess) onSuccess();
            })
            .catch(error => {
                alert('Failed to delete chord');
                console.error('There was an error!', error);
                if (onError) onError();
            });
    };

    return (
        <Button variant="danger" onClick={handleDelete}>Delete Chord</Button>
    );
};

export default DeleteChordButton;