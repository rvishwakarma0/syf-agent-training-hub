import ObjectExt from "../util/ObjectsExt";

export default class AudioPlayer {
    constructor() {
        this.onAudioPlayedListeners = [];
        this.initialized = false;
    }

    addEventListener(event, callback) {
        switch (event) {
            case "onAudioPlayed":
                this.onAudioPlayedListeners.push(callback);
                break;
            default:
                console.error("Listener registered for event type: " + event + " which is not supported");
        }
    }

    async start() {
        this.audioContext = new AudioContext({"sampleRate": 24000});
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 512;

        // Load worklet processor - construct proper URL for public folder
        // In development, process.env.PUBLIC_URL is empty, so we use window.location.origin
        const baseUrl = process.env.PUBLIC_URL || window.location.origin;
        const workletUrl = `${baseUrl}/AudioPlayerProcessor.worklet.js`;
        
        console.log("Loading audio worklet from:", workletUrl);
        
        try {
            await this.audioContext.audioWorklet.addModule(workletUrl);
            console.log("Audio worklet loaded successfully");
        } catch (error) {
            console.error("Failed to load audio worklet:", error);
            console.error("Attempted URL:", workletUrl);
            throw new Error(`Could not load worklet from ${workletUrl}: ${error.message}`);
        }
        
        this.workletNode = new AudioWorkletNode(this.audioContext, "audio-player-processor");
        this.workletNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.recorderNode = this.audioContext.createScriptProcessor(512, 1, 1);
        this.recorderNode.onaudioprocess = (event) => {
            // Pass the input along as-is
            const inputData = event.inputBuffer.getChannelData(0);
            const outputData = event.outputBuffer.getChannelData(0);
            outputData.set(inputData);
            // Notify listeners that the audio was played
            const samples = new Float32Array(outputData.length);
            samples.set(outputData);
            this.onAudioPlayedListeners.map(listener => listener(samples));
        }
        this.initialized = true;
    }

    bargeIn() {
        if (this.workletNode) {
            this.workletNode.port.postMessage({
                type: "barge-in",
            })
        }
    }

    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            console.log("Resuming audio context...");
            try {
                await this.audioContext.resume();
                console.log("Audio context resumed, state:", this.audioContext.state);
                return true;
            } catch (error) {
                console.error("Failed to resume audio context:", error);
                return false;
            }
        }
        return this.audioContext?.state === 'running';
    }

    getAudioContextState() {
        return this.audioContext?.state || 'unknown';
    }

    stop() {
        if (ObjectExt.exists(this.audioContext)) {
            this.audioContext.close();
        }

        if (ObjectExt.exists(this.analyser)) {
            this.analyser.disconnect();
        }

        if (ObjectExt.exists(this.workletNode)) {
            this.workletNode.disconnect();
        }

        if (ObjectExt.exists(this.recorderNode)) {
            this.recorderNode.disconnect();
        }

        this.initialized = false;
        this.audioContext = null;
        this.analyser = null;
        this.workletNode = null;
        this.recorderNode = null;
    }

    async playAudio(samples) {
        if (!this.initialized) {
            console.error("The audio player is not initialized. Call start() before attempting to play audio.");
            return;
        }
        
        // Ensure audio context is running (Chrome requires user interaction)
        if (this.audioContext.state === 'suspended') {
            console.log("Audio context is suspended, attempting to resume...");
            try {
                await this.audioContext.resume();
                console.log("Audio context resumed successfully");
            } catch (error) {
                console.error("Failed to resume audio context:", error);
            }
        }
        
        this.workletNode.port.postMessage({
            type: "audio",
            audioData: samples,
        });
    }

    getSamples() {
        if (!this.initialized) {
            return null;
        }
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteTimeDomainData(dataArray);
        return [...dataArray].map(e => e / 128 - 1);
    }

    getVolume() {
        if (!this.initialized) {
            return 0;
        }
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteTimeDomainData(dataArray);
        let normSamples = [...dataArray].map(e => e / 128 - 1);
        let sum = 0;
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        return Math.sqrt(sum / normSamples.length);
    }
}
