import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Header from './header';  // Adjust path if needed

function MelodyForm() {
  const [tempo, setTempo] = useState(120);
  const [key, setKey] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [sheetMusicUrl, setSheetMusicUrl] = useState(null);

  const handleGenerate = () => {
    const generatedAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Example MP3 URL
    const generatedSheetMusicUrl = "/sample-sheet-music.pdf"; // Local PDF URL in public folder

    setAudioUrl(generatedAudioUrl);
    setSheetMusicUrl(generatedSheetMusicUrl);
    setGenerated(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Render Header at the top */}
      <Header />

      {/* Main content area to center the form */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          backgroundColor: '#f4f4f4',
          backgroundImage: 'url(/musicstudio.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
            maxWidth: 700,
            padding: 3,
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: 4, // Increase margin when generated is true
            transition: 'margin-top 0.3s ease-in-out', // Smooth transition for margin change
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
            <Select value={key} onChange={(e) => setKey(e.target.value)} label="Key">
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((k) => (
                <MenuItem key={k} value={k}>{k}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Generate / Re-generate Button */}
          <Button variant="contained" color="primary" onClick={handleGenerate} fullWidth sx={{ marginBottom: 2 }}>
            {generated ? 'Re-generate' : 'Generate'}
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
                height="700px"
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
    </Box>
  );
}

export default MelodyForm;