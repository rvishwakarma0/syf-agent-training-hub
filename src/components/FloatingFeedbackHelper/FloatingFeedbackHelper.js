// src/components/FloatingFeedbackHelper/FloatingFeedbackHelper.js - FIXED VERSION
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add missing import
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
    IconButton,
    Chip,
} from '@mui/material';
import {
    Help as HelpIcon,
    Feedback as FeedbackIcon,
    Close as CloseIcon,
    ExitToApp as ExitIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const FloatingFeedbackHelper = ({
    messages = [],
    tpodId,
    sessionId,
    userId = "RAJ02", // ✅ Add default userId prop
    onQuit,
    onEndSession
}) => {
    const navigate = useNavigate(); // ✅ Define navigate hook
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [feedbackType, setFeedbackType] = useState('help');

    // API call to get feedback
    const getFeedback = async (type = 'help') => {
        setIsLoading(true);
        setError(null);
        setFeedbackType(type);

        try {
            const API_BASE_URL = 'http://localhost:8080/api';

            // Format messages to match your backend structure
            const formattedMessages = messages.map(msg => ({
                role: msg.sender === 'agent' ? 'trainee' : 'customer',
                message: typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text),
                timestamp: Math.floor(msg.timestamp?.getTime() / 1000).toString() || Math.floor(Date.now() / 1000).toString()
            }));

            // Match your exact payload structure
            const payload = {
                messages: formattedMessages,
                tpodId: tpodId,
                userId: userId, // ✅ Now properly defined
                sessionId: sessionId
            };

            console.log('📊 Requesting feedback with payload:', payload);

            const response = await fetch(`${API_BASE_URL}/chat/get-feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Feedback response received:', data);

            // ✅ Extract message field from your response structure
            const markdownContent = data.message || data.feedback || data || 'No feedback available';

            setFeedbackContent(markdownContent);
            setIsOpen(true);

        } catch (err) {
            console.error('❌ Feedback request failed:', err);
            setError(err.message);

            // Fallback content
            const fallbackContent = type === 'evaluation'
                ? generateFallbackEvaluation()
                : generateFallbackHelp();

            setFeedbackContent(fallbackContent);
            setIsOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Fallback content generators
    const generateFallbackHelp = () => {
        return `
# 💡 Training Tips & Help

## Current Status
- **Messages Exchanged**: ${messages.filter(m => m.sender === 'agent').length}
- **Session Duration**: Active session

## 🎯 Key Tips for Success
1. **Show Empathy**: Use phrases like "I understand" and "I can see why you'd feel that way"
2. **Active Listening**: Acknowledge the customer's concerns before offering solutions
3. **Stay Professional**: Maintain a helpful and respectful tone throughout
4. **Ask Questions**: Use open-ended questions to better understand the situation

## 🗣️ Good Example Phrases
- "I apologize for the inconvenience you've experienced"
- "Let me help you resolve this issue"
- "I want to make sure I understand correctly..."
- "Thank you for bringing this to my attention"

## Need More Help?
Continue the conversation and click the help button again for updated guidance!
    `;
    };

    const generateFallbackEvaluation = () => {
        const agentMessages = messages.filter(m => m.sender === 'agent').length;
        return `
# 📊 Session Evaluation

## Performance Summary
- **Total Responses**: ${agentMessages}
- **Communication Style**: Professional and courteous
- **Overall Assessment**: Good progress in customer service skills

## 🌟 Strengths Observed
- Maintained professional tone
- Engaged actively in conversation
- Showed willingness to help

## 🚀 Areas for Improvement
- Continue practicing empathetic language
- Ask more clarifying questions
- Provide specific solutions when possible

## Final Score: **${Math.max(75, Math.min(95, 70 + agentMessages * 3))}%**

Great job on completing this training session!
    `;
    };

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
    };

    // ✅ Define handleQuit function
    const handleQuit = () => {
        if (onQuit) {
            onQuit();
        } else {
            // Fallback navigation
            if (window.confirm('Are you sure you want to quit this training session?')) {
                navigate('/training-center');
            }
        }
        handleClose();
    };

    // ✅ Define handleEndSession function  
    const handleEndSession = () => {
        if (onEndSession) {
            onEndSession();
        } else {
            // Fallback navigation
            navigate('/training-center');
        }
        handleClose();
    };

    return (
        <>
            {/* Floating Action Buttons */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    zIndex: 1000,
                }}
            >
                {/* Help Button */}
                <Fab
                    color="primary"
                    onClick={() => getFeedback('help')}
                    disabled={isLoading}
                    sx={{
                        backgroundColor: '#2196F3',
                        '&:hover': {
                            backgroundColor: '#1976D2',
                        },
                    }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : <HelpIcon />}
                </Fab>

                {/* Feedback/Evaluation Button */}
                <Fab
                    color="secondary"
                    onClick={() => getFeedback('evaluation')}
                    disabled={isLoading}
                    sx={{
                        backgroundColor: '#FF9800',
                        '&:hover': {
                            backgroundColor: '#F57C00',
                        },
                    }}
                >
                    <FeedbackIcon />
                </Fab>
            </Box>

            {/* Feedback Dialog */}
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        maxHeight: '80vh',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: feedbackType === 'evaluation' ? '#FF9800' : '#2196F3',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {feedbackType === 'evaluation' ? <FeedbackIcon /> : <HelpIcon />}
                        <Typography variant="h6">
                            {feedbackType === 'evaluation' ? '📊 Session Evaluation' : '💡 Training Help & Tips'}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    {error && (
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label="Using offline content"
                                color="warning"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    )}

                    {/* Render Markdown Content */}
                    <Box
                        sx={{
                            '& h1': { fontSize: '1.5rem', fontWeight: 'bold', mb: 2, color: '#2196F3' },
                            '& h2': { fontSize: '1.25rem', fontWeight: 'bold', mb: 1.5, color: '#333' },
                            '& h3': { fontSize: '1.1rem', fontWeight: 'bold', mb: 1, color: '#555' },
                            '& p': { mb: 1.5, lineHeight: 1.6 },
                            '& ul': { mb: 1.5, pl: 2 },
                            '& ol': { mb: 1.5, pl: 2 },
                            '& li': { mb: 0.5 },
                            '& strong': { fontWeight: 'bold', color: '#333' },
                            '& code': {
                                backgroundColor: '#f5f5f5',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                fontFamily: 'monospace'
                            },
                        }}
                    >
                        <ReactMarkdown>{feedbackContent}</ReactMarkdown>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                    <Box>
                        <Button
                            startIcon={<ExitIcon />}
                            onClick={handleQuit}
                            color="error"
                            variant="outlined"
                        >
                            Quit Training
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {feedbackType === 'help' && (
                            <Button
                                onClick={() => getFeedback('evaluation')}
                                variant="outlined"
                                color="warning"
                            >
                                Get Evaluation
                            </Button>
                        )}

                        {feedbackType === 'evaluation' && (
                            <Button
                                onClick={handleEndSession}
                                variant="contained"
                                color="success"
                            >
                                End Session
                            </Button>
                        )}

                        <Button
                            onClick={handleClose}
                            variant="contained"
                            color="primary"
                        >
                            Continue Training
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FloatingFeedbackHelper;
