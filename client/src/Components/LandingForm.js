import React from 'react';
import { Link } from 'react-router-dom';
import './LandingForm.css'; // Import CSS

const LandingPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Melodai</h1>
            {/* Use React Router's Link to navigate to login and signup */}
            <Link to="/login" target="_blank" rel="noopener noreferrer">
                <button>Login</button>
            </Link>
            <Link to="/signup" target="_blank" rel="noopener noreferrer">
                <button>Sign Up</button>
            </Link>
        </div>
    );
};

export default LandingPage;