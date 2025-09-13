
import { Button } from '@mui/material'
import React from 'react'

export default function VoiceChat() {

  let chatHistory = "";

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'chatHistory') {
      chatHistory = event.data.data;
    }
  });

  const evaluateChatHistory = () => {
    console.log('chatHistory', chatHistory)
  }
  
  return (
    <>
    <Button
  onClick={() => evaluateChatHistory()}
  style={{
    float: 'right',
    backgroundColor: '#4CAF50', // green
    color: 'white',             // text color
    border: 'none',
    margin: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  }}
>
  Evaluate
</Button>
    <div style={{ height: '80vh', width: '100%' }}>
      <iframe
        src="http://https://syf-voice-stream.vercel.app/?data=abc"
        title="Voice Chat App"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allow="microphone; autoplay"
      />
    </div>
    </>
  )
}