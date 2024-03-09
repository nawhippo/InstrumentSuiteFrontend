import React from 'react';
import axios from 'axios';

const DeleteTuningButton = ({ tuningId, onSuccess }) => {
    const handleDelete = () => {
        axios.delete(`/api/tuningConfigurations/${tuningId}`)
            .then(() => {
                alert('Tuning deleted successfully');
                onSuccess(); 
            })
            .catch(error => {
                alert('Failed to delete tuning');
                console.error('There was an error!', error);
            });
    };

    return (
        <button onClick={handleDelete} className="btn btn-danger">Delete Tuning</button>
    );
};

export default DeleteTuningButton;