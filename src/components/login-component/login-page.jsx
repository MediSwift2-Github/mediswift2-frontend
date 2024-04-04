import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login-page.css';
import logo from './MediSwift.png';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password }, { withCredentials: true });
            if (response.data.message === 'Authentication successful') {
                // Check the role and navigate accordingly
                if (response.data.role === 'doctor') {
                    navigate('/doctor-dashboard');
                } else if (response.data.role === 'receptionist') {
                    navigate('/frontdesk-dashboard');
                } else {
                    // Handle other roles or default case
                    console.log('User role not recognized or user does not have permissions.');
                }
            } else {
                alert('Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="logo" />
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;