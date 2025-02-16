import { Howl } from 'howler';
import { sample } from 'lodash';
// Sound
const dailySfxFile = require('assets/sounds/daily-sfx.mp3');

export const dailySoundEffects = new Howl({
  src: [dailySfxFile],
  volume: 1,
  sprite: {
    bubble1: [0, 75], // Clap sound 1
    bubble2: [100, 75], // Clap sound 2
    bubble3: [200, 75], // Clap sound 3
    addCorrect: [300, 300],
    addWrong: [550, 500],
    alienYay: [1000, 700],
    alienBoo: [1800, 800],
    wrong: [2600, 800],
    correct1: [3400, 300],
    correct2: [3700, 300],
    select: [4050, 150],
    swap1: [4250, 150],
    swap2: [4400, 170],
    shuffle: [4600, 900],
    lose1: [5500, 2200],
    lose2: [7800, 2000],
    win1: [10000, 1200],
    win2: [11300, 1500],
  },
  // onend: () => alert('Sound finished playing'),
});

export const SFXAllNames = [
  'bubble1',
  'bubble2',
  'bubble3',
  'addCorrect',
  'addWrong',
  'alienYay',
  'alienBoo',
  'wrong',
  'correct1',
  'correct2',
  'select',
  'swap1',
  'swap2',
  'shuffle',
  'lose1',
  'lose2',
  'win1',
  'win2',
] as const;

type SFXTypes =
  | 'bubble'
  | 'bubbleIn'
  | 'bubbleOut'
  | 'addCorrect'
  | 'addWrong'
  | 'alienYay'
  | 'alienBoo'
  | 'wrong'
  | 'correct'
  | 'select'
  | 'swap'
  | 'shuffle'
  | 'win'
  | 'lose';

export const playSFX = (name: SFXTypes) => {
  switch (name) {
    case 'bubble':
      dailySoundEffects.play(sample(['bubble1', 'bubble2', 'bubble3']));
      break;
    case 'bubbleIn':
      dailySoundEffects.play('bubble1');
      break;
    case 'bubbleOut':
      dailySoundEffects.play('bubble2');
      break;
    case 'addCorrect':
      dailySoundEffects.play('addCorrect');
      break;
    case 'addWrong':
      dailySoundEffects.play('addWrong');
      break;
    case 'alienYay':
      dailySoundEffects.play('alienYay');
      break;
    case 'alienBoo':
      dailySoundEffects.play('alienBoo');
      break;
    case 'wrong':
      dailySoundEffects.play('wrong');
      break;
    case 'correct':
      dailySoundEffects.play(sample(['correct1', 'correct2']));
      break;
    case 'select':
      dailySoundEffects.play('select');
      break;
    case 'swap':
      dailySoundEffects.play(sample(['swap1', 'swap2']));
      break;
    case 'shuffle':
      dailySoundEffects.play('shuffle');
      break;
    case 'win':
      dailySoundEffects.play(sample(['win1', 'win2']));
      break;
    case 'lose':
      dailySoundEffects.play(sample(['lose1', 'lose2']));
      break;
  }
};
