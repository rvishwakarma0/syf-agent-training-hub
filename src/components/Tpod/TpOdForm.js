// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Box,
//   Button,
//   TextField,
//   CircularProgress,
//   Alert,
//   Divider,
//   MenuItem,
// } from '@mui/material';
// import {
//   ArrowBack as ArrowBackIcon,
//   Save as SaveIcon,
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useApp } from '../../context/AppContext';
// import TpOdService from '../../services/TpOdService';

// function TpOdForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { actions } = useApp();
//   const isEditing = Boolean(id);

//   const [formData, setFormData] = useState({
//     name: '',
//     summary: '',
//     difficulty: '',
//     firstMessage: '',
//     personaPrompt: '',
//     evaluatorPrompt: '',
//   });

//   const [tags, setTags] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (isEditing) {
//       fetchTpod();
//     }
//   }, [id, isEditing]);

//   const fetchTpod = async () => {
//     setLoading(true);
//     try {
//       const response = await TpOdService.getTpOdById(id);
//       if (response.success) {
//         const data = response.data;
//         setFormData({
//           name: data.name || '',
//           summary: data.summary || '',
//           difficulty: data.difficulty || '',
//           firstMessage: data.firstMessage || '',
//           personaPrompt: data.personaPrompt || '',
//           evaluatorPrompt: data.evaluatorPrompt || '',
//         });
//         setTags(data.tags ? (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) : '');
//       } else {
//         actions.addNotification({
//           type: 'error',
//           title: 'Error',
//           message: 'Failed to load TPOD',
//         });
//         navigate('/tpods');
//       }
//     } catch (error) {
//       console.error('Error fetching TPOD:', error);
//       navigate('/tpods');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     } else if (formData.name.length > 255) {
//       newErrors.name = 'Name cannot exceed 255 characters';
//     }

//     if (formData.summary && formData.summary.length > 1000) {
//       newErrors.summary = 'Summary cannot exceed 1000 characters';
//     }

//     if (!formData.firstMessage.trim()) {
//       newErrors.firstMessage = 'First message is required';
//     } else if (formData.firstMessage.length > 2000) {
//       newErrors.firstMessage = 'First message cannot exceed 2000 characters';
//     }

//     if (!formData.personaPrompt.trim()) {
//       newErrors.personaPrompt = 'Persona prompt is required';
//     }

//     if (!formData.evaluatorPrompt.trim()) {
//       newErrors.evaluatorPrompt = 'Evaluator prompt is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const completeTpodData = {
//         ...formData,
//         tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
//       };

//       console.log('Submitting TPOD with data:', completeTpodData);

//       const response = isEditing 
//         ? await TpOdService.updateTpOd(id, completeTpodData)
//         : await TpOdService.createTpOd(completeTpodData);

//       if (response.success) {
//         actions.addNotification({
//           type: 'success',
//           title: 'Success',
//           message: response.message,
//         });
//         navigate('/tpods');
//       } else {
//         actions.addNotification({
//           type: 'error',
//           title: 'Error',
//           message: response.message,
//         });
//       }
//     } catch (error) {
//       console.error('Error saving TPOD:', error);
//       actions.addNotification({
//         type: 'error',
//         title: 'Error',
//         message: 'Failed to save TPOD',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field) => (event) => {
//     setFormData({
//       ...formData,
//       [field]: event.target.value,
//     });

//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: null,
//       });
//     }
//   };

//   const handleTagsChange = (event) => {
//     setTags(event.target.value);
//   };

//   if (loading && isEditing && !formData.name) {
//     return (
//       <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Header */}
//         <Box display="flex" alignItems="center" mb={4}>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => navigate('/tpods')}
//             sx={{
//               mr: 2,
//               color: '#003DA5',
//               '&:hover': {
//                 backgroundColor: 'rgba(0, 61, 165, 0.05)',
//               },
//             }}
//           >
//             Back to TPODs
//           </Button>
//           <div>
//             <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#003DA5' }}>
//               {isEditing ? 'Edit TPOD' : 'Create New TPOD'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {isEditing ? 'Update the training pod details below' : 'Fill in the details for the new training pod'}
//             </Typography>
//           </div>
//         </Box>

