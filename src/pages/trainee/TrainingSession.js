// src/pages/TrainingSession.js - Complete Code with Integrated Feedback Icons
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  Box,
  Button,
  TextField,
  Avatar,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Stop as StopIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import VoiceInput from '../../components/VoiceInput/VoiceInput';
import ReactMarkdown from 'react-markdown';

// Updated apiService for Spring Boot integration
const apiService = {
  // Start Pod Session
  async startPod(scenarioData) {

    

  const API_BASE_URL = 'http://3.82.22.210:8080/api';

    try {
      const tpodMapping = {
        'customer-service': 'customer-support-tpod',
        'sales-conversation': 'sales-training-tpod',
        'difficult-customer': 'difficult-customer-tpod',
        'loan-consultation': 'loan-consultation-tpod',
      };

      const payload = {
        tpodId: tpodMapping[scenarioData.scenario] || 'customer-support-tpod',
        userId: 'current-user'
      };

      console.log('🚀 Starting Spring Boot pod session:', payload);

      const response = await fetch(`${API_BASE_URL}/chat/start-pod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Pod session started:', data);

      return {
        success: true,
        data: {
          sessionId: data.sessionId,
          scenario: scenarioData.scenario,
          tpodId: payload.tpodId,
          initialMessage: data.message,
          timestamp: data.timestamp,
        },
      };
    } catch (error) {
      console.error('❌ Start pod session failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: true,
      };
    }
  },

  // Send Message
  async sendMessage(messageData) {

    const API_BASE_URL = 'http://3.82.22.210:8080/api';

    try {
      const payload = {
        sessionId: messageData.sessionId,
        tpodId: messageData.tpodId,
        message: messageData.message,
      };

      console.log('💬 Sending message to Spring Boot:', payload);

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Message response received:', data);

      return {
        success: true,
        data: {
          sessionId: data.sessionId,
          aiResponse: typeof data.message === 'string'
            ? data.message
            : JSON.stringify(data.message),
          feedback: data.evalMsg,
          timestamp: data.timestamp,
        },
      };
    } catch (error) {
      console.error('❌ Send message failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: true,
      };
    }
  },
};

function TrainingSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const messagesEndRef = useRef(null);

  // State management
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentTpodId, setCurrentTpodId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioInfo, setScenarioInfo] = useState(null);
  const [showSessionResults, setShowSessionResults] = useState(false);
  const [sessionAnalysis, setSessionAnalysis] = useState(null);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Feedback states
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackType, setFeedbackType] = useState('help');
  const [feedbackError, setFeedbackError] = useState(null);

  // Scenario definitions
  const scenarios = {
    'customer-service': {
      title: 'Customer Service Excellence',
      description: 'Practice handling customer complaints with empathy',
      tpodId: 'customer-support-tpod',
    },
    'sales-conversation': {
      title: 'Sales Conversation',
      description: 'Learn to build rapport and close deals effectively',
      tpodId: 'sales-training-tpod',
    },
    'difficult-customer': {
      title: 'Difficult Customer Handling',
      description: 'De-escalate tense situations with angry customers',
      tpodId: 'difficult-customer-tpod',
    },
    'loan-consultation': {
      title: 'Loan Consultation',
      description: 'Guide customers through loan application process',
      tpodId: 'loan-consultation-tpod',
    },
  };

  // Initialize session
  useEffect(() => {
    const currentScenario = scenarios[sessionId] || scenarios['customer-service'];
    setScenarioInfo(currentScenario);
    setCurrentTpodId(currentScenario.tpodId);

    const initializeSession = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      
      try {
        console.log('🚀 Initializing Spring Boot session for:', sessionId);
        
        const response = await apiService.startPod({
          scenario: sessionId,
        });

        if (response && response.success) {
          const initialMessage = {
            id: 1,
            sender: 'customer',
            text: response.data.initialMessage,
            timestamp: new Date(),
            emotion: 'neutral',
          };
          
          setMessages([initialMessage]);
          setCurrentSessionId(response.data.sessionId);
          setCurrentTpodId(response.data.tpodId);
          setConnectionStatus('connected');
          
          console.log('✅ Session initialized:', response.data.sessionId);
        } else {
          throw new Error('Failed to start pod session');
        }
      } catch (error) {
        console.error('❌ Failed to initialize session:', error);
        setConnectionStatus('error');
        
        // Fallback message
        const fallbackMessage = {
          id: 1,
          sender: 'customer',
          text: "Hello! I have a concern I'd like to discuss. Can you help me?",
          timestamp: new Date(),
          emotion: 'neutral',
        };
        setMessages([fallbackMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // Start session timer
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Handle voice message - populate text field without auto-sending
  const handleVoiceMessage = (transcript) => {
    const safeTranscript = String(transcript || '').trim();
    console.log('🎤 Voice transcript:', safeTranscript, 'Type:', typeof safeTranscript);
    
    if (safeTranscript) {
      setCurrentMessage(safeTranscript);
    }
  };

  // Direct voice send - no review needed
  const handleDirectVoiceSend = (transcript) => {
    const safeTranscript = String(transcript || '').trim();
    if (safeTranscript && !isLoading) {
      console.log('🎤 Direct voice send:', safeTranscript);
      handleSendMessage(safeTranscript);
    }
  };

  // Send message to Spring Boot API
  const handleSendMessage = async (messageOverride = null) => {
    const messageToSend = messageOverride || currentMessage || '';
    const trimmedMessage = String(messageToSend).trim();
    
    if (!trimmedMessage || isLoading) return;

    setIsLoading(true);
    setIsTyping(true);

    const userMessage = {
      id: Date.now(),
      sender: 'agent',
      text: String(trimmedMessage),
      timestamp: new Date(),
    };
    
    console.log('✅ User message created:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      const response = await apiService.sendMessage({
        sessionId: currentSessionId,
        tpodId: currentTpodId,
        message: trimmedMessage,
      });

      if (response && response.success) {
        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + 1,
            sender: 'customer',
            text: String(response.data.aiResponse || 'Thank you for your response.'),
            timestamp: new Date(),
            emotion: 'neutral',
          };
          
          console.log('✅ AI message created:', aiMessage);
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1000);
      } else {
        // Fallback response
        const fallbackResponses = [
          "Thank you for your response. I appreciate your help.",
          "I understand. Can you tell me more about that?",
          "That makes sense. What would you recommend?",
          "I see. Is there anything else I should know?",
        ];

        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + 1,
            sender: 'customer',
            text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            timestamp: new Date(),
            emotion: 'neutral',
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Get feedback function
  const getFeedback = async (type = 'help') => {
    setIsGettingFeedback(true);
    setFeedbackError(null);
    setFeedbackType(type);

    try {
      const API_BASE_URL = 'http://localhost:8080/api';
      
      // Format messages to match your backend structure
      const formattedMessages = messages.map(msg => ({
        role: msg.sender === 'agent' ? 'trainee' : 'customer',
        message: typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text),
        timestamp: Math.floor(msg.timestamp?.getTime() / 1000).toString() || Math.floor(Date.now() / 1000).toString()
      }));

      // Match your exact payload structure
      const payload = {
        messages: formattedMessages,
        tpodId: currentTpodId,
        userId: "RAJ02",
        sessionId: currentSessionId
      };

      console.log('📊 Requesting feedback with payload:', payload);

      const response = await fetch(`${API_BASE_URL}/chat/get-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Feedback response received:', data);
      
      // Extract message field from your response structure
      const markdownContent = data.message || data.feedback || data || 'No feedback available';

      setFeedbackContent(markdownContent);
      setFeedbackDialogOpen(true);

    } catch (err) {
      console.error('❌ Feedback request failed:', err);
      setFeedbackError(err.message);
      
      // Fallback content
      const fallbackContent = type === 'evaluation' 
        ? generateFallbackEvaluation()
        : generateFallbackHelp();
      
      setFeedbackContent(fallbackContent);
      setFeedbackDialogOpen(true);
    } finally {
      setIsGettingFeedback(false);
    }
  };

  // Fallback content generators
  const generateFallbackHelp = () => {
    return `
# 💡 Training Tips & Help

## Current Status
- **Messages Exchanged**: ${messages.filter(m => m.sender === 'agent').length}
- **Session Duration**: ${formatDuration(sessionDuration)}

## 🎯 Key Tips for Success
1. **Show Empathy**: Use phrases like "I understand" and "I can see why you'd feel that way"
2. **Active Listening**: Acknowledge the customer's concerns before offering solutions
3. **Stay Professional**: Maintain a helpful and respectful tone throughout
4. **Ask Questions**: Use open-ended questions to better understand the situation

## 🗣️ Good Example Phrases
- "I apologize for the inconvenience you've experienced"
- "Let me help you resolve this issue"
- "I want to make sure I understand correctly..."
- "Thank you for bringing this to my attention"

## Need More Help?
Continue the conversation and click the help button again for updated guidance!
    `;
  };

  const generateFallbackEvaluation = () => {
    const agentMessages = messages.filter(m => m.sender === 'agent').length;
    return `
# 📊 Session Evaluation

## Performance Summary
- **Total Responses**: ${agentMessages}
- **Session Duration**: ${formatDuration(sessionDuration)}
- **Communication Style**: Professional and courteous
- **Overall Assessment**: Good progress in customer service skills

## 🌟 Strengths Observed
- Maintained professional tone
- Engaged actively in conversation
- Showed willingness to help

## 🚀 Areas for Improvement
- Continue practicing empathetic language
- Ask more clarifying questions
- Provide specific solutions when possible

## Final Score: **${Math.max(75, Math.min(95, 70 + agentMessages * 3))}%**

Great job on completing this training session!
    `;
  };

  // Handle quit training
  const handleQuitTraining = async () => {
    const confirmQuit = window.confirm(
      `Are you sure you want to quit this training session?\n\n` +
      `Session Progress:\n` +
      `• ${messages.filter(m => m.sender === 'agent').length} messages sent\n` +
      `• ${Math.floor(sessionDuration / 60)}m ${sessionDuration % 60}s elapsed\n\n` +
      `Your progress will not be saved.`
    );

    if (confirmQuit) {
      try {
        // Optional: Log quit action to backend
        if (currentSessionId) {
          await fetch('http://localhost:8080/api/chat/quit-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: currentSessionId,
              tpodId: currentTpodId,
              reason: 'user_quit',
              duration: sessionDuration,
              messagesExchanged: messages.filter(m => m.sender === 'agent').length
            }),
          }).catch(error => console.log('⚠️ Failed to log quit action:', error));
        }

        if (actions && actions.addNotification) {
          actions.addNotification({
            type: 'info',
            title: 'Training Quit',
            message: 'Training session was ended early',
          });
        }

        navigate('/training-center');
        
      } catch (error) {
        console.error('❌ Error quitting session:', error);
        navigate('/training-center');
      }
    }
  };

  // Handle end session from feedback
  const handleEndSessionFromFeedback = async () => {
    try {
      setIsLoading(true);
      
      const analysis = {
        sessionId: currentSessionId,
        totalMessages: messages.filter(m => m.sender === 'agent').length,
        duration: sessionDuration,
        summary: `Training session completed successfully. You exchanged ${messages.filter(m => m.sender === 'agent').length} messages over ${Math.floor(sessionDuration / 60)} minutes.`,
        suggestions: [
          'Continue practicing empathetic communication',
          'Ask more open-ended questions to better understand customer needs',
          'Maintain professional tone while showing genuine care',
          'Use active listening techniques to build rapport',
        ],
        performanceScore: Math.min(95, Math.max(60, 70 + (messages.filter(m => m.sender === 'agent').length * 3))),
      };

      setSessionAnalysis(analysis);
      setShowSessionResults(true);
      setFeedbackDialogOpen(false);

      if (actions && actions.endTrainingSession) {
        actions.endTrainingSession('current-user', sessionId);
        actions.addNotification({
          type: 'success',
          title: 'Session Completed',
          message: 'Training session completed successfully via feedback helper',
        });
      }

    } catch (error) {
      console.error('❌ Error ending session from feedback:', error);
      if (window.confirm('Error ending session. Would you like to return to the training center?')) {
        navigate('/training-center');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // End session (regular)
  const handleEndSession = async () => {
    try {
      setIsLoading(true);
      
      const analysis = {
        sessionId: currentSessionId,
        totalMessages: messages.filter(m => m.sender === 'agent').length,
        summary: 'Training session completed successfully.',
        suggestions: [
          'Continue practicing empathetic communication',
          'Ask more open-ended questions to better understand customer needs',
          'Maintain professional tone while showing genuine care',
        ],
      };

      setSessionAnalysis(analysis);
      setShowSessionResults(true);
    } catch (error) {
      console.error('❌ Error ending session:', error);
      navigate('/training-center');
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'satisfied': return '#28a745';
      case 'neutral': return '#ffc107';
      case 'frustrated': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Loading state
  if (isLoading && messages.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading training session...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Session Results Modal */}
      <Dialog 
        open={showSessionResults && sessionAnalysis} 
        maxWidth="md" 
        fullWidth
        onClose={() => setShowSessionResults(false)}
      >
        <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          🎉 Training Session Complete!
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Here's your session summary
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" color="primary">
              {sessionAnalysis?.totalMessages || 0}
            </Typography>
            <Typography variant="h6">Messages Exchanged</Typography>
            <Typography variant="body2" color="text.secondary">
              Duration: {Math.floor(sessionDuration / 60)}m {sessionDuration % 60}s
            </Typography>
          </Box>

          {sessionAnalysis?.summary && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>📋 Session Summary</Typography>
              <Typography variant="body1">{sessionAnalysis.summary}</Typography>
            </Box>
          )}

          {sessionAnalysis?.suggestions && sessionAnalysis.suggestions.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>🚀 Improvement Tips</Typography>
              {sessionAnalysis.suggestions.map((suggestion, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Chip
                    label={index + 1}
                    size="small"
                    color="primary"
                    sx={{ mr: 2, mt: 0.5, minWidth: '24px' }}
                  />
                  <Typography variant="body1">{suggestion}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/training-center')}
            sx={{ borderColor: '#FFD100', color: '#FFD100', px: 4 }}
          >
            Start New Training
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ borderColor: '#FFD100', color: '#FFD100', px: 4 }}
          >
            Back to Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh',
            minHeight: '60vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: feedbackType === 'evaluation' ? '#FF9800' : '#2196F3',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {feedbackType === 'evaluation' ? <FeedbackIcon /> : <HelpIcon />}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {feedbackType === 'evaluation' ? '📊 Performance Evaluation' : '💡 Training Help & Tips'}
            </Typography>
          </Box>
          <IconButton onClick={() => setFeedbackDialogOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {feedbackError && (
            <Box sx={{ p: 3, pb: 0 }}>
              <Chip
                label="Using offline content"
                color="warning"
                variant="outlined"
                size="small"
              />
            </Box>
          )}

          {/* Enhanced Markdown Content */}
          <Box
            sx={{
              p: 3,
              maxHeight: '60vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              '& h1': { 
                fontSize: '1.75rem', 
                fontWeight: 700, 
                mb: 3, 
                color: '#1976D2',
                borderBottom: '2px solid #E3F2FD',
                pb: 2
              },
              '& h2': { 
                fontSize: '1.4rem', 
                fontWeight: 600, 
                mb: 2, 
                mt: 3,
                color: '#333',
              },
              '& h3': { 
                fontSize: '1.15rem', 
                fontWeight: 600, 
                mb: 1.5,
                mt: 2,
                color: '#555' 
              },
              '& p': { 
                mb: 1.8, 
                lineHeight: 1.7,
                fontSize: '0.95rem',
                color: '#444'
              },
              '& ul': { 
                mb: 2, 
                pl: 3,
                '& li': {
                  mb: 1,
                  lineHeight: 1.6,
                  fontSize: '0.9rem',
                  color: '#555'
                }
              },
              '& strong': { 
                fontWeight: 700, 
                color: '#1976D2' 
              },
            }}
          >
            <ReactMarkdown>{feedbackContent}</ReactMarkdown>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'space-between', borderTop: '1px solid #E0E0E0' }}>
          <Box>
            <Button
              onClick={handleQuitTraining}
              color="error"
              variant="outlined"
              size="medium"
            >
              Quit Training
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {feedbackType === 'help' && (
              <Button
                onClick={() => getFeedback('evaluation')}
                variant="outlined"
                color="warning"
                size="medium"
              >
                Get Full Evaluation
              </Button>
            )}
            
            {feedbackType === 'evaluation' && (
              <Button
                onClick={handleEndSessionFromFeedback}
                variant="contained"
                color="success"
                size="medium"
              >
                End Session
              </Button>
            )}
            
            <Button
              onClick={() => setFeedbackDialogOpen(false)}
              variant="contained"
              color="primary"
              size="medium"
            >
              Continue Training
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Header with Integrated Feedback Icons */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => navigate('/training-center')}
              sx={{ mr: 2, color: 'primary.main' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h1">
                {scenarioInfo?.title || 'Customer Service Training'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scenarioInfo?.description || 'Customer Service Excellence'} • 
                Duration: {formatDuration(sessionDuration)} • 
                Status: {connectionStatus}
              </Typography>
            </Box>
          </Box>
          
          {/* Action Buttons with Feedback Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Help Button */}
            <Tooltip title="Get Training Tips & Help" arrow>
              <IconButton
                onClick={() => getFeedback('help')}
                disabled={isGettingFeedback}
                sx={{
                  color: '#2196F3',
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {isGettingFeedback && feedbackType === 'help' ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <HelpIcon />
                )}
              </IconButton>
            </Tooltip>

            {/* Evaluation Button */}
            <Tooltip title="Get Performance Evaluation" arrow>
              <IconButton
                onClick={() => getFeedback('evaluation')}
                disabled={isGettingFeedback}
                sx={{
                  color: '#FF9800',
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 152, 0, 0.2)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {isGettingFeedback && feedbackType === 'evaluation' ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FeedbackIcon />
                )}
              </IconButton>
            </Tooltip>

            {/* End Session Button */}
            <Button
              variant="outlined"
              color="error"
              onClick={handleEndSession}
              sx={{ 
                ml: 1,
                borderColor: '#F44336',
                color: '#F44336',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  borderColor: '#D32F2F',
                }
              }}
            >
              <StopIcon sx={{ mr: 1 }} />
              End Session
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Chat Area - Full Width */}
      <Card sx={{ height: { xs: '70vh', md: '75vh' }, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Customer (AI Simulation)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {scenarioInfo?.title || 'Customer Service Training'} Scenario
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                mb: 2, 
                display: 'flex',
                justifyContent: message.sender === 'agent' ? 'flex-end' : 'flex-start'
              }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: { xs: '85%', md: '70%' },
                    bgcolor: message.sender === 'agent' ? 'primary.light' : 'grey.100',
                    color: message.sender === 'agent' ? 'white' : 'text.primary',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    {message.sender === 'agent' ? (
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        🙋‍♂️ Agent:
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        👤 Customer:
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body1">
                    {message && message.text
                      ? (typeof message.text === 'string'
                        ? message.text
                        : JSON.stringify(message.text).replace(/[{}\"]/g, ''))
                      : 'Empty message'
                    }
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    {message.sender === 'customer' && message.emotion && (
                      <Chip
                        label={message.emotion}
                        size="small"
                        sx={{
                          bgcolor: getEmotionColor(message.emotion),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Customer is typing...
              </Typography>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area - Simplified Direct Send */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {/* Voice Toggle */}
          <Box sx={{ 
            mb: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1
          }}>
            <Button
              variant={useVoiceInput ? "contained" : "outlined"}
              onClick={() => setUseVoiceInput(!useVoiceInput)}
              startIcon={useVoiceInput ? <MicIcon /> : <MicOffIcon />}
              size="small"
              sx={{ 
                minWidth: { xs: '100%', sm: '140px' },
                bgcolor: useVoiceInput ? 'primary.main' : 'transparent',
                color: useVoiceInput ? 'white' : 'primary.main',
              }}
            >
              {useVoiceInput ? 'Voice Mode' : 'Text Mode'}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ 
              textAlign: { xs: 'center', sm: 'left' },
              mt: { xs: 1, sm: 0 }
            }}>
              {useVoiceInput ? 'Speak to send message directly' : 'Type your message'}
            </Typography>
          </Box>

          {/* Conditional Input - Only ONE at a time */}
          {useVoiceInput ? (
            // Voice Input Mode - Auto Send
            <Box sx={{ 
              border: '2px dashed #1976d2', 
              borderRadius: 2, 
              p: 3, 
              textAlign: 'center',
              bgcolor: 'rgba(25, 118, 210, 0.05)',
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              <VoiceInput 
                onTranscriptSend={handleDirectVoiceSend} 
                placeholder="Click microphone and speak - message will send automatically"
              />
              
              {/* Loading indicator for voice */}
              {isLoading && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="caption">Sending your message...</Typography>
                </Box>
              )}
            </Box>
          ) : (
            // Text Input Mode - Manual Send
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1 
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                placeholder="Type your response here..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{ 
                  minWidth: { xs: '100%', sm: '120px' },
                  minHeight: '56px',
                  borderRadius: 2,
                }}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          )}
        </Box>
      </Card>
    </Container>
  );
}

export default TrainingSession;
