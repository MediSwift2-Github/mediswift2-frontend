import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from "./components/login-component/login-page";
import DoctorDashboard from './components/doctor-dashboard/doctor-dashboard';
import FrontDeskDashboard from './components/frontdesk-dashboard/frontdesk-dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/frontdesk-dashboard" element={<FrontDeskDashboard />} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
}

export default App;
