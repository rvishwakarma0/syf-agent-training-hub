import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PromptService from '../../services/PromptService';

function PromptList() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, prompt: null });

  useEffect(() => {
    fetchPrompts();
    fetchStats();
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const response = await PromptService.getAllPrompts();
      if (response.success) {
        setPrompts(response.data);
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load prompts',
        });
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await PromptService.getPromptStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPrompts();
      return;
    }

    setLoading(true);
    try {
      const response = await PromptService.searchPrompts(searchTerm);
      if (response.success) {
        setPrompts(response.data);
      }
    } catch (error) {
      console.error('Error searching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (prompt) => {
    setDeleteDialog({ open: true, prompt });
  };

  const confirmDelete = async () => {
    const { prompt } = deleteDialog;
    try {
      const response = await PromptService.deletePrompt(prompt.id);
      if (response.success) {
        actions.addNotification({
          type: 'success',
          title: 'Success',
          message: 'Prompt deleted successfully',
        });
        fetchPrompts();
        fetchStats();
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete prompt',
        });
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    } finally {
      setDeleteDialog({ open: false, prompt: null });
    }
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prompt.summary && prompt.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ✅ UTILITY FUNCTIONS
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#003DA5' }}>
              Prompt Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage training prompts for agent empathy development
            </Typography>
          </div>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => { fetchPrompts(); fetchStats(); }}
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
              startIcon={<AddIcon />}
              onClick={() => navigate('/prompts/create')}
              sx={{
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                },
              }}
            >
              Create Prompt
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Alert 
            severity="info" 
            sx={{ mb: 4, backgroundColor: 'rgba(0, 61, 165, 0.05)', borderColor: '#003DA5' }}
          >
            <Typography variant="body2">
              <strong>Total Prompts:</strong> {stats.totalPrompts} | 
              <strong> Status:</strong> {stats.status} | 
              <strong> Last Updated:</strong> {formatDate(stats.timestamp)}
            </Typography>
          </Alert>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search prompts by name or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                        minWidth: 100,
                      }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Prompts Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt, index) => (
              <Grid item xs={12} md={6} lg={4} key={prompt.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 61, 165, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#003DA5',
                            wordBreak: 'break-word',
                            flex: 1,
                          }}
                        >
                          {prompt.name}
                        </Typography>
                        <Chip 
                          label={`ID: ${prompt.id}`} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      </Box>

                      {/* ✅ Type and Tags */}
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {/* Type Chip */}
                        {prompt.type && (
                          <Chip
                            label={prompt.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            size="small"
                            sx={{
                              backgroundColor: prompt.type === 'persona-prompt' ? '#e8f5e8' : '#e3f2fd',
                              color: prompt.type === 'persona-prompt' ? '#2e7d32' : '#1565c0',
                              fontWeight: 600,
                              border: `1px solid ${prompt.type === 'persona-prompt' ? '#4caf50' : '#2196f3'}`,
                            }}
                          />
                        )}

                        {/* Tags Chips */}
                        {prompt.tags && prompt.tags.length > 0 && (
                          <>
                            {prompt.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Chip
                                key={tagIndex}
                                label={tag}
                                size="small"
                                sx={{
                                  backgroundColor: '#f5f5f5',
                                  color: '#666',
                                  fontSize: '0.7rem',
                                  height: '20px',
                                  '& .MuiChip-label': {
                                    px: 1,
                                  },
                                }}
                              />
                            ))}
                            {prompt.tags.length > 3 && (
                              <Chip
                                label={`+${prompt.tags.length - 3}`}
                                size="small"
                                sx={{
                                  backgroundColor: '#e0e0e0',
                                  color: '#666',
                                  fontSize: '0.7rem',
                                  height: '20px',
                                  '& .MuiChip-label': {
                                    px: 1,
                                  },
                                }}
                              />
                            )}
                          </>
                        )}
                      </Box>

                      {/* Summary */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, flexGrow: 1 }}
                      >
                        <strong>Summary:</strong> {prompt.summary || 'No summary available'}
                      </Typography>

                      {/* Prompt Preview */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, flexGrow: 1 }}
                      >
                        <strong>Preview:</strong> {truncateText(prompt.prompt, 120)}
                      </Typography>

                      {/* Metadata */}
                      <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">
                          Created: {formatDate(prompt.createdAt)}
                        </Typography>
                        {prompt.updatedAt && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Updated: {formatDate(prompt.updatedAt)}
                          </Typography>
                        )}
                      </Box>

                      {/* Actions */}
                      <Box display="flex" gap={1} mt="auto">
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => navigate(`/prompts/${prompt.id}`)}
                          sx={{
                            borderColor: '#003DA5',
                            color: '#003DA5',
                            '&:hover': {
                              borderColor: '#002B5C',
                              backgroundColor: 'rgba(0, 61, 165, 0.05)',
                            },
                          }}
                          variant="outlined"
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/prompts/${prompt.id}/edit`)}
                          variant="outlined"
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
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePrompt(prompt)}
                          sx={{
                            color: '#dc3545',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 53, 69, 0.05)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                sx={{ 
                  textAlign: 'center',
                  py: 4,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No Prompts Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm 
                    ? `No prompts match your search: "${searchTerm}"`
                    : 'Get started by creating your first prompt!'
                  }
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/prompts/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                  }}
                >
                  Create First Prompt
                </Button>
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, prompt: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Prompt</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the prompt "{deleteDialog.prompt?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, prompt: null })}
            sx={{ color: '#6c757d' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{
              backgroundColor: '#dc3545',
              '&:hover': {
                backgroundColor: '#c82333',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}


export default PromptList;