//         {/* Form */}
//         <Card>
//           <CardContent sx={{ p: 4 }}>
//             <form onSubmit={handleSubmit}>
//               {/* Name Field */}
//               <TextField
//                 fullWidth
//                 label="Name *"
//                 value={formData.name}
//                 onChange={handleInputChange('name')}
//                 error={!!errors.name}
//                 helperText={errors.name || `${formData.name.length}/255 characters`}
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="Enter a descriptive name for the TPOD"
//                 inputProps={{ maxLength: 255 }}
//               />

//               {/* Summary Field */}
//               <TextField
//                 fullWidth
//                 label="Summary"
//                 value={formData.summary}
//                 onChange={handleInputChange('summary')}
//                 error={!!errors.summary}
//                 helperText={errors.summary || `${formData.summary.length}/1000 characters (optional)`}
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="Brief description of the training pod's purpose"
//                 multiline
//                 rows={3}
//                 inputProps={{ maxLength: 1000 }}
//               />

//               {/* Difficulty Field */}
//               <TextField
//                 select
//                 fullWidth
//                 label="Difficulty Level"
//                 value={formData.difficulty}
//                 onChange={handleInputChange('difficulty')}
//                 error={!!errors.difficulty}
//                 helperText={errors.difficulty || 'Select the difficulty level'}
//                 margin="normal"
//                 variant="outlined"
//               >
//                 <MenuItem value="easy">Easy</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="hard">Hard</MenuItem>
//               </TextField>

//               {/* Tags Field */}
//               <TextField
//                 fullWidth
//                 label="Tags"
//                 value={tags}
//                 onChange={handleTagsChange}
//                 error={!!errors.tags}
//                 helperText={errors.tags || 'Enter tags separated by commas (e.g., customer-service, empathy, banking)'}
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="customer-service, empathy, banking, complaint-handling"
//               />

//               {/* First Message Field */}
//               <TextField
//                 fullWidth
//                 label="First Message *"
//                 value={formData.firstMessage}
//                 onChange={handleInputChange('firstMessage')}
//                 error={!!errors.firstMessage}
//                 helperText={errors.firstMessage || `${formData.firstMessage.length}/2000 characters`}
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="Enter the initial message that starts the training scenario..."
//                 multiline
//                 rows={4}
//                 inputProps={{ maxLength: 2000 }}
//               />

//               <Divider sx={{ my: 3 }} />

//               {/* Persona Prompt Field */}
//               <TextField
//                 fullWidth
//                 label="Persona Prompt *"
//                 value={formData.personaPrompt}
//                 onChange={handleInputChange('personaPrompt')}
//                 error={!!errors.personaPrompt}
//                 helperText={errors.personaPrompt || 'Define the character/persona for this training scenario'}
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="You are acting as a banking customer who..."
//                 multiline
//                 rows={6}
//               />

//               {/* Evaluator Prompt Field */}
//               <TextField
//                 fullWidth
//                 label="Evaluator Prompt *"
//                 value={formData.evaluatorPrompt}
//                 onChange={handleInputChange('evaluatorPrompt')}
//                 error={!!errors.evaluatorPrompt}
//                 helperText={errors.evaluatorPrompt || 'Define how to evaluate agent responses in this scenario'}
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="Evaluate the agent's response based on empathy, accuracy..."
//                 multiline
//                 rows={6}
//               />

