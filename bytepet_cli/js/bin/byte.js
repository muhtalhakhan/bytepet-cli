#!/usr/bin/env node

'use strict';

const readline = require('readline');
const { PETS, getMood, getArt } = require('../lib/pets');
const {
  STATE_FILE,
  loadWithMeta,
  save,
  reset,
  applyDecay,
  createPet,
  addXP,
} = require('../lib/state');
const rps = require('../lib/rps');

const APP_NAME = 'bytepet-cli';
const VERSION = '0.2.0';

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

function printHelp() {
  console.log(`
${APP_NAME} v${VERSION}

Usage:
  byte
  bytepet

Options:
  -h, --help       Show this help message
  -v, --version    Show the current version
  --status         Print your pet's current status and exit
  --reset          Delete your saved pet and start over next run
  -y, --yes        Skip confirmation prompts

Controls:
  f    Feed your pet
  p    Play Rock Paper Scissors
  s    Let your pet sleep
  q    Save and quit

Save file:
  ${STATE_FILE}
`);
}

async function confirmReset() {
  if (!process.stdin.isTTY) return false;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await ask(rl, 'Delete your saved pet? This cannot be undone. [y/N] ');
  rl.close();
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

function printSaveWarning(meta) {
  if (!meta.recovered) return;
  console.error(`Save file was unreadable and has been moved to: ${meta.backupFile}`);
}

function printStatus(state) {
  const mood = getMood(state.stats);
  const xpNeeded = state.stats.level * 100;

  console.log(`${state.name} the ${PETS[state.petType].name}`);
  console.log(`Mood: ${mood}`);
  console.log(`Level: ${state.stats.level}`);
  console.log(`XP: ${state.stats.xp}/${xpNeeded}`);
  console.log(`Health: ${Math.round(state.stats.health)}%`);
  console.log(`Hunger: ${Math.round(state.stats.hunger)}%`);
  console.log(`Happiness: ${Math.round(state.stats.happiness)}%`);
  console.log(`Energy: ${Math.round(state.stats.energy)}%`);
  console.log(`Save file: ${STATE_FILE}`);
}

async function handleCliArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0) return false;

  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    return true;
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log(VERSION);
    return true;
  }

  if (args.includes('--status')) {
    const meta = loadWithMeta();
    printSaveWarning(meta);
    if (!meta.state) {
      console.log(`No pet found. Run "byte" to adopt one.`);
      console.log(`Save file: ${STATE_FILE}`);
      return true;
    }

    const state = applyDecay(meta.state);
    save(state);
    printStatus(state);
    return true;
  }

  if (args.includes('--reset')) {
    const force = args.includes('-y') || args.includes('--yes');
    if (!force && !(await confirmReset())) {
      console.log('Reset cancelled.');
      return true;
    }

    const removed = reset();
    console.log(removed ? 'Saved pet deleted. Run "byte" to adopt a new one.' : 'No saved pet found.');
    console.log(`Save file: ${STATE_FILE}`);
    return true;
  }

  console.error(`Unknown option: ${args[0]}`);
  console.error(`Run "byte --help" for usage.`);
  process.exitCode = 1;
  return true;
}

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
  console.log(paint(c.bold + c.cyan, `  🥚  Welcome to ${APP_NAME}!`));
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
  console.log(paint(c.bold + c.cyan, `  ⚡ ${APP_NAME}\n`));

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
  const meta = loadWithMeta();
  printSaveWarning(meta);
  let state = meta.state;

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

handleCliArgs(process.argv).then(handled => {
  if (handled) return;

  main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
