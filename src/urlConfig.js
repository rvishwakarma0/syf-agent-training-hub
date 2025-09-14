export const API_BASE_URL = "http://localhost:8080";

// TrainingSession
export const START_POD_CHAT_URL = API_BASE_URL + "/api/chat/start-pod";
export const SEND_MSG_CHAT_URL = API_BASE_URL + "/api/chat/message";
export const GET_FEEDBACK_URL = API_BASE_URL + "/api/chat/get-feedback";

// Prompt Service
export const PROMPT_API_BASE_URL = API_BASE_URL + "/api/prompts";

//TPOD Service
export const TPOD_API_BASE_URL = API_BASE_URL + "/admin/api/tpods";

// Voice Training UI MFE
export const VOICE_TRAINING_MFE_URL = "https://syf-voice-stream.vercel.app";