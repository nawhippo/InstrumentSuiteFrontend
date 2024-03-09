import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import WaveformVisualizer from './WaveformVisualizer';
import {Col, Container, Row} from "react-bootstrap";
import CreateTuningForm from "./Tuning/CreateTuningForm";
import TuningsList from "./Tuning/AllTunings";

const TuningPage = () => {
    const [audioStream, setAudioStream] = useState(null);
    const handleStreamReady = (stream) => {
        setAudioStream(stream);
    };


    return (
        <div>
            <Container className="mt-3" fluid>
                    <Row>
                        <Col>
                            <h4>Tune Instrument</h4>
                            <AudioRecorder onStreamReady={handleStreamReady} />
                        </Col>
                        <Col>
                            <h4>Edit Tunings</h4>
                            <TuningsList />
                        </Col>
                        <Col>
                            <h4>Create Tuning For Current Instrument</h4>
                            <CreateTuningForm />
                        </Col>
                        <Row>
                        <Col>
                            {audioStream && <WaveformVisualizer audioStream={audioStream} />}
                        </Col>
                        </Row>


                    </Row>
            </Container>
        </div>
    );
};

export default TuningPage;