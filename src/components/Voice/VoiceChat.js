import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioProcessor } from '../utils/audioProcessor';

const VoiceChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  
  const wsRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8080/voice-stream');
    ws.binaryType = 'arraybuffer';
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setStatus('Connected');
    };
    
    ws.onmessage = async (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Queue the audio for playback
        audioQueueRef.current.push(event.data);
        if (!isPlayingRef.current) {
          playNextAudio();
        }
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setStatus('Disconnected');
      wsRef.current = null;
    };
    
    wsRef.current = ws;
  }, []);

  // Play queued audio responses
  const playNextAudio = async () => {
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
      
      // Convert PCM to AudioBuffer
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        playNextAudio(); // Play next audio in queue
      };
      
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
      isPlayingRef.current = false;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      if (!audioProcessorRef.current) {
        audioProcessorRef.current = new AudioProcessor(stream, (audioData) => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(audioData);
          }
        });
      }
      
      audioProcessorRef.current.start();
      setIsRecording(true);
      setStatus('Recording...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setStatus('Microphone access denied');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop();
    }
    setIsRecording(false);
    setStatus('Connected');
  };

  // Toggle connection
  const toggleConnection = () => {
    if (isConnected) {
      if (isRecording) {
        stopRecording();
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    } else {
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
    <div className="voice-chat-container">
      <div className="status-indicator">
        <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
        <span className="status-text">{status}</span>
      </div>
      
      <div className="controls">
        <button 
          className={`btn ${isConnected ? 'btn-disconnect' : 'btn-connect'}`}
          onClick={toggleConnection}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
        
        <button 
          className={`btn ${isRecording ? 'btn-stop' : 'btn-record'}`}
          onClick={toggleRecording}
          disabled={!isConnected}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      
      <div className="audio-visualizer">
        <canvas id="visualizer" width="400" height="100"></canvas>
      </div>
    </div>
  );
};

export default VoiceChat;