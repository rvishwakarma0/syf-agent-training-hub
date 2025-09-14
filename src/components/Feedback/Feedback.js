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
 * @param {Function} onClose - Callback when feedback is closed (optional)
 * @param {boolean} open - Control modal open state (for HF type)
 */
const Feedback = ({
  conversationMessages = [],
  type = "HF", // "HF" = Help/Feedback modal, "ES" = End Session no modal
  onClose = () => {},
  open = false,
}) => {
  const navigate = useNavigate();
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedFeedback, setHasLoadedFeedback] = useState(false);

  // Get feedback content
  const loadFeedback = async () => {
    if (hasLoadedFeedback && feedbackContent) return; // Don't reload if already loaded

    setIsLoading(true);

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set content based on type
      const content = type === "HF" 
        ? getFallbackHelpContent()
        : getFallbackEndSessionContent();
      
      setFeedbackContent(content);
      setHasLoadedFeedback(true);
    } catch (err) {
      console.error('❌ Feedback loading failed:', err);
      
      // Set fallback content
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

  // Help content
  const getFallbackHelpContent = () => {
    return `## 🎯 Training Tips & Help


*Continue practicing to enhance your communication abilities!*`;
  };

  // End session content
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
