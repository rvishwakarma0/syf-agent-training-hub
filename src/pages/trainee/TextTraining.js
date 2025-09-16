import { useState, useEffect, useRef } from 'react';
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
} from '@mui/icons-material';
import { nanoid } from 'nanoid';

import { motion } from 'framer-motion';
import VoiceInput from '../../components/VoiceInput/VoiceInput';
import apiService from '../../services/apiService';
import TpOdService from '../../services/TpOdService';
import Feedback from '../../components/Feedback/Feedback';

const TextTraining = () => {
  const { tpodId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  // State management
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [feedback, setFeedback] = useState(false);
  const [session, setSession] = useState(true);
    const [transformedMessages, setTransformedMessages] = useState([]);
  const hasInitialized = useRef(false);
  const [tpod, settpod] = useState({});

  // Initialize session
useEffect(() => {
  if (hasInitialized.current) return; // Prevent double execution
  hasInitialized.current = true;
  const initializeSession = async () => {
    setIsLoading(true);
    setConnectionStatus("connecting");
    const msgs = [];
    try {
      // ✅ Run both APIs in parallel
      const [tpodData, podResponse] = await Promise.all([
        TpOdService.getTpOdById(tpodId),
        apiService.startPod({ tpodId, userId }),
      ]);
      // ✅ Set tpod data
      settpod(tpodData);
      // ✅ Build chat messages
      if (tpodData?.data?.firstMessage) {
        msgs.push({
          id: nanoid(5),
          sender: "agent",
          text: tpodData?.data?.firstMessage,
          timestamp: new Date().toISOString(),
        });
      }
      if (podResponse?.success) {
        msgs.push({
          id: nanoid(5),
          sender: "customer",
          text: podResponse.data.message,
          timestamp: podResponse.data.timestamp,
        });
        console.log("from useEffect", msgs);
        setMessages(msgs);
        setCurrentSessionId(podResponse.data.sessionId);
        setConnectionStatus("connected");
      } else {
        throw new Error("Failed to start pod session");
      }
    } catch (error) {
      console.error("❌ Failed to initialize session:", error);
      setConnectionStatus("error");
      setMessages([
        { id: nanoid(5), sender: "system", text: "Failed to load session" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  initializeSession();
}, []); // 👈 only runs once on mount

  // Auto-scroll to bottom
  useEffect(() => {
    console.log(messages)
    setTransformedMessages(transformMessages());
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

  // Direct voice send - no review needed
  const handleDirectVoiceSend = (transcript) => {
    const safeTranscript = String(transcript || '').trim();
    if (safeTranscript && !isLoading) {
      console.log('🎤 Direct voice send:', safeTranscript);
      handleSendMessage(safeTranscript);
    }
  };

  const transformMessages = () => { 
    return messages.map(msg => ({
      role: msg.sender === 'agent' ? 'trainee' : 'customer',
      message: msg.text || ""
    }));  
  }

  // Send message to Spring Boot API
  const handleSendMessage = async (messageOverride = null) => {
    let messageToSend;
    if(typeof messageOverride == "string") {
      messageToSend = messageOverride;
    }else{
      messageToSend = currentMessage;
    }
    const trimmedMessage = String(messageToSend).trim();
    console.log('➡️ Sending message:', trimmedMessage);
    if (!trimmedMessage || isLoading) return;

    setIsLoading(true);
    setIsTyping(true);

    const userMessage = {
      id: nanoid(5),
      sender: 'agent',
      text: String(trimmedMessage),
      timestamp: new Date().toISOString(),
    };

    console.log('✅ User message created:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      const response = await apiService.sendMessage({
        sessionId: currentSessionId,
        tpodId: tpodId,
        message: trimmedMessage,
      });

      if (response && response.success) {
          const aiMessage = {
            id: nanoid(5),
            sender: 'customer',
            text: String(response.data.message),
            timestamp: response.data.timestamp,
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
      } 
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
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
              onClick={() => setFeedback(true)}
              disabled={!session}
              sx={{
                ml: 1,
                borderColor: '#eef436ff',
                color: '#f4eb36ff',
                '&:hover': {
                  bgcolor: 'rgba(228, 190, 64, 0.1)',
                  borderColor: '#d3cd2fff',
                }
              }}
            >
              <StopIcon sx={{ mr: 1 }} />
              Help & Feedback
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setSession(false)}
              disabled={!session}
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
      {session ? (<Card sx={{ height: { xs: '70vh', md: '75vh' }, display: 'flex', flexDirection: 'column' }}>
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
                      {message.timestamp}
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
      </Card>): (<Feedback conversationMessages={transformedMessages} type = "ES" tpodId={tpodId} userId={userId} sessionId={currentSessionId} onClose={()=> setFeedback(false)} open={feedback}/>)}
      
      <Feedback conversationMessages={transformedMessages} tpodId={tpodId} userId={userId} sessionId={currentSessionId} onClose={()=> setFeedback(false)} open={feedback}/>

    </Container>
  );
};

export default TextTraining;
