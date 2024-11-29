import React, { useState, useEffect } from "react";

// Music note icon
const musicIcon = "🎵";

const UserSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set background color for the body
    document.body.style.backgroundColor = "black";
    document.body.style.margin = "0";

    // Fetch songs from the backend
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token for authentication
        const response = await fetch("/api/songs", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSongs(data);
        } else {
          console.error("Failed to fetch songs");
          alert("Could not load songs. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        alert("An error occurred while loading songs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDelete = async (title) => {
    alert(`Deleted ${title}`);
    // Optional: Implement DELETE request to remove the song from the database
  };

  if (loading) {
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading songs...</h2>;
  }

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

  const deleteButtonStyle = {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  };

  const deleteButtonHoverStyle = {
    backgroundColor: "#e60000",
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "21px",
  };

  return (
    <div style={containerStyle}>
      <h1>Your Songs</h1>
      {songs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No songs found.</p>
      ) : (
        <div style={gridStyle}>
          {songs.map((song, index) => (
            <div key={index} style={cardStyle}>
              <div style={songInfoStyle}>
                <h3>
                  {song.title} {musicIcon}
                </h3>
                <p>Duration: {song.duration}</p>
                <p>Created: {song.created}</p>
              </div>
              <button
                style={deleteButtonStyle}
                onClick={() => handleDelete(song.title)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor =
                    deleteButtonHoverStyle.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor =
                    deleteButtonStyle.backgroundColor)
                }
              >
                Delete
              </button>
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
