import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider'; // Import AuthProvider
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import LandingPage from './Components/LandingPage'; // Landing page component
import Homepage from './Components/Homepage'; // Homepage
import ExplorePage from './Components/Explore'; // Explore page
import LandingForm from './Components/LandingForm'; // Landing form
import LoginForm from './Components/LoginForm'; // Login form
import SignupForm from './Components/SignupForm'; // Signup form
import MelodyForm from './Components/MelodyForm'; // Melody creation form
import UserSongs from './Components/UserSongs'; // User songs
import EditProfilePage from './Components/Editprofile'; // Edit profile page
import ClearCookiesOnLoad from './Components/ClearCookiesOnLoad'; // Clear cookies on load

function App() {
  return (
    <>
      <ClearCookiesOnLoad />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Main Landing Page */}
            <Route path="/app" element={<Homepage />} /> {/* Homepage */}
            <Route path="/explore" element={<ExplorePage />} /> {/* Explore Page */}
            <Route path="/usersongs" element={<UserSongs />} /> {/* User songs */}
            <Route path="/landing-form" element={<LandingForm />} /> {/* Landing form */}
            <Route path="/login" element={<LoginForm />} /> {/* Login Form */}
            <Route path="/signup" element={<SignupForm />} /> {/* Signup Form */}
            <Route path="/edit-profile" element={<EditProfilePage />} /> {/* Edit Profile */}

            {/* Protect the Melody Form route */}
            <Route
              path="/create-melody"
              element={
                <ProtectedRoute>
                  <MelodyForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
