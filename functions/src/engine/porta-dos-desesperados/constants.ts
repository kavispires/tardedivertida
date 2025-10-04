/* eslint-disable quotes */
import type { TrapEntry } from './types';

export const PORTA_DOS_DESESPERADOS_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  BOOK_POSSESSION: 'BOOK_POSSESSION',
  DOOR_CHOICE: 'DOOR_CHOICE',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
};

export const PORTA_DOS_DESESPERADOS_ACTIONS = {
  SUBMIT_PAGES: 'SUBMIT_PAGES',
  SUBMIT_DOOR: 'SUBMIT_DOOR',
};

export const PORTA_DOS_DESESPERADOS_ACHIEVEMENTS = {
  MOST_POSSESSED: 'MOST_POSSESSED',
  LEAST_POSSESSED: 'LEAST_POSSESSED',
  BEST_GUIDE: 'BEST_GUIDE',
  BEGINNER_GUIDE: 'BEGINNER_GUIDE',
  SLOW_READER: 'SLOW_READER',
  FAST_LEARNER: 'FAST_LEARNER',
  MOST_PAGES: 'MOST_PAGES',
  FEWEST_PAGES: 'FEWEST_PAGES',
  MOST_CORRECT_DOORS: 'MOST_CORRECT_DOORS',
  MOST_WRONG_DOORS: 'MOST_WRONG_DOORS',
  MOST_SOLO_CORRECT_DOORS: 'MOST_SOLO_CORRECT_DOORS',
  MOST_SOLO_WRONG_DOORS: 'MOST_SOLO_WRONG_DOORS',
  SLOW_DECISIONS: 'SLOW_DECISIONS',
  QUICK_DECISIONS: 'QUICK_DECISIONS',
  MAGIC_WASTER: 'MAGIC_WASTER',
  MAGIC_SAVER: 'MAGIC_SAVER',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const MAX_ROUNDS = 15;

export const MAGIC_UNITS_PER_PLAYER_COUNT = {
  2: 15,
  3: 22,
  4: 25,
  5: 25,
  6: 25,
  7: 28,
  8: 28,
  9: 30,
  10: 30,
};

export const DOOR_OPTIONS_PER_ROUND = 6;

export const DOOR_LEVELS = 7;

export const PAGES_PER_ROUND = 8;

export const TOTAL_IMAGE_CARDS = 252;

export const OUTCOME = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const WIN_CONDITION = {
  LOSE: 'LOSE',
  WIN: 'WIN',
  CONTINUE: 'CONTINUE',
};

export const TRAPS = {
  // LEVEL 1
  NO_PREVIEW: 'NO_PREVIEW',
  CONCEALED_DOOR: 'CONCEALED_DOOR',
  EXTRA_DOOR: 'EXTRA_DOOR',
  SEPIA: 'SEPIA',
  BLIND_DOOR: 'BLIND_DOOR',
  LOCKED_CHOICE: 'LOCKED_CHOICE',
  // LEVEL 2
  MORE_CLUES: 'MORE_CLUES',
  FEWER_PAGES: 'FEWER_PAGES',
  DOUBLE_MAGIC: 'DOUBLE_MAGIC',
  HALF_TIME: 'HALF_TIME',
  FADED_DOORS: 'FADED_DOORS',
  DANCING_DOORS: 'DANCING_DOORS',
  // LEVEL 3
  SECRET_CHOICE: 'SECRET_CHOICE',
  VANISHING_DOORS: 'VANISHING_DOORS',
  ORDERED_DOORS: 'ORDERED_DOORS',
  RANDOM_INTERJECTION: 'RANDOM_INTERJECTION',
  SHUFFLED_DOORS: 'SHUFFLED_DOORS',
  FLIP_BOOK: 'FLIP_BOOK',
} as const;

export const TRAPS_ENTRIES: Dictionary<TrapEntry> = {
  // LEVEL 1
  [TRAPS.NO_PREVIEW]: {
    id: TRAPS.NO_PREVIEW,
    level: 1,
    target: 'guess',
    setup: 'frontend',
    note: "Cards can't be enlarged/Easy to cheat",
    icon: 'magicCandles',
    title: {
      pt: 'O Livreto Diminuto',
      en: 'The Little Booklet',
    },
    description: {
      pt: 'Páginas não podem ser ampliadas.',
      en: 'Expanding/Zooming in cards is not available this round.',
    },
  },
  [TRAPS.CONCEALED_DOOR]: {
    id: TRAPS.CONCEALED_DOOR,
    level: 1,
    target: 'guess',
    setup: 'frontend',
    note: "Players can't see door #4 but can still choose it",
    icon: 'magicRunes',
    title: {
      pt: 'A Porta Trancada',
      en: 'The Concealed Door',
    },
    description: {
      pt: 'A porta C não será revelada, mas ela ainda pode ser a porta correta.',
      en: 'The door C will not be revealed but it could still be the correct answer.',
    },
  },
  [TRAPS.EXTRA_DOOR]: {
    id: TRAPS.EXTRA_DOOR,
    level: 1,
    target: 'guess',
    setup: 'backend',
    note: 'Players have 7 doors to choose from',
    icon: 'magicRunes',
    title: {
      pt: 'O Caminho Estendido',
      en: 'The Increased Path',
    },
    description: {
      pt: 'Nessa rodada, uma porta extra está disponível a ser entrada.',
      en: 'This round an additional door is available to be entered.',
    },
  },
  [TRAPS.SEPIA]: {
    id: TRAPS.SEPIA,
    level: 1,
    target: 'guess',
    setup: 'frontend',
    note: 'Pages are tinted',
    icon: 'magicHamsa',
    title: {
      pt: 'O Livro Ancião',
      en: 'The Ancient Pages',
    },
    description: {
      pt: 'As páginas do livro estão desfocadas e desbotadas.',
      en: 'The Book Pages are old and do not have color.',
    },
  },
  [TRAPS.BLIND_DOOR]: {
    id: TRAPS.BLIND_DOOR,
    level: 1,
    target: 'guess',
    setup: 'frontend',
    note: 'Each player cannot see one random door',
    icon: 'magicVoodooDoll',
    title: {
      pt: 'A Porta Cega',
      en: 'The Blind Door',
    },
    description: {
      pt: 'Cada jogador não pode ver uma porta aleatória.',
      en: 'Each player cannot see one random door.',
    },
  },
  [TRAPS.LOCKED_CHOICE]: {
    id: TRAPS.LOCKED_CHOICE,
    level: 1,
    target: 'guess',
    setup: 'frontend',
    note: 'Players cannot change their door choice after selecting it',
    icon: 'magicVoodooDoll',
    title: {
      pt: 'A Escolha Permanente',
      en: 'The Locked Choice',
    },
    description: {
      pt: 'Jogadores não podem mudar de ideia depois de escolher uma porta.',
      en: 'Players cannot change their mind after selecting a door.',
    },
  },
  // LEVEL 2
  [TRAPS.MORE_CLUES]: {
    id: TRAPS.MORE_CLUES,
    level: 2,
    target: 'clue',
    setup: 'frontend',
    note: '3 book clues are used',
    icon: 'magicDivination',
    title: {
      pt: 'A Trindade Ilusória',
      en: 'The Illusionary Trinity',
    },
    description: {
      pt: 'O jogador possuído deve escolher exatamente 3 páginas do livro.',
      en: 'The possessed player must choose exactly 3 book pages.',
    },
  },
  [TRAPS.FEWER_PAGES]: {
    id: TRAPS.FEWER_PAGES,
    level: 2,
    target: 'clue',
    setup: 'backend',
    note: 'Possessed player can only choose from 4 cards',
    icon: 'magicDivination',
    title: {
      pt: 'A Escolha Minguante',
      en: 'The Waning Choice',
    },
    description: {
      pt: 'O jogador possuído tem apenas 4 opções de páginas para escolher',
      en: 'The possessed players has only 4 page options to choose from',
    },
  },
  [TRAPS.DOUBLE_MAGIC]: {
    id: TRAPS.DOUBLE_MAGIC,
    level: 2,
    target: 'guess',
    setup: 'backend',
    note: 'This turn all magic use is doubled',
    icon: 'dreamCatcher',
    title: {
      pt: 'A Magia Dúplice',
      en: 'The Double Magic',
    },
    description: {
      pt: 'Nessa rodada, cada porta visitada custa 2 cristais mágicos ao invés de 1.',
      en: 'This round each visited door costs 2 magic crystals instead of 1.',
    },
  },
  [TRAPS.HALF_TIME]: {
    id: TRAPS.HALF_TIME,
    level: 2,
    target: 'guess',
    setup: 'frontend',
    note: 'The time is cut in half',
    icon: 'dreamCatcher',
    title: {
      pt: 'O Ansiosa Decisão',
      en: 'The Rush Decision',
    },
    description: {
      pt: 'Jogadores tem que decidir qual porta visitar na metade do tempo.',
      en: 'Players have half the time to decide what door to enter',
    },
  },
  [TRAPS.FADED_DOORS]: {
    id: TRAPS.FADED_DOORS,
    level: 2,
    target: 'guess',
    setup: 'frontend',
    note: 'Doors randomly fade in and fade out, on expand, they are 50% opacity',
    icon: 'magicHamsa',
    title: {
      pt: 'As Portas Enfraquecidas',
      en: 'The Fading Doors',
    },
    description: {
      pt: 'As imagens das portas estão bem fracas e desaparecendo...',
      en: 'The doors are fading...',
    },
  },
  [TRAPS.DANCING_DOORS]: {
    id: TRAPS.DANCING_DOORS,
    level: 2,
    target: 'guess',
    setup: 'frontend',
    note: 'Doors keep moving around',
    icon: 'magicTarotCards',
    title: {
      pt: 'As Portas Dançantes',
      en: 'The Dancing Doors',
    },
    description: {
      pt: 'As portas ficam se movendo, possuídas pelo ritmo Ragatanga.',
      en: 'The doors keep moving around, possessed by the unknown rhythm.',
    },
  },
  // LEVEL 3
  [TRAPS.SECRET_CHOICE]: {
    id: TRAPS.SECRET_CHOICE,
    level: 3,
    target: 'guess',
    setup: 'frontend',
    note: "Players don't see what others are choosing and can't communicate",
    icon: 'magicVoodooDoll',
    title: {
      pt: 'A Escolha Secreta',
      en: 'The Secret Choice',
    },
    description: {
      pt: 'Nessa rodada, jogadores não podem discutir, e o voto é secreto.',
      en: 'This round, players cannot discuss and their selection is secret.',
    },
  },
  [TRAPS.VANISHING_DOORS]: {
    id: TRAPS.VANISHING_DOORS,
    level: 3,
    target: 'guess',
    setup: 'frontend',
    note: 'Every 30 seconds a door is removed from A to F',
    icon: 'magicTarotCards',
    title: {
      pt: 'As Portas Desvanecentes',
      en: 'The Vanishing Doors',
    },
    description: {
      pt: 'Um porta some a cada 30 segundos...',
      en: 'A door vanishes every 30 seconds...',
    },
  },
  [TRAPS.ORDERED_DOORS]: {
    id: TRAPS.ORDERED_DOORS,
    level: 3,
    target: 'guess',
    setup: 'frontend',
    note: 'Doors are revealed one at a time and players must choose in order',
    icon: 'magicTarotCards',
    title: {
      pt: 'As Portas Ordenadas',
      en: 'The Ordered Doors',
    },
    description: {
      pt: 'Nessa rodada, as portas aparecem a cada 30 segundos, e os jogadores só podem escolher cada porta dentro desses 30 segundos.',
      en: 'This round, the doors appear every 30 seconds, and players can only choose each door within those 30 seconds.',
    },
  },
  [TRAPS.RANDOM_INTERJECTION]: {
    id: TRAPS.RANDOM_INTERJECTION,
    level: 3,
    target: 'guess',
    setup: 'fullstack',
    note: 'A random card is added to the clues',
    icon: 'magicCandles',
    title: {
      pt: 'O Intruso',
      en: 'The Deceiving Intruder',
    },
    description: {
      pt: 'Nessa rodada, uma página aleatória será adicionada às páginas do jogador possuído e vocês não saberão qual é a pra ignorar.',
      en: "This round, one page will be randomly added to the possessed player's selected pages and you will not know which one you are supposed to ignore.",
    },
  },
  [TRAPS.SHUFFLED_DOORS]: {
    id: TRAPS.SHUFFLED_DOORS,
    level: 3,
    target: 'guess',
    setup: 'fullstack',
    note: 'Each player sees the doors in a different order',
    icon: 'magicTarotCards',
    title: {
      pt: 'As Portas Embaralhadas',
      en: 'The Shuffled Doors',
    },
    description: {
      pt: 'Cada jogador vê as portas em uma ordem diferente.',
      en: 'Each player sees the doors in a different order.',
    },
  },
  [TRAPS.FLIP_BOOK]: {
    id: TRAPS.FLIP_BOOK,
    level: 3,
    target: 'clue',
    setup: 'frontend',
    note: 'Possessed player can only see one page at a time and decide if they want to keep them or not',
    icon: 'magicDivination',
    title: {
      pt: 'O Livro Paginado',
      en: 'The Flip Book',
    },
    description: {
      pt: 'O jogador possuído pode ver apenas duas páginas por vez e decidir se quer mantê-las ou não.',
      en: 'The possessed player can only see two pages at a time and decide if they want to keep them or not.',
    },
  },
};
