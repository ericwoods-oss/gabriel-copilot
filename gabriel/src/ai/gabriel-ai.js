/**
 * Gabriel AI Engine
 * Powered by Gemini — real-time insurance copilot
 *
 * Handles:
 *  1. Manual Q&A: agent types a question, Gabriel answers
 *  2. Reactive analysis: given a transcript chunk, Gabriel decides if action is needed
 *     and returns structured reactions (AUTO_FILL, TRIGGER, ALERT, ANSWER, SILENCE)
 */

import CARRIER_KNOWLEDGE from '../data/carrier-knowledge-base.js';
import COLD_CALL_KNOWLEDGE from '../data/cold-call-knowledge-base.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ── Reaction types Gabriel can emit ──────────────────────────────────────
export const REACTION_TYPES = {
  // ── Inbound (Insurance) ──────────────────────────────────────────────────
  AUTO_FILL:  'AUTO_FILL',   // Detected a field value (name, VIN, etc.)
  TRIGGER:    'TRIGGER',     // Suggests firing a disclosure trigger
  ALERT:      'ALERT',       // Flags something important
  ANSWER:     'ANSWER',      // Answers a question (manual or from speech)
  SILENCE:    'SILENCE',     // Nothing actionable — do not display

  // ── Outbound (Cold Call / Sales) ─────────────────────────────────────────
  TALK_TRACK: 'TALK_TRACK',  // Suggested next line for the agent to say
  OBJECTION:  'OBJECTION',   // Detected objection + suggested rebuttal
  CAPTURE:    'CAPTURE',     // Key info to capture from the prospect
  QUALIFY:    'QUALIFY',     // Discovery insight / qualification info
};

class GabrielAI {
  constructor() {
    // Prefer baked-in env var (survives localStorage clears), then fall back to localStorage
    const envKey = import.meta.env.VITE_GEMINI_KEY || '';
    const storedKey = localStorage.getItem('gabriel_gemini_key') || '';
    this._apiKey = envKey || storedKey;
    // Keep localStorage in sync so the Settings UI reflects the active key
    if (envKey && envKey !== storedKey) {
      localStorage.setItem('gabriel_gemini_key', envKey);
    }
    this._conversationHistory = []; // Full multi-turn chat within a call
    this._callContext = null;
    this._listeners = new Set();
    this._processing = false;
  }

  // ── Configuration ────────────────────────────────────────────────────────

  setApiKey(key) {
    this._apiKey = key;
    localStorage.setItem('gabriel_gemini_key', key);
  }

  getApiKey() {
    return this._apiKey;
  }

  hasApiKey() {
    return !!this._apiKey && this._apiKey.length > 10;
  }

  setCallContext(context) {
    this._callContext = context;
  }

  clearHistory() {
    this._conversationHistory = [];
  }

  // ── Event system ─────────────────────────────────────────────────────────

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(event) {
    this._listeners.forEach(fn => fn(event));
  }

  // ── System Prompt ────────────────────────────────────────────────────────

