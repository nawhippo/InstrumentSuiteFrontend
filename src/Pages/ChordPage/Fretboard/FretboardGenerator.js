import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useUserContext} from "../../../Utility/UserContext";
import ChordCreator from "./ChordCreator";

const FretboardGenerator = () => {
    const [fretboard, setFretboard] = useState([]);
    const { user } = useUserContext();

    //grab user instrument tuning and instrument itself from usercontext.
    useEffect(() => {
        if (user?.selectedInstrument && user?.selectedTuning) {
            getFretboard(user.selectedInstrument, user.selectedTuning);
        }
    }, [user?.selectedInstrument, user?.selectedTuning]);

    const getFretboard = (instrument, tuning) => {
        axios.post('/api/instruments/fretboard', { instrument, tuning })
            .then(response => setFretboard(response.data))
            .catch(error => console.error("There was an error fetching the fretboard: ", error));
    };

    return (
        <div>
            {fretboard.length > 0 && <ChordCreator fretboard={fretboard} />}
        </div>
    );
};

export default FretboardGenerator;