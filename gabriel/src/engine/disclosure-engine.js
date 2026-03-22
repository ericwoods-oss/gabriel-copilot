/**
 * Gabriel Disclosure Engine
 * Core logic for managing TX insurance disclosures during live calls.
 * Loads disclosures, triggers them based on context, tracks completion.
 */

import disclosuresData from '../data/tx-auto-disclosures.json';

class DisclosureEngine {
  constructor() {
    this.disclosures = disclosuresData;
    this.activeDisclosures = [];
    this.completedDisclosures = [];
    this.callContext = {
      lineOfBusiness: null,
      customerName: '',
      stage: 'idle', // idle, intake, drivers, vehicles, coverage, disclosures, review
      triggers: new Set()
    };
    this.listeners = new Set();
  }

  /** Subscribe to state changes */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Notify all subscribers */
  _notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  /** Get full engine state */
  getState() {
    return {
      callContext: { ...this.callContext, triggers: [...this.callContext.triggers] },
      activeDisclosures: [...this.activeDisclosures],
      completedDisclosures: [...this.completedDisclosures],
      allDisclosures: this.disclosures,
      stats: this.getStats()
    };
  }

  /** Start a new call */
  startCall(lineOfBusiness, customerName = '') {
    this.activeDisclosures = [];
    this.completedDisclosures = [];
    this.callContext = {
      lineOfBusiness,
      customerName,
      stage: 'intake',
      triggers: new Set()
    };
    // Auto-trigger start_application disclosures
    this.trigger('start_application');
  }

  /** End the current call */
  endCall() {
    const missing = this.getMissingRequired();
    this.callContext.stage = 'idle';
    this._notify();
    return {
      completed: this.completedDisclosures.length,
      total: this.activeDisclosures.length + this.completedDisclosures.length,
      missingRequired: missing
    };
  }

  /** Trigger disclosures based on an action */
  trigger(triggerKey) {
    if (this.callContext.triggers.has(triggerKey)) return; // Already triggered
    this.callContext.triggers.add(triggerKey);

    const matching = this.disclosures.filter(d =>
      d.trigger === triggerKey &&
      d.lineOfBusiness === this.callContext.lineOfBusiness &&
      !this.activeDisclosures.find(a => a.id === d.id) &&
      !this.completedDisclosures.find(c => c.id === d.id)
    );

    this.activeDisclosures.push(...matching);
    this.activeDisclosures.sort((a, b) => a.order - b.order);
    this._notify();
    return matching;
  }

  /** Mark a disclosure as completed/presented */
  markCompleted(disclosureId) {
    const idx = this.activeDisclosures.findIndex(d => d.id === disclosureId);
    if (idx >= 0) {
      const [completed] = this.activeDisclosures.splice(idx, 1);
      completed.completedAt = new Date().toISOString();
      this.completedDisclosures.push(completed);
      this._notify();
    }
  }

  /** Move a disclosure back to active (undo completion) */
  markIncomplete(disclosureId) {
    const idx = this.completedDisclosures.findIndex(d => d.id === disclosureId);
    if (idx >= 0) {
      const [disclosure] = this.completedDisclosures.splice(idx, 1);
      delete disclosure.completedAt;
      this.activeDisclosures.push(disclosure);
      this.activeDisclosures.sort((a, b) => a.order - b.order);
      this._notify();
    }
  }

  /** Update customer name (used by Gabriel AI auto-fill) */
  updateCustomerName(name) {
    if (name && this.callContext.stage !== 'idle') {
      this.callContext.customerName = name;
      this._notify();
    }
  }

  /** Set the current application stage */
  setStage(stage) {
    this.callContext.stage = stage;
    
    // Auto-trigger stage-specific disclosures
    const stageMap = {
      'coverage': 'coverage_selection',
      'drivers': 'start_application',
      'review': 'start_application'
    };
    if (stageMap[stage]) {
      this.trigger(stageMap[stage]);
    }
    this._notify();
  }

  /** Get missing required disclosures */
  getMissingRequired() {
    return this.activeDisclosures.filter(d => d.required);
  }

  /** Get completion stats */
  getStats() {
    const total = this.activeDisclosures.length + this.completedDisclosures.length;
    const completed = this.completedDisclosures.length;
    const required = this.activeDisclosures.filter(d => d.required).length + 
                     this.completedDisclosures.filter(d => d.required).length;
    const requiredCompleted = this.completedDisclosures.filter(d => d.required).length;

    return {
      total,
      completed,
      remaining: this.activeDisclosures.length,
      required,
      requiredCompleted,
      requiredRemaining: required - requiredCompleted,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  /** Get all available triggers for UI buttons */
  getAvailableTriggers() {
    const lob = this.callContext.lineOfBusiness;
    if (!lob) return [];

    const triggers = new Map();
    this.disclosures
      .filter(d => d.lineOfBusiness === lob)
      .forEach(d => {
        if (!triggers.has(d.trigger)) {
          triggers.set(d.trigger, {
            key: d.trigger,
            label: d.triggerLabel,
            used: this.callContext.triggers.has(d.trigger),
            count: 0
          });
        }
        triggers.get(d.trigger).count++;
      });

    return [...triggers.values()];
  }

  /** Reset everything */
  reset() {
    this.activeDisclosures = [];
    this.completedDisclosures = [];
    this.callContext = {
      lineOfBusiness: null,
      customerName: '',
      stage: 'idle',
      triggers: new Set()
    };
    this._notify();
  }
}

// Singleton instance
const engine = new DisclosureEngine();
export default engine;
