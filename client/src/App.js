import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';  // Your landing page component
import Homepage from './Components/Homepage';  // The original page
import ExplorePage from './Components/Explore';  // New Explore page
import LandingForm from './Components/LandingForm';  // Landing form from second code
import LoginForm from './Components/LoginForm';  // Login form from second code
import SignupForm from './Components/SignupForm';  // Signup form from second code
import MelodyForm from'./Components/MelodyForm';
import UserSongs from "./Components/UserSongs";
import EditProfilePage from "./Components/Editprofile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes from the first code snippet */}
        <Route path="/" element={<LandingPage />} />       {/* Main Landing Page */}
        <Route path="/app" element={<Homepage />} />       {/* Homepage */}
        <Route path="/explore" element={<ExplorePage />} />{/* Explore Page */}
        <Route path="/usersongs" element={<UserSongs />}/> {/* Routes from the second code snippet */}
        <Route path="/landing-form" element={<LandingForm />} /> {/* Landing form */}
        <Route path="/login" element={<LoginForm />} />          {/* Login Form */}
        <Route path="/signup" element={<SignupForm />} />        {/* Signup Form */}
        {/* Melody Form Route */}
        <Route path="/create-melody" element={<MelodyForm />} /> {/* Create Melody Form */}
        <Route path="/edit-profile" element={<EditProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;