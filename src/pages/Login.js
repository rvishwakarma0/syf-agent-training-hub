// pages/Login.js - FIXED VERSION
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import { getUserBySsoId } from '../util/users-data';

function Login() {
  const [ssoid, setSsoid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ USE UserContext login method
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = getUserBySsoId(ssoid);

      if (userData) {
        // ✅ Format data correctly for UserContext
        const formattedUser = {
          id: userData['sso-id'],
          name: userData.name,
          email: `${userData.name.toLowerCase().replace(' ', '.')}@synchrony.com`,
          role: userData.role === 'trainer' ? 'admin' : userData.role, // Map trainer -> admin
        };

        // ✅ Use UserContext login method (it handles navigation internally)
        const result = login(formattedUser);

        if (!result.success) {
          setError('Login failed. Please try again.');
        }
        // Navigation is handled automatically by UserContext login method

      } else {
        setError('Invalid credentials. Try SSO ID: 1234567890 (admin) or 2345678901 (trainee)');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" gutterBottom sx={{ color: '#003DA5', fontWeight: 700 }}>
              SYNCHRONY AGENT TRAINING HUB
            </Typography>
            <Typography variant="h6" color="textSecondary">
              AI Training Hub

            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Empowering Customer Success Through AI-Driven Training
            </Typography>
            <Typography variant="body3" color="textSecondary" sx={{ mt: 1 }}>
              Sign in to access your training platform
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="ssoid"
              label="SSO ID"
              name="ssoid"
              value={ssoid}
              onChange={(e) => setSsoid(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !ssoid.trim()}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary" textAlign="center">
                <strong>Demo Credentials:</strong><br />
                Admin: 1234567890<br />
                Trainee: 2345678901
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
