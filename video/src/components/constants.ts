// Color palette — dark terminal aesthetic
export const COLORS = {
  bg: '#0d1117',
  terminal: '#161b22',
  border: '#30363d',
  cyan: '#58d9f0',
  green: '#3fb950',
  yellow: '#d29922',
  magenta: '#bc8cff',
  red: '#f85149',
  gray: '#8b949e',
  white: '#e6edf3',
  dim: '#484f58',
};

// ASCII art for each pet mood (mirrors lib/pets.js)
export const PET_ART = {
  cat: {
    happy: [
      '  /\\_____/\\  ',
      ' (  ^   ^  ) ',
      ' (  =^.^=  ) ',
      ' (--m-m----) ',
    ],
    hungry: [
      '  /\\_____/\\  ',
      ' (  -   -  ) ',
      ' (  =o.o=  ) ',
      ' (--m-m----) ',
    ],
    sleepy: [
      '  /\\_____/\\  ',
      ' (  -   -  ) ',
      ' (  =-.-=  ) ',
      ' (--m-m----) ',
    ],
    sad: [
      '  /\\_____/\\  ',
      ' (  T   T  ) ',
      ' (  =v.v=  ) ',
      ' (--m-m----) ',
    ],
  },
};

// Timing helpers (all in frames at 30fps)
export const FPS = 30;
export const SEC = FPS; // 1 second = 30 frames

// Scene boundaries (in frames)
export const SCENES = {
  intro:   { from: 0,          dur: 4  * SEC },  // 0–4s
  reveal:  { from: 4  * SEC,   dur: 5  * SEC },  // 4–9s
  actions: { from: 9  * SEC,   dur: 5  * SEC },  // 9–14s
  moods:   { from: 14 * SEC,   dur: 3  * SEC },  // 14–17s
  outro:   { from: 17 * SEC,   dur: 3  * SEC },  // 17–20s
};
