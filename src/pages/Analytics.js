import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Button,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area 
} from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';

function Analytics() {
  const { state } = useApp();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Generate mock analytics data
  const weeklyTrend = [
    { day: 'Mon', sessions: 24, avgScore: 85, improvement: 12 },
    { day: 'Tue', sessions: 31, avgScore: 87, improvement: 15 },
    { day: 'Wed', sessions: 28, avgScore: 83, improvement: 8 },
    { day: 'Thu', sessions: 35, avgScore: 89, improvement: 18 },
    { day: 'Fri', sessions: 42, avgScore: 88, improvement: 14 },
    { day: 'Sat', sessions: 18, avgScore: 86, improvement: 10 },
    { day: 'Sun', sessions: 15, avgScore: 84, improvement: 7 },
  ];

  const departmentData = [
    { department: 'Customer Service', agents: 4, avgScore: 87, sessions: 156 },
    { department: 'Technical Support', agents: 2, avgScore: 81, sessions: 89 },
  ];

  const scenarioPerformance = [
    { scenario: 'Billing Issue', sessions: 45, avgScore: 86, difficulty: 6 },
    { scenario: 'Customer Complaint', sessions: 38, avgScore: 82, difficulty: 8 },
    { scenario: 'Technical Support', sessions: 42, avgScore: 84, difficulty: 4 },
    { scenario: 'Workplace Conflict', sessions: 28, avgScore: 79, difficulty: 7 },
    { scenario: 'Family Crisis', sessions: 15, avgScore: 91, difficulty: 9 },
  ];

  const agentRankings = state.agents
    .sort((a, b) => b.empathyScore - a.empathyScore)
    .map((agent, index) => ({
      ...agent,
      rank: index + 1,
    }));

  const statusDistribution = [
    { name: 'Training', value: state.analytics.activeTraining, color: '#28a745' },
    { name: 'Available', value: state.analytics.availableAgents, color: '#6c757d' },
    { name: 'In Session', value: state.analytics.inSession, color: '#FFD100' },
  ];

  const dashboardKPIs = [
    {
      title: 'Total Training Sessions',
      value: '193',
      change: '+12%',
      changeType: 'positive',
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#003DA5' }} />,
    },
    {
      title: 'Average Empathy Score',
      value: `${state.analytics.averageEmpathyScore.toFixed(1)}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: <AwardIcon sx={{ fontSize: 40, color: '#FFD100' }} />,
    },
    {
      title: 'Active Agents',
      value: state.analytics.totalAgents,
      change: '+2',
      changeType: 'positive',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#28a745' }} />,
    },
    {
      title: 'Improvement Rate',
      value: `+${state.analytics.improvementRate}%`,
      change: '+3.1%',
      changeType: 'positive',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#17a2b8' }} />,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: 2 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#003DA5',
                mb: 1,
              }}
            >
              Analytics Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#6c757d',
                fontSize: '1.1rem',
              }}
            >
              Comprehensive insights into team performance and training effectiveness
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: '#003DA5',
                color: '#003DA5',
                '&:hover': {
                  borderColor: '#002B5C',
                  backgroundColor: 'rgba(0, 61, 165, 0.05)',
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                },
              }}
            >
              Export Report
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {dashboardKPIs.map((kpi, index) => (
            <Grid item xs={6} md={3} key={kpi.title}>
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
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
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
                    {kpi.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#003DA5',
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                      }}
                    >
                      {kpi.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6c757d',
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {kpi.title}
                    </Typography>
                    <Chip
                      label={kpi.change}
                      size="small"
                      sx={{
                        backgroundColor: kpi.changeType === 'positive' ? '#28a745' : '#dc3545',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#003DA5',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#003DA5',
              },
            }}
          >
            <Tab label="Performance Overview" />
            <Tab label="Agent Rankings" />
            <Tab label="Scenario Analysis" />
            <Tab label="Department Insights" />
          </Tabs>
        </Box>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Performance Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                  Weekly Training Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrend}>
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
                      <Area 
                        type="monotone" 
                        dataKey="sessions" 
                        stackId="1"
                        stroke="#003DA5" 
                        fill="url(#sessionsGradient)"
                      />
                      <defs>
                        <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#003DA5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#003DA5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                  Empathy Score Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis dataKey="day" stroke="#6c757d" />
                      <YAxis domain={[70, 100]} stroke="#6c757d" />
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
                        dataKey="avgScore" 
                        stroke="#FFD100" 
                        strokeWidth={3}
                        dot={{ fill: '#FFD100', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: '#003DA5', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                  Agent Status Distribution
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {statusDistribution.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                        }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>

              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                  Weekly Highlights
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#28a745', fontWeight: 600, mb: 1 }}>
                      🎉 Best Performance Day
                    </Typography>
                    <Typography variant="body1">
                      Thursday - 89% avg empathy score
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#003DA5', fontWeight: 600, mb: 1 }}>
                      📈 Most Active Day
                    </Typography>
                    <Typography variant="body1">
                      Friday - 42 training sessions
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#FFD100', fontWeight: 600, mb: 1 }}>
                      🚀 Top Improvement
                    </Typography>
                    <Typography variant="body1">
                      +18% improvement rate on Thursday
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Agent Rankings Tab */}
        {tabValue === 1 && (
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                Agent Performance Rankings
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Agent</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Empathy Score</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Sessions</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agentRankings.map((agent) => (
                      <TableRow key={agent.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                        <TableCell>
                          <Chip
                            label={`#${agent.rank}`}
                            size="small"
                            sx={{
                              backgroundColor: agent.rank <= 3 ? '#FFD100' : '#e9ecef',
                              color: agent.rank <= 3 ? '#003DA5' : '#6c757d',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                fontSize: '1.2rem',
                                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                              }}
                            >
                              {agent.avatar}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {agent.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{agent.department}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={agent.empathyScore}
                              sx={{
                                width: 80,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e9ecef',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #003DA5 0%, #FFD100 100%)',
                                  borderRadius: 4,
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#003DA5', minWidth: 40 }}>
                              {agent.empathyScore}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {agent.performance.totalSessions}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                            size="small"
                            sx={{
                              backgroundColor: 
                                agent.status === 'training' ? '#28a745' :
                                agent.status === 'session' ? '#FFD100' : '#6c757d',
                              color: agent.status === 'session' ? '#003DA5' : 'white',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        )}

        {/* Scenario Analysis Tab */}
        {tabValue === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                  Training Scenario Performance
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis 
                        dataKey="scenario" 
                        stroke="#6c757d"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis stroke="#6c757d" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="avgScore" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#003DA5" />
                          <stop offset="100%" stopColor="#FFD100" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Department Insights Tab */}
        {tabValue === 3 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#003DA5' }}>
                  Department Performance Comparison
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Agents</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Avg Empathy Score</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Total Sessions</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#003DA5' }}>Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentData.map((dept, index) => (
                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {dept.department}
                            </Typography>
                          </TableCell>
                          <TableCell>{dept.agents}</TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#003DA5' }}>
                              {dept.avgScore}%
                            </Typography>
                          </TableCell>
                          <TableCell>{dept.sessions}</TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={dept.avgScore}
                              sx={{
                                width: 150,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e9ecef',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #003DA5 0%, #FFD100 100%)',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        )}
      </motion.div>
    </Container>
  );
}

export default Analytics;
