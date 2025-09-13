import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserBySsoId } from '../util/users-data';

function Login() {
  const [ssoid, setSsoid] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(getUserBySsoId(ssoid) !== null){
      localStorage.setItem('user', JSON.stringify(getUserBySsoId(ssoid)));
      navigate('/welcome');
    }else {
      setError('Invalid credentials. Try any other SSO Id from 2345678901 for trainee or 1234567890 for trainer');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#003DA5' }}>
          Synchrony Agent Training Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to access your training platform
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="SSO Id"
          value={ssoid}
          onChange={(e) => setSsoid(e.target.value)}
          autoComplete="ssoid"
          autoFocus
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 3, 
            mb: 2,
            background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
          }}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
