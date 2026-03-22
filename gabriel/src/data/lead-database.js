/**
 * Gabriel — Lead Database (IndexedDB)
 *
 * Persistent client-side storage for cold-call leads.
 * No backend required — data lives in the browser's IndexedDB.
 *
 * Lead schema:
 * {
 *   id: string (UUID),
 *   name: string,       // Business name
 *   phone: string,
 *   address: string,
 *   city: string,
 *   state: string,
 *   website: string,
 *   category: string,   // "Trucking", "Oilfield Services", etc.
 *   source: string,     // Where the lead came from
 *   status: 'new' | 'called' | 'interested' | 'callback' | 'not_interested' | 'no_answer' | 'closed',
 *   lastCalled: string | null,   // ISO date
 *   callbackDate: string | null, // ISO date
 *   callCount: number,
 *   notes: string,
 *   capturedData: object,  // AI-captured data: { decisionMaker, fleetSize, budget, etc. }
 *   createdAt: string,     // ISO date
 *   updatedAt: string,     // ISO date
 * }
 */

const DB_NAME    = 'gabriel_leads';
const DB_VERSION = 1;
const STORE_NAME = 'leads';

class LeadDatabase {
  constructor() {
    this._db = null;
    this._ready = false;
    this._readyPromise = null;
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  init() {
    if (this._readyPromise) return this._readyPromise;
    this._readyPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('status',     'status',     { unique: false });
          store.createIndex('category',   'category',   { unique: false });
          store.createIndex('lastCalled', 'lastCalled', { unique: false });
          store.createIndex('name',       'name',       { unique: false });
        }
      };

      req.onsuccess = (e) => {
        this._db = e.target.result;
        this._ready = true;
        resolve(this._db);
      };

      req.onerror = (e) => {
        console.error('[LeadDB] Failed to open database:', e.target.error);
        reject(e.target.error);
      };
    });
    return this._readyPromise;
  }

  _ensureReady() {
    if (!this._ready) throw new Error('LeadDatabase not initialized. Call init() first.');
    return this._db;
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  getAllLeads() {
    const db = this._ensureReady();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  getLead(id) {
    const db = this._ensureReady();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  saveLead(lead) {
    const db   = this._ensureReady();
    const now  = new Date().toISOString();
    const full = {
      status:        'new',
      lastCalled:    null,
      callbackDate:  null,
      callCount:     0,
      notes:         '',
      capturedData:  {},
      createdAt:     now,
      ...lead,
      id:        lead.id        || crypto.randomUUID(),
      updatedAt: now,
    };
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.put(full);
      req.onsuccess = () => resolve(full);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  updateLead(id, patch) {
    return this.getLead(id).then((existing) => {
      if (!existing) throw new Error(`Lead ${id} not found`);
      const updated = { ...existing, ...patch, id, updatedAt: new Date().toISOString() };
      return this.saveLead(updated);
    });
  }

  deleteLead(id) {
    const db = this._ensureReady();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  clearAll() {
    const db = this._ensureReady();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  getCount() {
    const db = this._ensureReady();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req   = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  // ── CSV Import ────────────────────────────────────────────────────────────

  /**
   * Parse and import CSV leads.
   * Handles the Estrella scraper CSV format:
   *   Business Name, Phone, Address, City, State, Website, Category, Source
   *
   * @param {string} csvText - Raw CSV string
   * @returns {Promise<{imported: number, skipped: number}>}
   */
  async importFromCSV(csvText) {
    const lines  = csvText.trim().split('\n');
    if (lines.length < 2) return { imported: 0, skipped: 0 };

    const headers = parseCSVRow(lines[0]).map(h => h.trim().toLowerCase());
    const colIndex = {
      name:     headers.indexOf('business name'),
      phone:    headers.indexOf('phone'),
      address:  headers.indexOf('address'),
      city:     headers.indexOf('city'),
      state:    headers.indexOf('state'),
      website:  headers.indexOf('website'),
      category: headers.indexOf('category'),
      source:   headers.indexOf('source'),
    };

    let imported = 0;
    let skipped  = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = parseCSVRow(line);
      const name = cols[colIndex.name]?.trim() || '';
      if (!name) { skipped++; continue; }

      const lead = {
        name,
        phone:    cols[colIndex.phone]?.trim()    || '',
        address:  cols[colIndex.address]?.trim()  || '',
        city:     cols[colIndex.city]?.trim()     || '',
        state:    cols[colIndex.state]?.trim()    || '',
        website:  cols[colIndex.website]?.trim()  || '',
        category: cols[colIndex.category]?.trim() || 'Unknown',
        source:   cols[colIndex.source]?.trim()   || 'Import',
      };

      try {
        await this.saveLead(lead);
        imported++;
      } catch {
        skipped++;
      }
    }

    return { imported, skipped };
  }

  // ── Query Helpers ─────────────────────────────────────────────────────────

  async getLeadsByStatus(status) {
    const all = await this.getAllLeads();
    return all.filter(l => l.status === status);
  }

  async getNextNewLead() {
    const all  = await this.getAllLeads();
    return all.find(l => l.status === 'new') || null;
  }

  async getStats() {
    const all = await this.getAllLeads();
    const stats = {
      total:        all.length,
      new:          0,
      called:       0,
      interested:   0,
      callback:     0,
      not_interested: 0,
      no_answer:    0,
      closed:       0,
    };
    all.forEach(l => {
      if (stats[l.status] !== undefined) stats[l.status]++;
    });
    return stats;
  }
}

// ── CSV Parsing Utility ──────────────────────────────────────────────────────

function parseCSVRow(row) {
  const result = [];
  let current  = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// Singleton
const leadDB = new LeadDatabase();
export default leadDB;
