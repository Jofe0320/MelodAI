import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle the sign-up logic here, including making a request to your Flask backend
    console.log('SignUp:', { username, email, password });
  };

  return (
    <Grid container style={{ height: '100vh' }}>
      {/* Left Side: Sign-Up Form */}
      <Grid
        item
        xs={12}
        md={6}
        container
        alignItems="center"
        justifyContent="center"
        style={{ padding: '2rem', backgroundColor: '#f4f4f4' }}
      >
        <Box style={{ maxWidth: '400px', width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            By creating an account you can save any generated melodies.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Enter Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Enter email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Enter Password"
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
              SignUp
            </Button>
          </form>
        </Box>
      </Grid>

      {/* Right Side: Background Image */}
      <Grid item xs={12} md={6}>
        <Box
          style={{
            height: '100%',
            backgroundImage: 'url(/RockerImg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SignupForm;
