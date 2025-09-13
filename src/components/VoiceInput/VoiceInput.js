import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Clear as ClearIcon,
  Send as SendIcon
} from '@mui/icons-material';

const VoiceInput = ({ onTranscriptSend, placeholder = "Start speaking..." }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [localTranscript, setLocalTranscript] = useState('');

  // Update local transcript when speech recognition transcript changes
  useEffect(() => {
    setLocalTranscript(transcript);
  }, [transcript]);

  // Check browser support
  if (!browserSupportsSpeechRecognition) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
      </Alert>
    );
  }
  const handleTranscriptComplete = (transcript) => {
    const cleanTranscript = String(transcript || '').trim();
    if (onTranscriptSend && cleanTranscript) {
      onTranscriptSend(cleanTranscript); // ✅ Pass string, not object
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US'
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleClear = () => {
    resetTranscript();
    setLocalTranscript('');
  };

  const handleSend = () => {
    if (localTranscript.trim() && onTranscriptSend) {
      onTranscriptSend(localTranscript);
      handleClear();
    }
  };

  const handleManualChange = (event) => {
    setLocalTranscript(event.target.value);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🎤 Voice Input
        </Typography>

        <Chip
          label={listening ? 'Listening...' : 'Ready'}
          color={listening ? 'success' : 'default'}
          size="small"
          sx={{ mr: 1 }}
        />
      </Box>

      {/* Voice Input Controls */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant={listening ? 'contained' : 'outlined'}
          color={listening ? 'error' : 'primary'}
          onClick={listening ? stopListening : startListening}
          startIcon={listening ? <MicOffIcon /> : <MicIcon />}
          sx={{
            minWidth: 140,
            background: listening ?
              'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' :
              'transparent',
            '&:hover': {
              background: listening ?
                'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)' :
                'rgba(25, 118, 210, 0.04)',
            }
          }}
        >
          {listening ? 'Stop Listening' : 'Start Listening'}
        </Button>

        <IconButton onClick={handleClear} color="secondary">
          <ClearIcon />
        </IconButton>
      </Box>

      {/* Transcript Input Field */}
      <TextField
        fullWidth
        multiline
        rows={4}
        value={localTranscript}
        onChange={handleManualChange}
        placeholder={placeholder}
        variant="outlined"
        sx={{ mb: 2 }}
        disabled={listening}
        helperText={listening ? "Listening... Speak now" : "You can type here or use voice input"}
      />

      {/* Send Button */}
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!localTranscript.trim()}
          startIcon={<SendIcon />}
          sx={{
            background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #002B5C 0%, #001B3C 100%)',
            }
          }}
        >
          Send Message
        </Button>
      </Box>
    </Paper>
  );
};

export default VoiceInput;
