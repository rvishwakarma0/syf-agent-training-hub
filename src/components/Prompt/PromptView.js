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
  Category as CategoryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PromptService from '../../services/PromptService';

function PromptView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useApp();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  const fetchPrompt = async () => {
    setLoading(true);
    try {
      const response = await PromptService.getPromptById(id);
      if (response.success) {
        setPrompt(response.data);
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Prompt not found',
        });
        navigate('/prompts');
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
      navigate('/prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (prompt?.prompt) {
      try {
        await navigator.clipboard.writeText(prompt.prompt);
        actions.addNotification({
          type: 'success',
          title: 'Copied',
          message: 'Prompt text copied to clipboard',
        });
      } catch (error) {
        console.error('Failed to copy:', error);
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to copy prompt text',
        });
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${prompt.name}"? This action cannot be undone.`)) {
      try {
        const response = await PromptService.deletePrompt(id);
        if (response.success) {
          actions.addNotification({
            type: 'success',
            title: 'Success',
            message: 'Prompt deleted successfully',
          });
          navigate('/prompts');
        } else {
          actions.addNotification({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete prompt',
          });
        }
      } catch (error) {
        console.error('Error deleting prompt:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'persona-prompt':
        return { color: '#28a745', bgcolor: 'rgba(40, 167, 69, 0.1)' };
      case 'evaluator-prompt':
        return { color: '#007bff', bgcolor: 'rgba(0, 123, 255, 0.1)' };
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

  if (!prompt) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Prompt not found
        </Typography>
        <Button onClick={() => navigate('/prompts')} sx={{ mt: 2 }}>
          Back to Prompts
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
              onClick={() => navigate('/prompts')}
              sx={{
                mr: 2,
                color: '#003DA5',
                '&:hover': {
                  backgroundColor: 'rgba(0, 61, 165, 0.05)',
                },
              }}
            >
              Back to Prompts
            </Button>
            <div>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#003DA5' }}>
                {prompt.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <Chip label={`ID: ${prompt.id}`} size="small" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  Created: {formatDate(prompt.createdAt)}
                </Typography>
                {prompt.updatedAt && prompt.updatedAt !== prompt.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    • Updated: {formatDate(prompt.updatedAt)}
                  </Typography>
                )}
              </Box>
            </div>
          </Box>

          {/* Actions */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={handleCopyPrompt}
              sx={{
                borderColor: '#17a2b8',
                color: '#17a2b8',
                '&:hover': {
                  borderColor: '#138496',
                  backgroundColor: 'rgba(23, 162, 184, 0.05)',
                },
              }}
            >
              Copy
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/prompts/${id}/edit`)}
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
            {/* ✅ NEW: Type and Tags Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600, mb: 2 }}>
                Classification
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Type */}
                {prompt.type && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <CategoryIcon sx={{ color: '#6c757d' }} />
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: '#6c757d' }}>
                      Type:
                    </Typography>
                    <Chip
                      label={prompt.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      sx={{
                        ...getTypeColor(prompt.type),
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 2,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <LabelIcon sx={{ color: '#6c757d', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600, color: '#6c757d', mt: 0.5 }}>
                      Tags:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {prompt.tags.map((tag, index) => (
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

                {/* No type or tags message */}
                {(!prompt.type && (!prompt.tags || prompt.tags.length === 0)) && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No classification information available
                  </Typography>
                )}
              </Box>
              
              <Divider sx={{ mt: 3 }} />
            </Box>

            {/* Summary Section */}
            {prompt.summary && (
              <>
                <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600 }}>
                  Summary
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {prompt.summary}
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </>
            )}

            {/* Prompt Content */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
                Prompt Content
              </Typography>
              <Button
                size="small"
                startIcon={<CopyIcon />}
                onClick={handleCopyPrompt}
                sx={{
                  color: '#17a2b8',
                  '&:hover': {
                    backgroundColor: 'rgba(23, 162, 184, 0.05)',
                  },
                }}
              >
                Copy Text
              </Button>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e9ecef',
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
                {prompt.prompt}
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
                    Prompt ID
                  </Typography>
                  <Typography variant="body2">
                    {prompt.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Character Count
                  </Typography>
                  <Typography variant="body2">
                    {prompt.prompt.length} / 4096 characters
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Word Count
                  </Typography>
                  <Typography variant="body2">
                    ~{prompt.prompt.split(/\s+/).length} words
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Created Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(prompt.createdAt)}
                  </Typography>
                </Box>
                {prompt.updatedAt && prompt.updatedAt !== prompt.createdAt && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Last Modified
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(prompt.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}

export default PromptView;
