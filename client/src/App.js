import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';  // Your landing page component
import Homepage from './Homepage';  // The original page
import getstarter from './getstarter';  // The Sample Melodies page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />           {/* Landing Page */}
        <Route path="/app" element={<Homepage />} />           {/* Original Page */}
        <Route path="/getstarter" element={<getstarter />} /> {/* Sample Melodies */}
      </Routes>
    </Router>
  );
}

export default App;