'use strict';

const PETS = {
  cat: {
    emoji: '🐱',
    name: 'Cat',
    moods: {
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
      sick: [
        '  /\\_____/\\  ',
        ' (  x   x  ) ',
        ' (  =@.@=  ) ',
        ' (--m-m----) ',
      ],
    },
  },
  dog: {
    emoji: '🐶',
    name: 'Dog',
    moods: {
      happy: [
        '  / \\_/ \\   ',
        ' ( ^   ^ )  ',
        ' (  o.o  )  ',
        '  \\ ___/    ',
        '   |   |    ',
      ],
      hungry: [
        '  / \\_/ \\   ',
        ' ( -   - )  ',
        ' (  u.u  )  ',
        '  \\ ___/    ',
        '   |   |    ',
      ],
      sleepy: [
        '  / \\_/ \\   ',
        ' ( -   - )  ',
        ' (  -.–  )  ',
        '  \\ ___/    ',
        '   |   |    ',
      ],
      sad: [
        '  / \\_/ \\   ',
        ' ( T   T )  ',
        ' (  v.v  )  ',
        '  \\ ___/    ',
        '   |   |    ',
      ],
      sick: [
        '  / \\_/ \\   ',
        ' ( x   x )  ',
        ' (  @.@  )  ',
        '  \\ ___/    ',
        '   |   |    ',
      ],
    },
  },
  dragon: {
    emoji: '🐉',
    name: 'Dragon',
    moods: {
      happy: [
        '   / \\  / \\ ',
        '  ( o  \\/  o)',
        '  (   /\\   )',
        ' __\\_/  \\_/__ ',
        '(____________)',
      ],
      hungry: [
        '   / \\  / \\ ',
        '  ( -  \\/  -)',
        '  (   /\\   )',
        ' __\\_/  \\_/__ ',
        '(____________)',
      ],
      sleepy: [
        '   / \\  / \\ ',
        '  ( -  \\/  -)',
        '  (   -–   )',
        ' __\\_/  \\_/__ ',
        '(____________)',
      ],
      sad: [
        '   / \\  / \\ ',
        '  ( T  \\/  T)',
        '  (   /\\   )',
        ' __\\_/  \\_/__ ',
        '(____________)',
      ],
      sick: [
        '   / \\  / \\ ',
        '  ( x  \\/  x)',
        '  (   @~@  )',
        ' __\\_/  \\_/__ ',
        '(____________)',
      ],
    },
  },
};

function getMood(stats) {
  if (stats.health < 20) return 'sick';
  if (stats.hunger < 20) return 'hungry';
  if (stats.energy < 20) return 'sleepy';
  if (stats.happiness < 30) return 'sad';
  return 'happy';
}

function getArt(petType, stats) {
  const mood = getMood(stats);
  return PETS[petType].moods[mood];
}

module.exports = { PETS, getMood, getArt };
