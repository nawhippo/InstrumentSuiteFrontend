import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Chord from "../ChordPage/Chord/Chord";
import Metronome from './Metronome';
import './pulse.css';
const PracticePlanPage = () => {
    const [currentChordIndex, setCurrentChordIndex] = useState(0);
    const [timeSignature, setTimeSignature] = useState('4/4');
    const [bpm, setBpm] = useState(60);
    const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [practicing, setPracticing] = useState(false);
    const { state } = useLocation();
    const [isAccentedBeat, setIsAccentedBeat] = useState(false);
    const plan = state.selectedPlan;
    console.log("current plan:");
    console.log(plan);

    const handleAccentedBeat = () => {
        console.log('Beat accented from child component');
        setIsAccentedBeat(true);
        setTimeout(() => setIsAccentedBeat(false), (60 / bpm) * 250);
    };

    useEffect(() => {
        return () => clearInterval(intervalId);
    }, [plan, intervalId]);

    const handleTimeSignatureChange = (e) => {
        setTimeSignature(e.target.value);
    };

    const calculateIntervalDuration = () => {
        return (60 / bpm) * 1000;
    };

    const playChords = () => {
        setPracticing(true);
        if (!plan || !plan.chords || plan.chords.length === 0) {
            alert("No chords in the selected plan.");
            return;
        }

        const duration = calculateIntervalDuration();
        const id = setInterval(() => {
            setCurrentChordIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % plan.chords.length;
                return nextIndex;
            });
        }, duration);

        setIntervalId(id);
    };

    const stopPlaying = () => {
        setPracticing(false);
        clearInterval(intervalId);
    };

    return (
        <Container fluid className="mt-3">
            <Row className="mb-3">
                <Col md={12}>
                    <h2>Practice Plan: {plan?.name}</h2>
                    <Form.Group controlId="timeSignature">
                        <Form.Label>Please Choose a Time Signature</Form.Label>
                        <Form.Control as="select" value={timeSignature}  className="mb-3" onChange={handleTimeSignatureChange}>
                            <option value="4/4">4/4</option>
                            <option value="3/4">3/4</option>
                            <option value="6/8">6/8</option>
                        </Form.Control>
                    </Form.Group>
                    <Metronome
                        bpm={bpm}
                        onBpmChange={setBpm}
                        isPlaying={isMetronomePlaying}
                        timeSignature={timeSignature}
                        onAccentedBeat={handleAccentedBeat}
                    />

                    {isMetronomePlaying ? (
                        <Button variant="secondary" className="stop-metronome-btn" onClick={() => setIsMetronomePlaying(false)}>
                            Stop Metronome
                        </Button>
                    ) : (
                        <Button variant="primary" className="common-btn" onClick={() => setIsMetronomePlaying(true)}>
                            Start Metronome
                        </Button>
                    )}
                    {practicing ? (
                        <Button variant="secondary" onClick={stopPlaying}>Stop Practice</Button>
                    ) : (
                        <Button className="common-btn" variant="primary" onClick={playChords}>Start Practice</Button>
                    )}
                </Col>
            </Row>
            <Row style={{justifyContent: 'center'}}>
                <Col md={5}>
                    {plan?.chords && plan.chords.length > 0 && (
                        <div className={`${isAccentedBeat ? 'pulse-animation' : ''}`}>
                            <div className="beat-visual-indicator"></div>
                            <Chord chordId={plan.chords[currentChordIndex]} />
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default PracticePlanPage;