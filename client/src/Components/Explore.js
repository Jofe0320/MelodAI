import React from "react";
import './App.css';
import './Explore.css';

export default function ExplorePage() {
  const melodies = [
    { name: "Name A", user: "User A", audioSrc: "/audioA.mp3", duration: "01:04" },
    { name: "Name B", user: "User B", audioSrc: "/audioB.mp3", duration: "01:04" },
    { name: "Name C", user: "User C", audioSrc: "/audioC.mp3", duration: "01:04" },
  ];

  return (
    <div className="sample-melodies-container" style={{
        backgroundImage: "url('/wood.webp')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: 'white', // Change text color to white
      }}>
      <h2 className="sample-melodies-title" style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}>
        Sample Melodies
      </h2>
      <div className="melodies-grid">
        <div className="icon-container">
          <img src="/Pianopng.webp" alt="Piano" className="melody-icon" />
        </div>
        <div className="icon-container">
          <img src="/Saxofon.webp" alt="Saxophone" className="melody-icon" />
        </div>
        <div className="icon-container">
          <img src="/Guitarra.webp" alt="Guitar" className="melody-icon" />
        </div>
      </div>
      <div className="melodies-players-grid">
        {melodies.map((melody, index) => (
          <div key={index} className="audio-player" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "10px", borderRadius: "5px", margin: "10px 0" }}>
            <p className="melody-info" style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}>
              {melody.name} - {melody.user}
            </p>
            <audio controls>
              <source src={melody.audioSrc} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <p className="audio-duration" style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}>
              {melody.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
