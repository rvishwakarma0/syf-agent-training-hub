import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

/**
 * Common component to render markdown feedback content
 * @param {string} feedback - Markdown string to render
 * @param {object} sx - Additional styling (optional)
 */
const FeedbackRenderer = ({ feedback, sx = {} }) => {
  if (!feedback) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', ...sx }}>
        <Typography variant="body2" color="text.secondary">
          No feedback content available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        p: 2,
        '& h1, & h2, & h3': {
          color: 'primary.main',
          marginTop: 2,
          marginBottom: 1,
        },
        '& h1': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
        },
        '& h2': {
          fontSize: '1.25rem',
          fontWeight: 'bold',
        },
        '& h3': {
          fontSize: '1.1rem',
          fontWeight: 'bold',
        },
        '& p': {
          marginBottom: 1,
          lineHeight: 1.6,
        },
        '& ul, & ol': {
          paddingLeft: 3,
          marginBottom: 2,
        },
        '& li': {
          marginBottom: 0.5,
        },
        '& strong': {
          fontWeight: 'bold',
          color: 'text.primary',
        },
        '& em': {
          fontStyle: 'italic',
        },
        '& code': {
          backgroundColor: 'grey.100',
          padding: '2px 4px',
          borderRadius: 1,
          fontSize: '0.875rem',
        },
        '& blockquote': {
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          paddingLeft: 2,
          margin: '16px 0',
          fontStyle: 'italic',
          backgroundColor: 'grey.50',
          padding: 2,
          borderRadius: 1,
        },
        ...sx 
      }}
    >
      <ReactMarkdown>{feedback}</ReactMarkdown>
    </Box>
  );
};

export default FeedbackRenderer;
