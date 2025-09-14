import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Container
} from '@mui/material';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import TpOdService from '../../services/TpOdService';

const TrainingCenter = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tpodList, setTpodList] = useState([]);

  // Categories – “All” + unique tags from API
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await TpOdService.getAllTpOds();
        const data = Array.isArray(response) ? response : response.data;

        // Normalize API → UI structure
        const formatted = data.map(item => ({
          id: item.id,
          title: item.name,                        // API name → title
          description: item.summary,               // API summary → description
          difficulty: formatDifficulty(item.difficulty),
          duration: item.duration || "5 min",      // fallback
          category: item.tags?.[0] || "General",   // take first tag or fallback
          color: pickCategoryColor(item.tags?.[0]) // assign color
        }));

        setTpodList(formatted);

        // Extract unique categories for filter
        const uniqueCats = [
          ...new Set(formatted.map(item => item.category))
        ];
        setCategories(['All', ...uniqueCats]);

      } catch (error) {
        console.error("Error fetching scenarios:", error);
        setTpodList([]);
        setCategories(['All']);
      }
    };

    fetchScenarios();
  }, []);

  // filter scenarios based on selected category
  const filteredScenarios =
    selectedCategory === 'All'
      ? tpodList
      : tpodList.filter(scenario => scenario.category === selectedCategory);

  // Navigate functions
  const handleStartTextTraining = (scenarioId) => {
    navigate(`/text-training/${scenarioId}`);
  };

  const handleStartVoiceTraining = (scenarioId) => {
    navigate(`/voice-training/${scenarioId}`);
  };

  // Helpers
  const formatDifficulty = (difficulty = '') => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "medium": return "Intermediate"; // API returns medium
      case "advanced": return "Advanced";
      default: return "Unknown";
    }
  };

  const pickCategoryColor = (category = '') => {
    switch (category.toLowerCase()) {
      case 'sales': return '#2196F3';
      case 'banking': return '#4CAF50';
      case 'customer support': return '#FF9800';
      default: return '#9C27B0'; // fallback purple
    }
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

                    {/* Action Buttons - Chat & Voice */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleStartTextTraining(scenario.id)}
                        sx={{
                          flex: 1,
                          backgroundColor: scenario.color,
                          '&:hover': {
                            backgroundColor: scenario.color,
                            filter: 'brightness(0.9)'
                          },
                          py: 1.5,
                          fontWeight: 'bold',
                          borderRadius: '8px'
                        }}
                      >
                        Chat
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={() => handleStartVoiceTraining(scenario.id)}
                        sx={{
                          flex: 1,
                          borderColor: scenario.color,
                          color: scenario.color,
                          '&:hover': {
                            borderColor: scenario.color,
                            backgroundColor: `${scenario.color}10`,
                            color: scenario.color
                          },
                          py: 1.5,
                          fontWeight: 'bold',
                          borderRadius: '8px'
                        }}
                      >
                        Voice
                      </Button>
                    </Box>
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