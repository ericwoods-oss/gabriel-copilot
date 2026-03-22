/**
 * Gabriel Phone Engine
 * Native tel: protocol outbound calling — zero dependencies, zero auth friction
 *
 * Usage:
 *   import phoneEngine from './phone-engine.js';
 *   phoneEngine.subscribe(event => console.log(event));
 *   phoneEngine.call('+12125551234');
 *
 * Opens the system's default phone app (Windows Phone Link, Skype, Teams, etc.)
 * No Google sign-in or verification required.
 */

class PhoneEngine {
  constructor() {
    this._listeners = new Set();
    this._callActive = false;
    this._callStartTime = null;
    this._timerInterval = null;
  }

  // ── Event System ──────────────────────────────────────────────────────────

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(event) {
    this._listeners.forEach(fn => fn(event));
  }

  // ── Number Formatting ─────────────────────────────────────────────────────

  /**
   * Formats any US phone number to E.164 (+1XXXXXXXXXX).
   * Handles formats like: (555) 867-5309, 555-867-5309, 5558675309, +15558675309
   * Returns null if the number can't be parsed as a valid US phone.
   */
  formatNumber(raw) {
    if (!raw) return null;
    // Strip everything except digits and leading +
    const digits = raw.replace(/[^\d]/g, '');
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    // Already E.164 style
    if (raw.startsWith('+') && digits.length >= 10) {
      return `+${digits}`;
    }
    return null;
  }

  // ── Outbound Call (tel: protocol) ─────────────────────────────────────────

  /**
   * Dials the given number using the system's default phone app via tel: protocol.
   * Works with Windows Phone Link, Skype, Teams, or any registered telephony app.
   * No Google sign-in or verification required.
   *
   * @param {string} rawNumber - Phone number in any common US format
   * @returns {boolean} true if launched successfully
   */
  call(rawNumber) {
    const e164 = this.formatNumber(rawNumber);
    if (!e164) {
      this._emit({
        type: 'ERROR',
        message: `Could not parse phone number: "${rawNumber}". Use format (555) 867-5309.`,
      });
      return false;
    }

    // tel: protocol — opens the system's default phone/calling app instantly.
    // No browser auth, no Google Workspace restrictions.
    window.location.href = `tel:${e164}`;

    this._callActive = true;
    this._callStartTime = Date.now();
    this._startTimer();

    this._emit({
      type: 'LAUNCHED',
      number: e164,
      displayNumber: this.formatDisplay(e164),
      message: `Dialing ${this.formatDisplay(e164)}…`,
    });

    return true;
  }

  /**
   * Alias kept for backward compatibility.
   */
  launchGoogleVoice(rawNumber) {
    return this.call(rawNumber);
  }

  /**
   * Formats E.164 number for display: +15558675309 → (555) 867-5309
   */
  formatDisplay(e164) {
    if (!e164) return '';
    const digits = e164.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      const area = digits.slice(1, 4);
      const prefix = digits.slice(4, 7);
      const line = digits.slice(7);
      return `(${area}) ${prefix}-${line}`;
    }
    return e164;
  }

  // ── Call Timer ────────────────────────────────────────────────────────────

  _startTimer() {
    this._timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._callStartTime) / 1000);
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      this._emit({ type: 'TIMER', elapsed, display: `${mins}:${secs}` });
    }, 1000);
  }

  // ── End Call ──────────────────────────────────────────────────────────────

  /**
   * Signals that the call has ended — stops the timer and resets state.
   * Does NOT hang up Google Voice (that's done manually by the agent).
   */
  endCall() {
    if (!this._callActive) return;
    clearInterval(this._timerInterval);
    this._timerInterval = null;
    this._callActive = false;

    const duration = this._callStartTime
      ? Math.floor((Date.now() - this._callStartTime) / 1000)
      : 0;
    this._callStartTime = null;

    const mins = String(Math.floor(duration / 60)).padStart(2, '0');
    const secs = String(duration % 60).padStart(2, '0');

    this._emit({
      type: 'ENDED',
      duration,
      displayDuration: `${mins}:${secs}`,
    });
  }

  // ── State ─────────────────────────────────────────────────────────────────

  isActive() {
    return this._callActive;
  }

  getElapsed() {
    if (!this._callActive || !this._callStartTime) return 0;
    return Math.floor((Date.now() - this._callStartTime) / 1000);
  }
}

// Singleton
const phoneEngine = new PhoneEngine();
export default phoneEngine;
