import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export function useUserContext() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const cookieUserData = Cookies.get('userData');
        return cookieUserData ? JSON.parse(cookieUserData) : null;
    });

    useEffect(() => {
        Cookies.set('userData', JSON.stringify(user));
    }, [user]);

    const updateUser = (newUserData) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...newUserData,
        }));
    };

    const setSelectedInstrumentId = (instrumentId) => {
        updateUser({ selectedInstrument: { id: instrumentId } });
    };

    const setSelectedTuning = (selectedTuning) => {
        updateUser({ selectedTuning });
    };

    const clearUserContext = () => {
        setUser(null);
        Cookies.remove('userData');
    };

    return (
        <UserContext.Provider value={{ user, updateUser, setSelectedInstrumentId, setSelectedTuning, clearUserContext }}>
            {children}
        </UserContext.Provider>
    );
}