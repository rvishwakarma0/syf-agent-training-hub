import React from 'react'

export default function VoiceChat() {
  return (
    <div style={{ height: '91vh', width: '100%' }}>
      <iframe
        src="http://localhost:5173/"
        title="Voice Chat App"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allow="microphone; autoplay"
      />
    </div>
  )
}