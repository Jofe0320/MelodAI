import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';  // Your landing page component
import Homepage from './Homepage';  // The original page
import ExplorePage from "./Explore";  // New Explore page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />           {/* Landing Page */}
        <Route path="/app" element={<Homepage />} />   {/* Original Page */}
          <Route path="/explore" element={<ExplorePage />} />

      </Routes>
    </Router>
  );
}

export default App;