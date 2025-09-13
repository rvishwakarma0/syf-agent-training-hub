// components/Layout/Header.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useUser } from '../../context/UserContext';

function Header() {
  const { user, logout } = useUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
      }}
    >
      <Toolbar>
        {/* ✅ Updated App Title with Tagline */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            SYNCHRONY AGENT TRAINING HUB
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white', 
              opacity: 0.8, 
              fontSize: '0.75rem',
              marginTop: 0.5
            }}
          >
            Empowering Customer Success Through AI-Driven Training
          </Typography>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
          <Avatar sx={{ bgcolor: '#FFD100', color: '#003DA5' }}>
            <AccountCircle />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'white' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#FFD100',
            },
          }}
          variant="outlined"
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
