import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  People as PeopleIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

function Welcome() {
  const navigate = useNavigate();
  const { state } = useApp();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleStartDemo = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#003DA5' }} />,
      title: 'AI-Powered Empathy Training',
      description: 'Advanced algorithms analyze conversation patterns and provide real-time feedback on empathy levels.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#28a745' }} />,
      title: 'Real-Time Performance Tracking',
      description: 'Monitor agent progress with live metrics, empathy scores, and detailed analytics dashboards.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#FFD100' }} />,
      title: 'Scenario-Based Learning',
      description: 'Practice with realistic customer scenarios including billing issues, complaints, and support requests.',
    },
    {
      icon: <AwardIcon sx={{ fontSize: 40, color: '#FFC107' }} />,
      title: 'Achievement System',
      description: 'Gamified learning experience with badges, progress tracking, and performance recognition.',
    },
  ];

  const stats = [
    { label: 'Active Agents', value: state.analytics.totalAgents, color: '#003DA5' },
    { label: 'Training Sessions Today', value: state.analytics.totalSessionsToday, color: '#28a745' },
    { label: 'Average Empathy Score', value: `${state.analytics.averageEmpathyScore.toFixed(1)}%`, color: '#FFD100' },
    { label: 'Improvement Rate', value: `+${state.analytics.improvementRate}%`, color: '#17a2b8' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: 2 }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
            borderRadius: 4,
            p: 6,
            mb: 6,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Welcome to Synchrony Agent Training Hub
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: '#FFD100',
                  fontWeight: 500,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                Empowering Customer Success Through AI-Driven Empathy Training
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Transform your customer service team with our cutting-edge AI platform that provides 
                real-time empathy coaching, scenario-based training, and comprehensive performance analytics. 
                Join thousands of agents worldwide who are mastering the art of empathetic customer service.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayIcon />}
                  onClick={handleGetStarted}
                  sx={{
                    borderColor: '#FFD100',
                    color: '#FFD100',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FFC107',
                      backgroundColor: 'rgba(255, 209, 0, 0.1)',
                    },
                  }}
                >
                  Get Started
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleStartDemo}
                  sx={{
                    borderColor: '#FFD100',
                    color: '#FFD100',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FFC107',
                      backgroundColor: 'rgba(255, 209, 0, 0.1)',
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Box
                  sx={{
                    fontSize: '8rem',
                    textAlign: 'center',
                    filter: 'drop-shadow(0 10px 20px rgba(255, 209, 0, 0.3))',
                  }}
                >
                  🎯
                </Box>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 209, 0, 0.1) 0%, transparent 70%)',
            }}
          />
        </Box>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 61, 165, 0.15)',
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    mb: 1,
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6c757d',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
            color: '#003DA5',
          }}
        >
          Platform Features
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mb: 5,
            color: '#6c757d',
            fontSize: '1.1rem',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Discover how our AI-powered platform revolutionizes customer service training 
          through advanced empathy analysis and real-time coaching.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid #e9ecef',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 40px rgba(0, 61, 165, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 61, 165, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: '#003DA5',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#6c757d',
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Active Agents Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 700,
              color: '#003DA5',
            }}
          >
            Active Training Sessions
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mb: 5,
              color: '#6c757d',
              fontSize: '1.1rem',
            }}
          >
            See your team members currently engaged in AI-powered empathy training
          </Typography>

          <Grid container spacing={3}>
            {state.agents.slice(0, 3).map((agent, index) => (
              <Grid item xs={12} md={4} key={agent.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 30px rgba(0, 61, 165, 0.15)',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => navigate(`/agent/${agent.id}`)}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                      }}
                    >
                      {agent.avatar}
                    </Avatar>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: '#003DA5',
                      }}
                    >
                      {agent.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6c757d',
                        mb: 2,
                      }}
                    >
                      {agent.department} • {agent.level}
                    </Typography>
                    
                    <Chip
                      label={agent.status === 'training' ? 'In Training' : 
                            agent.status === 'session' ? 'In Session' : 'Available'}
                      size="small"
                      sx={{
                        backgroundColor: 
                          agent.status === 'training' ? '#28a745' :
                          agent.status === 'session' ? '#FFD100' : '#6c757d',
                        color: agent.status === 'session' ? '#003DA5' : 'white',
                        fontWeight: 500,
                        mb: 2,
                      }}
                    />
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                        Empathy Score
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={agent.empathyScore}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e9ecef',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #003DA5 0%, #FFD100 100%)',
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          color: '#003DA5',
                        }}
                      >
                        {agent.empathyScore}%
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Box
          sx={{
            mt: 8,
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            borderRadius: 4,
            border: '2px solid #e9ecef',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#003DA5',
            }}
          >
            Ready to Transform Your Team?
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#6c757d',
              fontSize: '1.1rem',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            Start your journey toward exceptional customer service with AI-powered empathy training.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<PeopleIcon />}
            onClick={handleGetStarted}
            sx={{
              background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
              color: 'white',
              fontWeight: 600,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            View Agent Dashboard
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
}

export default Welcome;
