// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Custom CSS for additional styling

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    navigate('/placeholder');
  };

  return (
    <div className="container mt-5 auth-container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow auth-card">
            <h3 className="text-center mb-4">Sign Up</h3>
            <form onSubmit={handleSignup}>
              <div className="form-group mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block w-100 mt-3">
                Sign Up
              </button>
            </form>
            <p className="text-center mt-3">
              Already have an account? <a href="/" className="text-primary">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
