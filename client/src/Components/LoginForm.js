import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../AuthProvider';

const Login = () => {
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended route from state or set a default route
  const from = location.state?.from?.pathname || '/create-melody';

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
        console.log('Login successful:', data);
        login(data)
        // Redirect to the intended route
        navigate(from, { replace: true });
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
