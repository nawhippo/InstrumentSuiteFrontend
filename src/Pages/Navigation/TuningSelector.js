import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { useUserContext  } from "../../Utility/UserContext"

const TuningSelector = () => {
    const [tunings, setTunings] = useState([]);
    const { user, updateUser, setSelectedTuning } = useUserContext();

    useEffect(() => {
        if (user && user.selectedInstrument) {
            fetchTunings(user.selectedInstrument.id);
        }
    }, [user]);

    const fetchTunings = async (instrumentId) => {
        try {
            const response = await axios.get(`/api/tuningConfigurations/byInstrument/${instrumentId}`);
            setTunings(response.data);
        } catch (error) {
            console.error('Error fetching tunings:', error);
        }
    };

    const handleTuningSelect = (selectedTuning) => {
        if(user.selectedTuning) {
            console.log("tuning before: " + user.selectedTuning.name);
        }
        setSelectedTuning(selectedTuning);
        if(user.selectedTuning) {
            console.log("tuning before: " + user.selectedTuning.name);
        }
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic-tuning">
                {user?.selectedTuning?.name || "Select Tuning"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {tunings.map((tuning) => (
                    <Dropdown.Item key={tuning.id} onClick={() => handleTuningSelect(tuning)}>
                        {tuning.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default TuningSelector;