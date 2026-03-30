// Types
import type { Achievement, GameRanking } from 'types/game';
import type { ContenderCard } from 'types/tdr';

/**
 * Payload for submitting selected characters
 */
export type SubmitCharactersPayload = {
  /**
   * IDs of the selected characters
   */
  characters: UID[];
};

/**
 * Payload for submitting glyphs/icons
 */
export type SubmitGlyphsPayload = {
  /**
   * Dictionary mapping glyph IDs to their value (true for positive, false for negative)
   */
  glyphs: Dictionary<boolean>;
};

/**
 * Payload for submitting guesses
 */
export type SubmitGuessesPayload = {
  /**
   * Dictionary mapping player IDs to guessed character IDs
   */
  guesses: Dictionary<string>;
  /**
   * Whether the player chose randomly instead of making deliberate guesses
   */
  choseRandomly: boolean;
};

/**
 * Represents a character in the game with player association
 */
export type Character = ContenderCard & {
  /**
   * ID of the player who has this character, or 'bot' for table characters
   */
  playerId?: UID;
};

/**
 * Dictionary of characters indexed by character ID
 */
export type Characters = Dictionary<Character>;

/**
 * Represents a round entry in the gallery
 */
export type GalleryEntry = {
  /**
   * ID of the player who had this character
   */
  playerId: UID;
  /**
   * ID of the character
   */
  characterId: UID;
  /**
   * Glyphs selected for this character
   */
  glyphs: Dictionary<boolean>;
  /**
   * Record of which players guessed which characters
   */
  playersSay: Record<UID, UID[]>;
  /**
   * Points earned by each player for this character
   */
  playersPoints: Record<UID, number>;
};

/**
 * Final character entry with all details for game over display
 */
export type FinalCharacterEntry = {
  /**
   * Unique identifier for the character
   */
  id: UID;
  /**
   * Character name in multiple languages
   */
  name: DualLanguageValue;
  /**
   * Character description in multiple languages
   */
  description: DualLanguageValue;
  /**
   * Glyphs that were selected for this character
   */
  glyphs: Dictionary<boolean>;
  /**
   * ID of the player who had this character
   */
  playerId: UID;
};

/**
 * State for the Character Filtering phase
 * Players select which characters they want to use in the game
 */
export type PhaseCharacterFilteringState = {
  /**
   * Game mode: 'imageCards' or 'characters'
   */
  mode: 'imageCards' | 'characters';
};

/**
 * State for the Character Description phase
 * Players describe their character using glyphs
 */
export type PhaseCharacterDescriptionState = {
  /**
   * Game mode: 'imageCards' or 'characters'
   */
  mode: 'imageCards' | 'characters';
  /**
   * Dictionary of all characters in play this round
   */
  characters: Characters;
  /**
   * Shuffled order of character IDs for display
   */
  tableOrder: UID[];
  /**
   * Whether characters are shown or hidden this round
   */
  roundType: 'SHOW' | 'HIDE';
};

/**
 * State for the Guessing phase
 * Players guess which character belongs to which player
 */
export type PhaseGuessingState = {
  /**
   * Game mode: 'imageCards' or 'characters'
   */
  mode: 'imageCards' | 'characters';
  /**
   * Dictionary of all characters in play this round
   */
  characters: Characters;
  /**
   * Shuffled order of character IDs for display
   */
  tableOrder: UID[];
  /**
   * Whether characters are shown or hidden this round
   */
  roundType: 'SHOW' | 'HIDE';
};

/**
 * State for the Results phase
 * Shows guessing results and awards points
 */
export type PhaseResultsState = {
  /**
   * Game mode: 'imageCards' or 'characters'
   */
  mode: 'imageCards' | 'characters';
  /**
   * Dictionary of all characters in play this round
   */
  characters: Characters;
  /**
   * Shuffled order of character IDs for display
   */
  tableOrder: UID[];
  /**
   * Whether characters are shown or hidden this round
   */
  roundType: 'SHOW' | 'HIDE';
  /**
   * Gallery entries for this round showing all characters and guesses
   */
  gallery: GalleryEntry[];
  /**
   * Player rankings with scores for this round
   */
  ranking: GameRanking;
};

/**
 * State for the Game Over phase
 * Shows final results and achievements
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * IDs of the winning players
   */
  winners: UID[];
  /**
   * Achievements earned by players
   */
  achievements: Achievement[];
  /**
   * Gallery of all rounds with character details
   */
  gallery: FinalCharacterEntry[];
};
