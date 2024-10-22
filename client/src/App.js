import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';  // Your landing page component
import Homepage from './Homepage';  // The original page
import ExplorePage from './Explore';  // New Explore page
import LandingForm from './Components/LandingForm';  // Landing form from second code
import LoginForm from './Components/LoginForm';  // Login form from second code
import SignupForm from './Components/SignupForm';  // Signup form from second code

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes from the first code snippet */}
        <Route path="/" element={<LandingPage />} />       {/* Main Landing Page */}
        <Route path="/app" element={<Homepage />} />       {/* Homepage */}
        <Route path="/explore" element={<ExplorePage />} />{/* Explore Page */}

        {/* Routes from the second code snippet */}
        <Route path="/landing-form" element={<LandingForm />} /> {/* Landing form */}
        <Route path="/login" element={<LoginForm />} />          {/* Login Form */}
        <Route path="/signup" element={<SignupForm />} />        {/* Signup Form */}
      </Routes>
    </Router>
  );
}

export default App;
