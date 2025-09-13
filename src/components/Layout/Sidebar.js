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
  Chip,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  AccessTime,
  Assignment as AssignmentIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 80;

function Sidebar({ open, onToggle }) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role'); // e.g., 'admin'
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useApp();

  const menuItemsAdmin = [
    {
      text: 'Welcome',
      icon: <HomeIcon />,
      path: '/welcome?role=admin',
      badge: null,
    },
    {
      text: 'Batches',
      icon: <DashboardIcon />,
      path: '/dashboard?role=admin',
      badge: state.analytics.activeTraining > 0 ? state.analytics.activeTraining : null,
    },
    {
      text: 'Prompt Management',
      icon: <AssignmentIcon />,
      path: '/prompts',
      badge: null,
    },
    {
      text: 'Scenario Engines',
      icon: <AccessTime />,
      path: '/scenario-engines?role=admin',
      badge: null,
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics?role=admin',
      badge: null,
    },
    {
      text: 'Voice Input Demo',
      icon: <MicIcon />,
      path: '/voice-demo',
      badge: 'NEW',
    },
    {
      text: 'Voice Chat',
      icon: <MicIcon />,
      path: '/voice-chat',
      badge: 'NEW',
    },
    {
      text: 'Voice Chat',
      icon: <MicIcon />,
      path: '/voice-chat',
      badge: 'BETA',
    },
    {
      text: 'Nova Sonic Chat',
      icon: <MicIcon />,
      path: '/nova-sonic-chat',
      badge: 'AI',
    },
  ];

  const menuItemsTrainee = [
    {
      text: 'Welcome',
      icon: <HomeIcon />,
      path: '/welcome?role=trainee',
      badge: null,
    },
    {
      text: 'Training Center',
      icon: <SchoolIcon />,
      path: '/training-center?role=trainee',
      badge: 'NEW',
    },
    {
      text: 'Performance',
      icon: <TrendingUpIcon />,
      path: '/performance?role=trainee',
      badge: null,
    },
  ];

  const bottomMenuItems = [
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
    {
      text: 'Help & Support',
      icon: <HelpIcon />,
      path: '/help',
    },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    // Remove query parameters for comparison
    const currentPath = location.pathname;
    const targetPath = path.split('?')[0];
    return currentPath === targetPath;
  };

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          borderBottom: '1px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#003DA5',
                fontSize: '1rem',
              }}
            >
              Navigation
            </Typography>
          </motion.div>
        )}

        <IconButton
          onClick={onToggle}
          sx={{
            color: '#003DA5',
            '&:hover': {
              backgroundColor: 'rgba(0, 61, 165, 0.1)',
            },
          }}
        >
          <ChevronLeftIcon
            sx={{
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* Main Menu */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {(role === 'admin' ? menuItemsAdmin : menuItemsTrainee).map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  onClick={() => handleItemClick(item.path)}
                  selected={isActiveRoute(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#FFD100',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 61, 165, 0.08)',
                    },
                    justifyContent: open ? 'initial' : 'center',
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActiveRoute(item.path) ? '#FFD100' : '#003DA5',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActiveRoute(item.path) ? 600 : 500,
                          fontSize: '0.9rem',
                        },
                      }}
                    />
                  )}

                  {open && item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: typeof item.badge === 'number' ? '#FFD100' : '#28a745',
                        color: typeof item.badge === 'number' ? '#003DA5' : 'white',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      {/* Bottom Menu */}
      <Box>
        <Divider sx={{ mx: 2 }} />
        <List sx={{ px: 1, py: 1 }}>
          {bottomMenuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={isActiveRoute(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 61, 165, 0.1)',
                    color: '#003DA5',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 61, 165, 0.05)',
                  },
                  justifyContent: open ? 'initial' : 'center',
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: '#6c757d',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.85rem',
                        color: '#6c757d',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Box
            sx={{
              p: 2,
              textAlign: 'center',
              borderTop: '1px solid #e9ecef',
              backgroundColor: '#f8f9fa',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#6c757d',
                fontSize: '0.7rem',
              }}
            >
              © 2025 Synchrony Financial
            </Typography>
          </Box>
        </motion.div>
      )}
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            borderRight: '1px solid #e9ecef',
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
          },
        }}
        open={open}
      >
        <Box sx={{ mt: 8 }}>
          <SidebarContent />
        </Box>
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
          },
        }}
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ mt: 8 }}>
          <SidebarContent />
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
