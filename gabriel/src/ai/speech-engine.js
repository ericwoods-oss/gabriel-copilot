/**
 * Gabriel Speech Engine
 * Real-time speech-to-text via Deepgram Nova-2 (WebSocket)
 *
 * Handles:
 *  - Mic capture via getUserMedia
 *  - WebSocket connection to Deepgram Nova-2
 *  - Interim + final transcript events
 *  - Speaker diarization (Agent vs Customer) when available
 *  - Start / stop / pause controls
 */

const DEEPGRAM_WS_URL = 'wss://api.deepgram.com/v1/listen';

export const MIC_STATUS = {
  IDLE:        'idle',
  CONNECTING:  'connecting',
  LISTENING:   'listening',
  PAUSED:      'paused',
  ERROR:       'error',
};

class SpeechEngine {
  constructor() {
    // Prefer baked-in env var (survives localStorage clears), then fall back to localStorage
    const envKey = import.meta.env.VITE_DEEPGRAM_KEY || '';
    const storedKey = localStorage.getItem('gabriel_deepgram_key') || '';
    this._apiKey = envKey || storedKey;
    // Keep localStorage in sync so the Settings UI reflects the active key
    if (envKey && envKey !== storedKey) {
      localStorage.setItem('gabriel_deepgram_key', envKey);
    }
    // Audio input device — persisted so VB-Cable selection survives reloads
    this._deviceId = localStorage.getItem('gabriel_mic_device') || null;
    this._ws = null;
    this._mediaRecorder = null;
    this._stream = null;
    this._status = MIC_STATUS.IDLE;
    this._listeners = new Set();
    this._transcriptBuffer = []; // Rolling buffer of final transcripts
    this._bufferMaxSeconds = 60;
    this._keepAliveInterval = null;  // Deepgram KeepAlive ping timer
    this._reconnectAttempts = 0;     // Auto-reconnect attempt counter
    this._maxReconnectAttempts = 3;  // Max retries before surfacing error
  }

  // ── Configuration ─────────────────────────────────────────────────────────

  setApiKey(key) {
    this._apiKey = key;
    localStorage.setItem('gabriel_deepgram_key', key);
  }

  getApiKey() {
    return this._apiKey;
  }

  hasApiKey() {
    return !!this._apiKey && this._apiKey.length > 10;
  }

  setDeviceId(id) {
    this._deviceId = id || null;
    if (id) {
      localStorage.setItem('gabriel_mic_device', id);
    } else {
      localStorage.removeItem('gabriel_mic_device');
    }
  }

  getDeviceId() {
    return this._deviceId;
  }

  getStatus() {
    return this._status;
  }

  getTranscriptBuffer() {
    return [...this._transcriptBuffer];
  }

  getRecentTranscript(seconds = 30) {
    const cutoff = Date.now() - (seconds * 1000);
    return this._transcriptBuffer
      .filter(t => t.timestamp >= cutoff)
      .map(t => `${t.speaker ? `[${t.speaker}] ` : ''}${t.text}`)
      .join(' ');
  }

  // ── Event system ──────────────────────────────────────────────────────────

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(event) {
    this._listeners.forEach(fn => fn(event));
  }

  _setStatus(status) {
    this._status = status;
    this._emit({ type: 'STATUS_CHANGE', status });
  }

  // ── Start Listening ───────────────────────────────────────────────────────

  async start() {
    if (!this.hasApiKey()) {
      this._emit({ type: 'ERROR', message: 'Deepgram API key not configured. Open Settings.' });
      return false;
    }

    if (this._status === MIC_STATUS.LISTENING) return true;

    this._setStatus(MIC_STATUS.CONNECTING);

    try {
      // Request microphone access — use stored deviceId if set (e.g. VB-Cable Output)
      const audioConstraints = {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: !this._deviceId, // disable for virtual devices
        noiseSuppression: !this._deviceId,
      };
      if (this._deviceId) {
        audioConstraints.deviceId = { exact: this._deviceId };
      }
      this._stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
    } catch (err) {
      this._setStatus(MIC_STATUS.ERROR);
      this._emit({
        type: 'ERROR',
        message: `Microphone access denied: ${err.message}. Please allow mic access and try again.`
      });
      return false;
    }

    // Build Deepgram WebSocket URL with params
    const params = new URLSearchParams({
      model: 'nova-2',
      language: 'en-US',
      smart_format: 'true',
      punctuate: 'true',
      diarize: 'true',          // Try to separate speakers
      interim_results: 'true',  // Live word-by-word updates
      utterance_end_ms: '1500', // Fire final after 1.5s silence
      endpointing: '400',
    });

    const wsUrl = `${DEEPGRAM_WS_URL}?${params}`;

    try {
      this._ws = new WebSocket(wsUrl, ['token', this._apiKey]);
    } catch (err) {
      this._setStatus(MIC_STATUS.ERROR);
      this._emit({ type: 'ERROR', message: 'Failed to connect to Deepgram: ' + err.message });
      this._stream.getTracks().forEach(t => t.stop());
      return false;
    }

    this._ws.onopen = () => {
      this._reconnectAttempts = 0; // Reset on successful connect
      this._setStatus(MIC_STATUS.LISTENING);
      this._emit({ type: 'CONNECTED' });
      this._startMediaRecorder();

      // --- FIX 1: Send KeepAlive every 8s to prevent Deepgram 60s timeout ---
      this._keepAliveInterval = setInterval(() => {
        if (this._ws?.readyState === WebSocket.OPEN) {
          this._ws.send(JSON.stringify({ type: 'KeepAlive' }));
        }
      }, 8000);
    };

    this._ws.onmessage = (event) => {
      this._handleDeepgramMessage(event.data);
    };

    this._ws.onerror = (err) => {
      this._setStatus(MIC_STATUS.ERROR);
      this._emit({ type: 'ERROR', message: 'Deepgram connection error. Check your API key.' });
      this.stop();
    };

    this._ws.onclose = (event) => {
      // Always clear the keep-alive timer and stop the recorder on close
      clearInterval(this._keepAliveInterval);
      this._keepAliveInterval = null;

      // --- FIX 2: Stop MediaRecorder immediately to prevent resource leak ---
      if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
        this._mediaRecorder.stop();
        this._mediaRecorder = null;
      }

      if (this._status === MIC_STATUS.LISTENING) {
        // --- FIX 3: Auto-reconnect on unexpected close (up to 3 retries) ---
        if (this._reconnectAttempts < this._maxReconnectAttempts) {
          this._reconnectAttempts++;
          this._emit({
            type: 'RECONNECTING',
            attempt: this._reconnectAttempts,
            max: this._maxReconnectAttempts,
            message: `Deepgram disconnected. Reconnecting… (${this._reconnectAttempts}/${this._maxReconnectAttempts})`,
          });
          setTimeout(() => this.start(), 1000);
        } else {
          // Exhausted retries — surface the error
          this._setStatus(MIC_STATUS.ERROR);
          this._emit({
            type: 'ERROR',
            message: `Deepgram connection lost after ${this._maxReconnectAttempts} reconnect attempts. Check your API key or network.`,
          });
        }
      } else {
        this._setStatus(MIC_STATUS.IDLE);
      }
    };

