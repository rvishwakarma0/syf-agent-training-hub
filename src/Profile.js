// pages/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Avatar,
  Divider,
  Alert,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useApp } from '../context/AppContext';

function Profile() {
  const { user } = useUser();
  const { state } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  // Get user's training statistics (if they are a trainee)
  const getUserStats = () => {
    if (user?.role === 'trainee') {
      // Mock stats for trainee users
      return {
        totalSessions: 45,
        averageScore: 87,
        improvementRate: 15,
        lastSession: '2 hours ago',
        nextGoal: 'Complete 50 training sessions',
        badges: ['Quick Learner', 'Empathy Expert', 'Problem Solver']
      };
    } else {
      // Stats for admin users
      return {
        totalAgentsManaged: state.analytics.totalAgents,
        averageTeamScore: state.analytics.averageEmpathyScore,
        sessionsToday: state.analytics.totalSessionsToday,
        lastActivity: 'Managing dashboard',
        nextGoal: 'Improve team average to 90%',
        badges: ['Team Leader', 'Training Expert', 'Analytics Pro']
      };
    }
  };

  const userStats = getUserStats();

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving profile data:', editData);
    
    // Mock save success
    setSaveMessage('Profile updated successfully!');
    setIsEditing(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#003DA5' }}>
            My Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your account information and view your training progress
          </Typography>
        </Box>

        {/* Success Message */}
        {saveMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {saveMessage}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#003DA5',
                      fontSize: '2rem',
                      mr: 3
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {user?.name || 'User'}
                    </Typography>
                    <Chip 
                      label={user?.role?.toUpperCase() || 'USER'} 
                      color="primary" 
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                    onClick={isEditing ? handleCancel : handleEdit}
                    sx={{
                      background: isEditing ? 'transparent' : 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                    }}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Profile Fields */}
                <Box sx={{ space: 2 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Full Name
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body1">{user?.name || 'Not provided'}</Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Email Address
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        variant="outlined"
                        size="small"
                        type="email"
                      />
                    ) : (
                      <Typography variant="body1">{user?.email || 'Not provided'}</Typography>
                    )}
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Role
                    </Typography>
                    <Typography variant="body1">{user?.role || 'Not assigned'}</Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {user?.id || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>

                {/* Save Button */}
                {isEditing && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      fullWidth
                      sx={{
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Statistics & Activity */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {/* Quick Stats */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
                      {user?.role === 'admin' ? 'Management Overview' : 'Training Progress'}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" sx={{ color: '#003DA5', fontWeight: 700 }}>
                            {user?.role === 'admin' ? userStats.totalAgentsManaged : userStats.totalSessions}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user?.role === 'admin' ? 'Agents Managed' : 'Training Sessions'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" sx={{ color: '#FFD100', fontWeight: 700 }}>
                            {user?.role === 'admin' 
                              ? `${userStats.averageTeamScore.toFixed(1)}%` 
                              : `${userStats.averageScore}%`
                            }
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user?.role === 'admin' ? 'Team Avg Score' : 'Personal Avg'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
                      Recent Activity
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={user?.role === 'admin' ? 'Dashboard Review' : 'Last Training Session'}
                          secondary={user?.role === 'admin' ? userStats.lastActivity : userStats.lastSession}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Next Goal"
                          secondary={userStats.nextGoal}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Achievements */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
                      Achievements
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userStats.badges.map((badge, index) => (
                        <Chip
                          key={index}
                          label={badge}
                          color="secondary"
                          variant="outlined"
                          icon={<BadgeIcon />}
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}

export default Profile;
