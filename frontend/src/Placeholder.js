// src/components/Placeholder.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const Placeholder = () => {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Welcome to the Cybersecurity Hub!</h2>
            <p className="text-center mb-5">
                This is a placeholder page after login/signup. Explore our services and learn how we can help you protect your digital assets.
            </p>
            
            <div className="row">
                {/* Card 1 */}
                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img src="https://via.placeholder.com/300x200" alt="Security Assessment" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">Security Assessment</h5>
                            <p className="card-text">Get a thorough evaluation of your security posture and identify vulnerabilities.</p>
                            <a href="#" className="btn btn-primary">Learn More</a>
                        </div>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img src="https://via.placeholder.com/300x200" alt="Incident Response" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">Incident Response</h5>
                            <p className="card-text">Quick and effective response to security incidents to minimize impact.</p>
                            <a href="#" className="btn btn-primary">Learn More</a>
                        </div>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm">
                        <img src="https://via.placeholder.com/300x200" alt="Training & Awareness" className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">Training & Awareness</h5>
                            <p className="card-text">Empower your team with the knowledge to recognize and respond to threats.</p>
                            <a href="#" className="btn btn-primary">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-5">
                <a href="/" className="btn btn-secondary">Back to Home</a>
            </div>
        </div>
    );
};

export default Placeholder;
