import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const musicIcon = "🎵";

const UserSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingSong, setPlayingSong] = useState(null); // Stores the MP3 URL of the currently playing song
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
        console.log("Fetched songs:", data.songs); // Debug: Log fetched songs
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

  const playSong = async (midiUrl) => {
    try {
      // Fetch the MIDI file
      const midiResponse = await fetch(midiUrl);
      if (!midiResponse.ok) {
        console.error("Failed to fetch MIDI file.");
        return;
      }

      const midiBlob = await midiResponse.blob();

      // Create FormData to send to the /convert endpoint
      const formData = new FormData();
      formData.append("file", midiBlob, "song.mid");

      // Send MIDI file to /convert
      const response = await fetch("/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to convert MIDI to MP3.");
        return;
      }

      // Get MP3 file and play it
      const mp3Blob = await response.blob();
      const mp3Url = URL.createObjectURL(mp3Blob);
      setPlayingSong(mp3Url); // Set MP3 URL to play the song
    } catch (error) {
      console.error("Error converting MIDI to MP3:", error);
    }
  };

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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Your Songs</h1>
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
            <div
              key={song.id}
              style={{
                backgroundColor: "#222",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#fff",
              }}
            >
              <h3 style={{ color: "#FFD700", marginBottom: "10px" }}>
                {musicIcon} Song ID: {song.id}
              </h3>

              <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                <span style={{ color: "#aaa" }}>Uploaded by:</span> {user.username}
              </p>

              {/* Play Button */}
              <button
                onClick={() => playSong(song.midi_presigned_url)}
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Play Song
              </button>

              {/* Audio Player */}
              {playingSong && (
                <audio controls autoPlay style={{ width: "100%" }}>
                  <source src={playingSong} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Download PDF Button */}
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = song.sheet_music_presigned_url;
                  link.download = `Song_${song.id}_SheetMusic.pdf`;
                  link.click();
                }}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  color: "#fff",
                  backgroundColor: "#007bff",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  textAlign: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Download Sheet Music
              </button>

              <p style={{ fontSize: "14px", color: "#aaa", marginTop: "10px" }}>
                Created At: {new Date(song.created_at).toLocaleString()}
              </p>
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
