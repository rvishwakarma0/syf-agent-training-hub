import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VOICE_TRAINING_MFE_URL } from '../../urlConfig';

export default function VoiceTraining() {
  const { tpodId } = useParams();   // ✅ get tpodId from route
  const [chatHistory, setChatHistory] = useState("");

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "chatHistory") {
        setChatHistory(event.data.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const endSession = () => {
    console.log("chatHistory", chatHistory);
    // in this method you  can call you feedback API with chatHistory and display in modal then close the iframe or navigate user to some training center
  };

  const getFeedback = () => {
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
    </>
  );
}