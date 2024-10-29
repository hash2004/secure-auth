// src/components/SignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const SignupForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '', email: '', name: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signup(formData);
            setMessage(response.data.message);
            localStorage.setItem('username', formData.username);
            navigate('/verify-otp', { state: { username: formData.username } });
        } catch (error) {
            setMessage(error.response?.data?.detail || 'An error occurred');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                className="form-control" 
                                placeholder="Enter Username" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                className="form-control" 
                                placeholder="Enter Password" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="form-control" 
                                placeholder="Enter Email" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                className="form-control" 
                                placeholder="Enter Full Name" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                    </form>
                    {message && <p className="text-danger text-center mt-3">{message}</p>} {/* Display any messages */}
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
