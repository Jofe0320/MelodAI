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
        const userId = localStorage.getItem("user_id"); // Get user_id (ensure this is stored or fetched)
        if (!userId || !token) {
          alert("User ID or token is missing. Please log in again.");
          return;
        }

        const response = await fetch(`/songs?user_id=${userId}`, {
          headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include token for authentication
        },
        });

        if (response.ok) {
          const data = await response.json();
          setSongs(data.songs); // Update to match the backend response structure
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch songs:", errorData.message);
          alert(errorData.message || "Could not load songs. Please try again.");
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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/songs/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert("Song deleted successfully.");
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete the song.");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      alert("An error occurred while deleting the song.");
    }
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
    marginTop: "20px",
  };

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

              {/* Delete Button */}
              <button
                style={deleteButtonStyle}
                onClick={() => handleDelete(song.id)}
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
