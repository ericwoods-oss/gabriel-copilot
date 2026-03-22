/**
 * Gabriel TTS Engine
 * Text-to-speech via ElevenLabs REST API
 *
 * Usage:
 *   import ttsEngine from './tts-engine.js';
 *   ttsEngine.speak("Hello, how can I help you today?");
 *   ttsEngine.stop(); // interrupt playback
 *
 * Free tier: 10,000 characters/month — no credit card required.
 * Sign up at https://elevenlabs.io to get your API key.
 */

// Default voice: "Sarah" — warm, natural, friendly. Not robotic.
// Browse voices at: https://elevenlabs.io/voice-library
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

export const TTS_STATUS = {
  IDLE:      'idle',
  LOADING:   'loading',   // fetching audio from ElevenLabs
  SPEAKING:  'speaking',  // audio playing
  ERROR:     'error',
};

class TTSEngine {
  constructor() {
    const envKey = import.meta.env.VITE_ELEVENLABS_KEY || '';
    const storedKey = localStorage.getItem('gabriel_elevenlabs_key') || '';
    this._apiKey = envKey || storedKey;

    // Keep localStorage in sync
    if (envKey && envKey !== storedKey) {
      localStorage.setItem('gabriel_elevenlabs_key', envKey);
    }

    this._voiceId = localStorage.getItem('gabriel_elevenlabs_voice') || DEFAULT_VOICE_ID;
    this._status = TTS_STATUS.IDLE;
    this._listeners = new Set();

    // Audio playback state
    this._audioContext = null;
    this._sourceNode = null;
    this._currentAbortController = null;
  }

  // ── Configuration ───────────────────────────────────────────────────────────

  setApiKey(key) {
    this._apiKey = key;
    localStorage.setItem('gabriel_elevenlabs_key', key);
  }

  getApiKey() {
    return this._apiKey;
  }

  hasApiKey() {
    return !!this._apiKey && this._apiKey.length > 10;
  }

  setVoiceId(id) {
    this._voiceId = id || DEFAULT_VOICE_ID;
    localStorage.setItem('gabriel_elevenlabs_voice', this._voiceId);
  }

  getVoiceId() {
    return this._voiceId;
  }

  getStatus() {
    return this._status;
  }

  isSpeaking() {
    return this._status === TTS_STATUS.SPEAKING || this._status === TTS_STATUS.LOADING;
  }

  // ── Event System ────────────────────────────────────────────────────────────

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

  // ── Speak ───────────────────────────────────────────────────────────────────

  /**
   * Converts text to speech and plays it through the browser's AudioContext.
   * Automatically stops any currently-playing audio first.
   *
   * @param {string} text - The text to speak
   * @returns {Promise<boolean>} true if successful
   */
  async speak(text) {
    if (!text || !text.trim()) return false;

    if (!this.hasApiKey()) {
      this._emit({
        type: 'ERROR',
        message: 'ElevenLabs API key not configured. Open Settings to add your key.',
      });
      return false;
    }

    // Stop any current playback before starting new
    this.stop();

    this._setStatus(TTS_STATUS.LOADING);
    this._currentAbortController = new AbortController();

    try {
      const response = await fetch(`${ELEVENLABS_API_URL}/${this._voiceId}`, {
        method: 'POST',
        signal: this._currentAbortController.signal,
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this._apiKey,
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_turbo_v2_5', // Fastest + cheapest model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`ElevenLabs API error ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Initialize AudioContext (must be done after user gesture)
      if (!this._audioContext || this._audioContext.state === 'closed') {
        this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (this._audioContext.state === 'suspended') {
        await this._audioContext.resume();
      }

      const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);

      // If stop() was called while we were fetching, bail out
      if (this._status !== TTS_STATUS.LOADING) return false;

      this._sourceNode = this._audioContext.createBufferSource();
      this._sourceNode.buffer = audioBuffer;
      this._sourceNode.connect(this._audioContext.destination);

      this._sourceNode.onended = () => {
        this._sourceNode = null;
        if (this._status === TTS_STATUS.SPEAKING) {
          this._setStatus(TTS_STATUS.IDLE);
          this._emit({ type: 'SPEAKING_END' });
        }
      };

      this._setStatus(TTS_STATUS.SPEAKING);
      this._emit({ type: 'SPEAKING_START', text });
      this._sourceNode.start(0);

      return true;

    } catch (err) {
      if (err.name === 'AbortError') {
        // Intentionally stopped — not an error
        return false;
      }
      this._setStatus(TTS_STATUS.ERROR);
      this._emit({
        type: 'ERROR',
        message: `TTS failed: ${err.message}`,
      });
      return false;
    }
  }

  // ── Stop ────────────────────────────────────────────────────────────────────

  /**
   * Immediately stops any audio playback and cancels any pending fetch.
   */
  stop() {
    // Cancel in-flight API request
    if (this._currentAbortController) {
      this._currentAbortController.abort();
      this._currentAbortController = null;
    }

    // Stop audio playback
    if (this._sourceNode) {
      try {
        this._sourceNode.onended = null; // Prevent double-emit
        this._sourceNode.stop();
      } catch (_) {
        // Already stopped
      }
      this._sourceNode = null;
    }

    if (this._status !== TTS_STATUS.IDLE) {
      this._setStatus(TTS_STATUS.IDLE);
      this._emit({ type: 'SPEAKING_END' });
    }
  }
}

// Singleton
const ttsEngine = new TTSEngine();
export default ttsEngine;
