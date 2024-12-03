import React, { useState, useEffect } from "react";

// Music note icon
const musicIcon = "🎵";

const UserSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    // Fetch user data from localStorage and log the user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log("Current user from previous page:", storedUser);
  }, []);

  useEffect(() => {
    // Set background color for the body
    document.body.style.backgroundColor = "black";
    document.body.style.margin = "0";

    // Fetch songs from the backend
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token for authentication
        const userId = localStorage.getItem("user_id"); // Get user_id (ensure this is stored or fetched)
        if (!userId || !token) {
          setError("User ID or token is missing. Please log in again.");
          return;
        }

        const response = await fetch(`/songs?user_id=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Could not load songs. Please try again.");
          return;
        }

        const data = await response.json();
        setSongs(data.songs); // Update to match the backend response structure
      } catch (error) {
        setError("An error occurred while loading songs. Please try again later.");
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    // Log the user whenever it changes
    if (user) {
      console.log("Updated user:", user);
    }
  }, [user]);

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    color: "white",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  };

  const cardStyle = {
    backgroundColor: "#333",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const songInfoStyle = {
    marginBottom: "10px",
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "20px",
  };

  if (loading) {
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading songs...</h2>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: "red", textAlign: "center" }}>Error</h2>
        <p style={{ color: "white", textAlign: "center" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1>Your Songs</h1>
      {songs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No songs found.</p>
      ) : (
        <div style={gridStyle}>
          {songs.map((song) => (
            <div key={song.id} style={cardStyle}>
              <div style={songInfoStyle}>
                <h3>
                  Song ID: {song.id} {musicIcon}
                </h3>
                <p>User ID: {song.user_id}</p>

                {/* Embed Audio Player for MIDI */}
                <p>
                  <strong>MIDI:</strong>
                </p>
                <audio controls>
                  <source src={song.midi_link} type="audio/midi" />
                  Your browser does not support the audio element.
                </audio>

                {/* Embed PDF Viewer for Sheet Music */}
                <p>
                  <strong>Sheet Music:</strong>
                </p>
                <iframe
                  src={song.sheet_music_link}
                  title={`Sheet Music ${song.id}`}
                  style={{
                    width: "100%",
                    height: "300px",
                    border: "1px solid #444",
                    borderRadius: "8px",
                  }}
                >
                  Your browser does not support embedding PDFs.{" "}
                  <a
                    href={song.sheet_music_link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#00f" }}
                  >
                    View Sheet Music
                  </a>
                </iframe>

                {/* Song Creation Date */}
                <p>Created At: {song.created_at}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={footerStyle}>
        <p>Total songs: {songs.length}</p>
      </div>
    </div>
  );
};

export default UserSongs;
