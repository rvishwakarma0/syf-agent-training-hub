export class AudioProcessor {
  constructor(stream, onAudioData) {
    this.stream = stream;
    this.onAudioData = onAudioData;
    this.audioContext = null;
    this.processor = null;
    this.source = null;
    this.isProcessing = false;
    this.bufferSize = 4096;
    this.sampleRate = 16000;
  }
  
  async start() {
    console.log('🎵 Starting AudioProcessor...');
    
    try {
      // Create audio context with specified sample rate
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.sampleRate
      });
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      console.log('📊 Audio context created:', {
        sampleRate: this.audioContext.sampleRate,
        state: this.audioContext.state
      });
      
      // Create media stream source
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      
      // Create script processor for capturing audio
      this.processor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);
      
      this.processor.onaudioprocess = (event) => {
        if (!this.isProcessing) return;
        
        const inputData = event.inputBuffer.getChannelData(0);
        
        // Convert Float32Array to 16-bit PCM
        const pcmData = this.convertToPCM16(inputData);
        
        // Send to WebSocket
        this.onAudioData(pcmData);
      };
      
      // Connect audio nodes
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      this.isProcessing = true;
      console.log('✅ AudioProcessor started successfully');
      
    } catch (error) {
      console.error('❌ Error starting AudioProcessor:', error);
      throw error;
    }
  }
  
  stop() {
    console.log('🛑 Stopping AudioProcessor...');
    this.isProcessing = false;
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        console.log('🎤 Stopped audio track:', track.label);
      });
    }
    
    console.log('✅ AudioProcessor stopped');
  }
  
  convertToPCM16(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      // Clamp sample to [-1, 1] range
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      
      // Convert to 16-bit signed integer
      const sample = s < 0 ? s * 0x8000 : s * 0x7FFF;
      
      // Write as little-endian 16-bit integer
      view.setInt16(offset, sample, true);
    }
    
    return buffer;
  }
  
  // Get current audio level for visualization
  getAudioLevel(float32Array) {
    let sum = 0;
    for (let i = 0; i < float32Array.length; i++) {
      sum += float32Array[i] * float32Array[i];
    }
    return Math.sqrt(sum / float32Array.length);
  }
}
