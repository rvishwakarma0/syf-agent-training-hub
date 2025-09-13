import React, { useState, useRef } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  PlayArrow as PlayIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';

function VoiceRecorder({ onAudioReady, onTranscriptReady }) {
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioRef = useRef(null);

  const addAudioElement = (blob) => {
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    
    if (onAudioReady) {
      onAudioReady(blob, url);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    try {
      // Here you would typically send the audio to a transcription service
      // For demo purposes, we'll simulate this
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      // Example API call (replace with your actual transcription service)
      // const response = await fetch('/api/transcribe', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      
      // Simulated response
      setTimeout(() => {
        const mockTranscript = "This is a mock transcription of your audio recording.";
        if (onTranscriptReady) {
          onTranscriptReady(mockTranscript);
        }
        setIsTranscribing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Transcription failed:', error);
      setIsTranscribing(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#003DA5', fontWeight: 600 }}>
        🎵 Audio Recorder
      </Typography>

      <Box mb={3}>
        <AudioRecorder 
          onRecordingComplete={addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          downloadOnSavePress={false}
          downloadFileExtension="wav"
        />
      </Box>

      {audioUrl && (
        <Box>
          <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%', marginBottom: 16 }} />
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<PlayIcon />}
              onClick={handlePlay}
              size="small"
            >
              Play
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              size="small"
            >
              Download
            </Button>
            
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleTranscribe}
              disabled={isTranscribing}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #003DA5 0%, #002B5C 100%)',
              }}
            >
              {isTranscribing ? 'Transcribing...' : 'Transcribe'}
            </Button>
          </Box>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Record audio and get transcription using AI-powered speech-to-text services.
        </Typography>
      </Alert>
    </Paper>
  );
}

export default VoiceRecorder;
