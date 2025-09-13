import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

function VoiceInput({ 
  onResult, 
  onTranscriptChange, 
  language = 'en-US',
  continuous = true,
  interimResults = true,
  placeholder = "Click the microphone and start speaking..."
}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    finalTranscript
  } = useSpeechRecognition();

  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Update parent component with transcript changes
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  // Send final result to parent
  useEffect(() => {
    if (finalTranscript && onResult) {
      onResult(finalTranscript);
    }
  }, [finalTranscript, onResult]);

  // Audio visualization
  useEffect(() => {
    if (listening && navigator.mediaDevices) {
      startAudioVisualization();
    } else {
      stopAudioVisualization();
    }

    return () => {
      stopAudioVisualization();
    };
  }, [listening]);

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateVolume = () => {
        if (analyserRef.current && listening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(Math.min(100, (average / 255) * 100));
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVolume(0);
  };

  const handleStart = async () => {
    setError('');
    setIsProcessing(true);
    
    try {
      await SpeechRecognition.startListening({
        continuous,
        language,
        interimResults
      });
    } catch (err) {
      setError('Failed to start speech recognition. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    stopAudioVisualization();
  };

  const handleReset = () => {
    resetTranscript();
    setError('');
  };

  const handleCopy = async () => {
    if (transcript) {
      try {
        await navigator.clipboard.writeText(transcript);
        // You can add a toast notification here
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleSpeak = () => {
    if (transcript && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Check browser support
  if (!browserSupportsSpeechRecognition) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Speech Recognition Not Supported
          </Typography>
          <Typography variant="body2">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </Typography>
        </Alert>
      </Paper>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>
            Microphone Not Available
          </Typography>
          <Typography variant="body2">
            Please allow microphone access to use voice input.
          </Typography>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        background: listening 
          ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: listening ? '2px solid #2196f3' : '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: '#003DA5', fontWeight: 600 }}>
          🎤 Voice Input
        </Typography>
        
        <Box display="flex" gap={1}>
          <Chip 
            label={listening ? 'Listening...' : 'Ready'} 
            color={listening ? 'primary' : 'default'}
            size="small"
          />
          
          {listening && (
            <Chip 
              label={`${Math.round(volume)}%`} 
              color="secondary"
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Volume Visualization */}
      {listening && (
        <Box mb={2}>
          <Box 
            sx={{ 
              height: 4, 
              backgroundColor: '#e0e0e0', 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <motion.div
              style={{
                height: '100%',
                backgroundColor: volume > 50 ? '#4caf50' : volume > 20 ? '#ff9800' : '#2196f3',
                borderRadius: 2,
              }}
              animate={{ width: `${volume}%` }}
              transition={{ duration: 0.1 }}
            />
          </Box>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Transcript Display */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          mb: 3, 
          minHeight: 120,
          backgroundColor: '#fafafa',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.6,
            color: transcript ? '#333' : '#999',
            fontStyle: transcript ? 'normal' : 'italic',
          }}
        >
          {transcript || placeholder}
        </Typography>
      </Paper>

      {/* Controls */}
      <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
        {/* Primary Action Button */}
        <Button
          variant="contained"
          size="large"
          onClick={listening ? handleStop : handleStart}
          disabled={isProcessing}
          startIcon={
            isProcessing ? (
              <CircularProgress size={20} color="inherit" />
            ) : listening ? (
              <StopIcon />
            ) : (
              <MicIcon />
            )
          }
          sx={{
            minWidth: 120,
            background: listening 
              ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
              : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            '&:hover': {
              background: listening 
                ? 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
                : 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
            },
          }}
        >
          {isProcessing ? 'Starting...' : listening ? 'Stop' : 'Start'}
        </Button>

        {/* Secondary Controls */}
        <IconButton
          onClick={handleReset}
          disabled={!transcript || listening}
          title="Reset transcript"
          sx={{
            color: '#666',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <RefreshIcon />
        </IconButton>

        <IconButton
          onClick={handleCopy}
          disabled={!transcript}
          title="Copy to clipboard"
          sx={{
            color: '#666',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <CopyIcon />
        </IconButton>

        <IconButton
          onClick={handleSpeak}
          disabled={!transcript}
          title="Read aloud"
          sx={{
            color: '#666',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <VolumeUpIcon />
        </IconButton>
      </Box>

      {/* Language Info */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
        Language: {language} • {continuous ? 'Continuous' : 'Single'} mode
      </Typography>
    </Paper>
  );
}

export default VoiceInput;
