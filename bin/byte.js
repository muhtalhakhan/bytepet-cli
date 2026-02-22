#!/usr/bin/env node

'use strict';

const readline = require('readline');
const { PETS, getMood, getArt } = require('../lib/pets');
const { load, save, applyDecay, createPet, addXP } = require('../lib/state');
const rps = require('../lib/rps');

// ── Colors ───────────────────────────────────────────────────────────────────
const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  gray:    '\x1b[90m',
};

const paint = (color, text) => `${color}${text}${c.reset}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function bar(value, max = 100, len = 10) {
  const filled = Math.round((value / max) * len);
  const empty  = len - filled;
  const color  = value > 60 ? c.green : value > 30 ? c.yellow : c.red;
  return `${color}${'█'.repeat(filled)}${c.gray}${'░'.repeat(empty)}${c.reset}`;
}

function ask(rl, question) {
  return new Promise(res => rl.question(question, ans => res(ans.trim())));
}

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function moodMessage(mood, name) {
  const messages = {
    happy:  `${name} is happy and energetic! 😊`,
    hungry: `${name} is hungry... feed me! 🍖`,
    sleepy: `${name} is really tired... 😴`,
    sad:    `${name} needs some attention 😢`,
    sick:   `${name} is not feeling well 🤒`,
  };
  return messages[mood];
}

// ── First run: pick pet ───────────────────────────────────────────────────────
async function onboard() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  clearScreen();
  console.log('');
  console.log(paint(c.bold + c.cyan, '  🥚  Welcome to byte-cli!'));
  console.log(paint(c.gray, '  Your terminal pet is waiting...\n'));

  console.log(paint(c.bold, '  Choose your pet:\n'));
  console.log(`  ${paint(c.cyan,    '[1]')} 🐱  Cat`);
  console.log(`  ${paint(c.yellow,  '[2]')} 🐶  Dog`);
  console.log(`  ${paint(c.magenta, '[3]')} 🐉  Dragon`);
  console.log('');

  let petType = null;
  while (!petType) {
    const choice = await ask(rl, '  Your choice: ');
    if (choice === '1') petType = 'cat';
    else if (choice === '2') petType = 'dog';
    else if (choice === '3') petType = 'dragon';
    else console.log(paint(c.red, '  Please pick 1, 2, or 3.\n'));
  }

  console.log('');
  const name = await ask(rl, paint(c.bold, `  What will you name your ${PETS[petType].name}?\n  `) + '> ');
  rl.close();

  const petName = name || PETS[petType].name;
  const state   = createPet(petName, petType);
  save(state);

  clearScreen();
  console.log('');
  console.log(paint(c.bold + c.green, `  🎉 ${petName} the ${PETS[petType].name} has been born!\n`));
  console.log(paint(c.gray, '  Take good care of them. Come back often — they miss you when you\'re away.\n'));

  await new Promise(res => setTimeout(res, 1500));
  return state;
}

// ── Render main screen ────────────────────────────────────────────────────────
function renderHome(state) {
  const { name, petType, stats } = state;
  const mood    = getMood(stats);
  const art     = getArt(petType, stats);
  const xpNeeded = stats.level * 100;

  clearScreen();
  console.log('');
  console.log(paint(c.bold + c.cyan, '  ⚡ byte-cli\n'));

  // ASCII art
  art.forEach(line => console.log(paint(c.yellow, '  ' + line)));
  console.log('');

  // Name + level
  console.log(`  ${paint(c.bold, name + ' the ' + PETS[petType].name)}  ${paint(c.gray, '·')}  ${paint(c.magenta, 'Level ' + stats.level)}  ${paint(c.gray, '·')}  ${paint(c.dim, stats.xp + '/' + xpNeeded + ' XP')}`);
  console.log('');

  // Stats
  console.log(`  ❤️  Health    ${bar(stats.health)}  ${paint(c.gray, Math.round(stats.health) + '%')}`);
  console.log(`  🍖  Hunger    ${bar(stats.hunger)}  ${paint(c.gray, Math.round(stats.hunger) + '%')}`);
  console.log(`  😊  Happiness ${bar(stats.happiness)}  ${paint(c.gray, Math.round(stats.happiness) + '%')}`);
  console.log(`  ⚡  Energy    ${bar(stats.energy)}  ${paint(c.gray, Math.round(stats.energy) + '%')}`);
  console.log('');

  // Mood message
  console.log(`  ${paint(c.dim, moodMessage(mood, name))}`);
  console.log('');

  // Actions
  console.log(paint(c.gray, '  ─────────────────────────────────────────'));
  console.log(`  ${paint(c.cyan, '[f]')} Feed   ${paint(c.cyan, '[p]')} Play   ${paint(c.cyan, '[s]')} Sleep   ${paint(c.cyan, '[q]')} Quit`);
  console.log('');
}

// ── Actions ───────────────────────────────────────────────────────────────────
function feed(state) {
  const s = { ...state, stats: { ...state.stats } };
  const boost = Math.min(100 - s.stats.hunger, 30);
  s.stats.hunger    = Math.min(100, s.stats.hunger + 30);
  s.stats.happiness = Math.min(100, s.stats.happiness + 5);
  const { state: newState, leveledUp } = addXP(s, 10);
  return { state: newState, leveledUp, msg: `${paint(c.green, '🍖 Yum!')} Hunger +${boost}  XP +10` };
}

function sleep(state) {
  const s = { ...state, stats: { ...state.stats } };
  s.stats.energy    = Math.min(100, s.stats.energy + 40);
  s.stats.health    = Math.min(100, s.stats.health + 5);
  const { state: newState, leveledUp } = addXP(s, 5);
  return { state: newState, leveledUp, msg: `${paint(c.blue, '💤 Zzz...')} Energy +40  XP +5` };
}

// ── Main loop ─────────────────────────────────────────────────────────────────
async function main() {
  let state = load();

  if (!state) {
    state = await onboard();
  } else {
    state = applyDecay(state);
    save(state);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  let message = '';
  let running = true;

  renderHome(state);
  if (message) console.log(`  ${message}\n`);

  process.stdin.on('keypress', async (str, key) => {
    if (!running) return;

    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      running = false;
      state.lastSeen = Date.now();
      save(state);
      rl.close();
      clearScreen();
      console.log('');
      console.log(paint(c.cyan, `  👋 Goodbye! ${state.name} will miss you.\n`));
      process.exit(0);
    }

    if (key.name === 'f') {
      const result = feed(state);
      state   = result.state;
      message = result.msg;
      if (result.leveledUp) message += paint(c.magenta + c.bold, `  🎉 LEVEL UP! Now level ${state.stats.level}!`);
      save(state);
      renderHome(state);
      console.log(`  ${message}\n`);
    }

    if (key.name === 's') {
      const result = sleep(state);
      state   = result.state;
      message = result.msg;
      if (result.leveledUp) message += paint(c.magenta + c.bold, `  🎉 LEVEL UP! Now level ${state.stats.level}!`);
      save(state);
      renderHome(state);
      console.log(`  ${message}\n`);
    }

    if (key.name === 'p') {
      process.stdin.setRawMode(false);
      rl.close();
      running = false;

      const result = await rps.play(state.name);

      // Apply game results to stats
      state.stats.happiness = Math.min(100, state.stats.happiness + result.happinessBoost);
      state.stats.energy    = Math.max(0,   state.stats.energy    - result.energyCost);
      const { state: newState, leveledUp } = addXP(state, result.xpEarned);
      state = newState;

      if (leveledUp) {
        console.log(paint(c.magenta + c.bold, `  🎉 LEVEL UP! ${state.name} is now level ${state.stats.level}!\n`));
        await new Promise(res => setTimeout(res, 1500));
      }

      save(state);

      // Restart loop
      running = true;
      const newRl = readline.createInterface({ input: process.stdin, output: process.stdout });
      readline.emitKeypressEvents(process.stdin);
      if (process.stdin.isTTY) process.stdin.setRawMode(true);

      renderHome(state);

      process.stdin.removeAllListeners('keypress');
      process.stdin.on('keypress', async (str, key) => {
        // re-attach same handler by restarting main — simplest approach
        newRl.close();
        process.stdin.setRawMode(false);
        process.stdin.removeAllListeners('keypress');
        main();
      });
    }
  });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
