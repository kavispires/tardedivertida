// Components
import { Translate } from 'components/language/Translate';

export type ButtonDictionaryEntry = {
  /**
   * Unique key identifier of the button type
   */
  key: string;
  /**
   * The category of the button
   */
  category: 'standard' | 'trick' | 'memory' | 'logic' | 'question' | 'conditional' | 'math' | 'count';
  /**
   * Description of the button
   */
  doc: string;
  /**
   * Number of required presses
   * -1 means that it doesn't matter how many times the button is pressed, it's always correct
   * -2 means the player must press the button the same number of times as the previous button
   */
  pressCount: number;
  /**
   * The expected action the player must take for this button to be considered correct. This is used for validation and feedback purposes.
   */
  expectedAction: 'PRESS' | 'DO_NOT_PRESS' | 'MULTI_PRESS' | 'PRESS_LESS' | 'PRESS_MORE' | 'ANY' | 'TBD';
  /**
   * Maximum number of occurrences of this button in the sequence. Most are 1.
   */
  maxOccurrence: number;
  /**
   * Duration scale that affects the button time to complete the task
   */
  durationScale: 'quick' | 'normal' | 'long';
  /**
   * Optional array of keywords that creates conditions on other buttons.
   */
  keyword?: string; // Optional array of keywords to help players identify the button
  /**
   * Optional key of another button that must appear before this one in the sequence
   */
  dependsOn?: string; // Optional key of another button that this button's correctness depends on
  /**
   * Optional array of keys of other buttons that this button is mutually exclusive with (i.e., only one of them can be correct in the sequence)
   */
  eitherOr?: string[];
  /**
   * Use a specific set of data that the game randomly picks an item to use in the game
   */
  pool?: string;
};

