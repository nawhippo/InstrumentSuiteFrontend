import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tuning from './Tuning';
import { Container, Row, Col } from 'react-bootstrap';

const TuningsList = () => {
    const [tunings, setTunings] = useState([]);

    useEffect(() => {
        fetchTunings();
    }, []);

    const fetchTunings = async () => {
        try {
            const response = await axios.get(`/api/tuningConfigurations`);
            setTunings(response.data);
        } catch (error) {
            console.error('Error fetching tunings:', error);
        }
    };

    const handleTuningDelete = async (tuningId) => {
        try {
            await axios.delete(`/api/tuningConfigurations/${tuningId}`);
            fetchTunings();
        } catch (error) {
            console.error('Error deleting tuning:', error);
        }
    };

    return (
        <Container fluid>
            <Row>
                {tunings.map(tuning => (
                    <Col key={tuning.id} md={8} className="mb-3">
                        <Tuning
                            tuning={tuning}
                            onDelete={() => handleTuningDelete(tuning.id)}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TuningsList;