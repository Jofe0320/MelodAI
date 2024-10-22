import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to MyApp</h1>
            {/* Use React Router's Link to navigate to login and signup */}
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/signup">
                <button>Sign Up</button>
            </Link>
        </div>
    );
};

export default LandingPage;
