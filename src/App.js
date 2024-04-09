import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from "./components/login-component/login-page";
import DoctorDashboard from './components/doctor-dashboard/doctor-dashboard';
import FrontDeskDashboard from './components/frontdesk-dashboard/frontdesk-dashboard';
import ConsultationDashboard from "./components/consultation-dashboard/consultation-dashboard";
import DocumentationPage from "./components/documentation-page/documentation-page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/frontdesk-dashboard" element={<FrontDeskDashboard />} />
                <Route path="/consultation-dashboard" element={<ConsultationDashboard />} />
                <Route path="/documentation" component={DocumentationPage} />{/* Add this line */}

                {/* Other routes */}
            </Routes>
        </Router>
    );
}

export default App;
