/**
 * Gabriel — Agent Copilot
 * Main application entry point — v2.0 with Live AI Pane
 */

import engine from './engine/disclosure-engine.js';
import gabrielAI, { REACTION_TYPES } from './ai/gabriel-ai.js';
import speechEngine, { MIC_STATUS } from './ai/speech-engine.js';
import leadDB from './data/lead-database.js';
import phoneEngine from './ai/phone-engine.js';
import './styles/index.css';

// ============================================
// APP STATE
// ============================================
const state = {
  currentView: 'dashboard', // dashboard, call, library, leads
  sidebarOpen: false,
  checklistOpen: false,
  modalOpen: false,
  settingsOpen: false,
  summaryModal: false,
  expandedNotes: new Set(),
  callSummary: null,
  // Gabriel pane state
  gabrielEvents: [],        // feed of AI reactions
  gabrielInput: '',         // current question in input box
  gabrielThinking: false,   // AI is processing (manual Q&A)
  gabrielAnalyzing: false,  // AI is processing (reactive speech analysis)
  micStatus: MIC_STATUS.IDLE,
  liveTranscript: '',       // interim transcript (live update)
  gabrielPaneOpen: true,    // collapsible on mobile
  // Feature: Live Transcript Panel
  showTranscript: false,    // transcript panel visible
  transcriptLog: [],        // { text, speaker, time }
  // Feature: Spanish Translator Mode
  spanishMode: false,
  spanishTranslatedCustomer: '', // EN translation of last customer speech
  spanishAgentInput: '',         // agent's typed EN reply
  spanishTranslatedAgent: '',    // ES translation for agent to speak
  spanishTranslating: false,
  // Feature: Audio device selection (VB-Cable)
  availableMicDevices: [],  // list of { deviceId, label } audio inputs

  // ── Outbound / Cold-Call mode ──────────────────────────────────────────
  callType: 'inbound',      // 'inbound' | 'outbound'
  activeLead: null,         // the lead object for the current outbound call
  coldCallPhase: 'opener',  // 'opener' | 'qualify' | 'pitch' | 'close'

  // ── Google Voice calling ───────────────────────────────────────────────
  gvCallActive: false,      // true while the GV-initiated call timer is running
  gvCallTimer: '00:00',     // display timer string e.g. '01:32'

  // ── Outcome logger modal ───────────────────────────────────────────────
  outcomeModalOpen: false,
  outcomeNotes: '',
  capturedFields: {},       // AI-captured data for this call { decisionMaker, fleetSize, etc. }

  // ── Leads View ─────────────────────────────────────────────────────────
  leads: [],                // all leads from DB
  leadsFilter: 'all',       // 'all' | status value
  leadsSearch: '',          // search text
  leadsLoaded: false,       // has DB been loaded yet
  leadsStats: null,
  leadsImporting: false,
};

// Max events to keep in Gabriel's feed
const MAX_GABRIEL_EVENTS = 50;

// ── Reactive analysis debounce ─────────────────────────────────────────────
// Prevent hammering Gemini on every short utterance:
//   - Minimum 6 words in the chunk before firing
//   - At most one reactive call every 4 seconds
const REACTIVE_MIN_WORDS = 6;
const REACTIVE_COOLDOWN_MS = 4000;
let _lastReactiveCallAt = 0;

function shouldRunReactiveAnalysis(text) {
  if (!text || !text.trim()) return false;
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < REACTIVE_MIN_WORDS) return false;
  const now = Date.now();
  if (now - _lastReactiveCallAt < REACTIVE_COOLDOWN_MS) return false;
  return true;
}

async function runReactiveAnalysis(fullBuffer, ctx) {
  if (!shouldRunReactiveAnalysis(fullBuffer)) return;
  _lastReactiveCallAt = Date.now();
  state.gabrielAnalyzing = true;
  const indicator = document.getElementById('gabriel-analyzing-indicator');
  if (indicator) indicator.style.display = 'flex';
  try {
    if (state.callType === 'outbound' && state.activeLead) {
      // Cold-call mode — use cold-call analysis
      await gabrielAI.analyzeColdCall(fullBuffer, state.activeLead);
    } else {
      // Inbound insurance mode
      await gabrielAI.analyzeTranscript(fullBuffer, ctx);
    }
  } finally {
    state.gabrielAnalyzing = false;
    const ind = document.getElementById('gabriel-analyzing-indicator');
    if (ind) ind.style.display = 'none';
  }
}

// ============================================
// GABRIEL AI WIRING
// ============================================

function getCallContextForAI() {
  const engineState = engine.getState();
  return {
    customerName: engineState.callContext.customerName,
    lineOfBusiness: engineState.callContext.lineOfBusiness,
    stage: engineState.callContext.stage,
    triggers: [...(engineState.callContext.triggers || [])],
    activeDisclosures: engineState.activeDisclosures,
    completedDisclosures: engineState.completedDisclosures,
  };
}

// Subscribe to Gabriel AI events
gabrielAI.subscribe((event) => {
  if (event.type === 'THINKING') {
    state.gabrielThinking = true;
    render();
    return;
  }

  state.gabrielThinking = false;

  if (event.type === 'ERROR') {
    pushGabrielEvent({
      type: 'ERROR',
      message: event.message,
      timestamp: new Date().toISOString(),
    });
    render();
    return;
  }

  if (event.type === REACTION_TYPES.ANSWER ||
      event.type === REACTION_TYPES.AUTO_FILL ||
      event.type === REACTION_TYPES.TRIGGER ||
      event.type === REACTION_TYPES.ALERT ||
      event.type === REACTION_TYPES.TALK_TRACK ||
      event.type === REACTION_TYPES.OBJECTION ||
      event.type === REACTION_TYPES.CAPTURE ||
      event.type === REACTION_TYPES.QUALIFY) {
    pushGabrielEvent(event);

    // Auto-fill: update engine / form fields if applicable
    if (event.type === REACTION_TYPES.AUTO_FILL) {
      handleAutoFill(event);
    }

    // Capture: store extracted fields to pre-fill outcome notes (outbound)
    if (event.type === REACTION_TYPES.CAPTURE && event.field && event.value) {
      state.capturedFields[event.field] = event.value;
    }

    render();
  }
});

// Subscribe to Phone Engine events
phoneEngine.subscribe((event) => {
  if (event.type === 'LAUNCHED') {
    state.gvCallActive = true;
    state.gvCallTimer = '00:00';
    // Auto-start mic so Gabriel starts listening immediately
    if (state.micStatus === MIC_STATUS.IDLE) {
      speechEngine.start();
    }
    render();
    return;
  }
  if (event.type === 'TIMER') {
    state.gvCallTimer = event.display;
    // Update timer in-place without full re-render
    const el = document.getElementById('gv-call-timer');
    if (el) el.textContent = event.display;
    return;
  }
  if (event.type === 'ENDED') {
    state.gvCallActive = false;
    state.gvCallTimer = '00:00';
    render();
    return;
  }
});

