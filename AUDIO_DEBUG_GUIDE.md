# Audio Debug Guide

## Issues Resolved

### 1. No Sound Playback (FIXED)
### 2. Voice Recognition Stops After System Speaks (FIXED)

### Changes Made

1. **Added Audio Context Resume Logic**
   - Chrome/Safari require user interaction before playing audio
   - Audio context starts in "suspended" state
   - Added automatic resume attempts when audio is played

2. **Implemented Turn-Taking / Echo Cancellation**
   - Added `isSystemSpeaking` flag to track when AI is speaking
   - Microphone input is paused while system speaks (prevents echo/feedback)
   - Visual indicators show "🔊 System Speaking" and "🎤 Listening" states
   - Prevents the system from hearing itself and getting confused

3. **Added Debug Logging**
   - Audio output events are now logged to console
   - Audio context state is logged
   - Sample counts are logged when audio chunks are received
   - Turn-taking events are logged with emoji indicators (🔴/🟢)

4. **Fixed ESLint Warnings**
   - Removed unused imports and variables
   - Added proper eslint-disable comments where needed

### How to Debug Audio Issues

#### Step 1: Check Browser Console
Open your browser's DevTools console (F12) and look for these logs:

1. **When WebSocket connects:**
   ```
   WebSocket Connected
   Loading audio worklet from: http://localhost:3000/AudioPlayerProcessor.worklet.js
   Audio worklet loaded successfully
   Audio player started, context state: running
   ```

2. **When audio is received:**
   ```
   Audio output received, content length: [number]
   Playing audio chunk, samples: [number]
   ```

3. **Audio context state:**
   - If you see: `Audio context is suspended, attempting to resume...`
   - This means the browser is blocking audio playback
   - **Solution:** Click anywhere on the page to allow audio

#### Step 2: Check Audio Context State
In the browser console, type:
```javascript
// This will show if audio context is running
console.log("Audio context state:", window.AudioContext ? "supported" : "not supported");
```

#### Step 3: Verify Audio is Being Received
- Look for `"Audio output received"` logs
- Check that `samples` count is greater than 0
- If you don't see these logs, the WebSocket server isn't sending audio

#### Step 4: Check Browser Audio Settings
1. Make sure your browser has permission to play audio
2. Check system volume is not muted
3. Check browser tab is not muted (look for speaker icon on tab)
4. Try clicking on the page (Chrome requires user interaction)

#### Step 5: Verify WebSocket Connection
1. Check for `"WebSocket Connected"` in console
2. Status chip should show "Connected" (green)
3. If disconnected, check that `ws://localhost:8081` is running

### Common Issues & Solutions

#### Issue: "Audio context is suspended"
**Solution:** Click anywhere on the page to resume audio context

#### Issue: Voice stops working after system speaks once (FIXED)
**Cause:** Microphone was picking up speaker audio (echo/feedback loop)
**Solution:** Implemented automatic turn-taking:
- Look for these logs in console:
  - `🔴 System started speaking - pausing microphone input`
  - `🟢 System finished speaking - resuming microphone input`
- Visual indicators show current state (🔊 System Speaking / 🎤 Listening)
- Microphone input is automatically paused during system playback

#### Issue: No audio output logs
**Solution:** 
- Check WebSocket server is sending audio data
- Verify `currentAudioConfig` is set (look for "Content start received" with type "AUDIO")

#### Issue: Audio worklet failed to load
**Solution:**
- Make sure `/public/AudioPlayerProcessor.worklet.js` exists
- Clear browser cache and reload
- Check console for 404 errors

#### Issue: Audio plays but is distorted
**Solution:**
- Check sample rate (should be 24000 Hz)
- Verify audio format is correct (16-bit PCM)

#### Issue: System doesn't respond to user speech
**Solution:**
- Wait for "🎤 Listening" indicator before speaking
- Make sure you're not speaking while system is playing audio
- Check microphone permissions in browser

### Testing Audio Playback

To test if audio system works, open browser console and run:
```javascript
// Create a test tone
const audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();
oscillator.connect(audioCtx.destination);
oscillator.start();
setTimeout(() => oscillator.stop(), 1000); // Play for 1 second
```

If you hear a tone, your browser audio is working.

### Next Steps

1. Refresh browser (Ctrl+R or Cmd+R)
2. Open DevTools Console (F12)
3. Click anywhere on the page after it loads
4. Look for debug logs listed above
5. If still no sound, check which step fails

### Files Modified
- `src/lib/play/AudioPlayer.js` - Added resume logic and logging
- `src/lib/websocketEvents.js` - Added audio debug logging
- `src/components/VoiceStream/VoiceStreamComponent.js` - Fixed warnings
- `src/pages/trainee/VoiceTraining.js` - Removed unused imports
