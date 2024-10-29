// src/services/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';  // URL of the FastAPI backend

export const signup = async (userData) => {
    return await axios.post(`${API_URL}/signup`, userData);
};

export const verifyOtp = async (username, otp) => {
    console.log("the user nam : ",username, otp);
    return await axios.post(`${API_URL}/verify-otp`, { username, otp });
};

export const login = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};
