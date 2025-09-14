import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
  EmojiEvents as AwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

function Dashboard() {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startTrainingDialog, setStartTrainingDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('');

  // Mock batches data
  const mockBatches = [
    { id: 1, name: 'Batch Alpha', agents: 8, status: 'Active', created: '2025-09-01' },
    { id: 2, name: 'Batch Beta', agents: 12, status: 'Completed', created: '2025-08-15' },
    { id: 3, name: 'Batch Gamma', agents: 10, status: 'Active', created: '2025-09-05' },
  ];

  const scenarios = [
    { value: 'billing_issue', label: 'Billing Issue', difficulty: 6 },
    { value: 'customer_complaint', label: 'Customer Complaint', difficulty: 8 },
    { value: 'workplace_conflict', label: 'Workplace Conflict', difficulty: 7 },
    { value: 'technical_support', label: 'Technical Support', difficulty: 4 },
    { value: 'family_crisis', label: 'Family Crisis', difficulty: 9 },
    { value: 'medical_concern', label: 'Medical Concern', difficulty: 8 },
    { value: 'financial_stress', label: 'Financial Stress', difficulty: 7 },
    { value: 'relationship_issue', label: 'Relationship Issue', difficulty: 9 },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAgentClick = (agentId) => {
    navigate(`/agent/${agentId}`);
  };

  const handleStartTraining = (agent) => {
    setSelectedAgent(agent);
    setStartTrainingDialog(true);
  };

  const handleConfirmStartTraining = () => {
    if (selectedAgent && selectedScenario) {
      actions.startTrainingSession(selectedAgent.id, selectedScenario);
      setStartTrainingDialog(false);
      setSelectedAgent(null);
      setSelectedScenario('');
      
      // Navigate to training session
      setTimeout(() => {
        const session = Object.values(state.sessions).find(
          s => s.agentId === selectedAgent.id && s.status === 'active'
        );
        if (session) {
          navigate(`/training/${session.id}`);
        }
      }, 500);
    }
  };

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

  const filteredAgents = state.agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getAgentsByStatus = (status) => {
    return state.agents.filter(agent => agent.status === status);
  };

  const dashboardStats = [
    {
      title: 'Total Agents',
      value: state.analytics.totalAgents,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#003DA5' }} />,
      color: '#003DA5',
    },
    {
      title: 'Active Training',
      value: state.analytics.activeTraining,
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#28a745' }} />,
      color: '#28a745',
    },
    {
      title: 'Avg Empathy Score',
      value: `${state.analytics.averageEmpathyScore.toFixed(1)}%`,
      icon: <AwardIcon sx={{ fontSize: 40, color: '#FFD100' }} />,
      color: '#FFD100',
    },
    {
      title: 'Sessions Today',
      value: state.analytics.totalSessionsToday,
      icon: <TimerIcon sx={{ fontSize: 40, color: '#17a2b8' }} />,
      color: '#17a2b8',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#003DA5',
              mb: 1,
            }}
          >
            Agent Training Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6c757d',
              fontSize: '1.1rem',
            }}
          >
            Monitor and manage your team's empathy training progress in real-time
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={stat.title}>
              <Card
                sx={{
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: stat.color,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6c757d',
                        fontWeight: 500,
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4, p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter by Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="training">Training</MenuItem>
                <MenuItem value="session">In Session</MenuItem>
                <MenuItem value="available">Available</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Chip
                label={`${filteredAgents.length} agents`}
                variant="outlined"
                sx={{ borderColor: '#003DA5', color: '#003DA5' }}
              />
            </Box>
          </Box>
        </Card>
      </motion.div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
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
            <Tab 
              label={`All Batches (${mockBatches.length})`}
              icon={<PeopleIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`All Agents (${state.agents.length})`}
              icon={<PeopleIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Training (${getAgentsByStatus('training').length})`}
              icon={<SchoolIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Available (${getAgentsByStatus('available').length})`}
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </motion.div>

      {/* Batches Grid (All Batches Tab) */}
      {tabValue === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ mb: 4, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#003DA5', fontWeight: 600 }}>
              Batches
            </Typography>
            <Grid container spacing={2}>
              {mockBatches.map((batch) => (
                <Grid item xs={12} md={6} lg={4} key={batch.id}>
                  <Card
                    sx={{
                      p: 2,
                      border: '1px solid #e9ecef',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003DA5' }}>
                      {batch.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                      Agents: {batch.agents}
                    </Typography>
                    <Chip
                      label={batch.status}
                      size="small"
                      sx={{
                        backgroundColor: batch.status === 'Active' ? '#28a745' : '#6c757d',
                        color: 'white',
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      Created: {batch.created}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </motion.div>
      )}

      {/* Agents Grid */}
      {tabValue !== 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid container spacing={3}>
            {filteredAgents
              .filter(agent => {
                if (tabValue === 1) return true; // All agents
                if (tabValue === 2) return agent.status === 'training';
                if (tabValue === 3) return agent.status === 'available';
                return true;
              })
              .map((agent, index) => (
              <Grid item xs={12} sm={6} lg={4} key={agent.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(0, 61, 165, 0.12)',
                      },
                    }}
                    onClick={() => handleAgentClick(agent.id)}
                  >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
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
                        label={getStatusLabel(agent.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(agent.status),
                          color: agent.status === 'session' ? '#003DA5' : 'white',
                          fontWeight: 500,
                          position: 'relative',
                          '&::before': agent.status === 'training' || agent.status === 'session' ? {
                            content: '""',
                            position: 'absolute',
                            top: -2,
                            left: -2,
                            right: -2,
                            bottom: -2,
                            background: getStatusColor(agent.status),
                            borderRadius: 'inherit',
                            opacity: 0.3,
                            animation: 'pulse 2s infinite',
                          } : {},
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                          Empathy Score
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#003DA5' }}>
                          {agent.empathyScore}%
                        </Typography>
                      </Box>
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
                    </Box>
                    
                    {agent.status === 'training' || agent.status === 'session' ? (
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                          Session Duration
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#28a745', fontWeight: 600 }}>
                          {agent.sessionDuration}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                          Last Active
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                          {agent.lastActive || 'Just now'}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgentClick(agent.id);
                        }}
                        sx={{
                          borderColor: '#003DA5',
                          color: '#003DA5',
                          '&:hover': {
                            borderColor: '#002B5C',
                            backgroundColor: 'rgba(0, 61, 165, 0.05)',
                          },
                        }}
                      >
                        View
                      </Button>
                      
                      {agent.status === 'available' && (
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<PlayIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTraining(agent);
                          }}
                          sx={{
                            background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                            },
                          }}
                        >
                          Train
                        </Button>
                      )}
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Start Training Dialog */}
      <Dialog
        open={startTrainingDialog}
        onClose={() => setStartTrainingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#003DA5' }}>
            Start Training Session
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Box sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                  }}
                >
                  {selectedAgent.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedAgent.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6c757d' }}>
                    {selectedAgent.department} • {selectedAgent.level}
                  </Typography>
                </Box>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Select Training Scenario</InputLabel>
                <Select
                  value={selectedScenario}
                  label="Select Training Scenario"
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  {scenarios.map((scenario) => (
                    <MenuItem key={scenario.value} value={scenario.value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{scenario.label}</span>
                        <Chip
                          label={`Level ${scenario.difficulty}`}
                          size="small"
                          sx={{
                            backgroundColor: 
                              scenario.difficulty <= 4 ? '#28a745' :
                              scenario.difficulty <= 7 ? '#ffc107' : '#dc3545',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setStartTrainingDialog(false)}
            sx={{ color: '#6c757d' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmStartTraining}
            disabled={!selectedScenario}
            sx={{
              background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
              },
            }}
          >
            Start Training
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;