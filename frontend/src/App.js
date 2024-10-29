// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Placeholder from './Placeholder';
import OTPVerification from './OTPVerification';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/placeholder" element={<Placeholder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