//               {/* Form Actions */}
//               <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => navigate('/tpods')}
//                   disabled={loading}
//                   sx={{
//                     borderColor: '#6c757d',
//                     color: '#6c757d',
//                     '&:hover': {
//                       borderColor: '#495057',
//                       backgroundColor: 'rgba(108, 117, 125, 0.05)',
//                     },
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={loading}
//                   startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
//                   sx={{
//                     background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
//                     minWidth: 150,
//                     '&:hover': {
//                       background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
//                     },
//                   }}
//                 >
//                   {loading ? 'Saving...' : (isEditing ? 'Update TPOD' : 'Create TPOD')}
//                 </Button>
//               </Box>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Help Text */}
//         <Alert severity="info" sx={{ mt: 3 }}>
//           <Typography variant="body2">
//             <strong>Tips:</strong>
//             <br />• Use a clear, descriptive name that identifies the training scenario
//             <br />• Set appropriate difficulty level based on complexity
//             <br />• The first message should engage the trainee immediately
//             <br />• Persona prompt defines the customer character behavior
//             <br />• Evaluator prompt should specify criteria for assessing responses
//           </Typography>
//         </Alert>
//       </motion.div>
//     </Container>
//   );
// }

// export default TpOdForm;


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
  Autocomplete,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  AutoFixHigh as AutoFillIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import TpOdService from '../../services/TpOdService';
