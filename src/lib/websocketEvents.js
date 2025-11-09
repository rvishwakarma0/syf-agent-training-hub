import AudioPlayer from "./play/AudioPlayer";
import ChatHistoryManager from "./util/ChatHistoryManager.js";
import { TPOD_API_BASE_URL } from "../urlConfig.js";

const audioPlayer = new AudioPlayer();

export class WebSocketEventManager {
    constructor(wsUrl, tpodId, setChatHistory, onStatusUpdate) {
        this.tpodId = tpodId;
        this.wsUrl = wsUrl;
        this.promptName = null;
        this.audioContentName = null;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentAudioConfig = null;
        this.isProcessing = false;
        this.displayAssistantText = false;
        this.role = null;
        this.chat = { history: [] };
        this.chatRef = { current: this.chat };
        this.onStatusUpdate = onStatusUpdate;
        this.isSystemSpeaking = false;  // Track when system is speaking
        this.isBargingIn = false;       // Track if user initiated barge-in

        this.chatHistoryManager = ChatHistoryManager.getInstance(
            this.chatRef,
            (newChat) => {
                this.chat = { ...newChat };
                this.chatRef.current = this.chat;
                if (setChatHistory) {
                    setChatHistory(this.chat.history);
                }
            }
        );

        // Fetch system prompt/config before connecting
        this.initialize = async () => {
            try {
                if (!this.tpodId) {
                    throw new Error("Missing tpodId");
                }

                const response = await fetch(`${TPOD_API_BASE_URL}/${this.tpodId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch TPOD config");
                }

                const data = await response.json();
                this.systemPromptFromTpod = data.personaPrompt;
                
                console.log("Fetched system prompt:", this.systemPromptFromTpod);

                // Connect only after API success
                this.connect();

            } catch (error) {
                console.error("Initialization error:", error);
                if (this.onStatusUpdate) {
                    this.onStatusUpdate("Initialization error", "error");
                }
            }
        };

        this.initialize();
    }

    connect() {
        if (this.socket) {
            this.socket.close();
        }
        this.socket = new WebSocket(this.wsUrl);
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        this.socket.onopen = async () => {
            console.log("WebSocket Connected");
            if (this.onStatusUpdate) {
                this.onStatusUpdate("Connected", "connected");
            }
            this.isProcessing = true;
            try {
                await audioPlayer.start();
                console.log("Audio player started, context state:", audioPlayer.getAudioContextState());
                
                // Try to resume audio context immediately
                const resumed = await audioPlayer.resumeAudioContext();
                if (!resumed) {
                    console.warn("Audio context not running - user interaction may be required");
                }
                
                this.startSession();
            } catch (error) {
                console.error("Failed to start audio player:", error);
                if (this.onStatusUpdate) {
                    this.onStatusUpdate("Audio initialization failed", "error");
                }
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (e) {
                console.error("Error parsing message:", e, "Raw data:", JSON.stringify(event.data));
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            if (this.onStatusUpdate) {
                this.onStatusUpdate("Connection error", "error");
            }
            this.isProcessing = false;
        };

        this.socket.onclose = (event) => {
            console.log("WebSocket Disconnected", JSON.stringify(event));
            if (this.onStatusUpdate) {
                this.onStatusUpdate("Disconnected", "disconnected");
            }
            this.isProcessing = false;
            audioPlayer.stop();
            if (this.isProcessing) {
                console.log("Attempting to reconnect...");
                setTimeout(() => this.connect(), 1000);
            }
        };
    }

    async sendEvent(event) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open. Current state:", this.socket?.readyState);
            return;
        }

        try {
            this.socket.send(JSON.stringify(event));
        } catch (error) {
            console.error("Error sending event:", error);
            if (this.onStatusUpdate) {
                this.onStatusUpdate("Error sending message", "error");
            }
        }
    }

    handleMessage(data) {
        if (!data.event) {
            console.error("Received message without event:", JSON.stringify(data));
            return;
        }

        const event = data.event;

        try {
            // Handle completionStart
            if (event.completionStart) {
                console.log("Completion start received:", JSON.stringify(event.completionStart));
                this.promptName = event.completionStart.promptName;
            }
            // Handle contentStart
            else if (event.contentStart) {
                console.log("Content start received:", JSON.stringify(event.contentStart));
                this.role = event.contentStart.role;
                
                // Track when system starts speaking
                if (event.contentStart.role === "ASSISTANT" && event.contentStart.type === "AUDIO") {
                    console.log("🔴 System started speaking - pausing microphone input");
                    this.isSystemSpeaking = true;
                    this.isBargingIn = false; // reset any previous barge-in state
                }
                
                if (event.contentStart.type === "AUDIO") {
                    this.currentAudioConfig = event.contentStart.audioOutputConfiguration;
                }
                if (event.contentStart.type === "TEXT") {
                    // Check for speculative content
                    let isSpeculative = false;
                    try {
                        if (event.contentStart.additionalModelFields) {
                            console.log("Additional model fields:", event.contentStart.additionalModelFields)
                            const additionalFields = JSON.parse(event.contentStart.additionalModelFields);
                            isSpeculative = additionalFields.generationStage === "SPECULATIVE";
                            if (isSpeculative) {
                                console.log("Received speculative content");
                                this.displayAssistantText = true;
                            }
                            else {
                                this.displayAssistantText = false;
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing additionalModelFields:", e);
                    }
                }

            }
            // Handle textOutput
            else if (event.textOutput) {
                console.log("Text output received:", JSON.stringify(event.textOutput));
                const messageData = {
                    role: this.role
                };
                if (messageData.role === "USER" || (messageData.role === "ASSISTANT" && this.displayAssistantText)) {
                    messageData.content = event.textOutput.content;
                }
                this.handleTextOutput(messageData);
            }
            // Handle audioOutput
            else if (event.audioOutput) {
                console.log("Audio output received, content length:", event.audioOutput.content?.length);
                if (this.currentAudioConfig) {
                    const audioData = this.base64ToFloat32Array(event.audioOutput.content);
                    console.log("Playing audio chunk, samples:", audioData.length);
                    audioPlayer.playAudio(audioData);
                } else {
                    console.warn("Received audio but currentAudioConfig is not set");
                }
            }
            // Handle contentEnd
            else if (event.contentEnd) {
                console.log("Content end received:", JSON.stringify(event.contentEnd));
                
                // Re-enable microphone when system finishes speaking
                if (event.contentEnd.type === "AUDIO" && this.isSystemSpeaking) {
                    console.log("🟢 System finished speaking - resuming microphone input");
                    this.isSystemSpeaking = false;
                    this.isBargingIn = false;
                }
                
                switch (event.contentEnd.type) {
                    case "TEXT":
                        if (event.contentEnd.stopReason.toUpperCase() === "END_TURN") {
                            this.chatHistoryManager.endTurn();
                        }
                        else if (event.contentEnd.stopReason.toUpperCase() === "INTERRUPTED") {
                            audioPlayer.bargeIn();
                        }
                        break;
                    default:
                        console.log("Received content end for type:", JSON.stringify(event.contentEnd.type));
                }
            }
            // Handle completionEnd
            else if (event.completionEnd) {
                console.log("Completion end received:", JSON.stringify(event.completionEnd));
            }
            else {
                console.warn("Unknown event type received:", JSON.stringify(Object.keys(event)[0]));
            }
        } catch (error) {
            console.error("Error processing message:", error);
            console.error("Event data:", JSON.stringify(event));
        }
    }

    handleTextOutput(data) {
        console.log("Processing text output:", data);
        if (data.content) {
            const messageData = {
                role: data.role,
                message: data.content
            };
            this.chatHistoryManager.addTextMessage(messageData);
        }
    }

    base64ToFloat32Array(base64String) {
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }

        return float32Array;
    }

    startSession() {
        console.log("Starting session...");
        const sessionStartEvent = {
            event: {
                sessionStart: {
                    inferenceConfiguration: {
                        maxTokens: 1024,
                        topP: 0.9,
                        temperature: 0.7
                    }
                }
            }
        };
        console.log("Sending session start:", JSON.stringify(sessionStartEvent, null, 2));
        this.sendEvent(sessionStartEvent);
        this.startPrompt();
    }

    startPrompt() {
        this.promptName = crypto.randomUUID();

        const promptStartEvent = {
            event: {
                promptStart: {
                    promptName: this.promptName,
                    textOutputConfiguration: {
                        mediaType: "text/plain"
                    },
                    audioOutputConfiguration: {
                        mediaType: "audio/lpcm",
                        sampleRateHertz: 24000,
                        sampleSizeBits: 16,
                        channelCount: 1,
                        voiceId: "matthew",
                        encoding: "base64",
                        audioType: "SPEECH"
                    },
                }
            }
        };
        this.sendEvent(promptStartEvent);
        this.sendSystemPrompt();
    }

    sendSystemPrompt() {
        const systemContentName = crypto.randomUUID();
        const contentStartEvent = {
            event: {
                contentStart: {
                    promptName: this.promptName,
                    contentName: systemContentName,
                    type: "TEXT",
                    role: "SYSTEM",
                    interactive: false,
                    textInputConfiguration: {
                        mediaType: "text/plain"
                    }
                }
            }
        };
        this.sendEvent(contentStartEvent);

        const textInputEvent = {
            event: {
                textInput: {
                    promptName: this.promptName,
                    contentName: systemContentName,
                    content: this.systemPromptFromTpod
                }
            }
        };
        this.sendEvent(textInputEvent);

        const contentEndEvent = {
            event: {
                contentEnd: {
                    promptName: this.promptName,
                    contentName: systemContentName
                }
            }
        };
        this.sendEvent(contentEndEvent);
        this.startAudioContent();
    }

    startAudioContent() {
        this.audioContentName = crypto.randomUUID();
        const contentStartEvent = {
            event: {
                contentStart: {
                    promptName: this.promptName,
                    contentName: this.audioContentName,
                    type: "AUDIO",
                    interactive: true,
                    role: "USER",
                    audioInputConfiguration: {
                        mediaType: "audio/lpcm",
                        sampleRateHertz: 16000,
                        sampleSizeBits: 16,
                        channelCount: 1,
                        audioType: "SPEECH",
                        encoding: "base64"
                    }
                }
            }
        };
        this.sendEvent(contentStartEvent);
    }

    sendAudioChunk(base64AudioData) {
        if (!this.promptName || !this.audioContentName) {
            console.error("Cannot send audio chunk - missing promptName or audioContentName");
            return;
        }

        // Don't send audio chunks while system is speaking (prevent echo)
        // ... unless we are actively barging in
        if (this.isSystemSpeaking && !this.isBargingIn) {
            // Silently skip - system is speaking, don't send mic input
            return;
        }

        const audioInputEvent = {
            event: {
                audioInput: {
                    promptName: this.promptName,
                    contentName: this.audioContentName,
                    content: base64AudioData
                }
            }
        };
        this.sendEvent(audioInputEvent);
    }

    startBargeIn() {
        if (!this.isBargingIn) {
            console.log("🟠 Barge-in requested - interrupting assistant and sending mic input");
            this.isBargingIn = true;
            // Locally cut off current TTS playback
            audioPlayer.bargeIn();
            // Note: many servers interrupt on receiving new user audioInput.
            // We rely on continued audioInput to signal interruption server-side.
        }
    }
    
    getIsSystemSpeaking() {
        return this.isSystemSpeaking;
    }

    endContent() {
        const contentEndEvent = {
            event: {
                contentEnd: {
                    promptName: this.promptName,
                    contentName: this.audioContentName
                }
            }
        };
        this.sendEvent(contentEndEvent);
    }

    endPrompt() {
        const promptEndEvent = {
            event: {
                promptEnd: {
                    promptName: this.promptName
                }
            }
        };
        this.sendEvent(promptEndEvent);
    }

    endSession() {
        const sessionEndEvent = {
            event: {
                sessionEnd: {}
            }
        };
        this.sendEvent(sessionEndEvent);
        this.socket.close();
    }

    cleanup() {
        this.isProcessing = false;
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            try {
                if (this.audioContentName && this.promptName) {
                    this.endContent();
                    this.endPrompt();
                }
                this.endSession();
            } catch (error) {
                console.error("Error during cleanup:", error);
            }
        }
        this.chatHistoryManager.endConversation();
    }
}
