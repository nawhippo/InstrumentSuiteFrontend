import React, { useState, useRef } from 'react';

const NotePlayer = ({ note }) => {
    const [playing, setPlaying] = useState(false);
    const contextRef = useRef(new AudioContext());
    const oscillatorRef = useRef(contextRef.current.createOscillator());
    const gainNodeRef = useRef(contextRef.current.createGain());

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(contextRef.current.destination);

    const playNote = (note) => {
        if (!window.AudioContext) {
            console.log("Web Audio API is not supported in this browser");
            return;
        }

        if (playing) {
            console.log("Already playing");
            return;
        }

        const noteToFrequency = (note) => {
            const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const octave = parseInt(note.slice(-1), 10);
            const keyNumber = notes.indexOf(note.slice(0, -1));

            if (keyNumber < 0) return null;

            return 440 * Math.pow(2, (octave - 4) + (keyNumber - 9) / 12);
        };

        const frequency = noteToFrequency(note);
        if (!frequency) {
            console.log("Invalid note");
            return;
        }

        oscillatorRef.current.frequency.setValueAtTime(frequency, contextRef.current.currentTime);
        oscillatorRef.current.type = "sine";

        gainNodeRef.current.gain.setValueAtTime(0, contextRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(1, contextRef.current.currentTime + 0.01);

        oscillatorRef.current.start(contextRef.current.currentTime);
        setPlaying(true);
    };

    const stopNote = () => {
        if (!playing) return;

        oscillatorRef.current.stop();
        setPlaying(false);
    };

    return (
        <>
            <button className="btn btn-primary common-btn" style={{marginRight: '10px'}} onClick={() => playNote(note)}>Play {note}</button>
            <button className="btn btn-primary common-btn"  onClick={stopNote}>Pause</button>
        </>
    );
};

export default NotePlayer;