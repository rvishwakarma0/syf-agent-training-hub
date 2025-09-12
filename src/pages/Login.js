import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple demo authentication
    if (email === 'admin@synchrony.com' && password === 'admin') {
      navigate('/welcome?role=admin');
    } else if (email === 'trainee@synchrony.com' && password === 'trainee') {
      navigate('/welcome?role=trainee');
    } else {
      setError('Invalid credentials. Try admin@synchrony.com/admin or trainee@synchrony.com/trainee');
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
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          autoFocus
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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

        <Alert severity="info">
          <strong>Demo Credentials:</strong><br />
          Admin: admin@synchrony.com / admin<br />
          Trainee: trainee@synchrony.com / trainee
        </Alert>
      </Box>
    </Container>
  );
}

export default Login;
