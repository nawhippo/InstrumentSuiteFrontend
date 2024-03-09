import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {ListGroup, Card, Button, Col, Row, Container} from 'react-bootstrap';
import { useUserContext } from '../../Utility/UserContext';
import Chord from "../ChordPage/Chord/Chord";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PracticePlanListPage = () => {
    const {user} = useUserContext();
    const navigate = useNavigate();
    const [practicePlans, setPracticePlans] = useState([]);
    const [chordsListData, setChordsListData] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [newPlanName, setNewPlanName] = useState('');
    const [selectedChords, setSelectedChords] = useState([]);
    const [chordsMarkedForRemoval, setChordsMarkedForRemoval] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const plansResponse = await axios.get(`/api/practicePlans/byUser`, {params: {userId: user.user.id}});
                    console.log(plansResponse);
                    const chordsResponse = await axios.get(`/api/chords/byTuning/${user?.selectedTuning.id}`);
                    console.log("Cookies in practice list: " + Cookies.get('token'))

                    setPracticePlans(Array.isArray(plansResponse.data) ? plansResponse.data : []);
                    setChordsListData(Array.isArray(chordsResponse.data) ? chordsResponse.data : []);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setPracticePlans([]);
                    setChordsListData([]);
                }
            }
        };
        fetchData();
    }, [user]);


    const toggleChordRemovalMark = (chordId) => {
        setChordsMarkedForRemoval(prev =>
            prev.includes(chordId) ? prev.filter(id => id !== chordId) : [...prev, chordId]
        );
    };

    const handleRemoveChordFromSelectedPlan = (chordId) => {
        if (selectedPlanId) {
            const updatedPlans = practicePlans.map(plan => {
                if (plan.id === selectedPlanId) {
                    const updatedChords = plan.chords.filter(id => id !== chordId);
                    return {...plan, chords: updatedChords};
                }
                return plan;
            });
            setPracticePlans(updatedPlans);
        }
    };

    const handleDeletePlan = async (planId) => {
        try {
            await axios.delete(`/api/practicePlans/${planId}`)
            const updatedPlans = practicePlans.filter(plan => plan.id !== planId);
            setPracticePlans(updatedPlans);
            if (selectedPlanId === planId) {
                setSelectedPlanId(null);
            }
        } catch (error) {
            console.error('Error deleting practice plan:', error);
            alert("Failed to delete the practice plan.");
        }
    };

    const selectedStyle = {
        backgroundColor: '#4f4f4f'
    };

    const selectedPlan = practicePlans.find(plan => plan.id === selectedPlanId);

    const handleNavigateToPracticePlanPage = () => {
        const selectedPlan = practicePlans.find(plan => plan.id === selectedPlanId);
        if (selectedPlan) {
            console.log("Navigating with plan:", selectedPlan);
            navigate('/practice', {state: {selectedPlan}});
        } else {
            console.error("No plan selected");
        }
    };
    const toggleChordInPracticePlan = (chordId) => {
        const isSelected = selectedChords.includes(chordId);
        setSelectedChords(isSelected ? selectedChords.filter(id => id !== chordId) : [...selectedChords, chordId]);
    };

    const createOrUpdatePlan = async () => {
        console.log(Cookies.get('token'));
        if (!newPlanName.trim()) {
            alert("Please enter a plan name.");
            return;
        }

        if (!user.selectedTuning.id) {
            alert("Tuning ID is missing.");
            return;
        }

        const planDetails = {
            name: newPlanName,
            userId: user.user.id,
            chords: [
                ...practicePlans.find(plan => plan.id === selectedPlanId)?.chords.filter(chord => !chordsMarkedForRemoval.includes(chord)) || [],
                ...selectedChords
            ],
            tuningId: user.selectedTuning.id,
        };

        try {
            let response;
            if (selectedPlanId) {
                response = await axios.put(`/api/practicePlans/${selectedPlanId}`, planDetails);
            } else {
                response = await axios.post('/api/practicePlans', planDetails);
                if (response.status === 200) {
                    console.log("Practice plan saved successfully.");
                    setNewPlanName('');
                    setSelectedChords([]);
                    setSelectedPlanId(null);
                }
            }
        }
        catch(error)
            {
                console.error('Error saving practice plan:', error);
                alert("Failed to save the practice plan.");
            }
        }

    return (
        <Container fluid className="mt-3">
            <Row>
                <Col>
                    <ListGroup>
                        {practicePlans.map((plan) => (
                            <Card key={plan.id} style={plan.id === selectedPlanId ? selectedStyle : {}}>
                                <Card.Header onClick={() => setSelectedPlanId(plan.id === selectedPlanId ? null : plan.id)}>
                                    {plan.name}
                                    <Button variant="danger" onClick={() => handleDeletePlan(plan.id)} style={{ float: 'right' }}>
                                        Delete
                                    </Button>
                                </Card.Header>
                                <Card.Body>
                                    {plan.chords.map((chordId, index) => {
                                        const chord = chordsListData.find(ch => ch.id === chordId);
                                        const isMarkedForRemoval = chordsMarkedForRemoval.includes(chordId);
                                        return chord ? (
                                            <div key={index} onClick={() => toggleChordRemovalMark(chordId)}>
                                                <Chord chord={chord} editable={false} isMarkedForRemoval={isMarkedForRemoval} />
                                            </div>
                                        ) : null;
                                    })}
                                </Card.Body>
                            </Card>
                        ))}
                    </ListGroup>
                    <Row className="mt-3">
                        <Col>
                            <button className="btn btn-primary common-btn"  variant="success" onClick={() => handleNavigateToPracticePlanPage(selectedPlan)}>
                                Proceed to Practice Plan
                            </button>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <ListGroup>
                        {chordsListData.map(chord => (
                            <div key={chord.id} onClick={() => toggleChordInPracticePlan(chord.id)}>
                                <Chord
                                    chord={chord}
                                    editable={false}
                                    isSelected={selectedChords.includes(chord.id)}
                                />
                            </div>
                        ))}
                    </ListGroup>
                </Col>
                <Col>
                    <input
                        style={{width: '300px'}}
                        className="form-control mb-3"
                        type="text"
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        placeholder="Enter new plan name"
                    />
                    <button className="btn btn-primary common-btn"  onClick={createOrUpdatePlan}>{selectedPlanId ? "Update Plan" : "Create New Plan"}</button>
                </Col>
            </Row>

        </Container>
    )
}



export default PracticePlanListPage;