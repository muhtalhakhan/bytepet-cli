# ⚡ bytepet-cli

> A terminal pet that lives in your CLI — feed it, play with it, watch it grow.

```
  /\_____/\  
 (  ^   ^  ) 
 (  =^.^=  )        Pixel the Cat
 (--m-m----)        Level 3 · 45/300 XP

  ❤️  Health    ██████████  100%
  🍖  Hunger    ███████░░░  70%
  😊  Happiness ████████░░  80%
  ⚡  Energy    █████░░░░░  50%

  [f] Feed   [p] Play   [s] Sleep   [q] Quit
```

## Install

```bash
npm install -g bytepet-cli
```

## Usage

```bash
byte
```

That's it. Your pet remembers you between sessions — stats decay while you're away, so check in often!

## Pets

Choose from three pets on first run:
- 🐱 **Cat** — curious and independent
- 🐶 **Dog** — loyal and energetic  
- 🐉 **Dragon** — rare and mysterious

## Stats

| Stat | Description |
|------|-------------|
| ❤️ Health | Drops if hunger or happiness hits 0 |
| 🍖 Hunger | Decays over time — feed your pet! |
| 😊 Happiness | Decays over time — play with your pet! |
| ⚡ Energy | Decays over time — let your pet sleep! |
| ⭐ XP / Level | Earned through feeding, playing, sleeping |

## Actions

| Key | Action | XP |
|-----|--------|----|
| `f` | Feed your pet | +10 XP |
| `p` | Play Rock Paper Scissors | +5–15 XP |
| `s` | Put your pet to sleep | +5 XP |
| `q` | Quit | — |

## Moods

Your pet's ASCII art changes based on its mood:
- 😊 **Happy** — all stats healthy
- 🍖 **Hungry** — hunger below 20%
- 😴 **Sleepy** — energy below 20%
- 😢 **Sad** — happiness below 30%
- 🤒 **Sick** — health below 20%

## Roadmap

- v0.1.0 — ✅ Core pet, 3 animals, 5 stats, RPS mini game
- v0.2.0 — More mini games, pet evolution stages, rare pets
- v0.3.0 — Pet accessories, backgrounds, seasonal events
- v1.0.0 — Pro tier: multiple pets, cloud sync, pet sharing

## License

UNLICENSED — © 2025 Muhammad Talha Khan
