import React, { useState, useRef, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Stop as StopIcon,
  Clear as ClearIcon,
  VolumeUp as VolumeUpIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const NovaSonicVoiceChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  
  const socketRef = useRef(null);
  
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const initialRequestSentRef = useRef(false);
  
  // WebSocket connection setup
//   const connectWebSocket = useCallback(() => {
//     try {
//       setError('');
//       const ws = new WebSocket('ws://localhost:8080/nova-sonic-stream');
      
//       ws.onopen = () => {
//         console.log('🔗 Connected to Nova Sonic WebSocket');
//         setIsConnected(true);
//         setStatus('Connected');
//         initialRequestSentRef.current = false;
        
//         // Send initial session start
//         sendInitialRequest(ws);
//       };
      
//       ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           handleNovaResponse(data);
//         } catch (e) {
//           console.error('❌ Error parsing WebSocket message:', e);
//         }
//       };
      
//       ws.onerror = (error) => {
//         console.error('❌ WebSocket error:', error);
//         setError('WebSocket connection failed');
//         setStatus('Connection Error');
//       };
      
//       ws.onclose = (event) => {
//         console.log('📵 WebSocket disconnected:', event);
//         setIsConnected(false);
//         setStatus('Disconnected');
//         wsRef.current = null;
//       };
      
//       wsRef.current = ws;
      
//     } catch (e) {
//       console.error('❌ Failed to connect:', e);
//       setError('Failed to establish connection');
//     }
//   }, []);
  

const connectWebSocket = useCallback(() => {
    try {
      setError('');
      setStatus('Connecting...');
      
      // ✅ FIXED: Use SockJS client instead of raw WebSocket
      const socket = new SockJS('http://localhost:8080/nova-sonic-stream');
      
      socket.onopen = () => {
        console.log('🔗 Connected to Nova Sonic via SockJS');
        setIsConnected(true);
        setStatus('Connected');
        
        // Send initial session start
        sendInitialRequest(socket);
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received from Nova Sonic:', data);
          handleNovaResponse(data);
        } catch (e) {
          console.error('❌ Error parsing message:', e);
        }
      };
      
      socket.onerror = (error) => {
        console.error('❌ SockJS error:', error);
        setError('Connection failed - Check backend configuration');
        setStatus('Connection Error');
      };
      
      socket.onclose = (event) => {
        console.log('📵 SockJS disconnected');
        setIsConnected(false);
        setStatus('Disconnected');
        socketRef.current = null;
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };
      
      socketRef.current = socket;
      
    } catch (e) {
      console.error('❌ Failed to connect:', e);
      setError('Failed to establish connection: ' + e.message);
    }
  }, []);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === SockJS.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  const sendInitialRequest = (ws) => {
    if (initialRequestSentRef.current) return;
    
    const sessionStart = {
      event: {
        sessionStart: {
          inferenceConfiguration: {
            maxTokens: 1024,
            topP: 0.9,
            temperature: 0.7
          }
        }
      }
    };
    
    ws.send(JSON.stringify(sessionStart));
    initialRequestSentRef.current = true;
    
    // Start prompt after session
    setTimeout(() => {
      sendPromptStart(ws);
    }, 500);
  };
  
  const sendPromptStart = (ws) => {
    const promptStart = {
      event: {
        promptStart: {
          promptName: `prompt-${Date.now()}`,
          textOutputConfiguration: {
            mediaType: "text/plain"
          },
          audioOutputConfiguration: {
            mediaType: "audio/lpcm",
            sampleRateHertz: 24000,
            sampleSizeBits: 16,
            channelCount: 1,
            voiceId: "matthew",
            encoding: "base64",
            audioType: "SPEECH"
          }
        }
      }
    };
    
    ws.send(JSON.stringify(promptStart));
    
    // Send system prompt
    setTimeout(() => {
      sendSystemPrompt(ws);
    }, 300);
  };
  
  const sendSystemPrompt = (ws) => {
    const systemContentName = `system-${Date.now()}`;
    
    // Content start
    const contentStart = {
      event: {
        contentStart: {
          promptName: `prompt-${Date.now()}`,
          contentName: systemContentName,
          type: "TEXT",
          role: "SYSTEM",
          interactive: false,
          textInputConfiguration: {
            mediaType: "text/plain"
          }
        }
      }
    };
    
    ws.send(JSON.stringify(contentStart));
    
    // System message
    const systemMessage = {
      event: {
        textInput: {
          promptName: `prompt-${Date.now()}`,
          contentName: systemContentName,
          content: "You are a helpful AI assistant in a training application. Keep responses concise and professional."
        }
      }
    };
    
    ws.send(JSON.stringify(systemMessage));
    
    // Content end
    const contentEnd = {
      event: {
        contentEnd: {
          promptName: `prompt-${Date.now()}`,
          contentName: systemContentName
        }
      }
    };
    
    ws.send(JSON.stringify(contentEnd));
  };
  
  const handleNovaResponse = (data) => {
    console.log('📨 Nova Sonic response:', data);
    
    if (data.event) {
      const { event } = data;
      
      if (event.textOutput) {
        const { role, content } = event.textOutput;
        addMessage(role || 'assistant', content, 'text');
      }
      else if (event.audioOutput) {
        const { content } = event.audioOutput;
        playAudioResponse(content);
        addMessage('assistant', 'Audio Response', 'audio');
      }
      else if (event.status) {
        setStatus(event.status.message || 'Status update');
      }
      else if (event.error) {
        setError(event.error.message || 'Unknown error');
      }
    }
  };
  
  const addMessage = (role, content, type = 'text') => {
    const message = {
      id: Date.now() + Math.random(),
      role,
      content,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, message]);
  };
  
  const playAudioResponse = async (base64Audio) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        uint8Array[i] = audioData.charCodeAt(i);
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      
      console.log('🔊 Playing audio response');
      
    } catch (error) {
      console.error('❌ Error playing audio:', error);
    }
  };
  
  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        processRecording();
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('Recording...');
      
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      setError('Failed to access microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setStatus('Processing...');
    }
  };
  
  const processRecording = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioBase64 = await blobToBase64(audioBlob);
      
      // Send audio to Nova Sonic
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const audioContentName = `audio-${Date.now()}`;
        
        // Start audio content
        const audioContentStart = {
          event: {
            contentStart: {
              promptName: `prompt-${Date.now()}`,
              contentName: audioContentName,
              type: "AUDIO",
              role: "USER",
              interactive: true,
              audioInputConfiguration: {
                mediaType: "audio/webm",
                sampleRateHertz: 16000,
                sampleSizeBits: 16,
                channelCount: 1,
                audioType: "SPEECH",
                encoding: "base64"
              }
            }
          }
        };
        
        wsRef.current.send(JSON.stringify(audioContentStart));
        
        // Send audio data
        const audioInput = {
          event: {
            audioInput: {
              promptName: `prompt-${Date.now()}`,
              contentName: audioContentName,
              content: audioBase64.split(',')[1] // Remove data:audio/webm;base64, prefix
            }
          }
        };
        
        wsRef.current.send(JSON.stringify(audioInput));
        
        // End content
        const audioContentEnd = {
          event: {
            contentEnd: {
              promptName: `prompt-${Date.now()}`,
              contentName: audioContentName
            }
          }
        };
        
        wsRef.current.send(JSON.stringify(audioContentEnd));
        
        addMessage('user', 'Audio Message', 'audio');
      }
      
    } catch (error) {
      console.error('❌ Error processing recording:', error);
      setError('Failed to process audio');
    } finally {
      setIsProcessing(false);
      setStatus('Connected');
    }
  };
  
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setIsRecording(false);
    setIsProcessing(false);
    setStatus('Disconnected');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <div>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#003DA5' }}>
              🎤 Nova Sonic Voice Chat
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AI-powered speech-to-speech conversation with AWS Nova Sonic
            </Typography>
          </div>
          <Box display="flex" gap={1} alignItems="center">
            <Chip 
              icon={<Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: isConnected ? '#4ade80' : '#f87171' 
              }} />}
              label={status} 
              color={isConnected ? 'success' : 'error'} 
              variant="outlined"
            />
            {isRecording && (
              <Chip 
                icon={<MicIcon />}
                label="REC" 
                color="error" 
                sx={{ animation: 'pulse 1s infinite' }}
              />
            )}
            {isProcessing && (
              <Chip 
                label="Processing..." 
                color="info"
              />
            )}
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Processing your voice message...
            </Typography>
          </Box>
        )}

        {/* Controls */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant={isConnected ? "contained" : "outlined"}
              color={isConnected ? "error" : "primary"}
              onClick={isConnected ? disconnect : connectWebSocket}
              startIcon={isConnected ? <StopIcon /> : <MicIcon />}
              sx={{ minWidth: 140 }}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
            
            <Button
              variant={isRecording ? "contained" : "outlined"}
              color={isRecording ? "warning" : "info"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isConnected || isProcessing}
              startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
              sx={{ minWidth: 140 }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            <IconButton
              onClick={clearMessages}
              disabled={messages.length === 0}
              title="Clear messages"
            >
              <ClearIcon />
            </IconButton>
            
            <IconButton
              onClick={() => window.location.reload()}
              title="Refresh page"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Messages */}
        <Paper elevation={2} sx={{ maxHeight: 400, overflow: 'auto', mb: 3 }}>
          <List>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: message.role === 'user' 
                          ? '#e3f2fd' 
                          : message.role === 'assistant' 
                            ? '#f5f5f5' 
                            : '#fff3e0',
                        borderRadius: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="caption" color="primary" fontWeight="bold">
                          {message.role === 'user' ? '👤 You' : '🤖 Nova Sonic'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {message.timestamp}
                        </Typography>
                        {message.type === 'audio' && (
                          <Chip label="🎵" size="small" />
                        )}
                      </Box>
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                    </Paper>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>

          {messages.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                {isConnected 
                  ? "Start recording to begin your conversation with Nova Sonic" 
                  : "Connect to Nova Sonic to start chatting"
                }
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Instructions */}
        <Alert severity="info">
          <Typography variant="body2">
            <strong>🎯 How to Use:</strong><br />
            1. Click <strong>Connect</strong> to establish connection with Nova Sonic<br />
            2. Click <strong>Start Recording</strong> and speak your message<br />
            3. Click <strong>Stop Recording</strong> to send your voice message<br />
            4. Listen to Nova Sonic's voice response and see the transcription<br />
            5. Continue the conversation naturally!
          </Typography>
        </Alert>
      </motion.div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </Container>
  );
};

export default NovaSonicVoiceChat;
