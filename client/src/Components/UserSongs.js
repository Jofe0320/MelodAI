import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const musicIcon = "🎵";

const UserSongs = () => {
  const [songs, setSongs] = useState([]); // List of songs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [audioSources, setAudioSources] = useState({}); // State to track audio sources for each song
  const { user } = useAuth(); // Get authenticated user
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the user is not logged in
    if (!user) {
      setError("User is not logged in. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchSongs = async () => {
      try {
        const response = await fetch(`/songs?user_id=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include session cookies
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Your session has expired. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
            return;
          }
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch songs.");
          return;
        }

        const data = await response.json();
        console.log("Fetched songs:", data.songs); // Debug log for fetched songs
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

  const playSong = async (midiUrl, songId) => {
    try {
      // Fetch the MIDI file using the presigned URL
      const midiResponse = await fetch(midiUrl);
      if (!midiResponse.ok) {
        console.error("Failed to fetch MIDI file.");
        return;
      }

      const midiBlob = await midiResponse.blob();

      // Create FormData to send to the /convert endpoint
      const formData = new FormData();
      formData.append("file", midiBlob, "song.mid");

      // Send the MIDI file to the /convert endpoint
      const response = await fetch("/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to convert MIDI to MP3.");
        return;
      }

      // Get the MP3 file and update the audio source
      const mp3Blob = await response.blob();
      const mp3Url = URL.createObjectURL(mp3Blob);

      // Update the audio source for the specific song
      setAudioSources((prevSources) => ({
        ...prevSources,
        [songId]: mp3Url,
      }));
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

              {/* Audio Player */}
              <audio
                controls
                style={{ width: "100%", marginBottom: "10px" }}
                src={audioSources[song.id]} // Use the song-specific audio source
                onPlay={() => {
                  if (!audioSources[song.id]) playSong(song.midi_presigned_url, song.id);
                }}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  console.error("Failed to load audio.");
                }}
              >
                Your browser does not support the audio element.
              </audio>

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
