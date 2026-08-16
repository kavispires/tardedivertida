// Types
import type { Achievement } from 'types/game';
import type { TextCardData } from 'types/tdr';

export type Suggestion = {
  /**
   * The suggestion text provided by the player
   */
  suggestion: string;
  /**
   * Whether the suggestion is invalid
   */
  invalid: boolean;
  /**
   * ID of the player who made the suggestion
   */
  playerId: UID;
};

export type GalleryEntry = {
  /**
   * Array of suggestions for this word
   */
  suggestions: Suggestion[];
  /**
   * Number of votes this word received
   */
  votes: number;
  /**
   * ID of the player who guessed
   */
  guesserId: UID;
  /**
   * The outcome result for this round
   */
  outcome: string;
} & TextCardData;

export type SubmitVotesPayload = {
  /**
   * Record of word IDs and their corresponding vote counts
   * If the player selected a single word, the weight is 3, if they select more than one, the weight is 2.
   * If they don't select any, the first word will be sent with weight 1.
   */
  votes: Record<string, number>;
};

export type SubmitSuggestionsPayload = {
  /**
   * Array of suggestion texts from the player
   */
  suggestions: string[];
};

export type SubmitValidationsPayload = {
  /**
   * Array of validated suggestions
   */
  validSuggestions: Suggestion[];
};

export type ValidateSuggestionPayload = {
  /**
   * Array of suggestions to validate
   */
  suggestions: Suggestion[];
};

export type SubmitOutcomePayload = {
  /**
   * The outcome result being submitted
   */
  outcome: string;
};

export type SendGuessPayload = {
  /**
   * The guess submitted by the player
   */
  guess: string;
};

export interface SecretWord {
  /**
   * Unique identifier for the word
   */
  id: string;
  /**
   * The secret word text
   */
  text: string;
  // playerName?: string | null;
  // uniqueSuggestions?: string[] | [];
  // commonSuggestions?: string[] | [];
  /**
   * Number of votes received
   */
  votes: 0;
}

export type GroupState = {
  /**
   * Number of correct guesses
   */
  correct: number;
  /**
   * Number of mistakes made
   */
  mistakes: number;
  /**
   * The current outcome status
   */
  outcome: string;
  /**
   * Array of attempt results for each round
   */
  attempts: string[];
  /**
   * Current score
   */
  score: number;
  /**
   * Score goal to win
   */
  goal: number;
};

export type PhaseWordSelectionState = {
  /**
   * Order of player turns
   */
  gameOrder: UID[];
  /**
   * The current group state
   */
  group: GroupState;
  /**
   * ID of the player who will guess
   */
  guesserId: UID;
  /**
   * ID of the player controlling the round
   */
  controllerId: UID;
  /**
   * Array of words to choose from
   */
  words: TextCardData[];
};

export type PhaseSuggestState = {
  /**
   * Order of player turns
   */
  gameOrder: UID[];
  /**
   * The current group state
   */
  group: GroupState;
  /**
   * ID of the player who will guess
   */
  guesserId: UID;
  /**
   * ID of the player controlling the round
   */
  controllerId: UID;
  /**
   * The secret word players are giving clues for
   */
  secretWord: SecretWord;
  /**
   * Number of suggestions each player should provide
   */
  suggestionsNumber: number;
};

export type PhaseCompareState = {
  /**
   * Order of player turns
   */
  gameOrder: UID[];
  /**
   * The current group state
   */
  group: GroupState;
  /**
   * ID of the player who will guess
   */
  guesserId: UID;
  /**
   * ID of the player controlling the round
   */
  controllerId: UID;
  /**
   * The secret word players are giving clues for
   */
  secretWord: SecretWord;
  /**
   * Array of suggestions from all players
   */
  suggestions: Suggestion[];
};

export type PhaseGuessState = {
  /**
   * Order of player turns
   */
  gameOrder: UID[];
  /**
   * The current group state
   */
  group: GroupState;
  /**
   * ID of the player who will guess
   */
  guesserId: UID;
  /**
   * ID of the player controlling the round
   */
  controllerId: UID;
  /**
   * The secret word players are giving clues for
   */
  secretWord: SecretWord;
  /**
   * Array of suggestions from all players
   */
  suggestions: Suggestion[];
  /**
   * Array of validated suggestions
   */
  validSuggestions: Suggestion[];
};

export type PhaseVerifyGuessState = {
  /**
   * Order of player turns
   */
  gameOrder: UID[];
  /**
   * The current group state
   */
  group: GroupState;
  /**
   * ID of the player who will guess
   */
  guesserId: UID;
  /**
   * ID of the player controlling the round
   */
  controllerId: UID;
  /**
   * The secret word players are giving clues for
   */
  secretWord: SecretWord;
  /**
   * Array of suggestions from all players
   */
  suggestions: Suggestion[];
  /**
   * Array of validated suggestions
   */
  validSuggestions: Suggestion[];
  /**
   * The guess submitted by the guesser
   */
  guess: string;
};

export type PhaseResultState = {
  /**
   * Order of player turns
   */
  gameOrder: UID[];
  /**
   * The current group state
   */
  group: GroupState;
  /**
   * ID of the player who will guess
   */
  guesserId: UID;
  /**
   * ID of the player controlling the round
   */
  controllerId: UID;
  /**
   * The secret word players are giving clues for
   */
  secretWord: SecretWord;
  /**
   * Array of suggestions from all players
   */
  suggestions: Suggestion[];
  /**
   * Array of validated suggestions
   */
  validSuggestions: Suggestion[];
  /**
   * The guess submitted by the guesser
   */
  guess: string;
};

export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * The final group state
   */
  group: GroupState;
  /**
   * Gallery of all past rounds with suggestions
   */
  gallery: GalleryEntry[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
