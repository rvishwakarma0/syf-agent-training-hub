import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Container,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const scenarios = [
  {
    id: 'customer-service',
    title: 'Customer Service Excellence',
    description: 'Practice handling customer complaints with empathy and professionalism',
    difficulty: 'Beginner',
    duration: '15 mins',
    category: 'Customer Support',
    color: '#4CAF50'
  },
  {
    id: 'sales-conversation',
    title: 'Sales Conversation',
    description: 'Learn to build rapport and close deals effectively',
    difficulty: 'Intermediate',
    duration: '20 mins',
    category: 'Sales',
    color: '#2196F3'
  },
  {
    id: 'difficult-customer',
    title: 'Difficult Customer Handling',
    description: 'De-escalate tense situations with angry customers',
    difficulty: 'Advanced',
    duration: '25 mins',
    category: 'Customer Support',
    color: '#FF9800'
  },
  {
    id: 'loan-consultation',
    title: 'Loan Consultation',
    description: 'Guide customers through loan application process',
    difficulty: 'Intermediate',
    duration: '30 mins',
    category: 'Banking',
    color: '#9C27B0'
  }
];

const TrainingCenter = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [apiStatus, setApiStatus] = useState(null);

  const categories = ['All', 'Customer Support', 'Sales', 'Banking'];
  
  const filteredScenarios = selectedCategory === 'All' 
    ? scenarios 
    : scenarios.filter(scenario => scenario.category === selectedCategory);

  // Test API connectivity on component mount
  useEffect(() => {
    const testApi = async () => {
      console.log('🧪 Testing AWS Lambda API connectivity...');
      
      try {
        // Test your actual deployed start-scenario endpoint
        const response = await fetch('https://cld1z37z1e.execute-api.us-east-1.amazonaws.com/demo/start-scenario', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scenarioType: "customer_complaint",
            emotion: "frustrated", 
            difficultyLevel: "medium"
          })
        });

        console.log('✅ API Test Response Status:', response.status);
        const data = await response.text();
        console.log('📋 API Test Response Data:', data);
        
        setApiStatus({ 
          success: response.ok, 
          status: response.status,
          message: response.ok ? 'AWS APIs working!' : 'API responding but may have CORS issue'
        });
      } catch (error) {
        console.log('❌ API Test Error:', error.message);
        setApiStatus({ 
          success: false, 
          error: error.message,
          message: 'CORS issue detected - using fallback responses'
        });
      }
    };
    
    testApi();
  }, []);

  const handleStartTraining = (scenarioId) => {
    // Navigate to training session with the scenario ID
    navigate(`/training/${scenarioId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1, px: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#003DA5', fontSize: '1.75rem' }}>
            Training Center
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1rem' }}>
            Choose a scenario to start your empathy training
          </Typography>
          
          {/* API Status Alert */}
          {apiStatus && (
            <Alert 
              severity={apiStatus.success ? 'success' : 'warning'} 
              sx={{ mt: 2, mb: 2 }}
            >
              {apiStatus.success 
                ? `✅ AWS Lambda APIs are accessible! (Status: ${apiStatus.status}) - ${apiStatus.message}` 
                : `⚠️ ${apiStatus.message || apiStatus.error}. Demo will use intelligent fallback responses.`
              }
            </Alert>
          )}
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter by Category:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>

        {/* Scenarios Grid */}
        <Grid container spacing={3}>
          {filteredScenarios.map((scenario, index) => (
            <Grid item xs={12} md={6} lg={4} key={scenario.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Colored Header Bar */}
                  <Box 
                    sx={{ 
                      height: 4, 
                      backgroundColor: scenario.color,
                      borderRadius: '4px 4px 0 0'
                    }} 
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Category Badge */}
                    <Chip 
                      label={scenario.category}
                      size="small"
                      sx={{ 
                        mb: 2,
                        backgroundColor: `${scenario.color}20`,
                        color: scenario.color,
                        border: `1px solid ${scenario.color}40`
                      }}
                    />
                    
                    {/* Title & Description */}
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {scenario.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {scenario.description}
                    </Typography>
                    
                    {/* Difficulty & Duration */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      <Chip 
                        label={scenario.difficulty}
                        size="small"
                        sx={{ 
                          backgroundColor: getDifficultyColor(scenario.difficulty),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip 
                        label={scenario.duration}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    {/* Start Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleStartTraining(scenario.id)}
                      sx={{
                        backgroundColor: scenario.color,
                        '&:hover': {
                          backgroundColor: scenario.color,
                          filter: 'brightness(0.9)'
                        },
                        py: 1.5,
                        fontWeight: 'bold'
                      }}
                    >
                      Start Training
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {filteredScenarios.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No scenarios found for "{selectedCategory}" category
            </Typography>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default TrainingCenter;
