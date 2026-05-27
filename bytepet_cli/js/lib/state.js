'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const STATE_DIR = path.join(os.homedir(), '.byte-cli');
const STATE_FILE = path.join(STATE_DIR, 'pet.json');

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

function load() {
  ensureDir();
  if (!fs.existsSync(STATE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function save(state) {
  ensureDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
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

module.exports = { load, save, applyDecay, createPet, addXP };
