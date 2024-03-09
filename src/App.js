import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from "./Pages/Navigation/Navigation";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/login";
import TuningPage from "./Pages/TuningPage/TuningPage";
import { UserProvider} from "./Utility/UserContext";
import ChordPage from "./Pages/ChordPage/ChordPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateAccount from "./Pages/Login/createAccount";
import PracticePlanListPage from "./Pages/PracticePlanPage/PracticePlanListPage";
import LogoutPage from "./Pages/Logout/LogoutPage";
import axios from './Utility/AxiosDefaults';
import './App.css';
import PracticePlanPage from "./Pages/PracticePlanPage/PracticePlanPage";
const App = () => {


    return (
        <UserProvider>
            <BrowserRouter>
                <div className="App">
                    <Navigation />
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/tuner" element={<TuningPage />} />
                        <Route path="/" element={<Login />} />
                        <Route path="/chords" element={<ChordPage /> } />
                        <Route path="/practicePlans" element={<PracticePlanListPage />} />
                        <Route path="/createAccount" element={<CreateAccount />} />
                        <Route path="/logout" element={<LogoutPage />} />
                        <Route path="/practice" element={<PracticePlanPage/>} />
                    </Routes>
                </div>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;