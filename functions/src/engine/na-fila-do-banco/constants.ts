export const NA_FILA_DO_BANCO_PHASES = {
  RULES: 'RULES',
  SETUP: 'SETUP',
  CARD_PLAY: 'CARD_PLAY',
  ROUND_RESOLUTION: 'ROUND_RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

export const NA_FILA_DO_BANCO_ACTIONS = {
  PLAY_CARD: 'PLAY_CARD',
} as const;

export const NA_FILA_DO_BANCO_ACHIEVEMENTS = {
  MOST_RETIREE_CARDS: 'MOST_RETIRE_CARDS',
  MOST_VETERAN_CARDS: 'MOST_VETERAN_CARDS',
  MOST_MOTHER_CARDS: 'MOST_MOTHER_CARDS',
  MOST_BUSINESSMAN_CARDS: 'MOST_BUSINESSMAN_CARDS',
  MOST_STUDENT_CARDS: 'MOST_STUDENT_CARDS',
  MOST_MOTOBOY_CARDS: 'MOST_MOTOBOY_CARDS',
  MOST_KID_CARDS: 'MOST_KID_CARDS',
  MOST_OWN_COLOR_CARDS: 'MOST_OWN_COLOR_CARDS',
  MOST_NEUTRAL_COLOR_CARDS: 'MOST_NEUTRAL_COLOR_CARDS',
  MOST_CUT_INS: 'MOST_CUT_INS',
  MOST_GOT_CUT: 'MOST_GOT_CUT',
  MOST_STAYS: 'MOST_STAYS',
  MOST_ONLINE_TRIGGERS: 'MOST_ONLINE_TRIGGERS',
} as const;

export const OUTCOME = {
  SETUP: 'SETUP',
  CONTINUE: 'CONTINUE',
  END_ROUND: 'END_ROUND',
} as const;

export const CHARACTER_TYPES = {
  KID: 'KID',
  RETIREE: 'RETIREE',
  VETERAN: 'VETERAN',
  MOTHER: 'MOTHER',
  BUSINESSMAN: 'BUSINESSMAN',
  STUDENT: 'STUDENT',
  MOTOBOY: 'MOTOBOY',
} as const;

// What character cuts in front of what character
export const CUT_IN_HIERARCHY: Record<string, string> = {
  [CHARACTER_TYPES.RETIREE]: CHARACTER_TYPES.VETERAN,
  [CHARACTER_TYPES.VETERAN]: CHARACTER_TYPES.MOTHER,
  [CHARACTER_TYPES.MOTHER]: CHARACTER_TYPES.BUSINESSMAN,
  [CHARACTER_TYPES.BUSINESSMAN]: CHARACTER_TYPES.STUDENT,
  [CHARACTER_TYPES.STUDENT]: CHARACTER_TYPES.MOTOBOY,
  [CHARACTER_TYPES.MOTOBOY]: CHARACTER_TYPES.RETIREE,
};

export const TELLER_TYPES = {
  A: 'a', // High capacity, low points
  B: 'b', // Normal capacity, normal points
  C: 'c', // Low capacity, double points
};

export const CARD_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'brown'];

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 5,
};

export const TOTAL_ROUNDS = 3;

export const ONLINE_TRIGGER_POINTS = 1;
export const ONLINE_TRIGGER_POINTS_KID = 2;

/**
 * Original game conversion
 * Kid -> Kid
 * Girl -> Retiree Woman
 * Boy ->  Retiree Man (Disabled man)
 * Woman -> Mother with baby
 * Man -> Businesswoman
 * Grandma -> Student girl
 * Grandpa -> Motoboy
 */
export const TELLERS = [
  {
    id: TELLER_TYPES.A,
    type: 'teller',
    capacitiesPerRound: {
      1: [3, 3, 5, 5],
      2: [3, 3, 4, 5, 6],
      3: [4, 4, 5, 6, 6],
    },
    doublers: [CHARACTER_TYPES.RETIREE, CHARACTER_TYPES.VETERAN],
  },
  {
    id: TELLER_TYPES.B,
    type: 'teller',
    capacitiesPerRound: {
      1: [2, 2, 3, 4, 4],
      2: [3, 3, 4, 5, 5],
      3: [5, 5, 7, 7],
    },
    doublers: [CHARACTER_TYPES.BUSINESSMAN, CHARACTER_TYPES.MOTOBOY],
  },
  {
    id: TELLER_TYPES.C,
    type: 'teller',
    capacitiesPerRound: {
      1: [2, 2, 3, 4, 4],
      2: [4, 4, 6, 6],
      3: [4, 4, 5, 6, 6],
    },
    doublers: [CHARACTER_TYPES.MOTHER, CHARACTER_TYPES.STUDENT],
  },
];

export const TELLER_EFFECT_TYPE = {
  STAY: 'STAY',
  CUT_IN_FRONT: 'CUT_IN_FRONT',
  BRING_NEXT_TO_ME: 'BRING_NEXT_TO_ME',
  REMOVE_THREE: 'REMOVE_THREE',
  BRING_NEXT_TO_ME_AND_REMOVE_THREE: 'BRING_NEXT_TO_ME_AND_REMOVE_THREE',
};

// SETUP
// Build deck with 35 cards (one of each type)
// Define turn order

// ROUND
// Reshuffle deck
// Build tellers (use the first 3 capacity for 3 players, 4 for 4 players and 5 for 5 players)
// Each player gets 2 cards in their hand at the start of the game, it cannot be a KID
// Each teller gets a card in front of them to start the line, it cannot be a KID
// Make a draw deck with the remaining cards, it will have all the KID cards.
// Define next player

// On their turn, a player must play a card from their hand to one of the tellers
// Apply cut-in rules based on the card, KID rule, or ONLINE rule if applicable, in this order
// Cut-in rules are based on the hierarchy defined in CUT_IN_HIERARCHY, if the card played can cut in front of any card in the line, it does so. If it cannot cut in front of any card, it goes to the end of the line.
// KID rule: When a kid is played in a line with another card of the same color as the kid, that card goes to the end of the line next to the kid.
// ONLINE "we can do this online": If 3 people of the same type are in the same line, they are removed from the line and placed in the discard pile. The player who triggered it gets 1 points. (2 points if it was a set of KIDs).

// Round ends when the deck is empty and all players have only 1 card in hand.
// Cards who met the capacity score points for that teller. If there's a doubler in the line, points are doubled. Kids always score 0.