  _buildSystemPrompt(mode = 'qa') {
    const ctx = this._callContext;
    const callInfo = ctx ? `
## LIVE CALL CONTEXT
- Customer Name: ${ctx.customerName || 'Unknown'}
- Line of Business: ${ctx.lineOfBusiness || 'Not started'}
- Application Stage: ${ctx.stage || 'idle'}
- Disclosures Triggered: ${(ctx.triggers || []).join(', ') || 'None yet'}
- Disclosures Completed: ${(ctx.completedDisclosures || []).map(d => d.name).join(', ') || 'None yet'}
- Disclosures Still Active: ${(ctx.activeDisclosures || []).map(d => d.name).join(', ') || 'None'}
` : '\n## LIVE CALL CONTEXT\nNo active call.\n';

    if (mode === 'qa') {
      return `You are Gabriel, an elite Texas insurance compliance copilot. You sit beside the agent like a trusted partner — you know the rules, the products, the "what ifs," and you answer in plain, confident English. You are never wishy-washy. You give the agent the direct answer they need to keep the call moving.

RULES:
- Always answer based on the knowledge base first. When general TX insurance law applies and isn't covered in the KB, you may use that knowledge.
- Be concise. Agents are on a live call — 2-4 sentences max unless a topic requires more detail.
- Never make up carrier-specific rates or binding decisions.
- If the agent asks something outside TX personal auto, acknowledge the scope and give what general guidance you can.
- Speak directly to the agent (not the customer).

${callInfo}

${CARRIER_KNOWLEDGE}`;
    }

    if (mode === 'reactive') {
      return `You are Gabriel, a real-time AI insurance compliance copilot listening to a live insurance sales call. Your job is to silently analyze each transcript chunk and output structured JSON reactions ONLY when something actionable is detected.

REACTION SCHEMA (output as JSON):
{
  "type": "AUTO_FILL" | "TRIGGER" | "ALERT" | "ANSWER" | "SILENCE",
  "field": "customerName" | "vin" | "address" | null,   // for AUTO_FILL
  "value": "extracted value",                            // for AUTO_FILL
  "triggerKey": "decline_pip" | "decline_um_uim" | "exclude_driver" | "sr22_required" | "add_young_driver" | "coverage_selection" | "decline_cancel_nonrenew" | null,
  "message": "Brief message to display in the agent pane"
}

RULES:
- Output ONLY valid JSON. No markdown fences. No explanation text.
- If nothing actionable: output {"type":"SILENCE"}
- For AUTO_FILL: only extract if you are confident (>90%) the customer stated this value directly
- For TRIGGER: only suggest if the transcript clearly matches a trigger scenario
- For ALERT: flag unusual or risky statements (lapse in coverage, undisclosed violations, etc.)
- For ANSWER: only if a direct question is asked that you can answer from the KB
- Keep messages SHORT — max 15 words. Agents are on a call.
- Prefer SILENCE over false positives. Do not spam the agent.

AVAILABLE TRIGGERS:
- decline_um_uim: customer declines UM/UIM coverage
- decline_pip: customer declines PIP coverage
- exclude_driver: agent/customer wants to exclude a driver
- sr22_required: SR-22 mentioned or required
- add_young_driver: driver under 25 being added
- coverage_selection: customer choosing coverage levels
- decline_cancel_nonrenew: customer mentions cancellation or non-renewal

${callInfo}

${CARRIER_KNOWLEDGE}`;
    }

    if (mode === 'cold_call') {
      const lead = this._leadContext;
      const leadInfo = lead ? `
## ACTIVE PROSPECT
- Business Name: ${lead.name || 'Unknown'}
- Category: ${lead.category || 'Unknown'}
- Phone: ${lead.phone || 'Unknown'}
- City/State: ${[lead.city, lead.state].filter(Boolean).join(', ') || 'Unknown'}
- Call Count (including this call): ${(lead.callCount || 0) + 1}
- Prior Notes: ${lead.notes || 'None'}
- Previously Captured: ${JSON.stringify(lead.capturedData || {})}
` : '\n## ACTIVE PROSPECT\nNo lead loaded.\n';

      return `You are Gabriel, an elite outbound sales copilot for Estrella AI. You are listening to a live cold call and your job is to silently analyze each transcript chunk and output structured JSON reactions ONLY when something actionable is detected. Help the agent stay sharp, handle objections, capture key info, and close toward a next step.

REACTION SCHEMA (output as JSON):
{
  "type": "TALK_TRACK" | "OBJECTION" | "CAPTURE" | "QUALIFY" | "ALERT" | "SILENCE",
  "field": string | null,   // for CAPTURE: what data point was captured (e.g. "decisionMaker", "fleetSize", "budget", "callbackDate", "email")
  "value": string | null,   // for CAPTURE: the extracted value
  "message": "Brief message or suggested line for the agent"
}

RULES:
- Output ONLY valid JSON. No markdown fences. No explanation text.
- If nothing actionable: output {"type":"SILENCE"}
- TALK_TRACK: suggest the agent's next line when the conversation needs direction
- OBJECTION: when the prospect voices a concern — always include a specific suggested rebuttal in "message"
- CAPTURE: when the prospect reveals key info (name, role, fleet size, budget, callback time, email) — extract it
- QUALIFY: when you learn something that helps assess fit (pain point, current solution, decision timeline)
- ALERT: flag important moments (e.g. prospect said they're in a meeting, legal/compliance issue mentioned)
- Keep messages SHORT — max 20 words for talk tracks, 25 for objection rebuttals.
- Prefer SILENCE over noise. One great suggestion beats five mediocre ones.
- Never suggest making up pricing/features not in the KB.

${leadInfo}

${COLD_CALL_KNOWLEDGE}`;
    }

    if (mode === 'cold_call_qa') {
      const lead = this._leadContext;
      const leadInfo = lead
        ? `## ACTIVE PROSPECT\n- Business: ${lead.name} (${lead.category}) — ${[lead.city, lead.state].filter(Boolean).join(', ')}\n`
        : '';

      return `You are Gabriel, an elite outbound sales copilot for Estrella AI. The agent is on a cold call and needs an immediate answer. You are their real-time sales expert — answer concisely and confidently so they can stay in the conversation.

RULES:
- Be direct. 2-3 sentences max unless nuance is truly required.
- Ground answers in the Estrella AI Knowledge Base below.
- Never make up pricing, products, or guarantees not in the KB.
- Speak directly to the agent (not the prospect).
- If they ask a product question, give the answer AND suggest how to pivot it back into the conversation.

${leadInfo}

${COLD_CALL_KNOWLEDGE}`;
    }

    return '';
  }

