import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make POST request to Flask backend for signup
      const response = await axios.post('/auth/signup', {
        username,
        email,
        password,
      });

      // Check and utilize the response data
      if (response.status === 201) {
        console.log('Response data:', response.data);
        setUsername('');
        setEmail('');
        setPassword('');
        setSuccessMessage(response.data.message || 'Account created successfully!');
        setErrorMessage(''); // Clear any previous error message
        navigate("/create-melody");
        
      } else {
        console.log('Unexpected status:', response.status);
        setErrorMessage('Unexpected response from the server.');
      }
    } catch (error) {
      // Handle errors (e.g., user already exists)
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'An error occurred during sign up.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      setSuccessMessage(''); // Clear success message on error
    }
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
            By creating an account, you can save any generated melodies.
          </Typography>

          {/* Show success message */}
          {successMessage && (
            <Typography color="primary" variant="subtitle2">
              {successMessage}
            </Typography>
          )}

          {/* Show error message */}
          {errorMessage && (
            <Typography color="error" variant="subtitle2">
              {errorMessage}
            </Typography>
          )}

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
              label="Enter Email"
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
            backgroundImage: 'url(/RockerImg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SignupForm;
