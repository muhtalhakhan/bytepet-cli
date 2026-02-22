'use strict';

const readline = require('readline');

const CHOICES = ['rock', 'paper', 'scissors'];
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' };

const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};

function getResult(player, computer) {
  if (player === computer) return 'draw';
  if (
    (player === 'rock'     && computer === 'scissors') ||
    (player === 'paper'    && computer === 'rock')     ||
    (player === 'scissors' && computer === 'paper')
  ) return 'win';
  return 'lose';
}

async function play(petName) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(res => rl.question(q, res));

  console.log(`\n${c.cyan}${c.bold}  🎮 Rock Paper Scissors with ${petName}!${c.reset}\n`);
  console.log(`${c.gray}  [1] Rock  [2] Paper  [3] Scissors  [q] Quit${c.reset}\n`);

  let wins = 0, losses = 0, draws = 0;
  let xpEarned = 0;
  let playing = true;

  while (playing) {
    const input = (await ask(`  Your choice: `)).trim().toLowerCase();

    if (input === 'q') { playing = false; break; }

    const idx = parseInt(input) - 1;
    if (isNaN(idx) || idx < 0 || idx > 2) {
      console.log(`${c.yellow}  Invalid choice. Pick 1, 2, or 3.${c.reset}\n`);
      continue;
    }

    const playerChoice   = CHOICES[idx];
    const computerChoice = CHOICES[Math.floor(Math.random() * 3)];
    const result         = getResult(playerChoice, computerChoice);

    console.log(`\n  You: ${EMOJI[playerChoice]} ${playerChoice}`);
    console.log(`  ${petName}: ${EMOJI[computerChoice]} ${computerChoice}\n`);

    if (result === 'win') {
      wins++;
      xpEarned += 15;
      console.log(`${c.green}${c.bold}  🎉 You win! +15 XP${c.reset}\n`);
    } else if (result === 'lose') {
      losses++;
      xpEarned += 5;
      console.log(`${c.red}  😅 ${petName} wins this round! +5 XP${c.reset}\n`);
    } else {
      draws++;
      xpEarned += 8;
      console.log(`${c.yellow}  🤝 Draw! +8 XP${c.reset}\n`);
    }

    const again = (await ask(`  Play again? [y/n]: `)).trim().toLowerCase();
    if (again !== 'y') playing = false;
    console.log('');
  }

  rl.close();

  console.log(`${c.gray}  Score — Wins: ${wins} | Losses: ${losses} | Draws: ${draws}${c.reset}`);
  console.log(`${c.cyan}  Total XP earned: +${xpEarned}${c.reset}\n`);

  return { xpEarned, happinessBoost: wins * 8, energyCost: (wins + losses + draws) * 3 };
}

module.exports = { play };
