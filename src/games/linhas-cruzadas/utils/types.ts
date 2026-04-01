// Types
import type { Achievement } from 'types/game';

/**
 * A prompt card that can be selected
 */
export type PromptCard = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The text content of the prompt
   */
  text: string;
  /**
   * Difficulty level of the prompt
   */
  level?: number;
};

/**
 * A prompt created by a player to be used in the album
 */
export type Prompt = {
  /**
   * The album entry id
   */
  id: UID;
  /**
   * The player who created the prompt
   */
  author: UID;
  /**
   * The content of the prompt
   */
  content: string;
  /**
   * Type of prompt
   */
  type: 'title' | 'drawing';
  /**
   * Number of words in the prompt
   */
  wordCount?: number;
};

/**
 * Payload for submitting a selected prompt
 */
export type SubmitPromptPayload = {
  /**
   * The ID of the selected prompt
   */
  promptId: string;
  /**
   * Whether the prompt was randomly selected
   */
  randomSelection?: boolean;
};

/**
 * Payload for submitting a drawing
 */
export type SubmitDrawingPayload = {
  /**
   * The drawing data as a stringified JSON
   */
  drawing: string;
};
/**
 * Payload for submitting a guess/name for a drawing
 */
export type SubmitGuessPayload = {
  /**
   * The guessed text/name
   */
  guess: string;
};

/**
 * A single slide in an album entry
 */
export type Slide = {
  /**
   * The player who created this slide
   */
  author: UID;
  /**
   * The content of the slide (text or drawing data)
   */
  content: string;
  /**
   * Type of slide
   */
  type: 'title' | 'drawing' | 'cover';
};

/**
 * An entry in the game album containing all slides for one player's story
 */
export type AlbumEntry = {
  /**
   * The player ID this album belongs to
   */
  id: UID;
  /**
   * The original prompt text
   */
  text: string;
  /**
   * The ID of the prompt card used
   */
  cardId: string;
  /**
   * All slides in this album entry
   */
  slides: Slide[];
};

/**
 * Phase: Prompt Selection
 * Players select a prompt from their options to start their album
 */
export type PhasePromptSelectionState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
};

/**
 * Phase: Drawing
 * Players draw based on the text they received
 */
export type PhaseDrawingState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
};

/**
 * Phase: Naming
 * Players write text to describe a drawing they received
 */
export type PhaseNamingState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
};

/**
 * Phase: Presentation
 * All albums are shown to players
 */
export type PhasePresentationState = {
  /**
   * The order of players in the game
   */
  gameOrder: GameOrder;
  /**
   * All completed album entries ordered by game order
   */
  album: AlbumEntry[];
};

/**
 * Phase: Game Over
 * Final results and achievements
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * All completed album entries
   */
  album: AlbumEntry[];
  /**
   * Group scoring information (non-winnable game)
   */
  group: {
    /**
     * Group score
     */
    score: number;
    /**
     * Victory score
     */
    victory: number;
    /**
     * Game outcome
     */
    outcome: string;
  };
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
};
