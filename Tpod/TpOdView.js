import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Label as LabelIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import TpOdService from '../../services/TpOdService';

function TpOdView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useApp();
  const [tpod, setTpod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTpod();
  }, [id]);

  const fetchTpod = async () => {
    setLoading(true);
    try {
      const response = await TpOdService.getTpOdById(id);
      if (response.success) {
        setTpod(response.data);
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'TPOD not found',
        });
        navigate('/tpods');
      }
    } catch (error) {
      console.error('Error fetching TPOD:', error);
      navigate('/tpods');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async (text, label) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        actions.addNotification({
          type: 'success',
          title: 'Copied',
          message: `${label} copied to clipboard`,
        });
      } catch (error) {
        console.error('Failed to copy:', error);
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: `Failed to copy ${label.toLowerCase()}`,
        });
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${tpod.name}"? This action cannot be undone.`)) {
      try {
        const response = await TpOdService.deleteTpOd(id);
        if (response.success) {
          actions.addNotification({
            type: 'success',
            title: 'Success',
            message: 'TPOD deleted successfully',
          });
          navigate('/tpods');
        } else {
          actions.addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete TPOD',
          });
        }
      } catch (error) {
        console.error('Error deleting TPOD:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return { color: '#28a745', bgcolor: 'rgba(40, 167, 69, 0.1)' };
      case 'medium':
        return { color: '#ffc107', bgcolor: 'rgba(255, 193, 7, 0.1)' };
      case 'hard':
        return { color: '#dc3545', bgcolor: 'rgba(220, 53, 69, 0.1)' };
      default:
        return { color: '#6c757d', bgcolor: 'rgba(108, 117, 125, 0.1)' };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!tpod) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          TPOD not found
        </Typography>
        <Button onClick={() => navigate('/tpods')} sx={{ mt: 2 }}>
          Back to TPODs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
          <Box display="flex" alignItems="center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/tpods')}
              sx={{
                mr: 2,
                color: '#003DA5',
                '&:hover': {
                  backgroundColor: 'rgba(0, 61, 165, 0.05)',
                },
              }}
            >
              Back to TPODs
            </Button>
            <div>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#003DA5' }}>
                {tpod.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip label={`ID: ${tpod.id.substring(0, 12)}...`} size="small" variant="outlined" />
              </Box>
            </div>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/tpods/${id}/edit`)}
              sx={{
                borderColor: '#FFD100',
                color: '#FFD100',
                '&:hover': {
                  borderColor: '#FFC107',
                  backgroundColor: 'rgba(255, 209, 0, 0.05)',
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                borderColor: '#dc3545',
                color: '#dc3545',
                '&:hover': {
                  borderColor: '#c82333',
                  backgroundColor: 'rgba(220, 53, 69, 0.05)',
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Classification Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600, mb: 2 }}>
                Classification
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Difficulty */}
                {tpod.difficulty && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <SchoolIcon sx={{ color: '#6c757d' }} />
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: '#6c757d' }}>
                      Difficulty:
                    </Typography>
                    <Chip
                      label={tpod.difficulty.toUpperCase()}
                      sx={{
                        ...getDifficultyColor(tpod.difficulty),
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 2,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Tags */}
                {tpod.tags && tpod.tags.length > 0 && (
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <LabelIcon sx={{ color: '#6c757d', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: '#6c757d', mt: 0.5 }}>
                      Tags:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {tpod.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: '#f8f9fa',
                            color: '#495057',
                            border: '1px solid #dee2e6',
                            '&:hover': {
                              backgroundColor: '#e9ecef',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ mt: 3 }} />
            </Box>

            {/* Summary Section */}
            {tpod.summary && (
              <>
                <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600 }}>
                  Summary
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {tpod.summary}
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </>
            )}

            {/* First Message */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
                First Message
              </Typography>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => handleCopyText(tpod.firstMessage, 'First Message')}
                sx={{
                  color: '#17a2b8',
                  '&:hover': {
                    backgroundColor: 'rgba(23, 162, 184, 0.05)',
                  },
                }}
              >
                Copy
              </Button>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e9ecef',
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography 
                variant="body1" 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {tpod.firstMessage}
              </Typography>
            </Paper>

            {/* Persona Prompt */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <PsychologyIcon sx={{ color: '#003DA5' }} />
                <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
                  Persona Prompt
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => handleCopyText(tpod.personaPrompt, 'Persona Prompt')}
                sx={{
                  color: '#17a2b8',
                  '&:hover': {
                    backgroundColor: 'rgba(23, 162, 184, 0.05)',
                  },
                }}
              >
                Copy
              </Button>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #add8e6',
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography 
                variant="body1" 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {tpod.personaPrompt}
              </Typography>
            </Paper>

            {/* Evaluator Prompt */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <AssessmentIcon sx={{ color: '#003DA5' }} />
                <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
                  Evaluator Prompt
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={() => handleCopyText(tpod.evaluatorPrompt, 'Evaluator Prompt')}
                sx={{
                  color: '#17a2b8',
                  '&:hover': {
                    backgroundColor: 'rgba(23, 162, 184, 0.05)',
                  },
                }}
              >
                Copy
              </Button>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8fff8', 
                border: '1px solid #90ee90',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="body1" 
                component="pre" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {tpod.evaluatorPrompt}
              </Typography>
            </Paper>

            {/* Metadata */}
            <Box mt={4} p={3} sx={{ backgroundColor: 'rgba(0, 61, 165, 0.02)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600 }}>
                Metadata
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TPOD ID
                  </Typography>
                  <Typography variant="body2">
                    {tpod.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    First Message Length
                  </Typography>
                  <Typography variant="body2">
                    {tpod.firstMessage?.length || 0} characters
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Persona Prompt Length
                  </Typography>
                  <Typography variant="body2">
                    {tpod.personaPrompt?.length || 0} characters
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Evaluator Prompt Length
                  </Typography>
                  <Typography variant="body2">
                    {tpod.evaluatorPrompt?.length || 0} characters
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}

export default TpOdView;
