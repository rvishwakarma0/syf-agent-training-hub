import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Button,
  TextField,
  Avatar,
  LinearProgress,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Stop as StopIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';

function TrainingSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [empathyScore, setEmpathyScore] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [scenarioInfo, setScenarioInfo] = useState(null);
  const [showSessionResults, setShowSessionResults] = useState(false);
  const [sessionAnalysis, setSessionAnalysis] = useState(null);
  const [metrics, setMetrics] = useState({
    empathyKeywords: 0,
    activeListening: 0,
    solutionOriented: 0,
    politeness: 0,
  });

  // Scenario definitions for direct access
  const scenarios = {
    'customer-service': {
      title: 'Customer Service Excellence',
      description: 'Practice handling customer complaints with empathy',
      initialMessage: "Hi, I'm really frustrated with your service! I've been trying to resolve this issue for weeks and nobody seems to care. Can you actually help me or are you going to give me the runaround like everyone else?"
    },
    'sales-conversation': {
      title: 'Sales Conversation',
      description: 'Learn to build rapport and close deals effectively',
      initialMessage: "I'm interested in your loan products, but I've had bad experiences with banks before. Why should I trust you guys? What makes you different?"
    },
    'difficult-customer': {
      title: 'Difficult Customer Handling',
      description: 'De-escalate tense situations with angry customers',
      initialMessage: "This is absolutely ridiculous! I've been charged fees that I never agreed to, and when I called last time, your representative was completely useless. I want these charges removed NOW!"
    },
    'loan-consultation': {
      title: 'Loan Consultation',
      description: 'Guide customers through loan application process',
      initialMessage: "I need a loan but my credit isn't perfect. I'm worried you'll just reject me like the other banks did. Is there even a point in applying?"
    }
  };

  // Find session and agent, or create mock data for direct access
  const session = state.sessions[sessionId] || {
    scenario: sessionId,
    agentId: 'current-user'
  };
  
  const agent = state.agents.find(a => a.id === session.agentId) || {
    id: 'current-user',
    name: 'Training Agent',
    avatar: '👤'
  };

  useEffect(() => {
    // Set scenario info
    const currentScenario = scenarios[sessionId] || scenarios['customer-service'];
    setScenarioInfo(currentScenario);

    // Initialize session with scenario message
    const initializeSession = async () => {
      setIsLoading(true);
      try {
        console.log('Starting scenario for:', sessionId);
        const response = await apiService.startScenario({
          scenario: sessionId, // Use sessionId as scenario type
        });

        if (response && response.success) {
          const initialMessage = {
            id: 1,
            sender: 'customer',
            text: response.data.initialMessage,
            timestamp: new Date(),
            emotion: response.data.customerEmotion || 'frustrated',
          };
          setMessages([initialMessage]);
          
          // Store the real sessionId from AWS
          if (response.data.sessionId) {
            console.log('Real AWS Session ID:', response.data.sessionId);
            // Update URL or store sessionId for future API calls
            window.awsSessionId = response.data.sessionId;
          }
        } else {
          // Fallback with scenario data
          const initialMessage = {
            id: 1,
            sender: 'customer',
            text: currentScenario.initialMessage,
            timestamp: new Date(),
            emotion: 'frustrated',
          };
          setMessages([initialMessage]);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        // Fallback with scenario data
        const initialMessage = {
          id: 1,
          sender: 'customer',
          text: currentScenario.initialMessage,
          timestamp: new Date(),
          emotion: 'frustrated',
        };
        setMessages([initialMessage]);
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

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const startTime = Date.now();
    setIsLoading(true);
    setIsTyping(true);

    // Add user message
    const userMessage = {
      id: Date.now(), // Use timestamp for unique ID
      sender: 'agent',
      text: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');

    try {
      // Use real AWS sessionId if available, otherwise use route sessionId
      const sessionIdToUse = window.awsSessionId || sessionId;
      console.log('Sending message to AWS Lambda with sessionId:', sessionIdToUse);
      
      // Call your real AWS API
      const response = await apiService.sendMessage({
        sessionId: sessionIdToUse,
        message: messageToSend,
      });

      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;

      if (response && response.success) {
        // Update metrics with real AWS response
        const realEmpathyScore = response.data.empathyScore || 75;
        setEmpathyScore(realEmpathyScore);
        setResponseTime(response.data.responseTime || responseTimeMs / 1000);
        setFeedback(response.data.feedback || 'Good response!');
        
        // Update complex metrics
        setMetrics({
          empathyKeywords: Math.min(realEmpathyScore + Math.random() * 10, 100),
          activeListening: Math.min(realEmpathyScore - 5 + Math.random() * 10, 100),
          solutionOriented: Math.min(realEmpathyScore - 10 + Math.random() * 15, 100),
          politeness: Math.min(realEmpathyScore + 5 + Math.random() * 5, 100),
        });

        // Add real AI response from AWS
        setTimeout(() => {
          const aiMessage = {
            id: Date.now(), // Use timestamp for unique ID
            sender: 'customer',
            text: response.data.aiResponse || 'Thank you for your response.',
            timestamp: new Date(),
            emotion: realEmpathyScore >= 80 ? 'satisfied' : 
                    realEmpathyScore >= 60 ? 'neutral' : 'frustrated',
          };
          
          // Only add the AI response, user message already added above
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1500);
      } else {
        // Fallback simulation
        const simulatedScore = Math.min(60 + Math.random() * 30, 100);
        setEmpathyScore(simulatedScore);
        setResponseTime(responseTimeMs / 1000);
        setFeedback(simulatedScore >= 80 ? "Great empathetic response!" : "Try to show more understanding.");
        
        setMetrics({
          empathyKeywords: Math.min(simulatedScore + Math.random() * 10, 100),
          activeListening: Math.min(simulatedScore - 5 + Math.random() * 10, 100),
          solutionOriented: Math.min(simulatedScore - 10 + Math.random() * 15, 100),
          politeness: Math.min(simulatedScore + 5 + Math.random() * 5, 100),
        });

        // Simulated responses
        const responses = [
          "Thank you for understanding. I appreciate your help with this.",
          "I'm feeling a bit better about this situation now.",
          "Okay, I see what you're saying. What should I do next?",
          "That makes sense. I hadn't thought of it that way.",
          "I still have some concerns, but you're being helpful."
        ];

        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + 1, // Use timestamp for unique ID
            sender: 'customer',
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            emotion: simulatedScore >= 80 ? 'satisfied' : 
                    simulatedScore >= 60 ? 'neutral' : 'frustrated',
          };
          
          // Only add the AI response, user message already added above
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1500);
      }

      // Update agent empathy score in global state if available
      if (actions && actions.updateEmpathyScore) {
        actions.updateEmpathyScore(agent.id, empathyScore);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // On error, still provide fallback response so conversation continues
      const fallbackScore = Math.min(60 + Math.random() * 20, 100);
      setEmpathyScore(fallbackScore);
      setResponseTime(3.0);
      setFeedback("Message sent! (Using fallback due to API connectivity)");
      
      // Add fallback AI response
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 2,
          sender: 'customer',
          text: "I understand you're trying to help. Let me think about what you've said.",
          timestamp: new Date(),
          emotion: 'neutral',
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
      
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    try {
      setIsLoading(true);
      
      // Get session analysis from API
      const sessionIdToUse = window.awsSessionId || sessionId;
      console.log('Ending session and fetching analysis for:', sessionIdToUse);
      
      const analysisResponse = await apiService.getAnalysis(sessionIdToUse);
      
      if (analysisResponse && analysisResponse.success) {
        setSessionAnalysis(analysisResponse.data);
        setShowSessionResults(true);
        
        // Update context
        if (actions && actions.endTrainingSession) {
          actions.endTrainingSession(agent.id, sessionId);
          actions.addNotification({
            type: 'success',
            title: 'Session Completed',
            message: `Training session completed successfully`,
          });
        }
      } else {
        console.error('Failed to get session analysis');
        // Navigate back anyway
        navigate('/training-center');
      }
    } catch (error) {
      console.error('Error ending session:', error);
      navigate('/training-center');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'satisfied': return '#28a745';
      case 'neutral': return '#ffc107';
      case 'frustrated': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getEmpathyScoreColor = (score) => {
    if (score >= 85) return '#28a745';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
  };

  if (isLoading && messages.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading training session...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: 'calc(100vh - 64px)', // Account for header
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8f9fa'
    }}>
      {/* Session Results Modal */}
      {showSessionResults && sessionAnalysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}
          >
            <Card sx={{ p: 4, background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)', color: 'white' }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#FFD100', mb: 2 }}>
                  🎉 Training Session Complete!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Here's your personalized performance analysis
                </Typography>
              </Box>

              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
                    <Typography variant="h1" sx={{ fontWeight: 700, color: '#FFD100', mb: 1 }}>
                      {sessionAnalysis.overallScore}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Empathy Score
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                      out of 10
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
                    <Typography variant="h2" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                      {sessionAnalysis.totalMessages}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Messages
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                      exchanged
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
                    <Typography variant="h2" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                      {Math.floor(sessionDuration / 60)}m
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                      training time
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {sessionAnalysis.summary && (
                <Box sx={{ mb: 4, p: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#FFD100' }}>
                    📋 Session Summary
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {sessionAnalysis.summary}
                  </Typography>
                </Box>
              )}

              {sessionAnalysis.suggestions && sessionAnalysis.suggestions.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#FFD100' }}>
                    🚀 Your Personalized Improvement Plan
                  </Typography>
                  <Grid container spacing={2}>
                    {sessionAnalysis.suggestions.map((suggestion, index) => (
                      <Grid item xs={12} key={index}>
                        <Box 
                          sx={{ 
                            p: 3, 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                            borderRadius: 3,
                            border: '1px solid rgba(255, 209, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                              transform: 'translateY(-2px)',
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box
                              sx={{
                                minWidth: 30,
                                height: 30,
                                borderRadius: '50%',
                                backgroundColor: '#FFD100',
                                color: '#003DA5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.6 }}>
                              {suggestion}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/training-center')}
                  sx={{
                    borderColor: '#FFD100',
                    color: '#FFD100',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FFD100',
                      backgroundColor: 'rgba(255, 209, 0, 0.1)',
                    },
                  }}
                >
                  Start New Training
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/analytics')}
                  sx={{
                    borderColor: '#FFD100',
                    color: '#FFD100',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#FFD100',
                      backgroundColor: 'rgba(255, 209, 0, 0.1)',
                    },
                  }}
                >
                  View Full Analytics
                </Button>
              </Box>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Sticky Header - Always visible */}
      <Box sx={{ 
        flexShrink: 0, 
        py: 2,
        px: 2,
        position: 'sticky',
        top: 0,
        backgroundColor: '#f8f9fa',
        zIndex: 10,
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '1200px', mx: 'auto' }}>
            <IconButton
              onClick={() => navigate('/training-center')}
              sx={{ mr: 2, color: '#003DA5' }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#003DA5',
                  fontSize: '1.25rem',
                }}
              >
                Training Session: {scenarioInfo?.title || 'Customer Service Training'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6c757d',
                  fontSize: '0.875rem',
                }}
              >
                Scenario: {scenarioInfo?.description || 'Customer Service Excellence'} • 
                Duration: {formatDuration(sessionDuration)}
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={handleEndSession}
              sx={{
                borderColor: '#dc3545',
                color: '#dc3545',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#c82333',
                  backgroundColor: 'rgba(220, 53, 69, 0.05)',
                },
              }}
            >
              End Session
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex',
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%',
        p: 2,
        gap: 2,
        minHeight: 0 // Important for flex
      }}>
        {/* Chat Column */}
        <Box sx={{ 
          flex: '1 1 65%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: 0 // Important for flex
            }}>
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid #e9ecef',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  flexShrink: 0
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#dc3545',
                    }}
                  >
                    👤
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                      Customer (AI Simulation)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.8rem' }}>
                      {scenarioInfo?.title || 'Customer Service Training'} Scenario
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Messages Area - Simplified scrolling */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  minHeight: 0
                }}
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ marginBottom: 16 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: message.sender === 'agent' ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            maxWidth: '75%',
                            minWidth: '200px',
                            background: message.sender === 'agent' 
                              ? '#003DA5' 
                              : '#ffffff',
                            color: message.sender === 'agent' ? '#ffffff' : '#343a40',
                            borderRadius: message.sender === 'agent' 
                              ? '20px 20px 4px 20px' 
                              : '20px 20px 20px 4px',
                            boxShadow: message.sender === 'agent' 
                              ? '0 4px 12px rgba(0, 61, 165, 0.3)'
                              : '0 2px 8px rgba(0, 0, 0, 0.1)',
                            border: message.sender === 'agent' ? 'none' : '1px solid #e9ecef',
                          }}
                        >
                          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            {message.sender === 'agent' && '🙋‍♂️ Agent: '}
                            {message.sender === 'customer' && '👤 Customer: '}
                            {message.text}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: message.sender === 'agent' 
                                  ? 'rgba(255, 255, 255, 0.7)' 
                                  : '#6c757d',
                              }}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            
                            {message.sender === 'customer' && message.emotion && (
                              <Chip
                                label={message.emotion}
                                size="small"
                                sx={{
                                  backgroundColor: getEmotionColor(message.emotion),
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            )}
                          </Box>
                        </Paper>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: '#ffffff',
                          borderRadius: '20px 20px 20px 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {[1, 2, 3].map((dot) => (
                            <Box
                              key={dot}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#6c757d',
                                animation: `typingAnimation 1.4s infinite ease-in-out`,
                                animationDelay: `${(dot - 1) * 0.16}s`,
                                '@keyframes typingAnimation': {
                                  '0%, 80%, 100%': {
                                    transform: 'scale(0.8)',
                                    opacity: 0.5,
                                  },
                                  '40%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                          Customer is typing...
                        </Typography>
                      </Paper>
                    </Box>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input - Always visible */}
              <Box sx={{ 
                p: 2, 
                borderTop: '1px solid #e9ecef',
                backgroundColor: 'white',
                flexShrink: 0
              }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type your empathetic response..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      borderRadius: 3,
                      px: 3,
                      color: 'white',
                      fontWeight: 600,
                      minWidth: '120px',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      },
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Box>

        {/* Metrics Sidebar - Scrollable but doesn't affect chat */}
        <Box sx={{ 
          flex: '0 0 320px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2, 
              height: '100%',
              overflowY: 'auto'
            }}>
              {/* Current Empathy Score */}
              <Card sx={{ p: 3, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <PsychologyIcon sx={{ color: '#003DA5' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Empathy Score
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      color: getEmpathyScoreColor(empathyScore),
                      mb: 1,
                    }}
                  >
                    {empathyScore}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={empathyScore}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#e9ecef',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${getEmpathyScoreColor(empathyScore)} 0%, #FFD100 100%)`,
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#003DA5' }}>
                      {responseTime.toFixed(1)}s
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      Response Time
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#003DA5' }}>
                      {messages.filter(m => m.sender === 'agent').length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      Messages Sent
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Performance Breakdown */}
              <Card sx={{ p: 3, flexShrink: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Performance Breakdown
                </Typography>

                {Object.entries(metrics).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#003DA5' }}>
                        {Math.round(value)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={value}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#e9ecef',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #003DA5 0%, #FFD100 100%)',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Card>

              {/* AI Feedback */}
              {feedback && (
                <Card sx={{ p: 3, flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LightbulbIcon sx={{ color: '#FFD100' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI Feedback
                    </Typography>
                  </Box>
                  
                  <Alert 
                    severity={empathyScore >= 80 ? 'success' : empathyScore >= 60 ? 'warning' : 'error'}
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        fontSize: '0.9rem',
                      },
                    }}
                  >
                    {feedback}
                  </Alert>
                </Card>
              )}
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}

export default TrainingSession;
