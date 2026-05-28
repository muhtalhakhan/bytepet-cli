# bytepet-cli

> A tiny terminal pet for your command line: feed it, play with it, let it sleep, and watch its mood change over time.

[![Watch bytepet-cli demo](https://cdn.jsdelivr.net/gh/muhtalhakhan/bytepet-cli@main/video/thumbnail.png)](https://github.com/muhtalhakhan/bytepet-cli/releases/download/v0.1.1/BytepetVideo.mp4)

```text
  /\_____/\  
 (  ^   ^  ) 
 (  =^.^=  )        Pixel the Cat
 (--m-m----)        Level 3 · 245/300 XP

  Health     ██████████  100%
  Hunger     ███████░░░  70%
  Happiness  ████████░░  80%
  Energy     █████░░░░░  55%

  [f] Feed   [p] Play   [s] Sleep   [q] Quit
```

## Install

```bash
npm install -g bytepet-cli
```

You can also install from PyPI if you prefer Python tooling:

```bash
pip install bytepet-cli
```

The PyPI package runs the same Node-powered terminal game, so Node.js still needs to be available on your machine.

## Run

```bash
byte
```

The npm package also exposes:

```bash
bytepet
```

Helpful flags:

```bash
byte --help
byte --version
byte --status
byte --reset
```

## What You Can Do

Bytepet is built around quick keyboard actions:

| Key | Action | Effect |
| --- | --- | --- |
| `f` | Feed | Hunger +30, happiness +5, XP +10 |
| `s` | Sleep | Energy +40, health +5, XP +5 |
| `p` | Play | Rock Paper Scissors, XP +5 to +15 |
| `q` | Quit | Save and leave your pet for later |

Your pet remembers you between sessions. Stats decay while you are away, so the next visit may find them hungry, tired, sad, or in need of care.

## Save Management

`byte --status` prints your current pet stats without opening the interactive UI. `byte --reset` deletes your saved pet so you can adopt a new one on the next run.

Bytepet stores your pet locally in:

```text
~/.byte-cli/pet.json
```

If the save file becomes unreadable, bytepet moves it aside as a `.corrupt-...json` backup and lets you adopt a fresh pet.

## Pets And Moods

On first run, choose a cat, dog, or dragon and give it a name. Each pet has ASCII-art mood states driven by its stats:

| Mood | Trigger |
| --- | --- |
| Happy | Stats are healthy |
| Hungry | Hunger is low |
| Sleepy | Energy is low |
| Sad | Happiness is low |
| Sick | Health is low |

## Progression

Feeding, sleeping, and playing all grant XP. Earn enough XP and your pet levels up, giving the little CLI companion a reason to keep living rent-free in your terminal.

## Promo Video

The `video/` folder contains the Remotion project used to render the promo:

```bash
cd video
npm install
npm run render
```

The rendered output lives at `video/out/BytepetVideo.mp4`.

## License

MIT - Copyright (c) 2026 Muhammad Talha Khan
