// src/components/OTPVerification.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { verifyOtp } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const OTPVerification = () => {
    const [ username ,setusername ] = useState(''); // Get the username from URL params
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    useEffect(() => {
        // Get username from local storage if it's not in params
        if (!username) {
            const storedUsername = localStorage.getItem('username');
            setusername(storedUsername); // Set the username in state
        }
    },[username]);

    const handleChange = (e) => {
        setOtp(e.target.value); // Update OTP state on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            // Call verifyOtp with the username and OTP entered
            const response = await verifyOtp(username, otp); 
            setMessage(response.data.message); // Set success message
            navigate('/');
        } catch (error) {
            // Handle errors appropriately
            const errorMessage = error.response?.data?.detail || 'An error occurred.';
            // setMessage(errorMessage);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">OTP Verification</h2>
            <form onSubmit={handleSubmit} className="text-center">
                <div className="mb-3">
                    <input 
                        type="text" 
                        name="otp" 
                        className="form-control" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Verify OTP</button>
            </form>
            {message && <p className="text-center mt-3">{message}</p>} {/* Display any messages */}
        </div>
    );
};

export default OTPVerification;
