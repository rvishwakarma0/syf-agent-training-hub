import React, { useState, useEffect, useRef } from 'react';
import { Box, Chip } from '@mui/material';
import { WebSocketEventManager } from '../../lib/websocketEvents';
import { WEBHOOK_BASE_URL } from '../../urlConfig';
import './VoiceStream.css';

// Use centralized base URL from src/urlConfig.js

export default function VoiceStreamComponent({ tpodId, onChatHistoryUpdate }) {
    const [status, setStatus] = useState({ message: 'Disconnected', className: 'disconnected' });
    const [chatHistory, setChatHistory] = useState([]);
    
    const wsManagerRef = useRef(null);
    const audioCleanupRef = useRef(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopStreaming();
        };
    }, []);

    // Ensure audio context is resumed after first user interaction (Chrome autoplay policy)
    useEffect(() => {
        const onFirstClick = () => {
            const manager = wsManagerRef.current;
            if (manager && manager.audioContext && manager.audioContext.state === 'suspended') {
                manager.audioContext.resume();
            }
        };
        document.addEventListener('click', onFirstClick, { once: true });
        return () => {
            document.removeEventListener('click', onFirstClick, { once: true });
        };
    }, []);

    useEffect(() => {
        // Update parent component with chat history
        if (onChatHistoryUpdate) {
            onChatHistoryUpdate(chatHistory);
        }
    }, [chatHistory, onChatHistoryUpdate]);

    const handleStatusUpdate = (message, className) => {
        setStatus({ message, className });
    };

    const handleChatHistoryUpdate = (history) => {
        setChatHistory(history);
    };

    // No polling or barge-in logic; mirror syf-voice-stream behavior

    const startStreaming = async () => {
        // Create WebSocket manager
        wsManagerRef.current = new WebSocketEventManager(
            `${WEBHOOK_BASE_URL}/interact-s2s`,
            tpodId,
            handleChatHistoryUpdate,
            handleStatusUpdate
        );

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,           // Mono
                    sampleRate: 16000,         // 16kHz
                    sampleSize: 16,            // 16-bit
                    echoCancellation: true,    // Enable echo cancellation
                    noiseSuppression: true,    // Enable noise suppression
                    autoGainControl: true      // Enable automatic gain control
                }
            });

            // Create AudioContext for processing
            const audioContext = new AudioContext({
                sampleRate: 16000,
                latencyHint: 'interactive'
            });

            // Create MediaStreamSource
            const source = audioContext.createMediaStreamSource(stream);

            // Create ScriptProcessor for raw PCM data
            const processor = audioContext.createScriptProcessor(512, 1, 1);

            source.connect(processor);
            processor.connect(audioContext.destination);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                const buffer = new ArrayBuffer(inputData.length * 2);
                const pcmData = new DataView(buffer);
                for (let i = 0; i < inputData.length; i++) {
                    const int16 = Math.max(-32768, Math.min(32767, Math.round(inputData[i] * 32767)));
                    pcmData.setInt16(i * 2, int16, true);
                }
                // Binary data string
                let data = "";
                for (let i = 0; i < pcmData.byteLength; i++) {
                    data += String.fromCharCode(pcmData.getUint8(i));
                }

                // Send to WebSocket
                if (wsManagerRef.current) {
                    wsManagerRef.current.sendAudioChunk(btoa(data));
                }
            };

            // Store cleanup functions
            audioCleanupRef.current = () => {
                processor.disconnect();
                source.disconnect();
                stream.getTracks().forEach(track => track.stop());
                audioContext.close();
            };

        } catch (error) {
            console.error("Error accessing microphone:", error);
            setStatus({ message: 'Microphone access denied', className: 'error' });
        }
    };

    const stopStreaming = () => {
        // Cleanup audio processing
        if (audioCleanupRef.current) {
            audioCleanupRef.current();
            audioCleanupRef.current = null;
        }

        if (wsManagerRef.current) {
            wsManagerRef.current.cleanup();
            wsManagerRef.current = null;
        }
    };

    useEffect(() => {
        // Auto-start streaming when component mounts
        startStreaming();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tpodId]);

    return (
        <Box className="voice-stream-container">
            <Box className="status-bar">
                <Chip 
                    label={status.message} 
                    className={`status-chip ${status.className}`}
                    color={status.className === 'connected' ? 'success' : status.className === 'error' ? 'error' : 'default'}
                />
            </Box>
            
            <Box className="chat-container">
                {chatHistory.map((item, index) => {
                    if (item.endOfConversation) {
                        return (
                            <Box key={index} className="message system">
                                Conversation ended
                            </Box>
                        );
                    }

                    if (item.role) {
                        const roleLowerCase = item.role.toLowerCase();
                        return (
                            <Box key={index} className={`message ${roleLowerCase}`}>
                                <Box className="role-label">{item.role}</Box>
                                <Box>{item.message || "No content"}</Box>
                            </Box>
                        );
                    }
                    return null;
                })}
            </Box>
        </Box>
    );
}