import PromptService from '../../services/PromptService'; // ✅ Using your proper service

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

  // Prompt-related state
  const [allPrompts, setAllPrompts] = useState([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptsError, setPromptsError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchTpod();
    }
    loadAllPrompts();
  }, [id, isEditing]);

  const loadAllPrompts = async () => {
    setPromptsLoading(true);
    setPromptsError(null);

    try {
      console.log('🔄 Loading prompts...');
      const response = await PromptService.getAllPrompts(); // ✅ Using your service

      if (response.success && response.data) {
        setAllPrompts(response.data);
        console.log('✅ Loaded prompts:', response.data.length);

        // Show success notification
        actions.addNotification({
          type: 'info',
          title: 'Prompts Loaded',
          message: `Loaded ${response.data.length} prompts from library`,
        });
      } else {
        setPromptsError(response.error || 'Failed to load prompts');
        console.error('❌ Failed to load prompts:', response.error);
      }
    } catch (error) {
      setPromptsError('Error connecting to prompt service');
      console.error('❌ Error loading prompts:', error);
    } finally {
      setPromptsLoading(false);
    }
  };

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

  // Smart auto-fill logic with enhanced detection
  const handlePromptSelect = (event, selectedPrompt) => {
    if (!selectedPrompt) {
      setSelectedPrompt(null);
      return;
    }

    const promptName = selectedPrompt.name.toLowerCase();
    const promptSummary = (selectedPrompt.summary || '').toLowerCase();

    // Enhanced detection logic
    const isEvaluatorPrompt =
      promptName.includes('eval') ||
      promptName.includes('evaluator') ||
      promptName.includes('assessment') ||
      promptName.includes('feedback') ||
      promptName.includes('judge') ||
      promptName.includes('rating') ||
      promptSummary.includes('eval') ||
      promptSummary.includes('evaluator') ||
      promptSummary.includes('assessment') ||
      promptSummary.includes('feedback') ||
      promptSummary.includes('judge') ||
      promptSummary.includes('rating');

    if (isEvaluatorPrompt) {
      // Fill evaluator prompt
      setFormData(prev => ({
        ...prev,
        evaluatorPrompt: selectedPrompt.prompt,
      }));

      actions.addNotification({
        type: 'success',
        title: '🔍 Evaluator Prompt Filled',
        message: `Auto-filled evaluator field with "${selectedPrompt.name}"`,
      });
    } else {
      // Fill persona prompt (default)
      setFormData(prev => ({
        ...prev,
        personaPrompt: selectedPrompt.prompt,
      }));

      actions.addNotification({
        type: 'success',
        title: '👤 Persona Prompt Filled',
        message: `Auto-filled persona field with "${selectedPrompt.name}"`,
      });
    }

    setSelectedPrompt(selectedPrompt);
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

      console.log('📝 Submitting TPOD:', completeTpodData);

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

  const clearSelectedPrompt = () => {
    setSelectedPrompt(null);
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
              {/* Basic Fields - keeping your original structure */}
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

              {/* Enhanced Prompt Selection Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600, mb: 2 }}>
                  🔍 Smart Auto-fill from Prompt Library
                </Typography>

                {/* Connection Status */}
                {promptsLoading && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Connecting to prompt service...
                    </Box>
                  </Alert>
                )}

                {promptsError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Connection Issue:</strong> {promptsError}
                      <br />You can still create TPODs manually or try refreshing.
                    </Typography>
                  </Alert>
                )}

                {allPrompts.length > 0 && !promptsLoading && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    ✅ Connected to prompt library ({allPrompts.length} prompts available)
                  </Alert>
                )}

                {/* Prompt Dropdown */}
                <Autocomplete
                  options={allPrompts}
                  getOptionLabel={(option) => `${option.name} ${option.summary ? `- ${option.summary}` : ''}`}
                  value={selectedPrompt}
                  onChange={handlePromptSelect}
                  loading={promptsLoading}
                  disabled={promptsLoading || allPrompts.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select prompt for auto-fill"
                      placeholder={
                        promptsLoading
                          ? "Loading prompts from server..."
                          : allPrompts.length === 0
                            ? "No prompts available - check connection"
                            : "Choose a prompt (smart detection: persona vs evaluator)"
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <AutoFillIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {promptsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#003DA5' }}>
                          {option.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {option.summary || 'No summary available'}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            (option.name.toLowerCase().includes('eval') ||
                              (option.summary || '').toLowerCase().includes('eval') ||
                              option.name.toLowerCase().includes('assessment'))
                              ? '🔍 → Evaluator Field'
                              : '👤 → Persona Field'
                          }
                          sx={{
                            fontSize: '0.7rem',
                            height: '20px',
                            bgcolor: (option.name.toLowerCase().includes('eval') ||
                              (option.summary || '').toLowerCase().includes('eval') ||
                              option.name.toLowerCase().includes('assessment'))
                              ? '#e3f2fd' : '#f3e5f5',
                            color: (option.name.toLowerCase().includes('eval') ||
                              (option.summary || '').toLowerCase().includes('eval') ||
                              option.name.toLowerCase().includes('assessment'))
                              ? '#1565c0' : '#7b1fa2'
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                  noOptionsText={
                    promptsLoading
                      ? "Loading prompts..."
                      : promptsError
                        ? "Connection failed - check your API"
                        : "No prompts found"
                  }
                />

                {/* Selected Prompt Display */}
                {selectedPrompt && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={`✅ Auto-filled: ${selectedPrompt.name}`}
                      color="primary"
                      variant="outlined"
                      onDelete={clearSelectedPrompt}
                      sx={{ borderColor: '#003DA5', color: '#003DA5' }}
                    />
                  </Box>
                )}

                {/* Action Buttons */}
                {(promptsError || allPrompts.length === 0) && !promptsLoading && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={loadAllPrompts}
                      disabled={promptsLoading}
                      sx={{ borderColor: '#003DA5', color: '#003DA5' }}
                    >
                      🔄 Retry Connection
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => navigate('/prompts')}
                      sx={{ color: '#003DA5' }}
                    >
                      📝 Manage Prompts
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Prompt Text Areas */}
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

        {/* Enhanced Help Text */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>🧠 Smart Auto-fill Guide:</strong>
            <br />• **Evaluator Prompts**: Names/summaries with "eval", "assessment", "feedback" → fills Evaluator field
            <br />• **Persona Prompts**: All others → fills Persona field
            <br />• **Edit after auto-fill**: You can modify the content before saving
            <br />• **Manual backup**: If service is down, you can still create TPODs manually
          </Typography>
        </Alert>
      </motion.div>
    </Container>
  );
}

export default TpOdForm;