    return true;
  }

  _startMediaRecorder() {
    try {
      this._mediaRecorder = new MediaRecorder(this._stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      this._mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this._ws?.readyState === WebSocket.OPEN) {
          this._ws.send(event.data);
        }
      };

      this._mediaRecorder.start(100); // Send audio chunks every 100ms
    } catch (err) {
      this._setStatus(MIC_STATUS.ERROR);
      this._emit({ type: 'ERROR', message: 'Failed to start audio recording: ' + err.message });
    }
  }

  _handleDeepgramMessage(rawData) {
    try {
      const data = JSON.parse(rawData);

      // Handle transcript results
      if (data.type === 'Results') {
        const alt = data.channel?.alternatives?.[0];
        if (!alt || !alt.transcript) return;

        const text = alt.transcript.trim();
        if (!text) return;

        const isFinal = data.is_final;
        const speaker = this._getSpeakerLabel(data);

        if (isFinal) {
          // Add to rolling buffer
          this._transcriptBuffer.push({
            text,
            speaker,
            timestamp: Date.now(),
            isFinal: true,
          });

          // Trim buffer to last 60 seconds
          const cutoff = Date.now() - (this._bufferMaxSeconds * 1000);
          this._transcriptBuffer = this._transcriptBuffer.filter(t => t.timestamp >= cutoff);

          this._emit({
            type: 'TRANSCRIPT_FINAL',
            text,
            speaker,
            fullBuffer: this.getRecentTranscript(30),
          });
        } else {
          this._emit({
            type: 'TRANSCRIPT_INTERIM',
            text,
            speaker,
          });
        }
      }

      // Handle speech started
      if (data.type === 'SpeechStarted') {
        this._emit({ type: 'SPEECH_STARTED' });
      }

      // Handle utterance end (silence detected)
      if (data.type === 'UtteranceEnd') {
        this._emit({ type: 'UTTERANCE_END' });
      }

    } catch (err) {
      // Silently ignore malformed messages
    }
  }

  _getSpeakerLabel(data) {
    // Attempt diarization — speaker 0 is usually the agent (closest mic)
    const word = data.channel?.alternatives?.[0]?.words?.[0];
    if (word?.speaker !== undefined) {
      return word.speaker === 0 ? 'Agent' : 'Customer';
    }
    return null;
  }

  // ── Stop / Pause ─────────────────────────────────────────────────────────

  stop() {
    // Clear keep-alive and reset reconnect counter so a manual stop
    // doesn't trigger auto-reconnect
    clearInterval(this._keepAliveInterval);
    this._keepAliveInterval = null;
    this._reconnectAttempts = this._maxReconnectAttempts; // Prevent reconnect on close

    if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
      this._mediaRecorder.stop();
    }
    if (this._ws && this._ws.readyState === WebSocket.OPEN) {
      // Send CloseStream message to Deepgram
      this._ws.send(JSON.stringify({ type: 'CloseStream' }));
      this._ws.close();
    }
    if (this._stream) {
      this._stream.getTracks().forEach(t => t.stop());
      this._stream = null;
    }

    this._ws = null;
    this._mediaRecorder = null;
    this._reconnectAttempts = 0; // Reset for next session
    this._setStatus(MIC_STATUS.IDLE);
    this._emit({ type: 'DISCONNECTED' });
  }

  clearBuffer() {
    this._transcriptBuffer = [];
  }

  onCallEnd() {
    this.stop();
    this.clearBuffer();
  }
}

// Singleton
const speechEngine = new SpeechEngine();
export default speechEngine;