// Subscribe to Speech Engine events
speechEngine.subscribe((event) => {
  if (event.type === 'STATUS_CHANGE') {
    state.micStatus = event.status;
    render();
    return;
  }

  if (event.type === 'TRANSCRIPT_INTERIM') {
    state.liveTranscript = event.text;
    // Update just the transcript div without full re-render
    const el = document.getElementById('gabriel-live-transcript');
    if (el) el.textContent = event.text;
    return;
  }

  if (event.type === 'TRANSCRIPT_FINAL') {
    state.liveTranscript = '';

    // Accumulate in transcript log
    state.transcriptLog.push({
      text: event.text,
      speaker: event.speaker,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    // Efficiently append to transcript panel if visible (no full re-render)
    appendTranscriptEntry(state.transcriptLog[state.transcriptLog.length - 1]);

    if (state.spanishMode) {
      // Route to Spanish translation instead of AI analysis
      gabrielAI.translateToEnglish(event.text).then((translated) => {
        if (translated) {
          state.spanishTranslatedCustomer = translated;
          const box = document.getElementById('spanish-customer-text');
          if (box) box.textContent = translated;
        }
      });
    } else {
      const ctx = getCallContextForAI();
      runReactiveAnalysis(event.fullBuffer, ctx);
    }
    return;
  }

  if (event.type === 'ERROR') {
    pushGabrielEvent({
      type: 'ERROR',
      message: event.message,
      timestamp: new Date().toISOString(),
    });
    render();
    return;
  }
});

function pushGabrielEvent(event) {
  state.gabrielEvents.unshift(event); // newest first
  if (state.gabrielEvents.length > MAX_GABRIEL_EVENTS) {
    state.gabrielEvents.pop();
  }
}

function handleAutoFill(event) {
  if (event.field === 'customerName' && event.value) {
    engine.updateCustomerName(event.value);
  }
  // VIN and other fields — update form inputs directly
  const fieldEl = document.getElementById(`autofill-${event.field}`);
  if (fieldEl) {
    fieldEl.value = event.value || '';
    fieldEl.classList.add('autofilled');
    setTimeout(() => fieldEl.classList.remove('autofilled'), 2000);
  }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <div class="main-content">
      ${renderTopBar()}
      <div class="workspace">
        ${state.currentView === 'dashboard' ? renderDashboard() : ''}
        ${state.currentView === 'call'      ? renderCallView()  : ''}
        ${state.currentView === 'library'   ? renderLibrary()   : ''}
        ${state.currentView === 'leads'     ? renderLeadsView() : ''}
      </div>
    </div>
    ${renderStartCallModal()}
    ${renderSummaryModal()}
    ${renderSettingsModal()}
    ${renderOutcomeModal()}
  `;
  bindEvents();
}

// --- Sidebar ---
function renderSidebar() {
  const engineState = engine.getState();
  const activeCount = engineState.activeDisclosures.length;
  const isInCall = engineState.callContext.stage !== 'idle';
  const micActive = state.micStatus === MIC_STATUS.LISTENING;

  return `
    <aside class="sidebar ${state.sidebarOpen ? 'mobile-open' : ''}" id="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-brand-icon">👼</div>
        <div class="sidebar-brand-text">
          <h1>Gabriel</h1>
          <span>Agent Copilot</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a class="sidebar-nav-item ${state.currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
          <span class="nav-icon">🏠</span>
          Dashboard
        </a>
        <a class="sidebar-nav-item ${state.currentView === 'call' ? 'active' : ''}" data-view="call">
          <span class="nav-icon">📞</span>
          Active Call
          ${activeCount > 0 ? `<span class="nav-badge">${activeCount}</span>` : ''}
        </a>
        <a class="sidebar-nav-item ${state.currentView === 'leads' ? 'active' : ''}" data-view="leads">
          <span class="nav-icon">🎯</span>
          Leads
          ${state.leadsStats && state.leadsStats.new > 0 ? `<span class="nav-badge leads-badge">${state.leadsStats.new}</span>` : ''}
        </a>
        <a class="sidebar-nav-item ${state.currentView === 'library' ? 'active' : ''}" data-view="library">
          <span class="nav-icon">📚</span>
          Disclosure Library
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-status-row">
          <span class="status-dot ${micActive ? 'mic-active' : ''}"></span>
          ${isInCall ? `On Call — ${engineState.callContext.customerName || 'Customer'}` : 'Ready'}
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top: 8px;">
          <span style="opacity: 0.5; font-size: 0.65rem;">TX Personal Auto • v2.0</span>
          <button class="settings-btn" id="settings-trigger" title="Settings">⚙️</button>
        </div>
      </div>
    </aside>
  `;
}

// --- Top Bar ---
function renderTopBar() {
  const engineState = engine.getState();
  const stages = ['intake', 'drivers', 'vehicles', 'coverage', 'disclosures', 'review'];
  const currentStage = engineState.callContext.stage;
  const isInCall = currentStage !== 'idle';

  return `
    <div class="top-bar">
      <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
      <span class="top-bar-title">
        ${state.currentView === 'dashboard' ? 'Dashboard' : ''}
        ${state.currentView === 'call' ? (isInCall ? `📞 ${engineState.callContext.customerName || 'Active Call'}` : 'Active Call') : ''}
        ${state.currentView === 'library' ? 'Disclosure Library' : ''}
      </span>
      ${isInCall && state.currentView === 'call' ? `
        <div class="top-bar-stage">
          ${stages.map(s => `
            <span class="stage-pill ${s === currentStage ? 'active' : (stages.indexOf(s) < stages.indexOf(currentStage) ? 'completed' : 'inactive')}" 
                  data-stage="${s}">
              ${s === currentStage ? '●' : (stages.indexOf(s) < stages.indexOf(currentStage) ? '✓' : '')} ${s}
            </span>
          `).join('')}
        </div>
        <button class="checklist-toggle" id="checklist-toggle">📋</button>
      ` : ''}
    </div>
  `;
}

// --- Dashboard ---
function renderDashboard() {
  const engineState = engine.getState();
  const isInCall = engineState.callContext.stage !== 'idle';
  const hasGeminiKey = gabrielAI.hasApiKey();
  const hasDeepgramKey = speechEngine.hasApiKey();

  if (isInCall) {
    return `
      <div class="welcome-screen">
        <div class="welcome-icon">📞</div>
        <h2>Call in Progress</h2>
        <p>You have an active call with <strong>${engineState.callContext.customerName || 'a customer'}</strong>. Switch to the Active Call view to manage disclosures.</p>
        <button class="start-call-btn" data-view="call">Go to Active Call →</button>
      </div>
    `;
  }

  return `
    <div class="welcome-screen">
      <div class="welcome-icon">👼</div>
      <h2>Gabriel</h2>
      <p>Your real-time AI compliance copilot. Gabriel listens to your calls, helps you navigate any situation, and ensures every required disclosure is delivered — so nothing ever gets missed.</p>
      
      ${!hasGeminiKey || !hasDeepgramKey ? `
        <div class="setup-notice">
          <div class="setup-notice-title">⚙️ Setup Required</div>
          <div class="setup-notice-items">
            ${!hasGeminiKey ? '<div class="setup-item missing">❌ Gemini API key not configured</div>' : '<div class="setup-item ok">✅ Gemini connected</div>'}
            ${!hasDeepgramKey ? '<div class="setup-item missing">❌ Deepgram API key not configured</div>' : '<div class="setup-item ok">✅ Deepgram connected</div>'}
          </div>
          <button class="btn-settings-open" id="start-settings-trigger">⚙️ Open Settings</button>
        </div>
      ` : `
        <div class="setup-notice all-good">
          <div class="setup-item ok">✅ Gemini connected</div>
          <div class="setup-item ok">✅ Deepgram connected</div>
        </div>
      `}

      <button class="start-call-btn" id="start-call-trigger" style="margin-top: 24px;">
        📞 Start New Call
      </button>
    </div>
  `;
}

// --- Active Call View ---
function renderCallView() {
  const engineState = engine.getState();
  const isInCall = engineState.callContext.stage !== 'idle';

  if (!isInCall) {
    return `
      <div class="welcome-screen">
        <div class="welcome-icon">📞</div>
        <h2>No Active Call</h2>
        <p>Start a call to begin real-time compliance tracking with Gabriel.</p>
        <button class="start-call-btn" id="start-call-trigger">
          📞 Start New Call
        </button>
      </div>
    `;
  }

  const triggers = engine.getAvailableTriggers();
  const { activeDisclosures, completedDisclosures, stats } = engineState;

  return `
    <!-- Hidden autofill DOM anchors for speech auto-fill -->
    <input type="hidden" id="autofill-customerName" />
    <input type="hidden" id="autofill-vin" />
    <input type="hidden" id="autofill-vehicleYear" />
    <input type="hidden" id="autofill-vehicleMake" />
    <input type="hidden" id="autofill-vehicleModel" />
    <input type="hidden" id="autofill-policyType" />
    <div class="call-workspace-v2">
      <!-- Left: Disclosures Column -->
      <div class="disclosures-column">
        <div class="triggers-section">
          <div class="section-title">⚡ Quick Actions</div>
          <div class="trigger-grid">
            ${triggers
              .filter(t => t.key !== 'start_application')
              .map(t => `
                <button class="trigger-btn ${t.used ? 'used' : ''}" 
                        data-trigger="${t.key}" 
                        ${t.used ? 'disabled' : ''}>
                  ${t.label}
                </button>
              `).join('')}
          </div>
        </div>

        <div class="section-title">
          📋 Active Disclosures 
          ${activeDisclosures.length > 0 ? `<span class="text-accent">(${activeDisclosures.length})</span>` : ''}
        </div>
        
        <div class="disclosures-area">
          ${activeDisclosures.length === 0 
            ? `<div class="empty-disclosures">
                <div class="empty-icon">✨</div>
                <p>No active disclosures right now.<br>Use the Quick Actions above to trigger disclosures as the call progresses.</p>
               </div>`
            : activeDisclosures.map(d => renderDisclosureCard(d)).join('')
          }
        </div>
      </div>

      <!-- Center: Gabriel AI Pane -->
      <div class="gabriel-pane ${state.gabrielPaneOpen ? '' : 'gabriel-pane-collapsed'}" id="gabriel-pane">
        <!-- Mobile collapse tab -->
        <button class="gabriel-collapse-tab" id="gabriel-collapse-tab" title="${state.gabrielPaneOpen ? 'Collapse Gabriel' : 'Expand Gabriel'}">
          ${state.gabrielPaneOpen ? '◀' : '▶'} <span class="gabriel-collapse-label">Gabriel</span>
        </button>
        ${state.gabrielPaneOpen
          ? (state.callType === 'outbound' ? renderColdCallGabrielPane() : renderGabrielPane())
          : ''}
      </div>

      <!-- Right: Checklist -->
      <div class="checklist-panel ${state.checklistOpen ? 'mobile-open' : ''}" id="checklist-panel">
        ${renderChecklist(activeDisclosures, completedDisclosures, stats)}
      </div>
    </div>
  `;
}

// --- Gabriel AI Pane ---
function renderGabrielPane() {
  const micActive = state.micStatus === MIC_STATUS.LISTENING;
  const micConnecting = state.micStatus === MIC_STATUS.CONNECTING;
  const micError = state.micStatus === MIC_STATUS.ERROR;

  const statusLabel = {
    [MIC_STATUS.IDLE]: 'Ready',
    [MIC_STATUS.CONNECTING]: 'Connecting…',
    [MIC_STATUS.LISTENING]: 'Listening',
    [MIC_STATUS.PAUSED]: 'Paused',
    [MIC_STATUS.ERROR]: 'Error',
  }[state.micStatus] || 'Ready';

  const statusClass = micActive ? 'status-listening' : micError ? 'status-error' : micConnecting ? 'status-connecting' : 'status-idle';

  return `
    <div class="gabriel-pane-header">
      <div class="gabriel-pane-title">
        <span>🤖 Gabriel</span>
        <div class="gabriel-status ${statusClass}">
          <span class="gabriel-status-dot"></span>
          ${statusLabel}
        </div>
      </div>
      <div class="gabriel-pane-actions">
        <button class="gabriel-tool-btn ${state.showTranscript ? 'active' : ''}" id="transcript-toggle"
                title="${state.showTranscript ? 'Hide Transcript' : 'Show Transcript'}">
          📄 Transcript
        </button>
        <button class="gabriel-tool-btn ${state.spanishMode ? 'active spanish-active' : ''}" id="spanish-toggle"
                title="${state.spanishMode ? 'Disable Spanish Mode' : 'Enable Spanish Translator'}">
          🌐 Español
        </button>
        <div class="mic-toggle-wrap">
          <button class="mic-toggle-btn ${micActive ? 'active' : ''}" id="mic-toggle" 
                  title="${micActive ? 'Stop Listening' : 'Start Listening'}">
            ${micConnecting ? '⏳' : micActive ? '🔴' : '🎙️'}
            ${micConnecting ? 'Connecting' : micActive ? 'Stop' : 'Listen'}
          </button>
          ${speechEngine.getDeviceId() ? (() => {
            const dev = state.availableMicDevices.find(d => d.deviceId === speechEngine.getDeviceId());
            const label = dev ? dev.label : 'Custom device';
            const shortLabel = label.length > 22 ? label.slice(0, 20) + '…' : label;
            return `<div class="mic-device-label" title="${escapeHtml(label)}">📡 ${escapeHtml(shortLabel)}</div>`;
          })() : ''}
        </div>
      </div>
    </div>

    <!-- Live interim transcript ticker -->
    ${micActive ? `
      <div class="gabriel-transcript-bar">
        <span id="gabriel-live-transcript" class="gabriel-transcript-text">${state.liveTranscript || '…listening…'}</span>
      </div>
    ` : ''}

    <!-- Transcript Log Panel -->
    ${state.showTranscript ? renderTranscriptPanel() : ''}

    <!-- Spanish Translator Panel -->
    ${state.spanishMode ? renderSpanishPanel() : ''}

    <!-- Event feed (hidden in Spanish-only mode when there are no events) -->
    ${!state.spanishMode ? `
      <div class="gabriel-feed" id="gabriel-feed">
        ${state.gabrielThinking ? `
          <div class="gabriel-event gabriel-thinking">
            <div class="gabriel-thinking-dots"><span></span><span></span><span></span></div>
            <span>Gabriel is thinking…</span>
          </div>
        ` : ''}
        <div class="gabriel-analyzing-indicator" id="gabriel-analyzing-indicator"
             style="display: ${state.gabrielAnalyzing ? 'flex' : 'none'}">
          <span class="gabriel-analyzing-dot"></span>
          <span>Analyzing speech…</span>
        </div>
        ${state.gabrielEvents.length === 0 && !state.gabrielThinking ? `
          <div class="gabriel-empty">
            <p>Gabriel is watching.<br>Ask a question below or start listening to hear the call.</p>
          </div>
        ` : ''}
        ${state.gabrielEvents.map((ev, idx) => renderGabrielEvent(ev, idx)).join('')}
      </div>
    ` : ''}

    <!-- Manual Q&A input -->
    <div class="gabriel-input-bar">
      <input type="text" 
             id="gabriel-question-input"
             class="gabriel-input"
             placeholder="Ask Gabriel anything… (e.g. What if they have a DUI?)"
             value="${escapeHtml(state.gabrielInput)}"
             autocomplete="off" />
      <button class="gabriel-send-btn" id="gabriel-send" 
              ${!gabrielAI.hasApiKey() ? 'disabled title="Configure Gemini API key in Settings"' : ''}>
        ${state.gabrielThinking ? '⏳' : '→'}
      </button>
    </div>
  `;
}

// --- Transcript Log Panel ---
function renderTranscriptPanel() {
  return `
    <div class="transcript-panel" id="transcript-panel">
      <div class="transcript-panel-header">
        <span>📄 Live Transcript</span>
        ${state.transcriptLog.length > 0
          ? `<button class="transcript-clear-btn" id="transcript-clear">Clear</button>`
          : ''}
      </div>
      <div class="transcript-entries" id="transcript-entries">
        ${state.transcriptLog.length === 0
          ? `<div class="transcript-empty">Transcript will appear here when the mic is listening.</div>`
          : state.transcriptLog.map(entry => transcriptEntryHtml(entry)).join('')
        }
      </div>
    </div>
  `;
}

function transcriptEntryHtml(entry) {
  const cls = entry.speaker === 'Agent'
    ? 'transcript-entry-agent'
    : entry.speaker === 'Customer'
      ? 'transcript-entry-customer'
      : 'transcript-entry-unknown';
  const label = entry.speaker || '🎙️';
  return `<div class="transcript-entry ${cls}">
    <span class="transcript-speaker">${escapeHtml(label)}</span>
    <span class="transcript-text">${escapeHtml(entry.text)}</span>
    <span class="transcript-time">${escapeHtml(entry.time)}</span>
  </div>`;
}

// Efficiently append a new transcript entry without full re-render
function appendTranscriptEntry(entry) {
  const container = document.getElementById('transcript-entries');
  if (!container) return;
  // Remove empty placeholder if present
  const empty = container.querySelector('.transcript-empty');
  if (empty) empty.remove();
  const div = document.createElement('div');
  div.innerHTML = transcriptEntryHtml(entry);
  container.appendChild(div.firstElementChild);
  container.scrollTop = container.scrollHeight;
}

// --- Spanish Translator Panel ---
function renderSpanishPanel() {
  return `
    <div class="spanish-panel">
      <div class="spanish-section">
        <div class="spanish-section-label">🇲🇽 They Said <span class="spanish-label-sub">(translated to English)</span></div>
        <div class="spanish-customer-box" id="spanish-customer-text">
          ${escapeHtml(state.spanishTranslatedCustomer) || '<span class="spanish-placeholder">Customer\'s Spanish will appear here in English…</span>'}
        </div>
      </div>
      <div class="spanish-section">
        <div class="spanish-section-label">💬 Your Response <span class="spanish-label-sub">(type in English)</span></div>
        <div class="spanish-input-row">
          <input type="text"
                 id="spanish-agent-input"
                 class="spanish-input"
                 placeholder="Type your English reply here…"
                 value="${escapeHtml(state.spanishAgentInput)}"
                 autocomplete="off" />
          <button class="spanish-translate-btn" id="spanish-translate"
                  ${!gabrielAI.hasApiKey() ? 'disabled title="Configure Gemini API key in Settings"' : ''}>
            ${state.spanishTranslating ? '⏳' : 'Translate →'}
          </button>
        </div>
        ${state.spanishTranslatedAgent ? `
          <div class="spanish-speak-box">
            <div class="spanish-speak-label">🗣️ Speak This (Spanish)</div>
            <div class="spanish-speak-text">${escapeHtml(state.spanishTranslatedAgent)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderGabrielEvent(ev, idx) {
  const typeConfig = {
    [REACTION_TYPES.AUTO_FILL]:  { icon: '✏️', cls: 'ev-autofill',  label: 'Auto-Fill' },
    [REACTION_TYPES.TRIGGER]:    { icon: '⚡', cls: 'ev-trigger',   label: 'Trigger' },
    [REACTION_TYPES.ALERT]:      { icon: '🚨', cls: 'ev-alert',     label: 'Alert' },
    [REACTION_TYPES.ANSWER]:     { icon: '💬', cls: 'ev-answer',    label: 'Answer' },
    [REACTION_TYPES.TALK_TRACK]: { icon: '🗣️', cls: 'ev-talktrack', label: 'Talk Track' },
    [REACTION_TYPES.OBJECTION]:  { icon: '🛡️', cls: 'ev-objection', label: 'Objection' },
    [REACTION_TYPES.CAPTURE]:    { icon: '📌', cls: 'ev-capture',   label: 'Captured' },
    [REACTION_TYPES.QUALIFY]:    { icon: '🔍', cls: 'ev-qualify',   label: 'Qualify' },
    'ERROR':                     { icon: '❌', cls: 'ev-error',     label: 'Error' },
    'USER_QUESTION':             { icon: '🧑', cls: 'ev-user',      label: 'You asked' },
  };

  const cfg = typeConfig[ev.type] || { icon: '•', cls: 'ev-answer', label: ev.type };
  const time = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  let content = '';

  if (ev.type === REACTION_TYPES.AUTO_FILL) {
    content = `<strong>${ev.field}:</strong> ${escapeHtml(ev.value || '')}`;
    if (ev.message) content += `<br><span class="ev-sub">${escapeHtml(ev.message)}</span>`;
  } else if (ev.type === REACTION_TYPES.TRIGGER) {
    content = escapeHtml(ev.message || ev.triggerKey || '');
    if (ev.triggerKey) {
      content += `<button class="gabriel-confirm-trigger" data-trigger="${ev.triggerKey}">⚡ Confirm</button>`;
    }
  } else {
    // Format answer text with line breaks preserved
    content = escapeHtml(ev.message || '').replace(/\n/g, '<br>');
  }

  // Speaker badge label — show who was heard if available
  const speakerLabel = ev.source === 'speech'
    ? `🎙️ ${ev.speaker ? escapeHtml(ev.speaker) : 'heard'}`
    : null;

  return `
    <div class="gabriel-event ${cfg.cls} ${idx === 0 && !state.gabrielThinking ? 'gabriel-event-new' : ''}" data-ev-idx="${idx}">
      <div class="gabriel-event-header">
        <span class="gabriel-event-type">${cfg.icon} ${cfg.label}</span>
        ${speakerLabel ? `<span class="gabriel-event-badge">${speakerLabel}</span>` : ''}
        <span class="gabriel-event-time">${time}</span>
      </div>
      <div class="gabriel-event-body">${content}</div>
    </div>
  `;
}

// --- Disclosure Card ---
function renderDisclosureCard(d) {
  const notesExpanded = state.expandedNotes.has(d.id);

  return `
    <div class="disclosure-card severity-${d.severity}" id="card-${d.id}">
      <div class="disclosure-card-header">
        <div>
          <div class="disclosure-card-title">${d.name}</div>
          <div class="disclosure-statute">${d.statute}</div>
        </div>
        <div class="disclosure-card-badges">
          ${d.severity === 'critical' ? '<span class="badge badge-critical">Critical</span>' : ''}
          ${d.required ? '<span class="badge badge-required">Required</span>' : '<span class="badge badge-recommended">Recommended</span>'}
          ${d.formRequired ? '<span class="badge badge-form">Form Required</span>' : ''}
        </div>
      </div>

      <div class="disclosure-text">
        <button class="copy-btn" data-copy="${d.id}">📋 Copy</button>
        ${d.disclosureText}
      </div>

      <div class="agent-notes">
        <button class="agent-notes-toggle" data-notes-toggle="${d.id}">
          <span class="arrow ${notesExpanded ? 'expanded' : ''}">▶</span>
          Agent Notes
        </button>
        <div class="agent-notes-content ${notesExpanded ? 'expanded' : ''}">
          ${d.agentNotes}
        </div>
      </div>

      ${d.formRequired ? `
        <div class="form-notice">
          📄 <strong>${d.formName}</strong>
        </div>
      ` : ''}

      <div class="disclosure-card-actions">
        <button class="mark-complete-btn" data-complete="${d.id}">
          ✓ Mark as Presented
        </button>
      </div>
    </div>
  `;
}

// --- Checklist Panel ---
function renderChecklist(active, completed, stats) {
  const allItems = [...completed.map(d => ({ ...d, done: true })), ...active.map(d => ({ ...d, done: false }))];
  allItems.sort((a, b) => a.order - b.order);

  return `
    <div class="checklist-header">
      <h3>📋 Checklist</h3>
      <span class="checklist-percentage">${stats.percentage}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: ${stats.percentage}%"></div>
    </div>
    <div class="checklist-items">
      ${allItems.map(item => `
        <div class="checklist-item ${item.done ? 'completed' : 'pending'}" data-checklist-id="${item.id}" data-done="${item.done}">
          <span class="check-icon">${item.done ? '✓' : ''}</span>
          <span class="check-label">${item.name}</span>
          <span class="severity-indicator ${item.severity}"></span>
        </div>
      `).join('')}
      ${allItems.length === 0 ? '<p class="text-muted" style="font-size:0.82rem; text-align:center; padding: 16px;">Disclosures will appear here as they are triggered.</p>' : ''}
    </div>
    <div class="call-summary-section">
      <div style="font-size:0.75rem; color: var(--text-muted); margin-bottom: 8px;">
        ${stats.requiredRemaining > 0 
          ? `⚠️ ${stats.requiredRemaining} required disclosure${stats.requiredRemaining > 1 ? 's' : ''} remaining`
          : stats.total > 0 ? '✅ All required disclosures completed' : ''
        }
      </div>
      <button class="end-call-btn" id="end-call-btn">End Call & Review</button>
    </div>
  `;
}

// --- Library View ---
function renderLibrary() {
  const allDisclosures = engine.getState().allDisclosures;

  return `
    <div class="section-title" style="margin-bottom: 8px;">All TX Personal Auto Disclosures</div>
    <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 24px;">Complete reference library of all required and recommended disclosures for Texas personal auto insurance.</p>
    <div class="library-grid">
      ${allDisclosures.map(d => `
        <div class="library-card severity-${d.severity}">
          <div class="disclosure-card-header" style="margin-bottom: 8px;">
            <div class="disclosure-card-title" style="font-size: 0.95rem;">${d.name}</div>
            <div class="disclosure-card-badges">
              ${d.severity === 'critical' ? '<span class="badge badge-critical">Critical</span>' : ''}
              ${d.required ? '<span class="badge badge-required">Required</span>' : '<span class="badge badge-recommended">Rec.</span>'}
              ${d.formRequired ? '<span class="badge badge-form">Form</span>' : ''}
            </div>
          </div>
          <div class="disclosure-statute">${d.statute}</div>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">
            ${d.disclosureText.substring(0, 180)}…
          </p>
        </div>
      `).join('')}
    </div>
  `;
}

// =============================================================================
// LEADS VIEW
// =============================================================================
function renderLeadsView() {
  const filtered = state.leads.filter(lead => {
    const matchesStatus = state.leadsFilter === 'all' || lead.status === state.leadsFilter;
    const q = state.leadsSearch.toLowerCase();
    const matchesSearch = !q ||
      lead.name.toLowerCase().includes(q) ||
      (lead.phone || '').includes(q) ||
      (lead.city || '').toLowerCase().includes(q) ||
      (lead.category || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const statusBadge = (s) => {
    const map = {
      new:            { label: 'New',           cls: 'badge-new' },
      called:         { label: 'Called',        cls: 'badge-called' },
      interested:     { label: 'Interested',    cls: 'badge-interested' },
      callback:       { label: 'Callback',      cls: 'badge-callback' },
      not_interested: { label: 'Not Interested',cls: 'badge-cold' },
      no_answer:      { label: 'No Answer',     cls: 'badge-no-answer' },
      closed:         { label: 'Closed',        cls: 'badge-closed' },
    };
    const cfg = map[s] || { label: s, cls: '' };
    return `<span class="lead-status-badge ${cfg.cls}">${cfg.label}</span>`;
  };

  const stats = state.leadsStats;

  return `
    <div class="leads-view">
      <div class="leads-header">
        <div class="leads-header-title">
          <h2>🎯 Lead Database</h2>
          <span class="leads-count">${state.leads.length} total leads</span>
        </div>
        <div class="leads-header-actions">
          <label class="import-csv-btn" for="csv-import-input">
            ${state.leadsImporting ? '⏳ Importing…' : '📂 Import CSV'}
          </label>
          <input type="file" id="csv-import-input" accept=".csv" style="display:none;" />
        </div>
      </div>

      ${stats ? `
        <div class="leads-stats-bar">
          <div class="lead-stat" data-filter="all" data-active="${state.leadsFilter === 'all'}">
            <span class="lead-stat-num">${stats.total}</span>
            <span class="lead-stat-label">All</span>
          </div>
          <div class="lead-stat" data-filter="new" data-active="${state.leadsFilter === 'new'}">
            <span class="lead-stat-num">${stats.new}</span>
            <span class="lead-stat-label">New</span>
          </div>
          <div class="lead-stat" data-filter="interested" data-active="${state.leadsFilter === 'interested'}">
            <span class="lead-stat-num">${stats.interested}</span>
            <span class="lead-stat-label">Interested</span>
          </div>
          <div class="lead-stat" data-filter="callback" data-active="${state.leadsFilter === 'callback'}">
            <span class="lead-stat-num">${stats.callback}</span>
            <span class="lead-stat-label">Callback</span>
          </div>
          <div class="lead-stat" data-filter="not_interested" data-active="${state.leadsFilter === 'not_interested'}">
            <span class="lead-stat-num">${stats.not_interested}</span>
            <span class="lead-stat-label">Not Interested</span>
          </div>
          <div class="lead-stat" data-filter="no_answer" data-active="${state.leadsFilter === 'no_answer'}">
            <span class="lead-stat-num">${stats.no_answer}</span>
            <span class="lead-stat-label">No Answer</span>
          </div>
        </div>
      ` : ''}

      <div class="leads-search-bar">
        <input type="text" 
               id="leads-search" 
               class="leads-search-input"
               placeholder="🔍 Search by name, phone, city, or category…"
               value="${escapeHtml(state.leadsSearch)}" />
      </div>

      ${state.leads.length === 0 && !state.leadsImporting ? `
        <div class="leads-empty">
          <div class="leads-empty-icon">🎯</div>
          <h3>No Leads Yet</h3>
          <p>Import a CSV from your lead scraper to get started, or add leads manually.</p>
          <label class="import-csv-btn-large" for="csv-import-input">📂 Import CSV File</label>
          <input type="file" id="csv-import-input" accept=".csv" style="display:none;" />
        </div>
      ` : filtered.length === 0 ? `
        <div class="leads-empty">
          <p>No leads match your search or filter.</p>
        </div>
      ` : `
        <div class="leads-grid">
          ${filtered.map(lead => `
            <div class="lead-card" data-lead-id="${lead.id}">
              <div class="lead-card-header">
                <div class="lead-card-name">${escapeHtml(lead.name)}</div>
                ${statusBadge(lead.status)}
              </div>
              <div class="lead-card-meta">
                ${lead.phone ? `<span>📞 ${escapeHtml(lead.phone)}</span>` : ''}
                ${lead.city  ? `<span>📍 ${escapeHtml([lead.city, lead.state].filter(Boolean).join(', '))}</span>` : ''}
              </div>
              <div class="lead-card-category">${escapeHtml(lead.category || '')}</div>
              ${lead.notes ? `<div class="lead-card-notes">${escapeHtml(lead.notes.substring(0, 80))}${lead.notes.length > 80 ? '…' : ''}</div>` : ''}
              ${Object.keys(lead.capturedData || {}).length > 0 ? `
                <div class="lead-card-captured">
                  ${Object.entries(lead.capturedData).map(([k, v]) => `<span class="capture-chip">📌 ${escapeHtml(k)}: ${escapeHtml(String(v))}</span>`).join('')}
                </div>
              ` : ''}
              <div class="lead-card-footer">
                ${lead.lastCalled ? `<span class="lead-last-called">Last called: ${new Date(lead.lastCalled).toLocaleDateString()}</span>` : '<span class="lead-last-called">Never called</span>'}
                <button class="lead-call-btn" data-call-lead="${lead.id}">📞 Call Now</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// =============================================================================
// COLD-CALL GABRIEL PANE
// =============================================================================
function renderColdCallGabrielPane() {
  const micActive      = state.micStatus === MIC_STATUS.LISTENING;
  const micConnecting  = state.micStatus === MIC_STATUS.CONNECTING;
  const micError       = state.micStatus === MIC_STATUS.ERROR;
  const lead           = state.activeLead;

  const phases = ['opener', 'qualify', 'pitch', 'close'];
  const phaseLabels = { opener: '👋 Opener', qualify: '🔍 Qualify', pitch: '💬 Pitch', close: '🎯 Close' };

  const statusLabel = {
    [MIC_STATUS.IDLE]:       'Ready',
    [MIC_STATUS.CONNECTING]: 'Connecting…',
    [MIC_STATUS.LISTENING]:  'Listening',
    [MIC_STATUS.PAUSED]:     'Paused',
    [MIC_STATUS.ERROR]:      'Error',
  }[state.micStatus] || 'Ready';

  const statusClass = micActive ? 'status-listening' : micError ? 'status-error' : micConnecting ? 'status-connecting' : 'status-idle';

  return `
    <div class="gabriel-pane-header">
      <div class="gabriel-pane-title">
        <span>🤖 Gabriel — Outbound</span>
        <div class="gabriel-status ${statusClass}">
          <span class="gabriel-status-dot"></span>
          ${statusLabel}
        </div>
      </div>
      <div class="gabriel-pane-actions">
        <div class="mic-toggle-wrap">
          <button class="mic-toggle-btn ${micActive ? 'active' : ''}" id="mic-toggle"
                  title="${micActive ? 'Stop Listening' : 'Start Listening'}">
            ${micConnecting ? '⏳' : micActive ? '🔴' : '🎤'}
            ${micConnecting ? 'Connecting' : micActive ? 'Stop' : 'Listen'}
          </button>
        </div>
      </div>
    </div>

    <!-- Lead Info Strip -->
    ${lead ? `
      <div class="cold-call-lead-strip">
        <div class="cold-call-lead-name">${escapeHtml(lead.name)}</div>
        <div class="cold-call-lead-meta">
          <span>📞 ${escapeHtml(lead.phone || 'No phone')}</span>
          <span>💼 ${escapeHtml(lead.category || '')}</span>
          <span>📍 ${escapeHtml([lead.city, lead.state].filter(Boolean).join(', ') || '')}</span>
          ${(lead.callCount || 0) > 0 ? `<span>🔄 Call #${lead.callCount + 1}</span>` : '<span>✨ First call!</span>'}
        </div>
        <!-- Google Voice dial button -->
        <div class="gv-dial-row">
          ${state.gvCallActive ? `
            <div class="gv-call-active">
              <span class="gv-call-dot"></span>
              <span class="gv-call-label">Call in Progress</span>
              <span class="gv-call-timer" id="gv-call-timer">${state.gvCallTimer}</span>
              <button class="gv-end-btn" id="gv-end-btn">End Call</button>
            </div>
          ` : `
            <button class="gv-call-btn" id="gv-call-btn"
                    data-phone="${escapeHtml(lead.phone || '')}"
                    ${!lead.phone ? 'disabled title="No phone number for this lead"' : ''}>
              📞 Call with Google Voice
            </button>
          `}
        </div>
      </div>
    ` : ''}

    <!-- Call Phase Tracker -->
    <div class="cold-call-phases">
      ${phases.map(p => `
        <button class="cold-call-phase ${state.coldCallPhase === p ? 'active' : ''}" data-phase="${p}">
          ${phaseLabels[p]}
        </button>
      `).join('')}
    </div>

    <!-- Live transcript ticker -->
    ${micActive ? `
      <div class="gabriel-transcript-bar">
        <span id="gabriel-live-transcript" class="gabriel-transcript-text">${state.liveTranscript || '…listening…'}</span>
      </div>
    ` : ''}

    <!-- Captured Data Chips -->
    ${Object.keys(state.capturedFields).length > 0 ? `
      <div class="cold-call-captures">
        <div class="captures-label">📌 Captured Info</div>
        ${Object.entries(state.capturedFields).map(([k, v]) =>
          `<span class="capture-chip">${escapeHtml(k)}: <strong>${escapeHtml(String(v))}</strong></span>`
        ).join('')}
      </div>
    ` : ''}

    <!-- Gabriel AI Event Feed -->
    <div class="gabriel-feed" id="gabriel-feed">
      ${state.gabrielThinking ? `
        <div class="gabriel-event gabriel-thinking">
          <div class="gabriel-thinking-dots"><span></span><span></span><span></span></div>
          <span>Gabriel is thinking…</span>
        </div>
      ` : ''}
      <div class="gabriel-analyzing-indicator" id="gabriel-analyzing-indicator"
           style="display: ${state.gabrielAnalyzing ? 'flex' : 'none'}">
        <span class="gabriel-analyzing-dot"></span>
        <span>Analyzing speech…</span>
      </div>
      ${state.gabrielEvents.length === 0 && !state.gabrielThinking ? `
        <div class="gabriel-empty">
          <p>Gabriel is ready.<br>Start the mic to get real-time coaching, or ask a question below.</p>
        </div>
      ` : ''}
      ${state.gabrielEvents.map((ev, idx) => renderGabrielEvent(ev, idx)).join('')}
    </div>

    <!-- Manual Q&A input -->
    <div class="gabriel-input-bar">
      <input type="text"
             id="gabriel-question-input"
             class="gabriel-input"
             placeholder="Ask Gabriel anything… (e.g. What's our AI Receptionist price?)"
             value="${escapeHtml(state.gabrielInput)}"
             autocomplete="off" />
      <button class="gabriel-send-btn" id="gabriel-send"
              ${!gabrielAI.hasApiKey() ? 'disabled title="Configure Gemini API key in Settings"' : ''}>
        ${state.gabrielThinking ? '⏳' : '→'}
      </button>
    </div>
  `;
}

// =============================================================================
// OUTCOME LOGGER MODAL
// =============================================================================
function renderOutcomeModal() {
  if (!state.outcomeModalOpen) return '';
  const lead = state.activeLead;

  // Build pre-filled notes from captured fields
  const capturedSummary = Object.keys(state.capturedFields).length > 0
    ? '\nCaptured:\n' + Object.entries(state.capturedFields).map(([k,v]) => `- ${k}: ${v}`).join('\n')
    : '';

  return `
    <div class="modal-overlay visible" id="outcome-overlay">
      <div class="modal outcome-modal">
        <h3>📋 Log Call Outcome</h3>
        ${lead ? `<div class="outcome-lead-name">${escapeHtml(lead.name)}</div>` : ''}

        <div class="outcome-buttons">
          <button class="outcome-btn outcome-interested"  data-outcome="interested" >🎯 Interested</button>
          <button class="outcome-btn outcome-callback"    data-outcome="callback"   >📅 Callback</button>
          <button class="outcome-btn outcome-no-answer"   data-outcome="no_answer"  >📵 No Answer</button>
          <button class="outcome-btn outcome-not-int"     data-outcome="not_interested">❌ Not Interested</button>
        </div>

        <div class="modal-field">
          <label>Notes</label>
          <textarea id="outcome-notes" rows="4" placeholder="Add notes about the call…">${escapeHtml(state.outcomeNotes || capturedSummary)}</textarea>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" id="outcome-cancel">Cancel</button>
          <button class="btn-primary"   id="outcome-save">Save &amp; Continue →</button>
        </div>
      </div>
    </div>
  `;
}

// --- Start Call Modal ---
function renderStartCallModal() {
  const outbound = state.callType === 'outbound';
  const leads = state.leads.filter(l => l.status === 'new' || l.status === 'callback');

  return `
    <div class="modal-overlay ${state.modalOpen ? 'visible' : ''}" id="modal-overlay">
      <div class="modal">
        <h3>Start New Call</h3>

        <!-- Call type toggle -->
        <div class="call-type-toggle">
          <button class="call-type-btn ${!outbound ? 'active' : ''}" data-call-type="inbound">
            📞 Inbound
          </button>
          <button class="call-type-btn ${outbound ? 'active' : ''}" data-call-type="outbound">
            📤 Outbound (Cold Call)
          </button>
        </div>

        ${!outbound ? `
          <!-- Inbound fields -->
          <div class="modal-field">
            <label>Customer Name</label>
            <input type="text" id="customer-name" placeholder="e.g. John Smith" autocomplete="off" />
          </div>
          <div class="modal-field">
            <label>Line of Business</label>
            <select id="lob-select">
              <option value="personal_auto">🚗 Personal Auto</option>
              <option value="homeowners" disabled>🏠 Homeowners (Coming Soon)</option>
              <option value="medicare"   disabled>🏥 Medicare (Coming Soon)</option>
              <option value="life"       disabled>💀 Life Insurance (Coming Soon)</option>
            </select>
          </div>
        ` : `
          <!-- Outbound fields -->
          <div class="modal-field">
            <label>Select Lead</label>
            ${leads.length > 0 ? `
              <select id="lead-select">
                <option value="">-- Quick Dial (no lead) --</option>
                ${leads.map(l => `
                  <option value="${l.id}">${escapeHtml(l.name)} — ${escapeHtml(l.phone || 'no phone')} (${l.status})</option>
                `).join('')}
              </select>
            ` : `<div style="color: var(--text-muted); font-size: 0.85rem;">No new leads in database. <a data-view="leads" style="cursor:pointer; color: var(--accent);">Import leads first →</a></div>`}
          </div>
          <div class="modal-field">
            <label>Or Quick Dial (name &amp; phone)</label>
            <input type="text" id="customer-name" placeholder="Business name" autocomplete="off" style="margin-bottom: 6px;"/>
            <input type="text" id="quick-dial-phone" placeholder="Phone number" autocomplete="off" />
          </div>
        `}

        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">Cancel</button>
          <button class="btn-primary" id="modal-start">Start Call →</button>
        </div>
      </div>
    </div>
  `;
}

// --- Settings Modal ---
function renderSettingsModal() {
  const geminiKey = gabrielAI.getApiKey();
  const deepgramKey = speechEngine.getApiKey();

  return `
    <div class="modal-overlay ${state.settingsOpen ? 'visible' : ''}" id="settings-overlay">
      <div class="modal" style="max-width: 480px;">
        <h3>⚙️ Gabriel Settings</h3>
        
        <div class="modal-field">
          <label>Gemini API Key <span style="color: var(--status-critical);">*</span></label>
          <input type="password" id="settings-gemini-key" 
                 placeholder="AIza…" 
                 value="${escapeHtml(geminiKey)}"
                 autocomplete="off" />
          <div class="settings-hint">Powers Gabriel's AI brain. Get one free at <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a></div>
        </div>

        <div class="modal-field">
          <label>Deepgram API Key <span style="color: var(--status-critical);">*</span></label>
          <input type="password" id="settings-deepgram-key" 
                 placeholder="Your Deepgram key…"
                 value="${escapeHtml(deepgramKey)}"
                 autocomplete="off" />
          <div class="settings-hint">Powers real-time speech-to-text. Free tier: 12,000 min/month at <a href="https://deepgram.com" target="_blank">deepgram.com</a></div>
        </div>

        <div class="modal-field">
          <label>🎙️ Microphone Source</label>
          ${state.availableMicDevices.length > 0 ? `
            <select id="settings-mic-device">
              <option value="" ${!speechEngine.getDeviceId() ? 'selected' : ''}>Default System Microphone</option>
              ${state.availableMicDevices.map(d => `
                <option value="${escapeHtml(d.deviceId)}" ${speechEngine.getDeviceId() === d.deviceId ? 'selected' : ''}>
                  ${escapeHtml(d.label)}
                </option>
              `).join('')}
            </select>
            <div class="settings-hint">Select <strong>CABLE Output (VB-Audio Virtual Cable)</strong> to capture both sides of the call.</div>
          ` : `
            <div style="display:flex; gap: 8px; align-items:center;">
              <select id="settings-mic-device" disabled style="flex:1;">
                <option>Click "Detect" to list microphones…</option>
              </select>
              <button class="btn-secondary" id="settings-detect-devices" style="white-space:nowrap; padding: 6px 12px;">🔍 Detect</button>
            </div>
            <div class="settings-hint">Allows selecting a virtual audio cable (VB-Cable) to hear both call sides.</div>
          `}
          ${state.availableMicDevices.length > 0 ? `
            <button class="btn-secondary" id="settings-detect-devices" style="margin-top:6px; padding:4px 10px; font-size:0.78rem;">🔄 Refresh Devices</button>
          ` : ''}
        </div>

        <div class="settings-tip">
          <strong>💡 VB-Cable Tip:</strong> Install <a href="https://vb-audio.com/Cable/" target="_blank">VB-Cable</a> (free), route your phone audio → CABLE Input, then select <em>CABLE Output</em> above so Gabriel hears both sides.
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" id="settings-cancel">Cancel</button>
          <button class="btn-primary" id="settings-save">Save Settings</button>
        </div>
      </div>
    </div>
  `;
}

// --- Summary Modal ---
function renderSummaryModal() {
  if (!state.summaryModal || !state.callSummary) return '';
  const { completed, total, missingRequired } = state.callSummary;

  return `
    <div class="modal-overlay visible" id="summary-overlay">
      <div class="modal" style="max-width: 500px;">
        <h3>📋 Call Summary</h3>
        <div class="summary-stats">
          <div class="summary-stat">
            <div class="stat-value">${completed}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="summary-stat">
            <div class="stat-value">${total}</div>
            <div class="stat-label">Total Triggered</div>
          </div>
        </div>
        ${missingRequired.length > 0 ? `
          <div class="summary-missing">
            <h4>⚠️ Missing Required Disclosures</h4>
            <ul>
              ${missingRequired.map(d => `<li>${d.name} — ${d.statute}</li>`).join('')}
            </ul>
          </div>
        ` : `
          <div style="background: var(--status-success-bg); border: 1px solid rgba(16,185,129,0.3); border-radius: var(--radius-md); padding: var(--space-md); text-align: center; margin-bottom: var(--space-md);">
            <span style="font-size: 1.5rem;">✅</span>
            <p style="color: var(--status-success); font-weight: 600; margin-top: 4px;">All required disclosures completed!</p>
          </div>
        `}
        <div class="modal-actions">
          <button class="btn-secondary" id="summary-back">← Back to Call</button>
          <button class="btn-primary" id="summary-confirm">Confirm & End Call</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// UTILITY
// ============================================
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================
// EVENT BINDING
// ============================================
function bindEvents() {
  // Sidebar navigation
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentView = el.dataset.view;
      state.sidebarOpen = false;
      render();
    });
  });

  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      state.sidebarOpen = !state.sidebarOpen;
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });
  }

  // Checklist toggle
  const checklistToggle = document.getElementById('checklist-toggle');
  if (checklistToggle) {
    checklistToggle.addEventListener('click', () => {
      state.checklistOpen = !state.checklistOpen;
      document.getElementById('checklist-panel')?.classList.toggle('mobile-open');
    });
  }

  // Start call triggers
  document.querySelectorAll('#start-call-trigger').forEach(el => {
    el.addEventListener('click', () => {
      state.modalOpen = true;
      render();
      setTimeout(() => document.getElementById('customer-name')?.focus(), 100);
    });
  });

  // Settings triggers — enumerate devices when opening
  document.querySelectorAll('#settings-trigger, #start-settings-trigger').forEach(el => {
    el?.addEventListener('click', async () => {
      state.settingsOpen = true;
      render();
      // Enumerate audio input devices (requires mic permission — browser may prompt)
      try {
        // Trigger permission if not yet granted, then enumerate
        await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop())).catch(() => {});
        const devices = await navigator.mediaDevices.enumerateDevices();
        state.availableMicDevices = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone (${d.deviceId.slice(0,8)}…)` }))
          .filter(d => d.deviceId && d.deviceId !== 'default' && d.deviceId !== 'communications');
        render();
      } catch (e) {
        // Permission denied — devices list stays empty
      }
    });
  });

  // Settings save
  const settingsSave = document.getElementById('settings-save');
  if (settingsSave) {
    settingsSave.addEventListener('click', () => {
      const gemKey = document.getElementById('settings-gemini-key')?.value?.trim();
      const dgKey = document.getElementById('settings-deepgram-key')?.value?.trim();
      const micDevice = document.getElementById('settings-mic-device')?.value || '';
      if (gemKey) gabrielAI.setApiKey(gemKey);
      if (dgKey) speechEngine.setApiKey(dgKey);
      speechEngine.setDeviceId(micDevice || null);
      state.settingsOpen = false;
      render();
    });
  }

  // Settings cancel
  const settingsCancel = document.getElementById('settings-cancel');
  if (settingsCancel) {
    settingsCancel.addEventListener('click', () => {
      state.settingsOpen = false;
      render();
    });
  }

  // Settings overlay click
  const settingsOverlay = document.getElementById('settings-overlay');
  if (settingsOverlay) {
    settingsOverlay.addEventListener('click', (e) => {
      if (e.target === settingsOverlay) {
        state.settingsOpen = false;
        render();
      }
    });
  }

  // Detect / refresh audio devices button
  const detectDevicesBtn = document.getElementById('settings-detect-devices');
  if (detectDevicesBtn) {
    detectDevicesBtn.addEventListener('click', async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop())).catch(() => {});
        const devices = await navigator.mediaDevices.enumerateDevices();
        state.availableMicDevices = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone (${d.deviceId.slice(0,8)}…)` }))
          .filter(d => d.deviceId && d.deviceId !== 'default' && d.deviceId !== 'communications');
        render();
      } catch (e) { /* permission denied */ }
    });
  }

  // Modal cancel
  const modalCancel = document.getElementById('modal-cancel');
  if (modalCancel) {
    modalCancel.addEventListener('click', () => {
      state.modalOpen = false;
      render();
    });
  }

  // Modal overlay click
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        state.modalOpen = false;
        render();
      }
    });
  }

  // Call type toggle (in modal)
  document.querySelectorAll('[data-call-type]').forEach(el => {
    el.addEventListener('click', () => {
      state.callType = el.dataset.callType;
      render(); // re-render modal to swap fields
      setTimeout(() => document.getElementById('customer-name')?.focus(), 50);
    });
  });

  // Modal start call
  const modalStart = document.getElementById('modal-start');
  if (modalStart) {
    modalStart.addEventListener('click', async () => {
      const name = document.getElementById('customer-name')?.value?.trim() || '';

      if (state.callType === 'inbound') {
        // Inbound — existing insurance flow
        const lob = document.getElementById('lob-select')?.value || 'personal_auto';
        engine.startCall(lob, name);
        gabrielAI.onCallStart(getCallContextForAI());
        state.gabrielEvents = [];
        state.activeLead    = null;
        state.capturedFields = {};
      } else {
        // Outbound — cold-call flow
        const leadId = document.getElementById('lead-select')?.value || '';
        let lead = null;
        if (leadId) {
          lead = state.leads.find(l => l.id === leadId) || null;
        }
        if (!lead && name) {
          // Quick dial — create a transient lead object (not saved)
          const phone = document.getElementById('quick-dial-phone')?.value?.trim() || '';
          lead = { id: null, name, phone, category: 'Unknown', city: '', state: '', callCount: 0, notes: '', capturedData: {} };
        }
        state.activeLead     = lead;
        state.capturedFields = {};
        state.coldCallPhase  = 'opener';
        state.gabrielEvents  = [];
        if (lead) gabrielAI.setLeadContext(lead);
        gabrielAI.clearHistory();
        // Still start the disclosure engine minimally (needed for state checks)
        engine.startCall('outbound', lead?.name || name);
      }

      state.modalOpen    = false;
      state.currentView  = 'call';
      render();
    });
  }

  // Enter key in customer name
  const nameInput = document.getElementById('customer-name');
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('modal-start')?.click();
    });
  }

  // Trigger buttons
  document.querySelectorAll('.trigger-btn:not(.used)').forEach(el => {
    el.addEventListener('click', () => {
      engine.trigger(el.dataset.trigger);
      render();
      setTimeout(() => {
        const cards = document.querySelectorAll('.disclosure-card');
        if (cards.length > 0) cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });

  // Mark complete
  document.querySelectorAll('[data-complete]').forEach(el => {
    el.addEventListener('click', () => {
      engine.markCompleted(el.dataset.complete);
      render();
    });
  });

  // Copy disclosure text
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const disclosure = engine.getState().allDisclosures.find(d => d.id === el.dataset.copy);
      if (disclosure) {
        navigator.clipboard.writeText(disclosure.disclosureText).then(() => {
          el.textContent = '✅ Copied!';
          setTimeout(() => { el.textContent = '📋 Copy'; }, 1500);
        });
      }
    });
  });

  // Agent notes toggle
  document.querySelectorAll('[data-notes-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.notesToggle;
      if (state.expandedNotes.has(id)) {
        state.expandedNotes.delete(id);
      } else {
        state.expandedNotes.add(id);
      }
      render();
    });
  });

  // Checklist item toggle
  document.querySelectorAll('.checklist-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.checklistId;
      const done = el.dataset.done === 'true';
      if (done) engine.markIncomplete(id);
      else engine.markCompleted(id);
      render();
    });
  });

  // Stage pills
  document.querySelectorAll('[data-stage]').forEach(el => {
    el.addEventListener('click', () => {
      engine.setStage(el.dataset.stage);
      render();
    });
  });

  // End call
  const endCallBtn = document.getElementById('end-call-btn');
  if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
      speechEngine.stop(); // Stop mic
      if (state.callType === 'outbound') {
        // Outbound: show outcome logger instead of insurance summary
        engine.endCall();
        state.outcomeNotes    = '';
        state.outcomeModalOpen = true;
        render();
      } else {
        // Inbound: existing insurance summary flow
        const summary = engine.endCall();
        state.callSummary  = summary;
        state.summaryModal = true;
        render();
      }
    });
  }

  // Summary modal back
  const summaryBack = document.getElementById('summary-back');
  if (summaryBack) {
    summaryBack.addEventListener('click', () => {
      state.summaryModal = false;
      state.callSummary = null;
      render();
    });
  }

  // Summary confirm
  const summaryConfirm = document.getElementById('summary-confirm');
  if (summaryConfirm) {
    summaryConfirm.addEventListener('click', () => {
      engine.reset();
      gabrielAI.onCallEnd();
      speechEngine.onCallEnd();
      state.summaryModal = false;
      state.callSummary = null;
      state.currentView = 'dashboard';
      state.expandedNotes.clear();
      state.gabrielEvents = [];
      state.liveTranscript = '';
      // Clear new feature state
      state.transcriptLog = [];
      state.showTranscript = false;
      state.spanishMode = false;
      state.spanishTranslatedCustomer = '';
      state.spanishAgentInput = '';
      state.spanishTranslatedAgent = '';
      state.spanishTranslating = false;
      render();
    });
  }

  // Summary overlay
  const summaryOverlay = document.getElementById('summary-overlay');
  if (summaryOverlay) {
    summaryOverlay.addEventListener('click', (e) => {
      if (e.target === summaryOverlay) {
        state.summaryModal = false;
        state.callSummary = null;
        render();
      }
    });
  }

  // ── Gabriel Pane Events ────────────────────────────────────────────────

  // Gabriel pane mobile collapse toggle
  const gabrielCollapseTab = document.getElementById('gabriel-collapse-tab');
  if (gabrielCollapseTab) {
    gabrielCollapseTab.addEventListener('click', () => {
      state.gabrielPaneOpen = !state.gabrielPaneOpen;
      render();
    });
  }

  // Transcript toggle
  const transcriptToggle = document.getElementById('transcript-toggle');
  if (transcriptToggle) {
    transcriptToggle.addEventListener('click', () => {
      state.showTranscript = !state.showTranscript;
      render();
    });
  }

  // Transcript clear
  const transcriptClear = document.getElementById('transcript-clear');
  if (transcriptClear) {
    transcriptClear.addEventListener('click', () => {
      state.transcriptLog = [];
      render();
    });
  }

  // Spanish mode toggle
  const spanishToggle = document.getElementById('spanish-toggle');
  if (spanishToggle) {
    spanishToggle.addEventListener('click', () => {
      state.spanishMode = !state.spanishMode;
      if (!state.spanishMode) {
        // Clear Spanish state when turning off
        state.spanishTranslatedCustomer = '';
        state.spanishAgentInput = '';
        state.spanishTranslatedAgent = '';
        state.spanishTranslating = false;
      }
      render();
    });
  }

  // Spanish agent input — live sync
  const spanishInput = document.getElementById('spanish-agent-input');
  if (spanishInput) {
    spanishInput.addEventListener('input', (e) => {
      state.spanishAgentInput = e.target.value;
    });
    spanishInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        await doSpanishTranslation();
      }
    });
    spanishInput.focus();
  }

  // Spanish translate button
  const spanishTranslateBtn = document.getElementById('spanish-translate');
  if (spanishTranslateBtn) {
    spanishTranslateBtn.addEventListener('click', async () => {
      await doSpanishTranslation();
    });
  }

  // Mic toggle
  const micToggle = document.getElementById('mic-toggle');
  if (micToggle) {
    micToggle.addEventListener('click', async () => {
      if (state.micStatus === MIC_STATUS.LISTENING) {
        speechEngine.stop();
      } else {
        await speechEngine.start();
      }
    });
  }

  // Gabriel question input — live state sync
  const questionInput = document.getElementById('gabriel-question-input');
  if (questionInput) {
    questionInput.addEventListener('input', (e) => {
      state.gabrielInput = e.target.value;
    });
    questionInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        await sendGabrielQuestion();
      }
    });
    // Restore focus without re-render flicker
    questionInput.focus();
    // move cursor to end
    const val = questionInput.value;
    questionInput.value = '';
    questionInput.value = val;
  }

  // Gabriel send button
  const gabrielSend = document.getElementById('gabriel-send');
  if (gabrielSend) {
    gabrielSend.addEventListener('click', async () => {
      await sendGabrielQuestion();
    });
  }

  // Gabriel confirm trigger buttons
  document.querySelectorAll('.gabriel-confirm-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const triggerKey = el.dataset.trigger;
      engine.trigger(triggerKey);
      el.textContent = '✅ Applied';
      el.disabled = true;
      render();
    });
  });

  // ── Cold-Call Phase Tracker ────────────────────────────────────────────
  document.querySelectorAll('[data-phase]').forEach(el => {
    el.addEventListener('click', () => {
      state.coldCallPhase = el.dataset.phase;
      render();
    });
  });

  // ── Leads View Events ──────────────────────────────────────────────────

  // CSV Import
  const csvInput = document.getElementById('csv-import-input');
  if (csvInput) {
    csvInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      state.leadsImporting = true;
      render();
      try {
        const text = await file.text();
        const { imported, skipped } = await leadDB.importFromCSV(text);
        state.leads      = await leadDB.getAllLeads();
        state.leadsStats = await leadDB.getStats();
        state.leadsImporting = false;
        alert(`✅ Imported ${imported} leads. ${skipped > 0 ? `Skipped ${skipped}.` : ''}`);
        render();
      } catch (err) {
        state.leadsImporting = false;
        alert(`❌ Import failed: ${err.message}`);
        render();
      }
    });
  }

  // Lead card "Call Now"
  document.querySelectorAll('[data-call-lead]').forEach(el => {
    el.addEventListener('click', async () => {
      const id   = el.dataset.callLead;
      const lead = state.leads.find(l => l.id === id);
      if (!lead) return;
      // Set up outbound call from lead
      state.callType       = 'outbound';
      state.activeLead     = lead;
      state.capturedFields = {};
      state.coldCallPhase  = 'opener';
      state.gabrielEvents  = [];
      state.gvCallActive   = false;
      state.gvCallTimer    = '00:00';
      gabrielAI.setLeadContext(lead);
      gabrielAI.clearHistory();
      engine.startCall('outbound', lead.name);
      state.currentView = 'call';
      render();
    });
  });

  // ── Google Voice dial button ─────────────────────────────────────────────
  const gvCallBtn = document.getElementById('gv-call-btn');
  if (gvCallBtn) {
    gvCallBtn.addEventListener('click', () => {
      const phone = gvCallBtn.dataset.phone;
      if (!phone) return;
      phoneEngine.launchGoogleVoice(phone);
    });
  }

  // ── Google Voice end-call button ─────────────────────────────────────────
  const gvEndBtn = document.getElementById('gv-end-btn');
  if (gvEndBtn) {
    gvEndBtn.addEventListener('click', () => {
      phoneEngine.endCall();
      speechEngine.stop();
    });
  }

  // Leads stat filter clicks
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      state.leadsFilter = el.dataset.filter;
      render();
    });
  });

  // Leads search
  const leadsSearchInput = document.getElementById('leads-search');
  if (leadsSearchInput) {
    leadsSearchInput.addEventListener('input', (e) => {
      state.leadsSearch = e.target.value;
      render();
    });
    leadsSearchInput.focus();
  }

  // ── Outcome Logger ─────────────────────────────────────────────────────

  // Outcome button selection (highlight but don't save yet)
  document.querySelectorAll('[data-outcome]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-outcome]').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      el.dataset.outcomeSelected = 'true';
    });
  });

  // Outcome save
  const outcomeSave = document.getElementById('outcome-save');
  if (outcomeSave) {
    outcomeSave.addEventListener('click', async () => {
      const selectedBtn = document.querySelector('[data-outcome].selected');
      const outcome     = selectedBtn?.dataset?.outcome || 'called';
      const notes       = document.getElementById('outcome-notes')?.value?.trim() || '';

      if (state.activeLead?.id) {
        // Save outcome to DB
        await leadDB.updateLead(state.activeLead.id, {
          status:       outcome,
          lastCalled:   new Date().toISOString(),
          callCount:    (state.activeLead.callCount || 0) + 1,
          notes,
          capturedData: { ...(state.activeLead.capturedData || {}), ...state.capturedFields },
        });
        state.leads      = await leadDB.getAllLeads();
        state.leadsStats = await leadDB.getStats();
      }

      // Reset outbound call state
      engine.reset();
      gabrielAI.onCallEnd();
      speechEngine.onCallEnd();
      phoneEngine.endCall(); // stop GV timer if still running
      state.outcomeModalOpen = false;
      state.outcomeNotes     = '';
      state.activeLead       = null;
      state.capturedFields   = {};
      state.gabrielEvents    = [];
      state.transcriptLog    = [];
      state.liveTranscript   = '';
      state.gvCallActive     = false;
      state.gvCallTimer      = '00:00';
      state.callType         = 'inbound'; // reset to inbound for next call
      state.currentView      = 'leads';
      render();
    });
  }

  // Outcome cancel
  const outcomeCancel = document.getElementById('outcome-cancel');
  if (outcomeCancel) {
    outcomeCancel.addEventListener('click', () => {
      state.outcomeModalOpen = false;
      render();
    });
  }

  // Outcome overlay click to close
  const outcomeOverlay = document.getElementById('outcome-overlay');
  if (outcomeOverlay) {
    outcomeOverlay.addEventListener('click', (e) => {
      if (e.target === outcomeOverlay) {
        state.outcomeModalOpen = false;
        render();
      }
    });
  }
}

async function sendGabrielQuestion() {
  const q = state.gabrielInput.trim();
  if (!q || state.gabrielThinking) return;

  const question = q;
  state.gabrielInput = '';

  // Add user message to feed immediately
  pushGabrielEvent({
    type: 'USER_QUESTION',
    message: question,
    timestamp: new Date().toISOString(),
  });

  // Temporarily show in feed as a user bubble
  const userBubble = {
    type: 'USER_QUESTION',
    icon: '🧑',
    cls: 'ev-user',
    label: 'You asked',
    message: question,
    timestamp: new Date().toISOString(),
  };
  state.gabrielEvents.unshift(userBubble);
  render();

  if (state.callType === 'outbound') {
    await gabrielAI.askColdCall(question, state.activeLead);
  } else {
    await gabrielAI.ask(question, getCallContextForAI());
  }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.summaryModal) {
      state.summaryModal = false;
      state.callSummary = null;
      render();
    } else if (state.modalOpen) {
      state.modalOpen = false;
      render();
    } else if (state.settingsOpen) {
      state.settingsOpen = false;
      render();
    }
  }
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    state.modalOpen = true;
    render();
    setTimeout(() => document.getElementById('customer-name')?.focus(), 100);
  }
  if (e.ctrlKey && e.key === ',') {
    e.preventDefault();
    state.settingsOpen = !state.settingsOpen;
    render();
  }
});

// ============================================
// INIT
// ============================================
async function init() {
  // Pre-load leads from IndexedDB before first render
  try {
    await leadDB.init();
    state.leads      = await leadDB.getAllLeads();
    state.leadsStats = await leadDB.getStats();
    state.leadsLoaded = true;
  } catch (err) {
    console.warn('[Gabriel] LeadDB init failed:', err);
  }

  render();

  engine.subscribe(() => {
    // Update Gabriel AI context whenever engine changes
    const ctx = getCallContextForAI();
    gabrielAI.setCallContext(ctx);
    render();
  });
}

init();
