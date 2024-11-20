import React from "react";

// Song data
const songs = [
  { title: "My First Song", duration: "3:45", created: "2023-05-15" },
  { title: "Summer Vibes", duration: "4:20", created: "2023-06-01" },
  { title: "Rainy Day Blues", duration: "5:10", created: "2023-06-15" },
  { title: "Midnight Melody", duration: "3:30", created: "2023-07-01" },
  { title: "Acoustic Dreams", duration: "2:55", created: "2023-07-05" },
  { title: "Electric Sunset", duration: "4:10", created: "2023-07-10" },
  { title: "Jazz Fusion", duration: "6:20", created: "2023-07-15" },
  { title: "Rock Anthem", duration: "3:50", created: "2023-07-20" },
  { title: "Rock Anthem", duration: "3:50", created: "2023-07-20" },
];

const UserSongs = () => {
  const handleDelete = (title) => {
    alert(`Deleted ${title}`);
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = "black";
    document.body.style.margin = "0";
  }, []);

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

  const addButtonStyle = {
    margin: "20px auto",
    display: "block",
    padding: "10px 20px",
    backgroundColor: "white",
    color: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const musicIcon = "🎵"; // Unicode music note
  const trashIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      fill="white"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
    </svg>
  );

  return (
    <div style={containerStyle}>
      <h1>Your Songs</h1>
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
              {trashIcon} Delete
            </button>
          </div>
        ))}
      </div>
      <div style={footerStyle}>
        <p>Total songs: {songs.length}</p>
      </div>
      <button style={addButtonStyle}>+ Add New Song</button>
    </div>
  );
};

export default UserSongs;
