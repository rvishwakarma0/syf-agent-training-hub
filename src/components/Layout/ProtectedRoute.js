
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useUser } from '../../context/UserContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated, loading } = useUser();

  // Debug logs
  console.log('ProtectedRoute Debug:', { user, isAuthenticated, requiredRoles, loading });

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    console.log('Role not authorized:', user.role, 'Required:', requiredRoles);
    return <Navigate to="/login" replace />;
  }

  console.log('User authorized, rendering children');
  return children;
};

export default ProtectedRoute;
