import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { Grid, TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/auth/login', {
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

        // Redirect to the /edit-profile page
        navigate('/create-melody');
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
      <Grid
        item
        xs={12}
        md={6}
        style={{
          backgroundImage: 'url(/GuitarImageLogIn.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
          backgroundRepeat: 'no-repeat',
        }}
      />

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
              style={{ marginTop: '1rem', backgroundColor: '#000' }}
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
