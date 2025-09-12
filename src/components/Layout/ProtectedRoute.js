import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, requiredRoles = [], allowUnauthenticated = false }) => {
  const location = useLocation();
  
  // For now, always allow access (you can enhance this later)
  return children;
};

// Access Denied Component
const AccessDenied = ({ userRole, requiredRoles }) => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ py: 8 }}>
          <Typography variant="h1" sx={{ fontSize: '6rem', color: '#003DA5', fontWeight: 700 }}>
            403
          </Typography>
          
          <Typography variant="h4" sx={{ color: '#003DA5', fontWeight: 600, mb: 2 }}>
            Access Denied
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#6c757d', mb: 4 }}>
            You don't have permission to access this page.
          </Typography>

          <Alert severity="warning" sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Need access?</strong>
              <br />• Contact your administrator to request proper permissions
              <br />• Ensure you're logged in with the correct account
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: '#003DA5',
                color: '#003DA5',
              }}
            >
              Go Back
            </Button>
            
            <Button
              variant="contained"
              onClick={() => navigate('/welcome')}
              sx={{
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
              }}
            >
              Go to Welcome
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ProtectedRoute;
