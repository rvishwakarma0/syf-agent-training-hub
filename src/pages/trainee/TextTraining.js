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
  CircularProgress,

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
import { SEND_MSG_CHAT_URL, START_POD_CHAT_URL } from '../../urlConfig';
import TpOdService from '../../services/TpOdService';

// Updated apiService for Spring Boot integration
const apiService = {
  // Start Pod Session
  async startPod(tpodId, userId) {
    try {
      const payload = {
        tpodId: tpodId,
        userId: userId,
      };

      console.log('🚀 Starting Spring Boot pod session:', payload);

      const response = await fetch(`${START_POD_CHAT_URL}`, {
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
          message: data.message,
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
    try {
      const payload = {
        sessionId: messageData.sessionId,
        tpodId: messageData.tpodId,
        message: messageData.message,
      };

      console.log('💬 Sending message to Spring Boot:', payload);

      const response = await fetch(`${SEND_MSG_CHAT_URL}`, {
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

}

const TextTraining = () => {
  const { tpodId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const messagesEndRef = useRef(null);

  // State management
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentTpodId, setCurrentTpodId] = useState(tpodId);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [scenarioInfo, setScenarioInfo] = useState(null);
  const [showSessionResults, setShowSessionResults] = useState(false);
  const [sessionAnalysis, setSessionAnalysis] = useState(null);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    title: '',
    content: '',
  });
  const [tpod, settpod] = useState({});

  // Initialize session
  useEffect(() => {

    const initializeSession = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      const Ttpod = await TpOdService.getTpOdById(tpodId);
      settpod(Ttpod);

      const msgs = [];
      msgs.push({
        id: 1,
        sender: 'agent',
        text: tpod.firstMessage,
        timestamp: new Date(),
      });


      const userId = JSON.parse(localStorage.getItem('user'))?.id;

      try {

        const response = await apiService.startPod({
          tpodId: tpodId,
          userId: userId,
        });

        if (response && response.success) {
          const initialMessage = {
            id: 1,
            sender: 'customer',
            text: response.data.message,
            timestamp: new Date(),
          };

          msgs.push(initialMessage);

          setMessages(msgs);
          setCurrentSessionId(response.data.sessionId);
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
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDuration = (seconds) => {
    try {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    } catch {
      return seconds;
    }
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
          "",
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
        }, 90000);
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle end session
  const handleEndSession = () => {
    navigate('/training-center');
    // TODO HELP AND FEEDBACK COMPONENT 

  };

  // Close feedback dialog
  const closeFeedbackDialog = () => {
    setFeedbackDialog({
      open: false,
      title: '',
      content: '',
    });
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
                {tpod?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tpod?.summary} •
                Duration: {formatDuration(sessionDuration)} •
                Status: {connectionStatus}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons with Feedback Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                {tpod?.name} Scenario
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
};

export default TextTraining;
