import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Paper,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';
import VoiceRecorder from './VoiceRecorder';

function VoiceInputDemo() {
  const [voiceText, setVoiceText] = useState('');
  const [finalResult, setFinalResult] = useState('');
  const [audioTranscript, setAudioTranscript] = useState('');

  const handleVoiceResult = (result) => {
    setFinalResult(result);
    console.log('Final voice result:', result);
  };

  const handleTranscriptChange = (transcript) => {
    setVoiceText(transcript);
  };

  const handleAudioTranscript = (transcript) => {
    setAudioTranscript(transcript);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#003DA5' }}>
          Voice Input Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Test speech-to-text functionality with real-time transcription and audio recording.
        </Typography>

        {/* Live Voice Input */}
        <Box mb={4}>
          <VoiceInput
            onResult={handleVoiceResult}
            onTranscriptChange={handleTranscriptChange}
            language="en-US"
            continuous={true}
            placeholder="Start speaking and see your words appear here in real-time..."
          />
        </Box>

        {/* Results Display */}
        <Box mb={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
              Live Transcript
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Real-time speech transcription will appear here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            {finalResult && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
                  Final Result
                </Typography>
                <Typography variant="body1" sx={{ 
                  p: 2, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap' 
                }}>
                  {finalResult}
                </Typography>
              </>
            )}
          </Paper>
        </Box>

        {/* Audio Recorder */}
        <Box mb={4}>
          <VoiceRecorder
            onTranscriptReady={handleAudioTranscript}
          />
        </Box>

        {/* Audio Transcript Display */}
        {audioTranscript && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#003DA5' }}>
              Audio Transcription Result
            </Typography>
            <Typography variant="body1" sx={{ 
              p: 2, 
              backgroundColor: '#e8f5e8', 
              borderRadius: 1,
              whiteSpace: 'pre-wrap' 
            }}>
              {audioTranscript}
            </Typography>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
}

export default VoiceInputDemo;
