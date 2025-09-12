import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import TpOdService from '../../services/TpOdService';

function TpOdForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useApp();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    difficulty: '',
    firstMessage: '',
    personaPrompt: '',
    evaluatorPrompt: '',
  });

  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchTpod();
    }
  }, [id, isEditing]);

  const fetchTpod = async () => {
    setLoading(true);
    try {
      const response = await TpOdService.getTpOdById(id);
      if (response.success) {
        const data = response.data;
        setFormData({
          name: data.name || '',
          summary: data.summary || '',
          difficulty: data.difficulty || '',
          firstMessage: data.firstMessage || '',
          personaPrompt: data.personaPrompt || '',
          evaluatorPrompt: data.evaluatorPrompt || '',
        });
        setTags(data.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) : '');
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load TPOD',
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Name cannot exceed 255 characters';
    }

    if (formData.summary && formData.summary.length > 1000) {
      newErrors.summary = 'Summary cannot exceed 1000 characters';
    }

    if (!formData.firstMessage.trim()) {
      newErrors.firstMessage = 'First message is required';
    } else if (formData.firstMessage.length > 2000) {
      newErrors.firstMessage = 'First message cannot exceed 2000 characters';
    }

    if (!formData.personaPrompt.trim()) {
      newErrors.personaPrompt = 'Persona prompt is required';
    }

    if (!formData.evaluatorPrompt.trim()) {
      newErrors.evaluatorPrompt = 'Evaluator prompt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const completeTpodData = {
        ...formData,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      };

      console.log('Submitting TPOD with data:', completeTpodData);

      const response = isEditing 
        ? await TpOdService.updateTpOd(id, completeTpodData)
        : await TpOdService.createTpOd(completeTpodData);

      if (response.success) {
        actions.addNotification({
          type: 'success',
          title: 'Success',
          message: response.message,
        });
        navigate('/tpods');
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: response.message,
        });
      }
    } catch (error) {
      console.error('Error saving TPOD:', error);
      actions.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save TPOD',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  if (loading && isEditing && !formData.name) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
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
              {isEditing ? 'Edit TPOD' : 'Create New TPOD'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing ? 'Update the training pod details below' : 'Fill in the details for the new training pod'}
            </Typography>
          </div>
        </Box>

        {/* Form */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Name *"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name || `${formData.name.length}/255 characters`}
                margin="normal"
                variant="outlined"
                placeholder="Enter a descriptive name for the TPOD"
                inputProps={{ maxLength: 255 }}
              />

              {/* Summary Field */}
              <TextField
                fullWidth
                label="Summary"
                value={formData.summary}
                onChange={handleInputChange('summary')}
                error={!!errors.summary}
                helperText={errors.summary || `${formData.summary.length}/1000 characters (optional)`}
                margin="normal"
                variant="outlined"
                placeholder="Brief description of the training pod's purpose"
                multiline
                rows={3}
                inputProps={{ maxLength: 1000 }}
              />

              {/* Difficulty Field */}
              <TextField
                select
                fullWidth
                label="Difficulty Level"
                value={formData.difficulty}
                onChange={handleInputChange('difficulty')}
                error={!!errors.difficulty}
                helperText={errors.difficulty || 'Select the difficulty level'}
                margin="normal"
                variant="outlined"
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </TextField>

              {/* Tags Field */}
              <TextField
                fullWidth
                label="Tags"
                value={tags}
                onChange={handleTagsChange}
                error={!!errors.tags}
                helperText={errors.tags || 'Enter tags separated by commas (e.g., customer-service, empathy, banking)'}
                margin="normal"
                variant="outlined"
                placeholder="customer-service, empathy, banking, complaint-handling"
              />

              {/* First Message Field */}
              <TextField
                fullWidth
                label="First Message *"
                value={formData.firstMessage}
                onChange={handleInputChange('firstMessage')}
                error={!!errors.firstMessage}
                helperText={errors.firstMessage || `${formData.firstMessage.length}/2000 characters`}
                margin="normal"
                variant="outlined"
                placeholder="Enter the initial message that starts the training scenario..."
                multiline
                rows={4}
                inputProps={{ maxLength: 2000 }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Persona Prompt Field */}
              <TextField
                fullWidth
                label="Persona Prompt *"
                value={formData.personaPrompt}
                onChange={handleInputChange('personaPrompt')}
                error={!!errors.personaPrompt}
                helperText={errors.personaPrompt || 'Define the character/persona for this training scenario'}
                margin="normal"
                variant="outlined"
                placeholder="You are acting as a banking customer who..."
                multiline
                rows={6}
              />

              {/* Evaluator Prompt Field */}
              <TextField
                fullWidth
                label="Evaluator Prompt *"
                value={formData.evaluatorPrompt}
                onChange={handleInputChange('evaluatorPrompt')}
                error={!!errors.evaluatorPrompt}
                helperText={errors.evaluatorPrompt || 'Define how to evaluate agent responses in this scenario'}
                margin="normal"
                variant="outlined"
                placeholder="Evaluate the agent's response based on empathy, accuracy..."
                multiline
                rows={6}
              />

              {/* Form Actions */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/tpods')}
                  disabled={loading}
                  sx={{
                    borderColor: '#6c757d',
                    color: '#6c757d',
                    '&:hover': {
                      borderColor: '#495057',
                      backgroundColor: 'rgba(108, 117, 125, 0.05)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
                    minWidth: 150,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
                    },
                  }}
                >
                  {loading ? 'Saving...' : (isEditing ? 'Update TPOD' : 'Create TPOD')}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Tips:</strong>
            <br />• Use a clear, descriptive name that identifies the training scenario
            <br />• Set appropriate difficulty level based on complexity
            <br />• The first message should engage the trainee immediately
            <br />• Persona prompt defines the customer character behavior
            <br />• Evaluator prompt should specify criteria for assessing responses
          </Typography>
        </Alert>
      </motion.div>
    </Container>
  );
}

export default TpOdForm;
