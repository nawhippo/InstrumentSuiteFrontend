import axios from "axios";
import {useState} from "react";
import {Card} from "react-bootstrap";

const Tuning = ({ tuning, onUpdate, onDelete }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedNotes, setEditedNotes] = useState(tuning.notes.map(note => note.name));
    const [isHovering, setIsHovering] = useState(false);
    const [editedName, setEditedName] = useState(tuning.name);

    const handleNoteChange = (index, newValue) => {
        const updatedNotes = [...editedNotes];
        updatedNotes[index] = newValue;
        setEditedNotes(updatedNotes);
    };

    const handleSave = async () => {
        const updatedTuning = { ...tuning, name: editedName, notes: editedNotes.map(name => ({ name })) };
        try {
            const response = await axios.put(`/api/tuningConfigurations/${tuning.id}`, updatedTuning);
            console.log('Tuning updated successfully:', response.data);
            onUpdate(response.data);
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update tuning:', error);
        }
    };


    const toggleEditMode = () => setEditMode(true);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    return (
        <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Card.Header>{tuning.name}</Card.Header>
            <Card.Body>
                {editMode ? (
                    <>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                        {editedNotes.map((note, index) => (
                            <input
                                key={index}
                                type="text"
                                className="form-control mb-2"
                                value={note}
                                onChange={(e) => handleNoteChange(index, e.target.value)}
                            />
                        ))}
                        <button onClick={handleSave} className="btn btn-primary me-2 btn-common">Save</button>
                        <button onClick={() => setEditMode(false)} className="btn btn-secondary">Cancel</button>
                    </>
                ) : (
                    <>
                        <p>{tuning.notes.map(note => note.name).join(', ')}</p>
                        {isHovering && (
                            <div>
                                <button onClick={toggleEditMode} className="btn btn-info me-2">Edit</button>
                                <button onClick={() => onDelete(tuning.id)} className="btn btn-danger">Delete</button>
                            </div>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default Tuning;