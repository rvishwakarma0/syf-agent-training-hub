import { Button } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Stop as StopIcon,
} from '@mui/icons-material';
import {
  Box
} from '@mui/material';
import Feedback from '../../components/Feedback/Feedback';
import VoiceStreamComponent from '../../components/VoiceStream/VoiceStreamComponent';

export default function VoiceTraining() {

  const { tpodId } = useParams();   // ✅ get tpodId from route
  const [feedback, setFeedback] = useState(false);
  const [session, setSession] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(crypto.randomUUID()); 
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  const handleChatHistoryUpdate = (history) => {
    // Convert the chat history format from WebSocket to the format expected by Feedback component
    const convertedHistory = history.map(msg => ({
      role: msg.role === "USER" ? "trainee" : "customer",
      message: msg.message
    }));
    if(convertedHistory.length > chatHistory.length) {
      setChatHistory(convertedHistory);
    }
  };

  const endSession = () => {
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
    <>
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
          <VoiceStreamComponent 
            tpodId={tpodId} 
            onChatHistoryUpdate={handleChatHistoryUpdate}
          />
        }

      {chatHistory && <Feedback conversationMessages={chatHistory} tpodId={tpodId} userId={userId} sessionId={currentSessionId} onClose={()=> setFeedback(false)} open={feedback}/>}
    </>
  );
}