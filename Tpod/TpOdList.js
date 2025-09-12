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
  Label as LabelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import TpOdService from '../../services/TpOdService';

function TpOdList() {
  const navigate = useNavigate();
  const { actions } = useApp();
  const [tpods, setTpods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tpod: null });

  useEffect(() => {
    fetchTpods();
  }, []);

  const fetchTpods = async () => {
    setLoading(true);
    try {
      const response = await TpOdService.getAllTpOds();
      if (response.success) {
        setTpods(response.data);
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load TPODs',
        });
      }
    } catch (error) {
      console.error('Error fetching TPODs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchTpods();
      return;
    }

    setLoading(true);
    try {
      const response = await TpOdService.searchTpOds(searchTerm);
      if (response.success) {
        setTpods(response.data);
      }
    } catch (error) {
      console.error('Error searching TPODs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTpod = (tpod) => {
    setDeleteDialog({ open: true, tpod });
  };

  const confirmDelete = async () => {
    const { tpod } = deleteDialog;
    try {
      const response = await TpOdService.deleteTpOd(tpod.id);
      if (response.success) {
        actions.addNotification({
          type: 'success',
          title: 'Success',
          message: 'TPOD deleted successfully',
        });
        fetchTpods();
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete TPOD',
        });
      }
    } catch (error) {
      console.error('Error deleting TPOD:', error);
    } finally {
      setDeleteDialog({ open: false, tpod: null });
    }
  };

  const filteredTpods = tpods.filter(tpod =>
    tpod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tpod.summary && tpod.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
              Training Pod Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage training scenarios and conversation pods
            </Typography>
          </div>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchTpods}
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
              onClick={() => navigate('/tpods/create')}
              sx={{
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                },
              }}
            >
              Create TPOD
            </Button>
          </Box>
        </Box>
      </motion.div>

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
              placeholder="Search TPODs by name or summary..."
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

      {/* TPODs Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredTpods.length > 0 ? (
            filteredTpods.map((tpod, index) => (
              <Grid item xs={12} md={6} lg={4} key={tpod.id}>
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
                          {tpod.name}
                        </Typography>
                        <Chip 
                          label={`ID: ${tpod.id.substring(0, 8)}...`} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      </Box>

                      {/* Difficulty and Tags */}
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {/* Difficulty Chip */}
                        {tpod.difficulty && (
                          <Chip
                            label={tpod.difficulty.toUpperCase()}
                            size="small"
                            sx={{
                              ...getDifficultyColor(tpod.difficulty),
                              fontWeight: 600,
                              '& .MuiChip-label': {
                                px: 2,
                              },
                            }}
                          />
                        )}

                        {/* Tags Chips */}
                        {tpod.tags && tpod.tags.length > 0 && (
                          <>
                            {tpod.tags.slice(0, 3).map((tag, tagIndex) => (
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
                            {tpod.tags.length > 3 && (
                              <Chip
                                label={`+${tpod.tags.length - 3}`}
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
                        <strong>Summary:</strong> {tpod.summary || 'No summary available'}
                      </Typography>

                      {/* First Message Preview */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, flexGrow: 1 }}
                      >
                        <strong>First Message:</strong> {truncateText(tpod.firstMessage, 100)}
                      </Typography>

                      {/* Actions */}
                      <Box display="flex" gap={1} mt="auto">
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => navigate(`/tpods/${tpod.id}`)}
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
                          onClick={() => navigate(`/tpods/${tpod.id}/edit`)}
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
                          onClick={() => handleDeleteTpod(tpod)}
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
                  No TPODs Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm 
                    ? `No TPODs match your search: "${searchTerm}"`
                    : 'Get started by creating your first Training Pod!'
                  }
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/tpods/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                  }}
                >
                  Create First TPOD
                </Button>
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, tpod: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete TPOD</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the TPOD "{deleteDialog.tpod?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, tpod: null })}
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

export default TpOdList;
