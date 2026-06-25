/**
 * Firestore collection and document name constants
 *
 * Centralized references to global and data document names used throughout the application
 */

/**
 * Global collection document names for tracking used resources
 */
export const GLOBAL_USED_DOCUMENTS = {
  ADJECTIVES: 'usedAdjectives',
  ALIEN_ITEMS: 'usedAlienItems',
  ARTE_RUIM: 'usedArteRuimCards',
  CHALLENGES: 'usedChallenges',
  CONTENDERS: 'usedContenders',
  GROUP_QUESTIONS: 'usedGroupQuestions',
  IMAGE_CARDS: 'usedImageCards',
  ITEMS: 'usedItems',
  MONSTERS: 'usedMonsters',
  MOVIES: 'usedMoviesAndReviews',
  MURDER_OBJECTS: 'usedMurderObjects',
  OPPOSING_IDEAS: 'usedOpposingIdeas',
  SINGLE_WORDS: 'usedSingleWords',
  SUSPECTS: 'usedSuspects',
  TESTIMONY_QUESTIONS: 'usedTestimonyQuestions',
} as const;

/**
 * Data collection document names for game resources and seed data
 */
export const DATA_DOCUMENTS = {
  CONTENDERS_GLYPHS: 'contendersGlyphs',
  ALIEN_ITEMS: 'alienItems',
  CARDS_CLUES_EN: 'cardsCluesEN',
  CARDS_CLUES_PT: 'cardsCluesPT',
  IMAGE_CARDS_CLUES_EN: 'imageCardsCluesEN',
  IMAGE_CARDS_CLUES_PT: 'imageCardsCluesPT',
  IMAGE_CARDS_RELATIONSHIPS: 'imageCardsRelationships',
  IMAGE_CARDS_RELATIONSHIPS_DAILY: 'imageCardsRelationshipsDaily',
  OPPOSING_IDEAS_CLUES: 'opposingIdeasClues',
  SUFFIX_COUNTS: 'suffixCounts',
  SUSPECT_ANSWERS: 'suspectAnswers',
  DRAWINGS: 'drawings', // requires language suffix
  MONSTER_DRAWINGS: 'monsterDrawings',
  PAIRS: 'pairs',
  SIGNS: 'signs', // requires language suffix
  TESTIMONIES: 'testimonies',
} as const;