export const BUTTONS_DICT: Record<string, ButtonDictionaryEntry> = {
  BASIC_PRESS: {
    key: 'BASIC_PRESS',
    category: 'standard',
    doc: 'Simple button that the player must press.',
    pressCount: 1,
    expectedAction: 'PRESS',
    maxOccurrence: 2,
    durationScale: 'normal',
  },
  BASIC_DO_NOT_PRESS: {
    key: 'BASIC_DO_NOT_PRESS',
    category: 'standard',
    doc: 'Button that the player must NOT press.',
    pressCount: 0,
    expectedAction: 'DO_NOT_PRESS',
    maxOccurrence: 2,
    durationScale: 'normal',
  },
  SAME_AS_PREVIOUS: {
    key: 'SAME_AS_PREVIOUS',
    category: 'memory',
    doc: 'The player must press a button the same number of times as the previous button.',
    pressCount: -2,
    expectedAction: 'TBD',
    maxOccurrence: 2,
    durationScale: 'normal',
  },
  TRICK_POLITE_DO_NOT_PRESS: {
    key: 'TRICK_POLITE_DO_NOT_PRESS',
    category: 'trick',
    doc: 'Asks politely not to be pressed.',
    expectedAction: 'DO_NOT_PRESS',
    pressCount: 0,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  QUICK_DO_NOT_PRESS: {
    key: 'QUICK_DO_NOT_PRESS',
    category: 'trick',
    doc: 'Asks to quickly not press.',
    expectedAction: 'DO_NOT_PRESS',
    pressCount: 0,
    maxOccurrence: 2,
    durationScale: 'quick',
  },
  LOGIC_HUMAN_TRUE: {
    key: 'LOGIC_HUMAN_TRUE',
    category: 'question',
    doc: 'Asks if player is human.',
    expectedAction: 'PRESS',
    pressCount: 1,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  LOGIC_HUMAN_FALSE: {
    key: 'LOGIC_HUMAN_FALSE',
    category: 'question',
    doc: 'Asks if player is not human.',
    expectedAction: 'DO_NOT_PRESS',
    pressCount: 0,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  LOGIC_ROBOT_TRUE: {
    key: 'LOGIC_ROBOT_TRUE',
    category: 'question',
    doc: 'Asks if player is a robot.',
    expectedAction: 'DO_NOT_PRESS',
    pressCount: 0,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  LOGIC_ROBOT_FALSE: {
    key: 'LOGIC_ROBOT_FALSE',
    category: 'question',
    doc: 'Asks if player is not a robot.',
    expectedAction: 'PRESS',
    pressCount: 1,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  COUNT_SENTENCE: {
    key: 'COUNT_SENTENCE',
    category: 'logic',
    doc: 'Player must press the button for the number of words in the sentence',
    expectedAction: 'MULTI_PRESS',
    pressCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'SENTENCES_FOR_COUNTING',
  },
  PRESS_LESS: {
    key: 'PRESS_LESS',
    category: 'conditional',
    doc: 'Player must press this button less than the number of times displayed',
    expectedAction: 'PRESS_LESS',
    pressCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'PRESS_LESS_COMPARISON',
    eitherOr: ['PRESS_MORE'],
  },
  PRESS_MORE: {
    key: 'PRESS_MORE',
    category: 'conditional',
    doc: 'Player must press this button more than the number of times displayed',
    expectedAction: 'PRESS_MORE',
    pressCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'PRESS_MORE_COMPARISON',
    eitherOr: ['PRESS_LESS'],
  },
  PRESS_SHAPE_SIDE: {
    key: 'PRESS_SHAPE_SIDE',
    category: 'count',
    doc: 'An shape is displayed, and press for the number of sides on the same',
    expectedAction: 'MULTI_PRESS',
    pressCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'SHAPES_FOR_SIDES_COUNTING',
  },
  PRESS_SHAPE_CORNER: {
    key: 'PRESS_SHAPE_CORNER',
    category: 'count',
    doc: 'An shape is displayed, and press for the number of corners on the same',
    expectedAction: 'MULTI_PRESS',
    pressCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'SHAPES_FOR_CORNERS_COUNTING',
  },
  // COUNT_WORDS: {
  //   key: 'COUNT_WORDS',
  //   category: 'logic',
  //   doc: 'Player must press the button for the number of words displayed on the button',
  //   pressCount: -2,
  //   maxOccurrence: 1,
  //   durationScale: 'long',
  //   pool: 'WORDS',
  // }
};

export const SENTENCES_FOR_COUNTING: Dictionary<{ id: string; text: DualLanguageValue; pressCount: number }> =
  {
    SENTENCE_1: {
      id: 'SENTENCE_1',
      text: {
        en: 'Press once for each word in this sentence.',
        pt: 'Aperte uma vez para cada palavra nesta frase.',
      },
      pressCount: 8,
    },
    SENTENCE_2: {
      id: 'SENTENCE_2',
      text: {
        en: 'How many words are in here? Press the button that many times.',
        pt: 'Quantas palavras tem aqui? Aperte o botão essa quantidade de vezes, ok?.',
      },
      pressCount: 12,
    },
    SENTENCE_3: {
      id: 'SENTENCE_3',
      text: {
        en: 'This sentence has exactly seven words. Press the button seven times.',
        pt: 'Esta frase tem exatamente sete palavras. Aperte o botão sete vezes.',
      },
      pressCount: 7,
    },
    SENTENCE_4: {
      id: 'SENTENCE_4',
      text: {
        en: 'Press once for each word in this sentence, ok?',
        pt: 'Aperte uma vez para cada palavra nesta frase, ok?',
      },
      pressCount: 9,
    },
  };

export const PRESS_LESS_COMPARISON: Dictionary<{ id: string; pressCount: number }> = {
  PRESS_LESS_THAN_2: {
    id: 'PRESS_LESS_THAN_2',
    pressCount: 2,
  },
  PRESS_LESS_THAN_3: {
    id: 'PRESS_LESS_THAN_3',
    pressCount: 3,
  },
  PRESS_LESS_THAN_4: {
    id: 'PRESS_LESS_THAN_4',
    pressCount: 4,
  },
  PRESS_LESS_THAN_5: {
    id: 'PRESS_LESS_THAN_5',
    pressCount: 5,
  },
};

export const PRESS_MORE_COMPARISON: Dictionary<{ id: string; pressCount: number }> = {
  PRESS_MORE_THAN_1: {
    id: 'PRESS_MORE_THAN_1',
    pressCount: 1,
  },
  PRESS_MORE_THAN_2: {
    id: 'PRESS_MORE_THAN_2',
    pressCount: 2,
  },
  PRESS_MORE_THAN_3: {
    id: 'PRESS_MORE_THAN_3',
    pressCount: 3,
  },
  PRESS_MORE_THAN_4: {
    id: 'PRESS_MORE_THAN_4',
    pressCount: 4,
  },
};

export const SHAPES_FOR_SIDES_COUNTING: Dictionary<{ id: string; itemId: string; pressCount: number }> = {
  SHAPE_TRIANGLE: {
    id: 'SHAPE_TRIANGLE',
    itemId: 'item-2115',
    pressCount: 3,
  },
  SHAPE_SQUARE: {
    id: 'SHAPE_SQUARE',
    itemId: 'item-2114',
    pressCount: 4,
  },
  SHAPE_RECTANGLE: {
    id: 'SHAPE_RECTANGLE',
    itemId: 'item-2121',
    pressCount: 5,
  },
  SHAPE_HEXAGON: {
    id: 'SHAPE_HEXAGON',
    itemId: 'item-2119',
    pressCount: 6,
  },
};

export const SHAPES_FOR_CORNERS_COUNTING: Dictionary<{ id: string; itemId: string; pressCount: number }> = {
  SHAPE_TRIANGLE: {
    id: 'SHAPE_TRIANGLE',
    itemId: 'item-2115',
    pressCount: 3,
  },
  SHAPE_SQUARE: {
    id: 'SHAPE_SQUARE',
    itemId: 'item-2114',
    pressCount: 4,
  },
  SHAPE_RHOMBUS: {
    id: 'SHAPE_RHOMBUS',
    itemId: 'item-2122',
    pressCount: 4,
  },
  SHAPE_HEXAGON: {
    id: 'SHAPE_HEXAGON',
    itemId: 'item-2119',
    pressCount: 6,
  },
};
