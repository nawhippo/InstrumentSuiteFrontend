import React, { useState, useRef, useEffect } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import NotePanel from "./NotePanel";
import {useUserContext} from "../../Utility/UserContext";
import {Button, Col, Row} from "react-bootstrap";
import NotePlayer from "./NotePlayer";
const AudioRecorder = ({ onStreamReady }) => {
    const webSocketRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [noteEstimation, setNoteEstimation] = useState("");
    const [difference, setDifference] = useState(0);
    const mediaRecorderRef = useRef(null);
    const intervalRef = useRef(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [index, setIndex] = useState(0);
    const {user} = useUserContext();
    const [isFreeTuning, setIsFreeTuning] = useState(false);
    const selectedTuningNotes = user.selectedTuning.notes;
    const [message, setMessage] = useState("");
    const [isMessageAcknowledged, setIsMessageAcknowledged] = useState(true);
    const [pulsing, setPulsing] = useState(false);
    useEffect(() => {
        if (!isFreeTuning && index < selectedTuningNotes.length) {
            setSelectedNote(selectedTuningNotes[index]?.name);
        }
        console.log('Selected Note: ' + selectedNote);
    }, [index, selectedTuningNotes, isFreeTuning]);



    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const toggleTuningMode = () => {
        setIsFreeTuning(!isFreeTuning);
        setIndex(0);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);

        if (webSocketRef.current) {
            webSocketRef.current.close();
            webSocketRef.current = null
        }
    };

const moveToNextNote = () => {
    if (index < selectedTuningNotes.length - 1) {
        setIndex(prevIndex => prevIndex + 1);
    } else {
        console.log("Tuning completed for all notes.");
    }
};

const handleNoteSend = (note) => {
    setSelectedNote(note);
};

    const startPulseRecording = () => {
        setPulsing(true);
        startRecording();
        intervalRef.current = setInterval(() => {
            stopRecording();
            setTimeout(() => startRecording(), 1000);
        }, 3000);
    };


    const stopPulseRecording = () => {
        setPulsing(false);
        clearInterval(intervalRef.current);
        stopRecording();
    };


    const startRecording = async () => {
        console.log("Starting recording, current note:", selectedNote);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            onStreamReady && onStreamReady(stream);

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            webSocketRef.current = new WebSocket("ws://localhost:8081/ws/audio");
            webSocketRef.current.onopen = () => {
                console.log("Connection is now open");
                console.log("WebSocket connection established, ready to send audio data.");
            };
            webSocketRef.current.onclose = () => console.log("Connection is now closed.");
            webSocketRef.current.onerror = (error) => console.error("An error occurred while opening the socket:", error);


            webSocketRef.current.onmessage = handleWebSocketMessages;

            mediaRecorderRef.current.addEventListener("dataavailable", async (event) => {
                if (event.data.size > 0 && webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
                    setIsMessageAcknowledged(false);
                    const audioBlob = event.data;
                    const reader = new FileReader();

                    reader.onload = () => {
                        const audioDataAsBase64 = reader.result.split(',')[1];
                        const message = JSON.stringify({
                            note: selectedNote,
                            audioData: audioDataAsBase64,
                        });

                        webSocketRef.current.send(message);
                    };

                    reader.readAsDataURL(audioBlob);
                }
            });

            mediaRecorderRef.current.start(1000);
            setRecording(true);
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    };


    const handleWebSocketMessages = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.error) {
                console.error("Error from server:", data.error);
            } else if (data.note && data.difference) {
                console.log("Pitch response from server:", data);
                setNoteEstimation(data.note.name);
                setDifference(data.difference);
                if (data.difference > 0) {
                    setMessage("Tune down");
                } else if (data.difference < 0) {
                    setMessage("Tune up");
                } else {
                    setMessage("");
                }
            }
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            console.error("Faulty message:", event.data);
        } finally {
            setIsMessageAcknowledged(true);
        }
    };

    return (
        <div>
            <Row>
                <Col >
                <button className="btn btn-primary common-btn"  onClick={toggleTuningMode}>
                    {isFreeTuning ? "Toggle Guided Tuning" : "Toggle Free Tuning"}
                </button>
                </Col>
            </Row>
            <MicIcon
                style={{
                    fontSize: '200px',
                    color: pulsing ? 'red' : 'green',
                    cursor: 'pointer'
                }}
                onClick={recording ? stopPulseRecording : startPulseRecording}
            />
            <p>Current Note: {selectedNote}</p>
            <NotePlayer note={selectedNote}/>
            {isFreeTuning && (
                <NotePanel onNoteSend={handleNoteSend} selectedNote={selectedNote} />
            )}
            {message && <p>{message}</p>}
            {noteEstimation && <p>Note: {noteEstimation}</p>}
            {difference !== undefined && <p>Difference: {difference} Hz</p>}
        </div>
    );
};

export default AudioRecorder;