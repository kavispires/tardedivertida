// Types
import type { TextCardData } from '../../types/tdr';
import type { OUTCOME, UE_SO_ISSO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `ue-so-isso` session.
 */
export type UeSoIssoGameOptions = {
  /**
   * Use only 3 cards instead of 5 for the word selection
   */
  fewerCards: boolean;
  /**
   * Add bot that write suggestions to eliminate common clues
   */
  withBot: boolean;
  /**
   * UI option to time clue writing
   */
  withTimer: boolean;
  /**
   * UI option to display hints (timing answering)
   */
  withHints: boolean;
};

/**
 * A previously played word and the unique and duplicated clues submitted for it.
 */
export interface UsedWord {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The text displayed for this card or entry.
   */
  text: string;
  /**
   * The guesser's display name retained with the used word.
   */
  playerName?: string | null;
  /**
   * Clues that remained unique after comparing player submissions.
   */
  uniqueSuggestions?: string[] | [];
  /**
   * Duplicated clues excluded from the guesser's available suggestions.
   */
  commonSuggestions?: string[] | [];
  /**
   * The initial vote count when this word enters the selection.
   */
  votes: 0;
}

/**
 * Previously played words indexed by word identifier.
 */
export interface UsedWords {
  /**
   * Used-word records indexed by word identifier.
   */
  [key: string]: UsedWord;
}

/**
 * The result used to determine the next game step or final resolution.
 */
type Outcome = keyof typeof OUTCOME;

/**
 * A player-submitted clue and whether it has been invalidated.
 */
export interface PlayerSuggestion {
  /**
   * The clue text submitted by the player.
   */
  suggestion: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Whether this clue or guess is invalid for scoring.
   */
  invalid: boolean;
}

/**
 * A played word with its submitted clues, guesser, and round outcome.
 */
export interface PastSuggestion extends TextCardData {
  /**
   * Clue suggestions submitted for the current word.
   */
  suggestions: PlayerSuggestion[];
  /**
   * Identifier of the player making the guess.
   */
  guesserId: UID;
  /**
   * The result used to resolve this step or advance the game.
   */
  outcome: Outcome;
}

/**
 * Server-side data retained between phases of a `ue-so-isso` session.
 */
export interface UeSoIssoStore extends DefaultStore {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck?: TextCardData[];
  /**
   * Player identifiers in the order used for turns.
   */
  turnOrder?: UID[];
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: UID[];
  /**
   * Previously played words and their retained clue history.
   */
  usedWords?: UsedWords;
  /**
   * Word cards currently offered for selection.
   */
  currentWords?: TextCardData[];
  /**
   * Player suggestions currently awaiting validation or guessing.
   */
  currentSuggestions?: PlainObject[];
}

/**
 * Public game state shared with players during a `ue-so-isso` session.
 */
export interface UeSoIssoState extends DefaultState {
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: UID[];
  /**
   * Identifier of the player making the guess.
   */
  guesserId?: UID;
  /**
   * Identifier of the player controlling clue validation.
   */
  controllerId?: UID;
}

/**
 * The initial metadata, server-side store, and public state for a `ue-so-isso` session.
 */
export interface UeSoIssoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: UeSoIssoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: UeSoIssoState;
}

/**
 * The player action payload for submitting clue suggestions.
 */
export interface SubmitSuggestionsPayload extends Payload {
  /**
   * Clue suggestions submitted for the current word.
   */
  suggestions: string[];
}

/**
 * Current clue suggestions grouped by their associated identifier.
 */
export type CurrentSuggestions = Record<string, string[]>;

/**
 * The player action payload containing validated clue suggestions.
 */
export interface SubmitSuggestionsValidationPayload extends Payload {
  /**
   * Player suggestions accepted after validation.
   */
  validSuggestions: PlayerSuggestion[];
}

/**
 * The player action payload for confirming the guesser's answer.
 */
export interface ConfirmGuessPayload extends Payload {
  /**
   * The answer submitted by the guesser.
   */
  guess: string;
}

/**
 * Player action payload accepted by the `ue-so-isso` engine.
 */
export interface UeSoIssoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof UE_SO_ISSO_ACTIONS;
}

/**
 * Firestore document data used when reading the `ue-so-isso` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | UeSoIssoState;
/**
 * Firestore document data used when reading the `ue-so-isso` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | UeSoIssoStore;
