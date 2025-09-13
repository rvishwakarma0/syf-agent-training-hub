import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioProcessor } from '../../util/audioProcessor';
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
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Stop as StopIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const VoiceChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [logs, setLogs] = useState([]);
  
  const wsRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  
  // Add log entry
  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  }, []);
  
  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8080/nova-sonic-stream');
    ws.binaryType = 'arraybuffer';
    
    ws.onopen = () => {
      console.log('🔗 WebSocket connected');
      setIsConnected(true);
      setStatus('Connected');
      addLog('Connected to Nova Sonic Voice Chat');
    };
    
    ws.onmessage = async (event) => {
      if (event.data instanceof ArrayBuffer) {
        console.log('📨 Received audio data:', event.data.byteLength, 'bytes');
        addLog(`Received ${event.data.byteLength} bytes of audio`);
        
        // Queue the audio for playback
        audioQueueRef.current.push(event.data);
        if (!isPlayingRef.current) {
          playNextAudio();
        }
      } else if (typeof event.data === 'string') {
        console.log('📝 Received text message:', event.data);
        addLog(`Server: ${event.data}`);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setStatus('Connection Error');
      addLog('Connection error occurred');
    };
    
    ws.onclose = (event) => {
      console.log('📵 WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      setStatus('Disconnected');
      addLog(`Disconnected (${event.code}): ${event.reason || 'Connection closed'}`);
      wsRef.current = null;
    };
    
    wsRef.current = ws;
  }, [addLog]);
  
  // Play queued audio responses
  const playNextAudio = useCallback(async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }
    
    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift();
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Convert PCM to AudioBuffer
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        playNextAudio(); // Play next audio in queue
      };
      
      source.start();
      addLog('Playing audio response');
      
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      addLog(`Audio playback error: ${error.message}`);
      isPlayingRef.current = false;
    }
  }, [addLog]);
  
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      if (!audioProcessorRef.current) {
        audioProcessorRef.current = new AudioProcessor(stream, (audioData) => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(audioData);
            console.log('📤 Sent audio chunk:', audioData.byteLength, 'bytes');
          }
        });
      }
      
      await audioProcessorRef.current.start();
      setIsRecording(true);
      setStatus('Recording...');
      addLog('Started recording audio');
      
    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      setStatus('Microphone access denied');
      addLog(`Microphone error: ${error.message}`);
    }
  }, [addLog]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
    }
    setIsRecording(false);
    setStatus(isConnected ? 'Connected' : 'Disconnected');
    addLog('Stopped recording audio');
  }, [isConnected, addLog]);
  
  // Toggle connection
  const toggleConnection = () => {
    if (isConnected) {
      if (isRecording) {
        stopRecording();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      addLog('Disconnecting...');
    } else {
      addLog('Connecting to server...');
      connectWebSocket();
    }
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Send test ping
  const sendPing = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send('ping');
      addLog('Sent ping to server');
    }
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioProcessorRef.current) {
        audioProcessorRef.current.stop();
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
              Real-time voice conversation with AWS Bedrock
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
          </Box>
        </Box>

        {/* Main Controls */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant={isConnected ? "contained" : "outlined"}
              color={isConnected ? "error" : "primary"}
              onClick={toggleConnection}
              startIcon={isConnected ? <StopIcon /> : <SendIcon />}
              sx={{
                minWidth: 140,
                background: isConnected 
                  ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
                  : 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                '&:hover': {
                  boxShadow: isConnected 
                    ? '0 8px 25px rgba(248, 113, 113, 0.3)'
                    : '0 8px 25px rgba(74, 222, 128, 0.3)',
                },
              }}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
            
            <Button
              variant={isRecording ? "contained" : "outlined"}
              color={isRecording ? "warning" : "info"}
              onClick={toggleRecording}
              disabled={!isConnected}
              startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
              sx={{
                minWidth: 140,
                background: isRecording 
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                  : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                '&:hover': {
                  boxShadow: isRecording
                    ? '0 8px 25px rgba(251, 191, 36, 0.3)'
                    : '0 8px 25px rgba(96, 165, 250, 0.3)',
                },
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={sendPing}
              disabled={!isConnected}
              startIcon={<SendIcon />}
              sx={{
                minWidth: 140,
                borderColor: '#a78bfa',
                color: '#a78bfa',
                '&:hover': {
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(167, 139, 250, 0.05)',
                },
              }}
            >
              Test Ping
            </Button>
          </Box>
        </Paper>

        {/* Audio Visualizer */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
            Audio Stream Visualizer
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 100,
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(0, 61, 165, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0, 61, 165, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <canvas 
              id="visualizer" 
              width="380" 
              height="80"
              style={{ borderRadius: 8 }}
            />
          </Box>
        </Paper>

        {/* Activity Logs */}
        <Paper elevation={2} sx={{ p: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)' 
          }}>
            <Typography variant="h6" sx={{ color: '#003DA5' }}>
              📊 Activity Logs
            </Typography>
            <IconButton onClick={clearLogs} size="small">
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ maxHeight: 200, overflowY: 'auto', p: 2 }}>
            {logs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No activity yet... Click Connect to start!
              </Typography>
            ) : (
              <List dense>
                {logs.map((log, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={log}
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          color: '#333',
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Instructions */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>🎯 How to Use:</strong><br />
            1. Click <strong>Connect</strong> to establish WebSocket connection<br />
            2. Click <strong>Start Recording</strong> to capture your voice<br />
            3. Speak naturally - your audio is sent to Nova Sonic<br />
            4. Listen to the AI's voice response in real-time<br />
            5. Click <strong>Test Ping</strong> to verify connection
          </Typography>
        </Alert>
      </motion.div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
          }
        }
      `}</style>
    </Container>
  );
};

export default VoiceChat;
