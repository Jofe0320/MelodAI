import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingForm';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Landing page route */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Login route */}
                <Route path="/login" element={<LoginForm />} />
                
                {/* Signup route */}
                <Route path="/signup" element={<SignupForm />} />
            </Routes>
        </Router>
    );
};

export default App;
