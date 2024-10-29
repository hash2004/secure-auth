// src/components/LoginForm.js
import React, { useState } from 'react';
import { login } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            setMessage(response.data.message);
            navigate('/placeholder');

        } catch (error) {
            setMessage(error.response.data.detail);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                className="form-control" 
                                placeholder="Enter your username" 
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
                                placeholder="Enter your password" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>
                    {message && <p className="text-danger text-center mt-3">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
