import React, { useState, useEffect } from 'react';

const Metronome = ({ bpm, onBpmChange, isPlaying, onTogglePlay, timeSignature, onAccentedBeat }) => {
    const [beatCount, setBeatCount] = useState(0);
    const [audioContext, setAudioContext] = useState(null);
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);

    useEffect(() => {
        // Initialize audio context lazily
        if (!audioContext && window.AudioContext) {
            setAudioContext(new AudioContext());
        }

        if (isPlaying && audioContext) {
            const interval = setInterval(() => {
                playClick();
            }, (60 / bpm) * 1000);

            // Clean up on effect cleanup
            return () => clearInterval(interval);
        }
    }, [isPlaying, bpm, audioContext, beatsPerMeasure]); // Adding beatsPerMeasure to dependency array

    const playClick = () => {
        if (!audioContext) return;
        setBeatCount((prevBeatCount) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (prevBeatCount % beatsPerMeasure === 0) {
                onAccentedBeat && onAccentedBeat();
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                gainNode.gain.value = 1;
            } else {
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                gainNode.gain.value = 0.5;
            }

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            return (prevBeatCount + 1) % beatsPerMeasure;
        });
    };

    return (
        <div>
            <div>{`BPM: ${bpm}`}</div>
            <input type="range" min="40" max="200" value={bpm} onChange={(e) => onBpmChange(parseInt(e.target.value))} />
        </div>
    );
};

export default Metronome;