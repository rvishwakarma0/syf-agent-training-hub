// components/Layout/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Analytics as AnalyticsIcon,
  Assignment as PromptIcon,
  School as TpodIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { School as SchoolIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

import { useUser } from '../../context/UserContext';

const DRAWER_WIDTH = 280;

// Update the chat label in menuConfig:
const menuConfig = {
  admin: [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/chat', label: 'Synchrony Chat', icon: ChatIcon }, // ✅ Updated
    { path: '/analytics', label: 'Analytics', icon: AnalyticsIcon },
    { path: '/prompts', label: 'Prompts', icon: PromptIcon },
    { path: '/tpods', label: 'Training Pods', icon: TpodIcon },
    { path: '/profile', label: 'Profile', icon: ProfileIcon },
    { path: '/training-center', label: 'Training Center', icon: SchoolIcon },
    { path: '/performance', label: 'Performance', icon: TrendingUpIcon }
  ],
  trainee: [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/chat', label: 'Synchrony Chat', icon: ChatIcon }, // ✅ Updated
    { path: '/profile', label: 'Profile', icon: ProfileIcon },
    { path: '/training-center', label: 'Training Center', icon: SchoolIcon },
    { path: '/performance', label: 'Performance', icon: TrendingUpIcon }
  ],
  user: [
    { path: '/chat', label: 'Synchrony Chat', icon: ChatIcon }, // ✅ Updated
    { path: '/profile', label: 'Profile', icon: ProfileIcon },
  ]
};


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // Get menu items based on user role
  const menuItems = menuConfig[user?.role] || menuConfig.user;

  const handleItemClick = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
          color: 'white',
        },
      }}
    >

      {/* Header - UPDATE THIS PART */}
      <Box sx={{ p: 1, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          SYNCHRONY
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
          Role: {user?.role}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <Icon sx={{ color: isActive ? '#FFD100' : 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      color: isActive ? '#FFD100' : 'white',
                      fontWeight: isActive ? 600 : 400,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
