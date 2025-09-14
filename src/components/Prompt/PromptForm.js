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
  InputAdornment, // ✅ Added for search icon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Search as SearchIcon, // ✅ Added for search bar
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PromptService from '../../services/PromptService';
import PromptOptionsDropdown from './PromptOptionsDropdown';

function PromptForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions } = useApp();
  const isEditing = Boolean(id);

  // ✅ EXISTING FORM DATA
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    prompt: '',
  });

  // ✅ NEW STATE FOR TAGS AND TYPE
  const [tags, setTags] = useState('');
  const [promptType, setPromptType] = useState('persona-prompt');

  // ✅ EXISTING STATE FOR DROPDOWN OPTIONS
  const [promptOptions, setPromptOptions] = useState({
    domain: '',
    emotion: '',
    tone: '',
    knowledgeLevel: '',
    context: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchPrompt();
    }
  }, [id, isEditing]);

  const fetchPrompt = async () => {
    setLoading(true);
    try {
      const response = await PromptService.getPromptById(id);
      if (response.success) {
        const data = response.data;
        setFormData({
          name: data.name || '',
          summary: data.summary || '',
          prompt: data.prompt || '',
        });

        // ✅ SET TAGS AND TYPE FROM EXISTING DATA
        setTags(data.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) : '');
        setPromptType(data.type || 'persona-prompt');

        // ✅ SET DROPDOWN OPTIONS IF THEY EXIST
        setPromptOptions({
          domain: data.domain || '',
          emotion: data.emotion || '',
          tone: data.tone || '',
          knowledgeLevel: data.knowledgeLevel || '',
          context: data.context || '',
        });
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load prompt',
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Name cannot exceed 255 characters';
    }

    if (formData.summary && formData.summary.length > 500) {
      newErrors.summary = 'Summary cannot exceed 500 characters';
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt text is required';
    } else if (formData.prompt.length > 4096) {
      newErrors.prompt = 'Prompt text cannot exceed 4096 characters';
    }

    // ✅ VALIDATE PROMPT TYPE
    if (!promptType) {
      newErrors.promptType = 'Prompt type is required';
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
      // ✅ COMBINE ALL DATA INCLUDING TAGS AND TYPE
      const completePromptData = {
        ...formData,
        type: promptType,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        ...promptOptions, // Include all dropdown selections
      };

      console.log('Submitting prompt with all data:', completePromptData);

      const response = isEditing
        ? await PromptService.updatePrompt(id, completePromptData)
        : await PromptService.createPrompt(completePromptData);

      if (response.success) {
        actions.addNotification({
          type: 'success',
          title: 'Success',
          message: response.message,
        });
        navigate('/prompts');
      } else {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: response.message,
        });
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      actions.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save prompt',
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

  // ✅ NEW HANDLERS FOR TAGS AND TYPE
  const handleTagsChange = (event) => {
    setTags(event.target.value);
    if (errors.tags) {
      setErrors({
        ...errors,
        tags: null,
      });
    }
  };

  const handleTypeChange = (event) => {
    setPromptType(event.target.value);
    if (errors.promptType) {
      setErrors({
        ...errors,
        promptType: null,
      });
    }
  };

  // ✅ HANDLE DROPDOWN CHANGES
  const handleOptionsChange = (options) => {
    setPromptOptions(options);
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
              {isEditing ? 'Edit Prompt' : 'Create New Prompt'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing ? 'Update the prompt details and options below' : 'Fill in the details and configure options for the new prompt'}
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
                placeholder="Enter a descriptive name for the prompt"
                inputProps={{ maxLength: 255 }}
              />

              {/* Summary Field */}
              <TextField
                fullWidth
                label="Summary"
                value={formData.summary}
                onChange={handleInputChange('summary')}
                error={!!errors.summary}
                helperText={errors.summary || `${formData.summary.length}/500 characters (optional)`}
                margin="normal"
                variant="outlined"
                placeholder="Brief description of the prompt's purpose"
                multiline
                rows={3}
                inputProps={{ maxLength: 500 }}
              />

              {/* ✅ NEW TYPE DROPDOWN FIELD */}
              <TextField
                select
                fullWidth
                label="Prompt Type *"
                value={promptType}
                onChange={handleTypeChange}
                error={!!errors.promptType}
                helperText={errors.promptType || 'Select the type of prompt'}
                margin="normal"
                variant="outlined"
              >
                <MenuItem value="persona-prompt">Persona Prompt</MenuItem>
                <MenuItem value="evaluator-prompt">Evaluator Prompt</MenuItem>
              </TextField>

              {/* ✅ NEW TAGS TEXT FIELD */}
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

              {/* Prompt Text Field */}
              <TextField
                fullWidth
                label="Prompt Text *"
                value={formData.prompt}
                onChange={handleInputChange('prompt')}
                error={!!errors.prompt}
                helperText={errors.prompt || `${formData.prompt.length}/4096 characters`}
                margin="normal"
                variant="outlined"
                placeholder="Enter the detailed prompt text that will be used for training..."
                multiline
                rows={8}
                inputProps={{ maxLength: 4096 }}
              />


              {/* ✅ NEW DISABLED SEARCH BAR */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <TextField
                    fullWidth
                    label="Search SOP Data"
                    placeholder="Fetching data from SOP..."
                    disabled
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="disabled" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#9e9e9e',
                      },
                      '& .MuiInputLabel-root.Mui-disabled': {
                        color: '#9e9e9e',
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Divider sx={{ my: 3 }} />

              {/* Form Actions */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/prompts')}
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
                  {loading ? 'Saving...' : (isEditing ? 'Update Prompt' : 'Create Prompt')}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Tips:</strong>
            <br />• Use a clear, descriptive name that identifies the prompt's purpose
            <br />• Select the appropriate prompt type: Persona or Evaluator
            <br />• Add relevant tags to help categorize and search for prompts
            <br />• The summary should briefly explain when and how this prompt will be used
            <br />• Write detailed prompt text that provides clear instructions for the intended scenario
          </Typography>
        </Alert>
      </motion.div>
    </Container>
  );
}

export default PromptForm;
