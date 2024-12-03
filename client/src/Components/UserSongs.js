import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";

const musicIcon = "🎵";

const UserSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Use global user state from AuthProvider

  useEffect(() => {
    // Ensure the user is logged in
    if (!user) {
      setError("User is not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          setError("Authentication token is missing. Please log in again.");
          return;
        }

        const response = await fetch(`/songs?user_id=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            setError("Your session has expired. Please log in again.");
            return;
          }
          const errorData = await response.json();
          setError(errorData.message || "Could not load songs. Please try again.");
          return;
        }

        const data = await response.json();
        setSongs(data.songs); // Update with backend response
      } catch (err) {
        setError("An error occurred while loading songs. Please try again later.");
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user]); // Re-run if the user context changes

  if (loading) {
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading songs...</h2>;
  }

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", color: "white" }}>
      <h1>Your Songs</h1>
      {songs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No songs found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {songs.map((song) => (
            <div key={song.id} style={{ backgroundColor: "#333", padding: "20px", borderRadius: "8px" }}>
              <h3>
                {musicIcon} Song ID: {song.id}
              </h3>
              <p>User ID: {song.user_id}</p>
              <audio controls>
                <source src={song.midi_link} type="audio/midi" />
                Your browser does not support the audio element.
              </audio>
              <iframe
                src={song.sheet_music_link}
                title={`Sheet Music ${song.id}`}
                style={{ width: "100%", height: "300px", marginTop: "10px", borderRadius: "8px" }}
              />
              <p>Created At: {song.created_at}</p>
            </div>
          ))}
        </div>
      )}
      <footer style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Total songs: {songs.length}</p>
      </footer>
    </div>
  );
};

export default UserSongs;
