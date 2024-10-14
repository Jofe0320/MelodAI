import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If login is successful, store the token in localStorage
        localStorage.setItem('token', data.token);
        console.log('Login successful:', data);
        // Optionally, redirect the user to a different page after login
      } else {
        console.error('Login failed:', data.message);
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <Grid container style={{ height: '100vh' }}>
      {/* Left column with image */}
      <Grid item xs={12} md={6}   style={{
    backgroundImage: 'url(/GuitarImageLogIn.webp)', 
    backgroundSize: 'cover',  // Ensures the image covers the entire area
    backgroundPosition: 'center',  // Centers the image
    height: '100%',  // Makes sure the height fills the entire view
    backgroundRepeat: 'no-repeat',  // Prevents any repeat of the image
  }}>
        {/* You can replace the image URL above with your guitar image */}
      </Grid>

      {/* Right column with login form */}
      <Grid
        item
        xs={12}
        md={6}
        container
        alignItems="center"
        justifyContent="center"
        style={{ padding: '2rem' }}
      >
        <Box style={{ maxWidth: '400px', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            LogIn
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Stay tuned for updates
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Enter your email here"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem', backgroundColor: '#000' }}  // To match your black button style
            >
              Login
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
