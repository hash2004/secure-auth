// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Custom CSS for additional styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Normally, you would validate credentials and log in
    navigate('/placeholder');
  };

  return (
    <div className="container mt-5 auth-container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4 shadow auth-card">
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleLogin}>
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
              <button type="submit" className="btn btn-primary btn-block w-100 mt-3">
                Login
              </button>
            </form>
            <p className="text-center mt-3">
              Don't have an account? <a href="/signup" className="text-primary">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
