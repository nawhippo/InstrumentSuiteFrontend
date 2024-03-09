import React, { useEffect } from 'react';
import { useUserContext } from "../../Utility/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const LogoutPage = () => {
    const { clearUserContext } = useUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        handleLogout();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        Cookies.remove('token');
        clearUserContext();

        // Redirect to login page
        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutPage;