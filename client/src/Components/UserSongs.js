import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const musicIcon = "🎵";

const MidiPlayer = ({ midiUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (window.MIDI) {
      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onsuccess: () => {
          console.log("MIDI.js loaded successfully");
        },
      });
    }
  }, []);

  const handlePlay = async () => {
    try {
      setIsPlaying(true);
      const response = await fetch(midiUrl);
      const arrayBuffer = await response.arrayBuffer();
      MIDI.Player.loadFile(arrayBuffer, () => {
        MIDI.Player.start();
      });
    } catch (error) {
      console.error("Error playing MIDI file:", error);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    MIDI.Player.stop();
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        style={{
          backgroundColor: isPlaying ? "#ff4d4d" : "#28a745",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          marginRight: "10px",
        }}
      >
        {isPlaying ? "Stop MIDI" : "Play MIDI"}
      </button>
    </div>
  );
};

const UserSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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
          credentials: "include",
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

              {/* MIDI Player */}
              <MidiPlayer midiUrl={song.midi_presigned_url} />

              {/* PDF Viewer in iframe */}
              <iframe
                src={song.sheet_music_presigned_url}
                title={`Sheet Music ${song.id}`}
                style={{
                  width: "100%",
                  height: "300px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  border: "1px solid #555",
                }}
                onError={(e) => {
                  console.error(`Failed to load PDF: ${song.sheet_music_presigned_url}`);
                  e.target.parentNode.innerHTML = `<p style="color: red;">Failed to load sheet music.</p>`;
                }}
              ></iframe>

              <p style={{ fontSize: "14px", color: "#aaa", marginTop: "10px" }}>
                Created At: {new Date(song.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSongs;