  // ── Core API Call ────────────────────────────────────────────────────────

  async _callGemini(messages, systemPrompt) {
    if (!this.hasApiKey()) {
      throw new Error('NO_API_KEY');
    }

    const body = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: messages,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        topP: 0.8,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ]
    };

    const response = await fetch(`${GEMINI_API_BASE}?key=${this._apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // ── Manual Q&A ───────────────────────────────────────────────────────────

  async ask(question, callContext = null) {
    if (callContext) this.setCallContext(callContext);
    if (this._processing) return;
    this._processing = true;

    // Emit thinking state
    this._emit({ type: 'THINKING' });

    // Add user message to history
    this._conversationHistory.push({
      role: 'user',
      parts: [{ text: question }]
    });

    try {
      const systemPrompt = this._buildSystemPrompt('qa');
      const responseText = await this._callGemini(this._conversationHistory, systemPrompt);

      // Add to history
      this._conversationHistory.push({
        role: 'model',
        parts: [{ text: responseText }]
      });

      this._emit({
        type: REACTION_TYPES.ANSWER,
        message: responseText,
        source: 'manual',
        timestamp: new Date().toISOString(),
      });

      return responseText;
    } catch (err) {
      this._emit({ type: 'ERROR', message: err.message });
      return null;
    } finally {
      this._processing = false;
    }
  }

  // ── Reactive Transcript Analysis ─────────────────────────────────────────

  async analyzeTranscript(transcriptChunk, callContext = null) {
    if (callContext) this.setCallContext(callContext);
    if (this._processing) return null;
    if (!transcriptChunk || transcriptChunk.trim().length < 8) return null;
    this._processing = true;

    try {
      const systemPrompt = this._buildSystemPrompt('reactive');

      // For reactive mode, we use a single-shot call (not multi-turn)
      const messages = [{
        role: 'user',
        parts: [{ text: `TRANSCRIPT CHUNK:\n"${transcriptChunk}"` }]
      }];

      const responseText = await this._callGemini(messages, systemPrompt);

      // Parse JSON reaction
      let reaction;
      try {
        // Strip any accidental markdown fences
        const cleaned = responseText.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();
        reaction = JSON.parse(cleaned);
      } catch {
        // If JSON parse fails, default to silence
        return null;
      }

      if (!reaction || reaction.type === REACTION_TYPES.SILENCE) return null;

      const enriched = {
        ...reaction,
        source: 'speech',
        timestamp: new Date().toISOString(),
      };

      this._emit(enriched);
      return enriched;
    } catch (err) {
      // Silently fail on reactive analysis errors (don't interrupt the agent)
      console.warn('[Gabriel AI] Reactive analysis error:', err.message);
      return null;
    } finally {
      this._processing = false;
    }
  }

  // ── Translation Methods ───────────────────────────────────────────────────

  /**
   * Translate Spanish text → English.
   * Returns plain translated text or null on error.
   */
  async translateToEnglish(spanishText) {
    if (!this.hasApiKey() || !spanishText?.trim()) return null;
    try {
      const systemPrompt = `You are a professional Spanish-to-English translator. 
Translate the input text from Spanish to natural, conversational English.
Output ONLY the translated text — no explanations, no quotation marks, no notes.`;
      const messages = [{
        role: 'user',
        parts: [{ text: spanishText.trim() }]
      }];
      const result = await this._callGemini(messages, systemPrompt);
      return result?.trim() || null;
    } catch (err) {
      console.warn('[Gabriel AI] translateToEnglish error:', err.message);
      return null;
    }
  }

  /**
   * Translate English text → Spanish.
   * Returns plain translated text or null on error.
   */
  async translateToSpanish(englishText) {
    if (!this.hasApiKey() || !englishText?.trim()) return null;
    try {
      const systemPrompt = `You are a professional English-to-Spanish translator for insurance calls in Texas.
Translate the input text from English to clear, professional Mexican Spanish (formal "usted" register).
Output ONLY the translated text — no explanations, no quotation marks, no notes.`;
      const messages = [{
        role: 'user',
        parts: [{ text: englishText.trim() }]
      }];
      const result = await this._callGemini(messages, systemPrompt);
      return result?.trim() || null;
    } catch (err) {
      console.warn('[Gabriel AI] translateToSpanish error:', err.message);
      return null;
    }
  }

  // ── Cold-Call Lead Context ────────────────────────────────────────────────

  setLeadContext(lead) {
    this._leadContext = lead;
  }

  clearLeadContext() {
    this._leadContext = null;
  }

  // ── Cold-Call Reactive Analysis ───────────────────────────────────────────

  async analyzeColdCall(transcriptChunk, leadContext = null) {
    if (leadContext) this.setLeadContext(leadContext);
    if (this._processing) return null;
    if (!transcriptChunk || transcriptChunk.trim().length < 8) return null;
    this._processing = true;

    try {
      const systemPrompt = this._buildSystemPrompt('cold_call');
      const messages = [{
        role: 'user',
        parts: [{ text: `TRANSCRIPT CHUNK:\n"${transcriptChunk}"` }]
      }];

      const responseText = await this._callGemini(messages, systemPrompt);

      let reaction;
      try {
        const cleaned = responseText.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();
        reaction = JSON.parse(cleaned);
      } catch {
        return null;
      }

      if (!reaction || reaction.type === REACTION_TYPES.SILENCE) return null;

      const enriched = {
        ...reaction,
        source: 'speech',
        timestamp: new Date().toISOString(),
      };

      this._emit(enriched);
      return enriched;
    } catch (err) {
      console.warn('[Gabriel AI] Cold-call analysis error:', err.message);
      return null;
    } finally {
      this._processing = false;
    }
  }

  // ── Cold-Call Q&A (separate history from insurance mode) ─────────────────

  async askColdCall(question, leadContext = null) {
    if (leadContext) this.setLeadContext(leadContext);
    if (this._processing) return;
    this._processing = true;
    this._emit({ type: 'THINKING' });

    this._conversationHistory.push({
      role: 'user',
      parts: [{ text: question }]
    });

    try {
      const systemPrompt = this._buildSystemPrompt('cold_call_qa');
      const responseText = await this._callGemini(this._conversationHistory, systemPrompt);

      this._conversationHistory.push({
        role: 'model',
        parts: [{ text: responseText }]
      });

      this._emit({
        type: REACTION_TYPES.ANSWER,
        message: responseText,
        source: 'manual',
        timestamp: new Date().toISOString(),
      });

      return responseText;
    } catch (err) {
      this._emit({ type: 'ERROR', message: err.message });
      return null;
    } finally {
      this._processing = false;
    }
  }

  // ── Call Lifecycle ────────────────────────────────────────────────────────

  onCallStart(context) {
    this.setCallContext(context);
    this.clearHistory();
  }

  onCallEnd() {
    this._callContext = null;
    this._leadContext = null;
    this.clearHistory();
  }
}

// Singleton
const gabrielAI = new GabrielAI();
export default gabrielAI;
