import React, { useState, useEffect } from 'react';

function NotePanel({ onNoteSend, selectedNote }) {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const [selectedNumber, setSelectedNumber] = useState('');
    const [localSelectedNote, setLocalSelectedNote] = useState(selectedNote);

    useEffect(() => {
        if (localSelectedNote && selectedNumber && onNoteSend) {
            const newSendString = `${localSelectedNote}${selectedNumber}`;
            onNoteSend(newSendString);
        }
    }, [localSelectedNote, selectedNumber, onNoteSend]);

    const handleNumberClick = (number) => {
        setSelectedNumber(number);
    };

    const handleNoteClick = (note) => {
        setLocalSelectedNote(note);
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    const buttonStyle = {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        margin: '5px',
        cursor: 'pointer',
    };

    const selectedButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#1a1a1a',
    };

    return (
        <div>
            <div style={rowStyle}>
                {notes.map((note, index) => (
                    <button
                        key={`note-${index}`}
                        onClick={() => handleNoteClick(note)}
                        style={localSelectedNote === note ? selectedButtonStyle : buttonStyle}
                    >
                        {note}
                    </button>
                ))}
            </div>
            <div style={rowStyle}>
                {numbers.map((number, index) => (
                    <button
                        key={`number-${index}`}
                        onClick={() => handleNumberClick(number)}
                        style={selectedNumber === number ? selectedButtonStyle : buttonStyle}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}



export default NotePanel;