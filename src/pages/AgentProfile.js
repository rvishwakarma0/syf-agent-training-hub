import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

function AgentProfile() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [tabValue, setTabValue] = useState(0);

  const agent = state.agents.find(a => a.id === agentId);

  if (!agent) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Agent not found
        </Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStartTraining = () => {
    // This would trigger a scenario selection dialog
    actions.addNotification({
      type: 'info',
      title: 'Training Started',
      message: `Training session initiated for ${agent.name}`,
    });
  };

  // Generate mock performance data for charts
  const performanceData = [
    { day: 'Mon', score: 85, sessions: 3 },
    { day: 'Tue', score: 88, sessions: 4 },
    { day: 'Wed', score: 82, sessions: 2 },
    { day: 'Thu', score: 91, sessions: 5 },
    { day: 'Fri', score: 87, sessions: 3 },
    { day: 'Sat', score: 89, sessions: 2 },
    { day: 'Sun', score: 85, sessions: 1 },
  ];

  const skillsData = [
    { skill: 'Empathy Keywords', score: 92 },
    { skill: 'Active Listening', score: 88 },
    { skill: 'Problem Solving', score: 85 },
    { skill: 'Response Time', score: 78 },
    { skill: 'Professional Tone', score: 94 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'training': return '#28a745';
      case 'session': return '#FFD100';
      case 'available': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'training': return 'In Training';
      case 'session': return 'In Session';
      case 'available': return 'Available';
      default: return 'Unknown';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2, color: '#003DA5' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#003DA5',
              flexGrow: 1,
            }}
          >
            Agent Profile
          </Typography>
          {agent.status === 'available' && (
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={handleStartTraining}
              sx={{
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                },
              }}
            >
              Start Training
            </Button>
          )}
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Left Column - Agent Info */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Agent Overview Card */}
            <Card sx={{ mb: 3, p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '3rem',
                    background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                  }}
                >
                  {agent.avatar}
                </Avatar>
                
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#003DA5',
                  }}
                >
                  {agent.name}
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: '#6c757d',
                    mb: 2,
                  }}
                >
                  {agent.department} • {agent.level}
                </Typography>
                
                <Chip
                  label={getStatusLabel(agent.status)}
                  sx={{
                    backgroundColor: getStatusColor(agent.status),
                    color: agent.status === 'session' ? '#003DA5' : 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1,
                  }}
                />
              </Box>

              {/* Current Empathy Score */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Current Empathy Score
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#003DA5' }}>
                    {agent.empathyScore}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={agent.empathyScore}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#e9ecef',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #003DA5 0%, #FFD100 100%)',
                      borderRadius: 6,
                    },
                  }}
                />
              </Box>

              {/* Performance Metrics */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#003DA5' }}>
                      {agent.performance.averageScore}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Avg Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#28a745' }}>
                      {agent.performance.totalSessions}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                      Sessions
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Contact Information */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                Contact Information
              </Typography>
              
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EmailIcon sx={{ color: '#003DA5' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={agent.email}
                    primaryTypographyProps={{ variant: 'body2', color: '#6c757d' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#343a40' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhoneIcon sx={{ color: '#003DA5' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={agent.phone}
                    primaryTypographyProps={{ variant: 'body2', color: '#6c757d' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#343a40' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationIcon sx={{ color: '#003DA5' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={agent.location}
                    primaryTypographyProps={{ variant: 'body2', color: '#6c757d' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#343a40' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ScheduleIcon sx={{ color: '#003DA5' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Shift"
                    secondary={agent.shift}
                    primaryTypographyProps={{ variant: 'body2', color: '#6c757d' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#343a40' }}
                  />
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarIcon sx={{ color: '#003DA5' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Join Date"
                    secondary={new Date(agent.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    primaryTypographyProps={{ variant: 'body2', color: '#6c757d' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#343a40' }}
                  />
                </ListItem>
              </List>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Column - Detailed Information */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  sx={{
                    px: 3,
                    '& .MuiTab-root': {
                      fontWeight: 500,
                      textTransform: 'none',
                    },
                    '& .Mui-selected': {
                      color: '#003DA5',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#003DA5',
                    },
                  }}
                >
                  <Tab label="Performance Analytics" />
                  <Tab label="Recent Sessions" />
                  <Tab label="Skills Assessment" />
                </Tabs>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Performance Analytics Tab */}
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                      Weekly Performance Trend
                    </Typography>
                    
                    <Box sx={{ height: 300, mb: 4 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis dataKey="day" stroke="#6c757d" />
                          <YAxis stroke="#6c757d" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#003DA5" 
                            strokeWidth={3}
                            dot={{ fill: '#003DA5', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#FFD100', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#28a745' }}>
                            Strengths
                          </Typography>
                          <List dense>
                            {agent.performance.strengths.map((strength, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#28a745' }} />
                                </ListItemIcon>
                                <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, backgroundColor: '#fff3cd' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#856404' }}>
                            Areas for Improvement
                          </Typography>
                          <List dense>
                            {agent.performance.improvements.map((improvement, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffc107' }} />
                                </ListItemIcon>
                                <ListItemText primary={improvement} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Recent Sessions Tab */}
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                      Recent Training Sessions
                    </Typography>
                    
                    <List>
                      {agent.recentSessions.map((session, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ px: 0, py: 2 }}>
                            <ListItemIcon>
                              <AssignmentIcon sx={{ color: '#003DA5' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {session.scenario.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Typography>
                                  <Chip
                                    label={`${session.score}%`}
                                    size="small"
                                    sx={{
                                      backgroundColor: session.score >= 85 ? '#28a745' : session.score >= 70 ? '#ffc107' : '#dc3545',
                                      color: 'white',
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                                  <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                    📅 {session.date}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                    ⏱️ {session.duration}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < agent.recentSessions.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Skills Assessment Tab */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                      Skills Breakdown
                    </Typography>
                    
                    <Box sx={{ height: 300, mb: 3 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillsData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis type="number" domain={[0, 100]} stroke="#6c757d" />
                          <YAxis dataKey="skill" type="category" width={120} stroke="#6c757d" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="score" 
                            fill="url(#skillGradient)"
                            radius={[0, 4, 4, 0]}
                          />
                          <defs>
                            <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#003DA5" />
                              <stop offset="100%" stopColor="#FFD100" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003DA5' }}>
                        Skill Development Recommendations
                      </Typography>
                      <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <List>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Focus on Response Time Improvement"
                              secondary="Practice quick decision-making scenarios to improve response efficiency"
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Continue Empathy Excellence"
                              secondary="Maintain high empathy keyword usage and emotional intelligence"
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Advanced Problem-Solving Training"
                              secondary="Engage in complex scenario training to enhance analytical skills"
                            />
                          </ListItem>
                        </List>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AgentProfile;
