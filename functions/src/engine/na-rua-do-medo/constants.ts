export const NA_RUA_DO_MEDO_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  TRICK_OR_TREAT: 'TRICK_OR_TREAT',
  RESULT: 'RESULT',
  STREET_END: 'STREET_END',
  GAME_OVER: 'GAME_OVER',
};

export const PLAYER_COUNT = {
  MIN: 3,
  MAX: 10,
};

export const MAX_ROUNDS = 5;

export const SHORT_GAME_ROUNDS = 3;

export const CANDY_VALUES = [1, 2, 3, 4, 5, 5, 5, 7, 7, 7, 8, 9, 10, 11, 11, 12, 13, 14, 15, 17, 19];

export const JACKPOT_VALUES = [5, 8, 10, 12, 15];

export const CARD_KEY_PREFIX = 'nrdm';

export const HORROR_SETS = [
  [
    { en: 'Alien', pt: 'Alienígena' },
    { en: 'Monster', pt: 'Monstro' },
    { en: 'Zombie', pt: 'Zumbi' },
  ],
  [
    { en: 'Werewolf', pt: 'Lobisomem' },
    { en: 'Skeleton', pt: 'Esqueleto' },
    { en: 'Nun', pt: 'Freira' },
  ],
  [
    { en: 'Jack', pt: 'Homem-abóbora' },
    { en: 'Witch', pt: 'Bruxa' },
    { en: 'Scarecrow', pt: 'Espantalho' },
  ],
  [
    { en: 'Vampire', pt: 'Vampiro' },
    { en: 'Mummy', pt: 'Múmia' },
    { en: 'Ghost', pt: 'Fantasma' },
  ],
  [
    { en: 'Clown', pt: 'Palhaço' },
    { en: 'Cyclops', pt: 'Ciclope' },
    { en: 'Devil', pt: 'Diabo' },
  ],
];

export const OUTCOME_STATUS = {
  CONTINUE: 'CONTINUE',
  NEW_STREET: 'NEW_STREET',
  END_STREET: 'END_STREET',
};

export const DECISIONS = {
  CONTINUE: 'CONTINUE',
  GO_HOME: 'GO_HOME',
  HOME: 'HOME',
};
