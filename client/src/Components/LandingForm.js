import React from 'react';
import { Link } from 'react-router-dom';
import './LandingForm.css'; // Import CSS

const LandingPage = () => {
    return (
        <div className="landing-container">
            <h1 className="landing-title">Welcome to Melodai</h1>
            <div className="landing-buttons">
                <Link to="/login">
                    <button className="landing-button">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="landing-button">Sign Up</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;