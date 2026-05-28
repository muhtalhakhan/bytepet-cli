'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_DIR = path.join(os.homedir(), '.byte-cli');
const STATE_FILE = path.join(STATE_DIR, 'pet.json');
const STAT_NAMES = ['hunger', 'happiness', 'energy', 'health', 'xp', 'level'];

const DECAY_RATES = {
  hunger:    0.8,   // per hour
  happiness: 0.5,
  energy:    0.4,
  health:    0.2,
};

function ensureDir() {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
  }
}

function backupCorruptSave() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(STATE_DIR, `pet.corrupt-${stamp}.json`);
  fs.renameSync(STATE_FILE, backupFile);
  return backupFile;
}

function clampStat(value, min = 0, max = 100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.name || typeof raw.name !== 'string') return null;
  if (!PETS_TYPES().includes(raw.petType)) return null;
  if (!raw.stats || typeof raw.stats !== 'object') return null;

  for (const stat of STAT_NAMES) {
    if (!Number.isFinite(Number(raw.stats[stat]))) return null;
  }

  return {
    ...raw,
    stats: {
      hunger: clampStat(raw.stats.hunger),
      happiness: clampStat(raw.stats.happiness),
      energy: clampStat(raw.stats.energy),
      health: clampStat(raw.stats.health),
      xp: Math.max(0, Math.floor(Number(raw.stats.xp))),
      level: Math.max(1, Math.floor(Number(raw.stats.level))),
    },
    lastSeen: Number.isFinite(Number(raw.lastSeen)) ? Number(raw.lastSeen) : Date.now(),
    born: Number.isFinite(Number(raw.born)) ? Number(raw.born) : Date.now(),
  };
}

function PETS_TYPES() {
  return ['cat', 'dog', 'dragon'];
}

function loadWithMeta() {
  ensureDir();
  if (!fs.existsSync(STATE_FILE)) return { state: null, recovered: false, backupFile: null };

  try {
    const state = normalizeState(JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')));
    if (state) return { state, recovered: false, backupFile: null };
  } catch {
    // Fall through to quarantine the unreadable save file.
  }

  const backupFile = backupCorruptSave();
  return { state: null, recovered: true, backupFile };
}

function load() {
  return loadWithMeta().state;
}

function save(state) {
  ensureDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function reset() {
  ensureDir();
  if (!fs.existsSync(STATE_FILE)) return false;
  fs.unlinkSync(STATE_FILE);
  return true;
}

function applyDecay(state) {
  const now = Date.now();
  const lastSeen = state.lastSeen || now;
  const hoursElapsed = (now - lastSeen) / (1000 * 60 * 60);

  if (hoursElapsed < 0.05) return state; // less than 3 mins, skip

  const newState = { ...state, stats: { ...state.stats } };

  for (const [stat, rate] of Object.entries(DECAY_RATES)) {
    newState.stats[stat] = Math.max(0, newState.stats[stat] - rate * hoursElapsed);
  }

  // Health drops if hunger or happiness hits 0
  if (newState.stats.hunger === 0 || newState.stats.happiness === 0) {
    newState.stats.health = Math.max(0, newState.stats.health - 1 * hoursElapsed);
  }

  newState.lastSeen = now;
  return newState;
}

function createPet(name, petType) {
  return {
    name,
    petType,
    stats: {
      hunger:    80,
      happiness: 80,
      energy:    80,
      health:    100,
      xp:        0,
      level:     1,
    },
    lastSeen: Date.now(),
    born: Date.now(),
  };
}

function addXP(state, amount) {
  const newState = { ...state, stats: { ...state.stats } };
  newState.stats.xp += amount;
  const xpNeeded = newState.stats.level * 100;
  if (newState.stats.xp >= xpNeeded) {
    newState.stats.xp -= xpNeeded;
    newState.stats.level += 1;
    return { state: newState, leveledUp: true };
  }
  return { state: newState, leveledUp: false };
}

module.exports = {
  STATE_DIR,
  STATE_FILE,
  load,
  loadWithMeta,
  save,
  reset,
  applyDecay,
  createPet,
  addXP,
};
