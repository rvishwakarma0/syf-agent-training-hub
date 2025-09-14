import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import {
  Help as HelpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FeedbackRenderer from './FeedbackRenderer';

/**
 * Common Feedback Component
 * @param {Array} conversationMessages - List of conversation messages
 * @param {string} type - "HF" for Help/Feedback modal, "ES" for End Session without modal
 * @param {Function} feedbackApiCall - API service function to get feedback
 * @param {Function} onClose - Callback when feedback is closed (optional)
 * @param {boolean} open - Control modal open state (for HF type)
 * @param {string} tpodId - Training pod ID (optional)
 * @param {string} sessionId - Session ID (optional)
 */
const Feedback = ({
  conversationMessages = [],
  type = "HF", // "HF" = Help/Feedback modal, "ES" = End Session no modal
  feedbackApiCall,
  onClose = () => {},
  open = false,
  tpodId = null,
  sessionId = null,
}) => {
  const navigate = useNavigate();
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedFeedback, setHasLoadedFeedback] = useState(false);

  // Get feedback from API
  const loadFeedback = async () => {
    if (hasLoadedFeedback && feedbackContent) return; // Don't reload if already loaded

    setIsLoading(true);
    setError(null);

    try {
      // Prepare API payload
      const payload = {
        conversationMessages,
        feedbackType: type === "HF" ? "help" : "evaluation",
        tpodId,
        sessionId,
      };

      console.log('🔄 Loading feedback:', payload);

      const response = await feedbackApiCall(payload);

      if (response && response.success) {
        const content = response.data?.feedback || response.data?.message || '';
        setFeedbackContent(content);
        setHasLoadedFeedback(true);
      } else {
        throw new Error(response?.error || 'Failed to get feedback');
      }
    } catch (err) {
      console.error('❌ Feedback loading failed:', err);
      setError(err.message);
      
      // Set fallback content based on type
      const fallbackContent = type === "HF" 
        ? getFallbackHelpContent()
        : getFallbackEndSessionContent();
      
      setFeedbackContent(fallbackContent);
      setHasLoadedFeedback(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load feedback when component mounts or when opened
  React.useEffect(() => {
    if ((type === "HF" && open) || type === "ES") {
      loadFeedback();
    }
  }, [open, type, conversationMessages]);

  // Fallback content for help/feedback
  const getFallbackHelpContent = () => {
    return `## 🎯 Training Tips & Help

*Continue practicing to enhance your communication abilities!*`;
  };

  // Fallback content for end session
  const getFallbackEndSessionContent = () => {
    return `## 🎊 Session Complete - Training Summary

**Congratulations!** You've completed your training session.

**Session Overview:**
• **Total Interactions:** ${conversationMessages.length} messages
• **Training Type:** Communication Skills Practice
• **Status:** Successfully Completed
**Remember:** Consistent practice leads to mastery. Keep up the great work!

*Thank you for your dedication to learning and improvement.*`;
  };

  // Handle continue learning (close modal)
  const handleContinueLearning = () => {
    onClose();
  };

  // Handle return to training center (for end session)
  const handleReturnToTrainingCenter = () => {
    navigate('/training-center');
  };

  // Get dialog title based on type
  const getDialogTitle = () => {
    if (type === "HF") {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpIcon sx={{ mr: 1, color: 'primary.main' }} />
          Training Tips & Help
        </Box>
      );
    }
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AssessmentIcon sx={{ mr: 1, color: 'success.main' }} />
        Session Complete - Final Evaluation
      </Box>
    );
  };

  // Loading content
  const LoadingContent = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4 
    }}>
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Box sx={{ textAlign: 'center' }}>
        Getting your {type === "HF" ? "training tips" : "session evaluation"}...
      </Box>
    </Box>
  );

  // Error content
  const ErrorContent = () => (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}. Showing fallback content below.
    </Alert>
  );

  // Render for HF type (Help/Feedback with modal)
  if (type === "HF") {
    return (
      <Dialog
        open={open}
        onClose={handleContinueLearning}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '400px' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          pb: 1
        }}>
          {getDialogTitle()}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 1 }}>
          {isLoading && <LoadingContent />}
          {error && !isLoading && <ErrorContent />}
          {!isLoading && feedbackContent && (
            <FeedbackRenderer feedback={feedbackContent} />
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
          <Button 
            onClick={handleContinueLearning} 
            variant="contained"
            sx={{ minWidth: '150px' }}
          >
            Continue Learning
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Render for ES type (End Session without modal)
  if (type === "ES") {
    return (
      <Box sx={{ width: '100%' }}>
        {isLoading && <LoadingContent />}
        {error && !isLoading && <ErrorContent />}
        {!isLoading && feedbackContent && (
          <>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              {getDialogTitle()}
            </Box>
            <FeedbackRenderer feedback={feedbackContent} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button 
                onClick={handleReturnToTrainingCenter} 
                variant="contained"
                color="primary"
                sx={{ minWidth: '200px' }}
              >
                Return to Training Center
              </Button>
            </Box>
          </>
        )}
      </Box>
    );
  }

  return null;
};

export default Feedback;
