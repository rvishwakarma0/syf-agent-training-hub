import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Stop as StopIcon,
} from '@mui/icons-material';
import {
  Box
} from '@mui/material';
import { VOICE_TRAINING_MFE_URL } from '../../urlConfig';
import Feedback from '../../components/Feedback/Feedback';

export default function VoiceTraining() {

  const { tpodId } = useParams();   // ✅ get tpodId from route
  const [feedback, setFeedback] = useState(false);
  const [session, setSession] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(crypto.randomUUID()); 
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current || document.documentElement;
    if (!el) return;
    try {
      if (el.requestFullscreen) {
        const p = el.requestFullscreen({ navigationUI: 'hide' });
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } catch (e) {}
    return () => {
      const d = document;
      const isFs =
        d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement;
      if (isFs) {
        try {
          if (d.exitFullscreen) {
            const p = d.exitFullscreen();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } else if (d.webkitExitFullscreen) {
            d.webkitExitFullscreen();
          } else if (d.mozCancelFullScreen) {
            d.mozCancelFullScreen();
          } else if (d.msExitFullscreen) {
            d.msExitFullscreen();
          }
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === 'chatHistory') {
        try {
          const ch = JSON.parse(event.data.data);
          setChatHistory(prev => (ch.length > prev.length ? ch : prev));
        } catch (err) {
          console.error("Error parsing chat history", err);
          setChatHistory([]);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const exitFullscreen = () => {
    const d = document;
    try {
      const isFs = d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement;
      if (!isFs) return;
      if (d.exitFullscreen) {
        const p = d.exitFullscreen();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else if (d.webkitExitFullscreen) {
        d.webkitExitFullscreen();
      } else if (d.mozCancelFullScreen) {
        d.mozCancelFullScreen();
      } else if (d.msExitFullscreen) {
        d.msExitFullscreen();
      }
    } catch (e) {}
  };

  const endSession = () => {
    exitFullscreen();
    setSession(true);
    console.log("chatHistory", chatHistory);
    // in this method you  can call you feedback API with chatHistory and display in modal then close the iframe or navigate user to some training center
  };

  const getFeedback = () => {
    setFeedback(true);
    console.log("chatHistory", chatHistory);
    // in this method you can call your feedback API with chatHistory and display feedback to user in a modal
  };


  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={getFeedback}
          disabled={session}
          sx={{
            ml: 1,
            borderColor: '#eef436ff',
            color: '#f4eb36ff',
            '&:hover': {
              bgcolor: 'rgba(228, 190, 64, 0.1)',
              borderColor: '#d3cd2fff',
            }
          }}
        >
          <StopIcon sx={{ mr: 1 }} />
          Help & Feedback
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={endSession}
          disabled={session}
          sx={{
            ml: 1,
            borderColor: '#F44336',
            color: '#F44336',
            '&:hover': {
              bgcolor: 'rgba(244, 67, 54, 0.1)',
              borderColor: '#D32F2F',
            }
          }}
        >
          <StopIcon sx={{ mr: 1 }} />
          End Session
        </Button>
      </Box>
        {session ? <> <Feedback conversationMessages={chatHistory} type = "ES" tpodId={tpodId} userId={userId} sessionId={currentSessionId} onClose={()=> setFeedback(false)} open={feedback}/></> :
          <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
          <iframe
            src={`${VOICE_TRAINING_MFE_URL}?tpodId=${tpodId}`}  // ✅ inject tpodId
            title="Voice Chat App"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            allow="microphone; autoplay"
          />
        </div>
        }

      {chatHistory && <Feedback conversationMessages={chatHistory} tpodId={tpodId} userId={userId} sessionId={currentSessionId} onClose={()=> setFeedback(false)} open={feedback}/>}
    </div>
  );
}