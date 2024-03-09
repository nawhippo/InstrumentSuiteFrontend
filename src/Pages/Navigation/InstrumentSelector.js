import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { useUserContext } from "../../Utility/UserContext";

const InstrumentSelector = () => {
    const { user, updateUser } = useUserContext();
    const [instruments, setInstruments] = useState([]);
    const [selectedInstrumentId, setSelectedInstrumentId] = useState('');

    useEffect(() => {
        axios.get('/api/instruments/getAllInstruments')
            .then(response => {
                setInstruments(response.data);
                if (response.data.length > 0 && (!user || !user.selectedInstrument)) {
                    const firstInstrument = response.data[0];
                    setSelectedInstrumentId(firstInstrument.id);
                    updateUser({ selectedInstrument: firstInstrument });
                }
            })
            .catch(error => {
                console.error("Error fetching instruments:", error);
            });
    }, [updateUser, user]);

    const handleInstrumentSelect = (selectedInstrument) => {
        setSelectedInstrumentId(selectedInstrument.id);
        console.log("user: " + user.selectedInstrument.name);
        updateUser({ selectedInstrument });
        console.log("user after: " + user.selectedInstrument.name);
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic-instrument">
                {user?.selectedInstrument?.name || "Select Instrument"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {instruments.map((instrument) => (
                    <Dropdown.Item key={instrument.id} onClick={() => handleInstrumentSelect(instrument)}>
                        {instrument.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default InstrumentSelector;