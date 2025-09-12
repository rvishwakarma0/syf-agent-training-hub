import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
  Divider
} from '@mui/material';

function PromptOptionsDropdown({ onSelectionChange, initialValues = {} }) {
  const [domain, setDomain] = useState(initialValues.domain || '');
  const [emotion, setEmotion] = useState(initialValues.emotion || '');
  const [tone, setTone] = useState(initialValues.tone || '');
  const [knowledgeLevel, setKnowledgeLevel] = useState(initialValues.knowledgeLevel || '');
  const [context, setContext] = useState(initialValues.context || '');

  // ✅ UPDATE STATE WHEN INITIAL VALUES CHANGE (FOR EDITING)
  useEffect(() => {
    setDomain(initialValues.domain || '');
    setEmotion(initialValues.emotion || '');
    setTone(initialValues.tone || '');
    setKnowledgeLevel(initialValues.knowledgeLevel || '');
    setContext(initialValues.context || '');
  }, [initialValues]);

  // Inform parent component of any change
  useEffect(() => {
    onSelectionChange({ domain, emotion, tone, knowledgeLevel, context });
  }, [domain, emotion, tone, knowledgeLevel, context, onSelectionChange]);

  return (
    <Box sx={{ mt: 2, mb: 2 }}>      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Domain</InputLabel>
          <Select 
            value={domain} 
            label="Domain" 
            onChange={e => setDomain(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="loan">Loan</MenuItem>
            <MenuItem value="payments">Payments</MenuItem>
            <MenuItem value="disputes">Disputes</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
            <MenuItem value="general_inquiry">General Inquiry</MenuItem>
            <MenuItem value="refund_request">Refund Request</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Emotion</InputLabel>
          <Select 
            value={emotion} 
            label="Emotion" 
            onChange={e => setEmotion(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="happy">Happy</MenuItem>
            <MenuItem value="sad">Sad</MenuItem>
            <MenuItem value="angry">Angry</MenuItem>
            <MenuItem value="confused">Confused</MenuItem>
            <MenuItem value="frustrated">Frustrated</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Tone</InputLabel>
          <Select 
            value={tone} 
            label="Tone" 
            onChange={e => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="polite">Polite</MenuItem>
            <MenuItem value="frustrated">Frustrated</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Knowledge Level</InputLabel>
          <Select 
            value={knowledgeLevel} 
            label="Knowledge Level" 
            onChange={e => setKnowledgeLevel(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="expert">Expert</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Context</InputLabel>
          <Select 
            value={context} 
            label="Context" 
            onChange={e => setContext(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="double_charge">Double Charge</MenuItem>
            <MenuItem value="loan_rejection">Loan Rejection</MenuItem>
            <MenuItem value="missed_payment">Missed Payment</MenuItem>
            <MenuItem value="refund_request">Refund Request</MenuItem>
            <MenuItem value="product_inquiry">Product Inquiry</MenuItem>
            <MenuItem value="account_closure">Account Closure</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default PromptOptionsDropdown;
