import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Header from './header';  // Adjust path if needed
import {useAuth} from'../AuthProvider'
import CircularProgress from '@mui/material/CircularProgress';

function MelodyForm() {
  const [tempo, setTempo] = useState(120);
  const [key, setKey] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [sheetMusicUrl, setSheetMusicUrl] = useState(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false); // Loader for Generate
  const [loadingSave, setLoadingSave] = useState(false); // Loader for Save
  const [saved, setSaved] = useState(false);
  const [midiBlob, setMidiBlob] = useState(null);

  const { user } = useAuth();
  // Log the user whenever the component renders or user changes
  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const handleGenerate = async () => {
    setGenerated(false); // Reset the generated state
    setAudioUrl(null);
    setSheetMusicUrl(null);
    setLoadingGenerate(true);
    setSaved(false); // Reset saved state
  
    try {
      // Step 1: Generate MIDI
      const generateResponse = await fetch("/api/generate_melody", { method: "GET" });
      if (!generateResponse.ok) throw new Error("Failed to generate MIDI");
  
      // Store the generated MIDI file as a Blob
      const midiBlob = await generateResponse.blob();
      setMidiBlob(midiBlob);
      // Create a File object for the MIDI file
      const midiFile = new File([midiBlob], "generated_melody.mid", { type: "audio/midi" });
      // Step 2: Convert MIDI to MP3
      const mp3FormData = new FormData();
      mp3FormData.append("file", midiFile);
  
      const mp3Response = await fetch("/api/convert", {
        method: "POST",
        body: mp3FormData,
      });
      if (!mp3Response.ok) throw new Error("Failed to convert MIDI to MP3");
  
      const mp3Blob = await mp3Response.blob();
      const mp3Url = URL.createObjectURL(mp3Blob);
      setAudioUrl(mp3Url);
  
      // Step 3: Convert MIDI to Sheet Music PDF
      const pdfFormData = new FormData();
      pdfFormData.append("file", midiFile);
  
      const pdfResponse = await fetch("/api/generate_pdf", {
        method: "POST",
        body: pdfFormData,
      });
      if (!pdfResponse.ok) throw new Error("Failed to convert MIDI to PDF");
  
      const pdfBlob = await pdfResponse.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setSheetMusicUrl(pdfUrl);
  
      // Set the generated state to true
      setGenerated(true);
    } catch (error) {
      console.error("Error during melody generation:", error);
      alert("An error occurred: " + error.message);
    } finally {
      setLoadingGenerate(false); // Stop the Generate loader
    }
  
  };

  const handleSaveFavorite = async () => {
    if (!audioUrl || !sheetMusicUrl || !user) {
      alert("Please generate a melody first or ensure you're logged in.");
      return;
    }

    setLoadingSave(true); // Start the Save loader

    try {
      const formData = new FormData();
  
      // Add user ID
      formData.append("user_id", user.id);
  
      // Add MIDI file with correct file name
      //const midiFile = new File([midiBlob], "generated_melody.mid", { type: "audio/midi" });
      formData.append("midi", midiBlob);
  
      // Add Sheet Music file with correct file name
      const pdfBlob = await fetch(sheetMusicUrl).then((res) => res.blob());
      const pdfFile = new File([pdfBlob], "sheet_music.pdf", { type: "application/pdf" });
      formData.append("sheet_music", pdfFile);
  
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to save the song");
      }
  
      const data = await response.json();
      alert(data.message || "Song saved successfully!");
      setSaved(true); // Mark the melody as saved
    } catch (error) {
      console.error("Error saving song:", error);
      alert("An error occurred while saving the song.");
    } finally {
      setLoadingSave(false); // Stop the Save loader
    }
  };
  
  
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Render Header at the top */}
      <Header user={user?.username || "Guest"} /> 
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
          {/* Generate / Re-generate Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerate}
            fullWidth
            disabled={loadingGenerate || loadingSave} // Disable during any loading
            sx={{ marginBottom: 2 }}
          >
            {loadingGenerate ? <CircularProgress size={24} color="inherit" /> : (generated ? 'Re-generate' : 'Generate')}
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

          {/* Favorite Button */}
          {generated && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSaveFavorite}
              fullWidth
              disabled={loadingGenerate || loadingSave || saved} // Disable during any loading
              sx={{ marginTop: 2 }}
            >
              {loadingSave ? <CircularProgress size={24} color="inherit" /> : 'Save as Favorite'}
            </Button>
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