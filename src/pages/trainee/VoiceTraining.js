import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VOICE_TRAINING_MFE_URL } from '../../urlConfig';
import Feedback from '../../components/Feedback/Feedback';

export default function VoiceTraining() {
  let chatHistory = "";
  const { tpodId } = useParams();   // ✅ get tpodId from route
  const [feedback, setFeedback] = useState(false);
  const [session, setSession] = useState(false);

  window.addEventListener('message', (event) => {
    if (event.data?.type === 'chatHistory') {
      chatHistory = event.data.data;
    }
  });

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
      <Button
        onClick={endSession}
        style={{
          float: "right",
          backgroundColor: "#f44336ff",
          color: "white",
          border: "none",
          margin: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        End session
      </Button>

      <Button
        onClick={getFeedback}
        style={{
          float: "right",
          backgroundColor: "#929341ff",
          color: "white",
          border: "none",
          margin: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Help & feedback
      </Button>
        {session ? <> <Feedback conversationMessages={chatHistory} type = "ES" onClose={()=> setFeedback(false)} open={feedback}/></> :
          <div style={{ height: "80vh", width: "100%" }}>
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

      <Feedback conversationMessages={chatHistory} onClose={()=> setFeedback(false)} open={feedback}/>
    </>
  );
}