import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  School as SchoolIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

function Header({ onSidebarToggle }) {
  const { state, actions } = useApp();

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleLogout = () => {
    actions.logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
        boxShadow: '0 2px 20px rgba(0, 61, 165, 0.15)',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Menu Toggle */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onSidebarToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SchoolIcon
              sx={{
                fontSize: 32,
                color: '#FFD100',
                mr: 2,
              }}
            />
          </motion.div>

          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: '#FFD100',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                lineHeight: 1.2,
              }}
            >
              SYNCHRONY AGENT TRAINING HUB
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.75rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Empowering Customer Success Through AI-Driven Training
            </Typography>
          </Box>
        </Box>

        {/* Status Indicators */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mr: 2,
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFD100', fontWeight: 600 }}>
                {state.analytics.activeTraining}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Training
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFD100', fontWeight: 600 }}>
                {state.analytics.totalAgents}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Total Agents
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFD100', fontWeight: 600 }}>
                {state.analytics.averageEmpathyScore.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Avg Score
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Notifications */}
        <IconButton color="inherit" onClick={handleNotificationClick} sx={{ mr: 1 }}>
          <Badge
            badgeContent={state.notifications.length}
            color="secondary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#FFD100',
                color: '#003DA5',
                fontWeight: 600,
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Button
          color="inherit"
          onClick={handleProfileClick}
          startIcon={<AccountCircle />}
          sx={{
            textTransform: 'none',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {state.user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {state.user.role}
            </Typography>
          </Box>
        </Button>

        {/* Logout Button */}
        {state.user.authenticated && (
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2, textTransform: 'none' }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
