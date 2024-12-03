import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const musicIcon = "🎵";

const UserSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure the user is logged in
    if (!user) {
      setError("User is not logged in. Redirecting...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      return;
    }

    const fetchSongs = async () => {
      try {
        const response = await fetch(`/songs?user_id=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include HttpOnly token cookie
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Your session has expired. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
            return;
          }
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch songs.");
          return;
        }

        const data = await response.json();
        setSongs(data.songs);
      } catch (error) {
        setError("An error occurred while fetching songs.");
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user, navigate]);

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
