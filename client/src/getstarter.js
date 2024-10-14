import React from "react";
import "./getstarter.css"; // Import the CSS

export default function SampleMelodies() {
  const melodies = [
    { name: "Name A", user: "User A", audioSrc: "/audioA.mp3", duration: "01:04" },
    { name: "Name B", user: "User B", audioSrc: "/audioB.mp3", duration: "01:04" },
    { name: "Name C", user: "User C", audioSrc: "/audioC.mp3", duration: "01:04" },
  ];

  return (
    <div className="sample-melodies-container">
      <h2 className="sample-melodies-title">Sample Melodies</h2>
      <div className="melodies-grid">
        <div className="icon-container">
          <img src="/icons/piano-icon.svg" alt="Piano" className="melody-icon" />
        </div>
        <div className="icon-container">
          <img src="/icons/saxophone-icon.svg" alt="Saxophone" className="melody-icon" />
        </div>
        <div className="icon-container">
          <img src="/icons/guitar-icon.svg" alt="Guitar" className="melody-icon" />
        </div>
      </div>
      <div className="melodies-players-grid">
        {melodies.map((melody, index) => (
          <div key={index} className="audio-player">
            <p className="melody-info">{melody.name} - {melody.user}</p>
            <audio controls>
              <source src={melody.audioSrc} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <p className="audio-duration">{melody.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
