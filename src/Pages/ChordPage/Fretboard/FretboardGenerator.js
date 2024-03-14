import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from "../../../Utility/UserContext";
import ChordCreator from "./ChordCreator";

const FretboardGenerator = () => {
    const [fretboard, setFretboard] = useState([]);
    const { user } = useUserContext();

    useEffect(() => {
        if (user?.selectedInstrument && user?.selectedTuning) {
            if (!user.selectedTuning.fretboard) {
                getFretboard(user.selectedInstrument, user.selectedTuning.id);
            } else {
                setFretboard(user.selectedTuning.fretboard);
            }
        }
    }, [user?.selectedInstrument, user?.selectedTuning]);

    const getFretboard = (instrument, tuningId) => {
        axios.post('/api/instruments/fretboard', { instrumentId: instrument.id, tuningId })
            .then(response => {
                setFretboard(response.data);
            })
            .catch(error => console.error("There was an error fetching the fretboard: ", error));
    };

    return (
        <div>
            {fretboard.length > 0 && <ChordCreator fretboard={fretboard} />}
        </div>
    );
};

export default FretboardGenerator;