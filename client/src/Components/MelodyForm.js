import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function MelodyForm() {
  const [tempo, setTempo] = useState(120);
  const [key, setKey] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);  // Store the audio file URL
  const [generated, setGenerated] = useState(false);  // Track whether "Generate" was clicked
  const [sheetMusicUrl, setSheetMusicUrl] = useState(null);  // Store sheet music PDF URL

  const handleGenerate = () => {
    const generatedAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Example MP3 URL
    const generatedSheetMusicUrl = "/sample-sheet-music.pdf"; // Local PDF URL in public folder

    setAudioUrl(generatedAudioUrl);
    setSheetMusicUrl(generatedSheetMusicUrl);  // Set the sheet music URL
    setGenerated(true);  // Show the audio controls and sheet music
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',  // Full viewport height for vertical centering
        backgroundColor: '#f4f4f4', // Light background for better contrast
        backgroundImage: 'url(/musicstudio.webp)',  // Set your image path
        backgroundSize: 'cover', // Cover the full area
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Prevent repeating
      }}
    >
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 700,  // Increased the maxWidth to make the form wider
          padding: 3,  // Increased padding for better spacing
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Create Melody
        </Typography>
        
        {/* Tempo Input */}
        <TextField
          label="Tempo (BPM)"
          type="number"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          sx={{ marginBottom: 2 }}
          fullWidth
        />

        {/* Key Select Input */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Key</InputLabel>
          <Select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            label="Key"
          >
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="C#">C#</MenuItem>
            <MenuItem value="D">D</MenuItem>
            <MenuItem value="D#">D#</MenuItem>
            <MenuItem value="E">E</MenuItem>
            <MenuItem value="F">F</MenuItem>
            <MenuItem value="F#">F#</MenuItem>
            <MenuItem value="G">G</MenuItem>
            <MenuItem value="G#">G#</MenuItem>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="A#">A#</MenuItem>
            <MenuItem value="B">B</MenuItem>
          </Select>
        </FormControl>

        {/* Generate Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          Generate
        </Button>

        {/* Audio Player with Built-in Controls */}
        {generated && (
          <>
            <audio id="audio-player" controls style={{ width: '100%', marginBottom: 16 }}>
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>

            {/* Display PDF as Sheet Music */}
            <iframe
              src={sheetMusicUrl}
              width="100%"
              height="700px"  // Increased height of the sheet music display
              style={{
                border: '1px solid #ddd',
                borderRadius: 4,
                marginTop: 16,
              }}
              title="Sheet Music"
            ></iframe>
          </>
        )}

        {/* Placeholder for Sheet Music */}
        {!generated && (
          <Typography variant="body1" sx={{ marginTop: 2, textAlign: 'center' }}>
            Sheet music will display here after generation.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default MelodyForm;
