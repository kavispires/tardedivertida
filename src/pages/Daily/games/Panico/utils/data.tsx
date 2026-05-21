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
  targetCount: number;
  /**
   * The expected action the player must take for this button to be considered correct. This is used for validation and feedback purposes.
   */
  expectedAction: 'PRESS' | 'DO_NOT_PRESS' | 'MULTI_PRESS' | 'PRESS_LESS' | 'PRESS_MORE' | 'ANY' | 'TBD';
  /**
   * When to verify if the action was correct. IMMEDIATE means the game checks as soon as the player finishes interacting with the button (e.g., after releasing it). DEFAULT means the game checks only after the full timer duration has elapsed, regardless of when the player interacts with the button.
   */
  verification: 'IMMEDIATE' | 'DEFAULT';
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
  /**
   * Optional variant for styling purposes (e.g., to indicate a red button that must not be pressed)
   */
  buttonVariant?: string;
  /**
   * When a button is TBD, it needs a resolver
   */
  resolver?:
    | 'PREVIOUS_BUTTON_PRESS_COUNT'
    | 'POOL_KEYWORD_MATCH'
    | 'POOL_KEYWORD_MATCH_REVERSE'
    | 'NEXT_IS_LIE'
    | (string & NonNullable<unknown>);
};

export const BUTTONS_DICT: Record<string, ButtonDictionaryEntry> = {
  BASIC_PRESS: {
    key: 'BASIC_PRESS',
    category: 'standard',
    doc: 'Simple button that the player must press.',
    targetCount: 1,
    expectedAction: 'PRESS',
    verification: 'IMMEDIATE',
    maxOccurrence: 2,
    durationScale: 'normal',
  },
  BASIC_DO_NOT_PRESS: {
    key: 'BASIC_DO_NOT_PRESS',
    category: 'standard',
    doc: 'Button that the player must NOT press.',
    targetCount: 0,
    expectedAction: 'DO_NOT_PRESS',
    verification: 'DEFAULT',
    maxOccurrence: 2,
    durationScale: 'normal',
  },
  FINAL_PRESS: {
    key: 'FINAL_PRESS',
    category: 'standard',
    doc: 'The final button that the player must press.',
    targetCount: 1,
    expectedAction: 'PRESS',
    verification: 'DEFAULT',
    maxOccurrence: 0, // Only appears at the end of the sequence
    durationScale: 'normal',
  },
  SAME_AS_PREVIOUS: {
    key: 'SAME_AS_PREVIOUS',
    category: 'memory',
    doc: 'The player must press a button the same number of times as the previous button.',
    targetCount: -2,
    expectedAction: 'TBD',
    verification: 'DEFAULT',
    maxOccurrence: 2,
    durationScale: 'normal',
    resolver: 'PREVIOUS_BUTTON_PRESS_COUNT',
  },
  // NEXT_IS_LIE: {
  //   key: 'NEXT_IS_LIE',
  //   category: 'trick',
  //   doc: 'The instructions on the next button are a lie.',
  //   expectedAction: 'TBD',
  //   verification: 'DEFAULT',
  //   targetCount: 0,
  //   maxOccurrence: 1,
  //   durationScale: 'normal',
  //   resolver: 'NEXT_IS_LIE',
  // },
  TRICK_POLITE_DO_NOT_PRESS: {
    key: 'TRICK_POLITE_DO_NOT_PRESS',
    category: 'trick',
    doc: 'Asks politely not to be pressed.',
    expectedAction: 'DO_NOT_PRESS',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  QUICK_DO_NOT_PRESS: {
    key: 'QUICK_DO_NOT_PRESS',
    category: 'trick',
    doc: 'Asks to quickly not press.',
    expectedAction: 'DO_NOT_PRESS',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'quick',
  },
  LOGIC_HUMAN_TRUE: {
    key: 'LOGIC_HUMAN_TRUE',
    category: 'question',
    doc: 'Asks if player is human.',
    expectedAction: 'PRESS',
    verification: 'IMMEDIATE',
    targetCount: 1,
    maxOccurrence: 1,
    durationScale: 'quick',
    eitherOr: ['LOGIC_HUMAN_FALSE'],
  },
  LOGIC_HUMAN_FALSE: {
    key: 'LOGIC_HUMAN_FALSE',
    category: 'question',
    doc: 'Asks if player is not human.',
    expectedAction: 'DO_NOT_PRESS',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'quick',
    eitherOr: ['LOGIC_HUMAN_TRUE'],
  },
  LOGIC_ROBOT_TRUE: {
    key: 'LOGIC_ROBOT_TRUE',
    category: 'question',
    doc: 'Asks if player is a robot.',
    expectedAction: 'DO_NOT_PRESS',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'quick',
    eitherOr: ['LOGIC_ROBOT_FALSE'],
  },
  LOGIC_ROBOT_FALSE: {
    key: 'LOGIC_ROBOT_FALSE',
    category: 'question',
    doc: 'Asks if player is not a robot.',
    expectedAction: 'PRESS',
    verification: 'IMMEDIATE',
    targetCount: 1,
    maxOccurrence: 1,
    durationScale: 'quick',
    eitherOr: ['LOGIC_ROBOT_TRUE'],
  },
  COUNT_SENTENCE: {
    key: 'COUNT_SENTENCE',
    category: 'logic',
    doc: 'Player must press the button for the number of words in the sentence',
    expectedAction: 'MULTI_PRESS',
    verification: 'DEFAULT',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'SENTENCES_FOR_COUNTING',
  },
  PRESS_LESS: {
    key: 'PRESS_LESS',
    category: 'conditional',
    doc: 'Player must press this button less than the number of times displayed',
    expectedAction: 'PRESS_LESS',
    verification: 'DEFAULT',
    targetCount: -2,
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
    verification: 'DEFAULT',
    targetCount: -2,
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
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'SHAPES_FOR_SIDES_COUNTING',
    eitherOr: ['PRESS_SHAPE_CORNER'],
  },
  PRESS_SHAPE_CORNER: {
    key: 'PRESS_SHAPE_CORNER',
    category: 'count',
    doc: 'An shape is displayed, and press for the number of corners on the same',
    expectedAction: 'MULTI_PRESS',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'SHAPES_FOR_CORNERS_COUNTING',
    eitherOr: ['PRESS_SHAPE_SIDE'],
  },
  PRESS_TARGET_NUMBER: {
    key: 'PRESS_TARGET_NUMBER',
    category: 'math',
    doc: 'A number is displayed, and the player must press the button that many times.',
    expectedAction: 'MULTI_PRESS',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'TARGET_NUMBERS_FOR_PRESSING',
  },
  PRESS_TARGET_COUNTDOWN: {
    key: 'PRESS_TARGET_COUNTDOWN',
    category: 'math',
    doc: 'A number is displayed, and the player must press the button that many times.',
    expectedAction: 'MULTI_PRESS',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'PRESS_TARGET_COUNTDOWN',
  },
  DO_NOT_PRESS_RED_RULE: {
    key: 'DO_NOT_PRESS_RED_RULE',
    category: 'trick',
    doc: 'The button is red, but the player must not press it.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'normal',
    keyword: 'RED',
  },
  RED_BUTTON: {
    key: 'RED_BUTTON',
    category: 'trick',
    doc: 'The button is red, but the player must not press it.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: 1,
    maxOccurrence: 1,
    durationScale: 'quick',
    buttonVariant: 'RED',
    resolver: 'RED',
  },
  YELLOW_BUTTON: {
    key: 'YELLOW_BUTTON',
    category: 'trick',
    doc: 'The button is yellow, but the player must press it.',
    expectedAction: 'PRESS',
    verification: 'IMMEDIATE',
    targetCount: 1,
    maxOccurrence: 1,
    durationScale: 'quick',
    buttonVariant: 'YELLOW',
    eitherOr: ['BLUE_BUTTON'],
  },
  BLUE_BUTTON: {
    key: 'BLUE_BUTTON',
    category: 'trick',
    doc: 'The button is blue, but the player must not press it.',
    expectedAction: 'DO_NOT_PRESS',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'quick',
    buttonVariant: 'BLUE',
    eitherOr: ['YELLOW_BUTTON'],
  },
  REMEMBER_NUMBER: {
    key: 'REMEMBER_NUMBER',
    category: 'memory',
    doc: 'A number is displayed, and the player must remember it to use as the target count for a later button.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: 0,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'NUMBERS_MUST_REMEMBER',
  },
  REMEMBERED_NUMBER: {
    key: 'REMEMBERED_NUMBER',
    category: 'memory',
    doc: 'If the number displayed was the one told to remember, press.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'NUMBERS_MUST_REMEMBER',
    dependsOn: 'REMEMBER_NUMBER',
    resolver: 'POOL_KEYWORD_MATCH',
  },
  COUNT_VOWELS: {
    key: 'COUNT_VOWELS',
    category: 'logic',
    doc: 'Player must press the button for the number of vowels in the word displayed.',
    expectedAction: 'MULTI_PRESS',
    verification: 'DEFAULT',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'WORDS_FOR_VOWEL_COUNTING',
    eitherOr: ['COUNT_CONSONANTS'],
  },
  COUNT_CONSONANTS: {
    key: 'COUNT_CONSONANTS',
    category: 'logic',
    doc: 'Player must press the button for the number of consonants in the word displayed.',
    expectedAction: 'MULTI_PRESS',
    verification: 'DEFAULT',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'WORDS_FOR_CONSONANT_COUNTING',
    eitherOr: ['COUNT_VOWELS'],
  },
  EQUATION_RESULT: {
    key: 'EQUATION_RESULT',
    category: 'math',
    doc: 'An equation is displayed, and the player must solve it and press the button the number of times corresponding to the result.',
    expectedAction: 'MULTI_PRESS',
    verification: 'DEFAULT',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'EQUATIONS_TO_SOLVE',
  },
  ALL_ODD_NUMBERS: {
    key: 'ALL_ODD_NUMBERS',
    category: 'trick',
    doc: 'All numbers displayed are odd, but the player must press only for the even ones.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'ALL_ODD_NUMBERS',
    eitherOr: ['ALL_EVEN_NUMBERS'],
  },
  ALL_EVEN_NUMBERS: {
    key: 'ALL_EVEN_NUMBERS',
    category: 'trick',
    doc: 'All numbers displayed are even, but the player must press only for the odd ones.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'ALL_EVEN_NUMBERS',
    eitherOr: ['ALL_ODD_NUMBERS'],
  },
  WHEN_YOU_SEE_RULE: {
    key: 'WHEN_YOU_SEE_RULE',
    category: 'trick',
    doc: 'In the future, when an icon appears, the player must press.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: -1,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_SEE',
  },
  SEE_SOMETHING_PRESS: {
    key: 'SEE_SOMETHING_PRESS',
    category: 'trick',
    doc: 'An icon is displayed, and if the player has seen it before, they must press.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_SEE',
    dependsOn: 'WHEN_YOU_SEE_RULE',
    eitherOr: ['SEE_SOMETHING_PRESS_TRICK'],
    resolver: 'POOL_KEYWORD_MATCH',
  },
  SEE_SOMETHING_PRESS_TRICK: {
    key: 'SEE_SOMETHING_PRESS_TRICK',
    category: 'trick',
    doc: 'An icon is displayed, but it says do not press, and if the player has seen it before, they must press.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_SEE',
    dependsOn: 'WHEN_YOU_SEE_RULE',
    eitherOr: ['SEE_SOMETHING_PRESS'],
    resolver: 'POOL_KEYWORD_MATCH',
  },
  SEE_SOMETHING_PRESS_ASIDE: {
    key: 'SEE_SOMETHING_PRESS_ASIDE',
    category: 'trick',
    doc: 'An icon is displayed aside from the button, and if the player has seen it before, they must press.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_SEE',
    dependsOn: 'WHEN_YOU_SEE_RULE',
    eitherOr: ['SEE_SOMETHING_PRESS_ASIDE_TRICK'],
    resolver: 'POOL_KEYWORD_MATCH',
  },
  WHEN_YOU_SEE_RULE_AVOID: {
    key: 'WHEN_YOU_SEE_RULE_AVOID',
    category: 'trick',
    doc: 'In the future, when an icon appears, the player must not press.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: -1,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_AVOID',
    eitherOr: ['WHEN_YOU_SEE_RULE'],
  },
  SEE_SOMETHING_PRESS_AVOID: {
    key: 'SEE_SOMETHING_PRESS_AVOID',
    category: 'trick',
    doc: 'An icon is displayed, and if the player has seen it before, they must press.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_AVOID',
    dependsOn: 'WHEN_YOU_SEE_RULE_AVOID',
    resolver: 'POOL_KEYWORD_MATCH_REVERSE',
  },
  SEE_AND_COUNT: {
    key: 'SEE_AND_COUNT',
    category: 'trick',
    doc: 'An icon is displayed, and the player must press for the number of times they have seen it before.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'THINGS_TO_COUNT',
  },
  REMEMBER_SEQUENCE: {
    key: 'REMEMBER_SEQUENCE',
    category: 'memory',
    doc: 'Player is shown a sequence of items and must remember the order.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: -1,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'SEQUENCES_TO_REMEMBER',
  },
  REMEMBERED_SEQUENCE: {
    key: 'REMEMBERED_SEQUENCE',
    category: 'memory',
    doc: 'Player must recall the sequence of items they were shown.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'SEQUENCES_TO_REMEMBER',
    dependsOn: 'REMEMBER_SEQUENCE',
    resolver: 'POOL_KEYWORD_MATCH',
  },
  RANDOM_QUESTION: {
    key: 'RANDOM_QUESTION',
    category: 'question',
    doc: 'A random question is displayed, and the player must answer it correctly by pressing or not pressing the button.',
    expectedAction: 'ANY',
    verification: 'IMMEDIATE',
    targetCount: -1,
    maxOccurrence: 1,
    durationScale: 'normal',
    pool: 'RANDOM_QUESTIONS',
  },
  PRESS_IF_WANTED: {
    key: 'PRESS_IF_WANTED',
    category: 'conditional',
    doc: 'Player can choose to press or not press the button, but if they choose to press, they must press it the number of times displayed.',
    expectedAction: 'ANY',
    verification: 'DEFAULT',
    targetCount: -1,
    maxOccurrence: 1,
    durationScale: 'normal',
  },
  ICON_COMPARISON: {
    key: 'ICON_COMPARISON',
    category: 'logic',
    doc: 'There is a sequence of icons and the player must press or not depending the value is more than the other.',
    expectedAction: 'TBD',
    verification: 'IMMEDIATE',
    targetCount: -2,
    maxOccurrence: 1,
    durationScale: 'long',
    pool: 'ICON_COMPARISONS',
  },
};

// biome-ignore lint/suspicious/noExplicitAny: This is a utility type for button entries, and the generic allows for flexibility in the additional properties that can be included based on the button's pool or specific needs.
export type PoolGroupEntry<T extends Record<string, any> = Record<string, any>> = {
  id: string;
  targetCount: number;
} & T;

const SENTENCES_FOR_COUNTING: Dictionary<PoolGroupEntry<{ text: DualLanguageValue }>> = {
  SENTENCE_1: {
    id: 'SENTENCE_1',
    text: {
      en: 'Press once for each word in this sentence.',
      pt: 'Aperte uma vez para cada palavra nesta frase.',
    },
    targetCount: 8,
  },
  SENTENCE_2: {
    id: 'SENTENCE_2',
    text: {
      en: 'How many words are in here? Press the button that many times.',
      pt: 'Quantas palavras tem aqui? Aperte o botão essa quantidade de vezes, ok?',
    },
    targetCount: 12,
  },
  SENTENCE_3: {
    id: 'SENTENCE_3',
    text: {
      en: 'This sentence has exactly seven words. Press the button seven times.',
      pt: 'Esta frase tem exatamente sete palavras. Aperte o botão sete vezes.',
    },
    targetCount: 7,
  },
  SENTENCE_4: {
    id: 'SENTENCE_4',
    text: {
      en: 'Press once for each word in this sentence, ok?',
      pt: 'Aperte uma vez para cada palavra nesta frase, ok?',
    },
    targetCount: 9,
  },
};

const PRESS_LESS_COMPARISON: Dictionary<PoolGroupEntry> = {
  PRESS_LESS_THAN_2: {
    id: 'PRESS_LESS_THAN_2',
    targetCount: 2,
  },
  PRESS_LESS_THAN_3: {
    id: 'PRESS_LESS_THAN_3',
    targetCount: 3,
  },
  PRESS_LESS_THAN_4: {
    id: 'PRESS_LESS_THAN_4',
    targetCount: 4,
  },
  PRESS_LESS_THAN_5: {
    id: 'PRESS_LESS_THAN_5',
    targetCount: 5,
  },
};

const PRESS_MORE_COMPARISON: Dictionary<PoolGroupEntry> = {
  PRESS_MORE_THAN_2: {
    id: 'PRESS_MORE_THAN_2',
    targetCount: 2,
  },
  PRESS_MORE_THAN_3: {
    id: 'PRESS_MORE_THAN_3',
    targetCount: 3,
  },
  PRESS_MORE_THAN_4: {
    id: 'PRESS_MORE_THAN_4',
    targetCount: 4,
  },
  PRESS_MORE_THAN_5: {
    id: 'PRESS_MORE_THAN_5',
    targetCount: 5,
  },
};

const SHAPES_FOR_SIDES_COUNTING: Dictionary<PoolGroupEntry> = {
  SHAPE_TRIANGLE: {
    id: 'SHAPE_TRIANGLE',
    itemId: 'item-2115',
    targetCount: 3,
  },
  SHAPE_CUBE: {
    id: 'SHAPE_CUBE',
    itemId: 'item-2117',
    targetCount: 6,
  },
  SHAPE_RECTANGLE: {
    id: 'SHAPE_RECTANGLE',
    itemId: 'item-2121',
    targetCount: 4,
  },
  SHAPE_HEXAGON: {
    id: 'SHAPE_HEXAGON',
    itemId: 'item-2119',
    targetCount: 6,
  },
};

const SHAPES_FOR_CORNERS_COUNTING: Dictionary<PoolGroupEntry<{ itemId: string }>> = {
  SHAPE_TRIANGLE: {
    id: 'SHAPE_TRIANGLE',
    itemId: 'item-2115',
    targetCount: 3,
  },
  SHAPE_SQUARE: {
    id: 'SHAPE_SQUARE',
    itemId: 'item-2114',
    targetCount: 4,
  },
  SHAPE_RHOMBUS: {
    id: 'SHAPE_RHOMBUS',
    itemId: 'item-2122',
    targetCount: 4,
  },
  SHAPE_HEXAGON: {
    id: 'SHAPE_HEXAGON',
    itemId: 'item-2119',
    targetCount: 6,
  },
};

const TARGET_NUMBERS_FOR_PRESSING: Dictionary<PoolGroupEntry<{ text: DualLanguageValue }>> = {
  NUMBER_1: {
    id: 'NUMBER_1',
    targetCount: 1,
    text: {
      en: 'Press exactly once',
      pt: 'Aperte exatamente uma vez',
    },
  },
  NUMBER_2: {
    id: 'NUMBER_2',
    targetCount: 2,
    text: {
      en: 'Press exactly twice',
      pt: 'Aperte exatamente duas vezes',
    },
  },
  NUMBER_3: {
    id: 'NUMBER_3',
    targetCount: 3,
    text: {
      en: 'Press exactly three times',
      pt: 'Aperte exatamente três vezes',
    },
  },
  NUMBER_5: {
    id: 'NUMBER_5',
    targetCount: 5,
    text: {
      en: 'Press exactly five times',
      pt: 'Aperte exatamente cinco vezes',
    },
  },
  NUMBER_6: {
    id: 'NUMBER_6',
    targetCount: 6,
    text: {
      en: 'Press exactly six times',
      pt: 'Aperte exatamente seis vezes',
    },
  },
};

const PRESS_TARGET_COUNTDOWN: Dictionary<PoolGroupEntry> = {
  NUMBER_3: {
    id: 'NUMBER_3',
    targetCount: 3,
  },
  NUMVER_4: {
    id: 'NUMVER_4',
    targetCount: 4,
  },
  NUMBER_5: {
    id: 'NUMBER_5',
    targetCount: 5,
  },
  NUMBER__7: {
    id: 'NUMBER_7',
    targetCount: 7,
  },
  NUMBER_10: {
    id: 'NUMBER_10',
    targetCount: 10,
  },
};

const NUMBERS_MUST_REMEMBER: Dictionary<PoolGroupEntry> = {
  NUMBER_TO_REMEMBER_1: {
    id: 'NUMBER_TO_REMEMBER_1',
    targetCount: -1,
    value: '42',
    keyword: '42',
  },
  NUMBER_TO_REMEMBER_2: {
    id: 'NUMBER_TO_REMEMBER_2',
    targetCount: -1,
    value: '17',
    keyword: '17',
  },
  NUMBER_TO_REMEMBER_3: {
    id: 'NUMBER_TO_REMEMBER_3',
    targetCount: -1,
    value: '68',
    keyword: '68',
  },
  NUMBER_TO_REMEMBER_4: {
    id: 'NUMBER_TO_REMEMBER_4',
    targetCount: -1,
    value: '73',
    keyword: '73',
  },
};

const WORDS_FOR_VOWEL_COUNTING: Dictionary<PoolGroupEntry<{ value: string }>> = {
  VOWEL_WORD_1: {
    id: 'VOWEL_WORD_1',
    targetCount: 5,
    value: 'AEIOU',
  },
  VOWEL_WORD_2: {
    id: 'VOWEL_WORD_2',
    targetCount: 3,
    value: 'BANANA',
  },
  VOWEL_WORD_3: {
    id: 'VOWEL_WORD_3',
    targetCount: 3,
    value: 'PODCAST',
  },
  VOWEL_WORD_4: {
    id: 'VOWEL_WORD_4',
    targetCount: 7,
    value: 'PARALELEPÍPEDO',
  },
};

const WORDS_FOR_CONSONANT_COUNTING: Dictionary<PoolGroupEntry<{ value: string }>> = {
  CONSONANT_WORD_1: {
    id: 'CONSONANT_WORD_1',
    targetCount: 0,
    value: 'AEIOU',
  },
  CONSONANT_WORD_2: {
    id: 'CONSONANT_WORD_2',
    targetCount: 3,
    value: 'BANANA',
  },
  CONSONANT_WORD_3: {
    id: 'CONSONANT_WORD_3',
    targetCount: 5,
    value: 'PODCAST',
  },
  CONSONANT_WORD_4: {
    id: 'CONSONANT_WORD_4',
    targetCount: 7,
    value: 'PARALELEPÍPEDO',
  },
};

export const EQUATIONS_TO_SOLVE: Dictionary<PoolGroupEntry<{ value: string }>> = {
  EQUATION_1: {
    id: 'EQUATION_1',
    targetCount: 5,
    value: '2 + 3',
  },
  EQUATION_2: {
    id: 'EQUATION_2',
    targetCount: 4,
    value: '10 - 6',
  },
  EQUATION_3: {
    id: 'EQUATION_3',
    targetCount: 6,
    value: '2 × 3',
  },
  EQUATION_4: {
    id: 'EQUATION_4',
    targetCount: 4,
    value: '8 ÷ 2',
  },
  EQUATION_5: {
    id: 'EQUATION_5',
    targetCount: 4,
    value: '3 + 2 - 1',
  },
  EQUATION_6: {
    id: 'EQUATION_6',
    targetCount: 4,
    value: '2 × (1 + 1)',
  },
  EQUATION_7: {
    id: 'EQUATION_7',
    targetCount: 3,
    value: '1 + 1 + 1 - 1 + 1',
  },
};

const ALL_ODD_NUMBERS: Dictionary<PoolGroupEntry<{ value: string }>> = {
  ALL_ODD_1: {
    id: 'ALL_ODD_1',
    targetCount: 0,
    value: '1, 1, 1, 0, 1',
  },
  ALL_ODD_2: {
    id: 'ALL_ODD_2',
    targetCount: 1,
    value: '3, 19, 17, 9, 11',
  },
  ALL_ODD_3: {
    id: 'ALL_ODD_3',
    targetCount: 0,
    value: '5, 7, 1312, 15, 9',
  },
  ALL_ODD_4: {
    id: 'ALL_ODD_4',
    targetCount: 0,
    value: '33, 55, 77, 99, 101',
  },
};

const ALL_EVEN_NUMBERS: Dictionary<PoolGroupEntry<{ value: string }>> = {
  ALL_EVEN_1: {
    id: 'ALL_EVEN_1',
    targetCount: 1,
    value: '2, 4, 8, 16',
  },
  ALL_EVEN_2: {
    id: 'ALL_EVEN_2',
    targetCount: 1,
    value: '8, 12, 28, 16',
  },
  ALL_EVEN_3: {
    id: 'ALL_EVEN_3',
    targetCount: 0,
    value: '6, 4, 1, 10',
  },
  ALL_EVEN_4: {
    id: 'ALL_EVEN_4',
    targetCount: 0,
    value: '14, 22, 443, 4',
  },
};

const THINGS_TO_SEE: Dictionary<PoolGroupEntry<{ itemId: string; keyword: string; value: string }>> = {
  THING_TO_SEE_1: {
    id: 'THING_TO_SEE_1',
    targetCount: -1,
    itemId: 'item-470',
    keyword: 'SEE_PINWHEEL',
    value: 'SEE_PINWHEEL',
  },
  THING_TO_SEE_2: {
    id: 'THING_TO_SEE_2',
    targetCount: -1,
    itemId: 'item-390',
    keyword: 'SEE_KITE',
    value: 'SEE_KITE',
  },
  THING_TO_SEE_4: {
    id: 'THING_TO_SEE_4',
    targetCount: -1,
    itemId: 'item-1575',
    keyword: 'SEE_RAINBOW',
    value: 'SEE_RAINBOW',
  },
};

const THINGS_TO_AVOID: Dictionary<PoolGroupEntry<{ itemId: string; keyword: string; value: string }>> = {
  THING_TO_AVOID_1: {
    id: 'THING_TO_AVOID_1',
    targetCount: -1,
    itemId: 'item-135',
    keyword: 'SEE_COCKROACH',
    value: 'SEE_COCKROACH',
  },
  THING_TO_AVOID_2: {
    id: 'THING_TO_AVOID_2',
    targetCount: -1,
    itemId: 'item-304',
    keyword: 'SEE_DYNAMITE',
    value: 'SEE_DYNAMITE',
  },
  THING_TO_AVOID_3: {
    id: 'THING_TO_AVOID_3',
    targetCount: -1,
    itemId: 'item-276',
    keyword: 'AVOID_GHOST',
    value: 'AVOID_GHOST',
  },
};

const THINGS_TO_COUNT: Dictionary<PoolGroupEntry<{ itemId: string }>> = {
  THING_TO_COUNT_1: {
    id: 'THING_TO_COUNT_1',
    targetCount: 3,
    itemId: 'item-14', // strawberry
  },
  THING_TO_COUNT_2: {
    id: 'THING_TO_COUNT_2',
    targetCount: 4,
    itemId: 'item-621', // orange
  },
  THING_TO_COUNT_3: {
    id: 'THING_TO_COUNT_3',
    targetCount: 5,
    itemId: 'item-1858', // apple
  },
};

export const SEQUENCES_TO_REMEMBER: Dictionary<
  PoolGroupEntry<{ value: string; keyword: string; itemsIds: string[] }>
> = {
  THING_SEQUENCE_1: {
    id: 'THING_SEQUENCE_1',
    targetCount: -1,
    value: 'MOON_MOON_SUN_MOON_SUN',
    keyword: 'MOON_MOON_SUN_MOON_SUN',
    itemsIds: ['item-1059', 'item-1059', 'item-1054', 'item-1059', 'item-1054'],
  },
  THING_SEQUENCE_2: {
    id: 'THING_SEQUENCE_2',
    targetCount: -1,
    value: 'MOON_SUN_SUN_MOON_MOON',
    keyword: 'MOON_SUN_SUN_MOON_MOON',
    itemsIds: ['item-1059', 'item-1054', 'item-1054', 'item-1059', 'item-1059'],
  },
  THING_SEQUENCE_3: {
    id: 'THING_SEQUENCE_3',
    targetCount: -1,
    value: 'SUN_SUN_MOON_SUN_MOON',
    keyword: 'SUN_SUN_MOON_SUN_MOON',
    itemsIds: ['item-1054', 'item-1054', 'item-1059', 'item-1054', 'item-1059'],
  },
  THING_SEQUENCE_4: {
    id: 'THING_SEQUENCE_4',
    targetCount: -1,
    value: 'SUN_MOON_SUN_MOON_SUN',
    keyword: 'SUN_MOON_SUN_MOON_SUN',
    itemsIds: ['item-1054', 'item-1059', 'item-1054', 'item-1059', 'item-1054'],
  },
};

export const RANDOM_QUESTIONS: Dictionary<PoolGroupEntry<{ text: DualLanguageValue }>> = {
  RANDOM_QUESTION_1: {
    id: 'RANDOM_QUESTION_1',
    targetCount: -1,
    text: {
      en: 'Press if you think you are beautiful',
      pt: 'Pressione se você acha que é bonito',
    },
  },
  RANDOM_QUESTION_2: {
    id: 'RANDOM_QUESTION_2',
    targetCount: -1,
    text: {
      en: "Press if you think it's gonna rain tomorrow",
      pt: 'Pressione se você acha que vai chover amanhã',
    },
  },
  RANDOM_QUESTION_3: {
    id: 'RANDOM_QUESTION_3',
    targetCount: -1,
    text: {
      en: 'Press if you think water is wet',
      pt: 'Pressione se você acha que a água é molhada',
    },
  },
  RANDOM_QUESTION_4: {
    id: 'RANDOM_QUESTION_4',
    targetCount: -1,
    text: {
      en: "Press if you think you're smart",
      pt: 'Pressione se você acha que é inteligente',
    },
  },
};

const ICON_COMPARISONS: Dictionary<PoolGroupEntry<{ value: DualLanguageValue; itemsIds: string[] }>> = {
  COMPARISON_1: {
    id: 'COMPARISON_1',
    targetCount: 0,
    value: {
      en: 'truffle',
      pt: 'brigadeiro',
    },
    itemsIds: ['item-837', 'item-837', 'item-1723'],
  },
  COMPARISON_2: {
    id: 'COMPARISON_2',
    targetCount: 0,
    value: {
      en: 'truffle',
      pt: 'brigadeiro',
    }, // 3 brigadeiros vs 1 3-candies
    itemsIds: ['item-837', 'item-837', 'item-837', 'item-1723', 'item-837'],
  },
  COMPARISON_3: {
    id: 'COMPARISON_3',
    targetCount: 1,
    value: {
      en: 'truffle',
      pt: 'brigadeiro',
    }, // 4 brigadeiros vs 1 3-candies
    itemsIds: ['item-837', 'item-1723', 'item-837', 'item-837', 'item-837'],
  },
  COMPARISON_4: {
    id: 'COMPARISON_4',
    targetCount: 0,
    value: {
      en: 'jujuba',
      pt: 'jujuba',
    }, // 1 3-candies vs 4 brigadeiros
    itemsIds: ['item-837', 'item-1723', 'item-837', 'item-837', 'item-837'],
  },
  COMPARISON_5: {
    id: 'COMPARISON_5',
    targetCount: 1,
    value: {
      en: 'jujuba',
      pt: 'jujuba',
    }, // 1 3-candies vs 2 brigadeiros
    itemsIds: ['item-837', 'item-1723', 'item-837'],
  },
};

export const POOLS: Dictionary<Dictionary<PoolGroupEntry>> = {
  SENTENCES_FOR_COUNTING,
  PRESS_LESS_COMPARISON,
  PRESS_MORE_COMPARISON,
  SHAPES_FOR_SIDES_COUNTING,
  SHAPES_FOR_CORNERS_COUNTING,
  TARGET_NUMBERS_FOR_PRESSING,
  PRESS_TARGET_COUNTDOWN,
  NUMBERS_MUST_REMEMBER,
  WORDS_FOR_VOWEL_COUNTING,
  WORDS_FOR_CONSONANT_COUNTING,
  EQUATIONS_TO_SOLVE,
  ALL_ODD_NUMBERS,
  ALL_EVEN_NUMBERS,
  THINGS_TO_SEE,
  THINGS_TO_AVOID,
  THINGS_TO_COUNT,
  SEQUENCES_TO_REMEMBER,
  RANDOM_QUESTIONS,
  ICON_COMPARISONS,
};
