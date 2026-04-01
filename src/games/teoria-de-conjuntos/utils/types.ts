// Types
import type { Achievement, GamePlayer } from 'types/game';
import type { DiagramTopic, Item } from 'types/tdr';
// Internal
import type { OUTCOME } from './constants';

/**
 * Payload for submitting judge selection
 */
export type SubmitJudgePayload = {
  /**
   * ID of the player selected as judge
   */
  judgeId: UID;
};

/**
 * Payload for submitting item placement on the diagram
 */
export type SubmitItemPlacementPayload = {
  /**
   * ID of the item being placed
   */
  itemId: UID;
  /**
   * Area position on the diagram (e.g., 'A', 'W', 'AW', 'O')
   */
  position: string;
};

/**
 * Payload for submitting judge's evaluation
 */
export type SubmitEvaluationPayload = {
  /**
   * Evaluation result from the judge
   */
  evaluation: string;
};

/**
 * Payload for submitting evaluation fix/correction
 */
export type SubmitEvaluationFixPayload = {
  /**
   * ID of the item being re-evaluated
   */
  itemId: UID;
  /**
   * Current area where the item is placed
   */
  currentArea: string;
  /**
   * New evaluation result
   */
  newEvaluation: string;
};

/**
 * Solutions dictionary containing the correct topics for each diagram circle
 */
export type Solutions = {
  /**
   * Attribute circle topic
   */
  attribute: DiagramTopic;
  /**
   * Word circle topic
   */
  word: DiagramTopic;
  /**
   * Context circle topic (optional, not present in easy mode)
   */
  context?: DiagramTopic;
};

/**
 * Examples for each diagram type to help players understand the categories
 */
export type DiagramExamples = {
  /**
   * Example topics for the attribute circle
   */
  attribute: DiagramTopic[];
  /**
   * Example topics for the word circle
   */
  word: DiagramTopic[];
  /**
   * Example topics for the context circle (optional, not present in easy mode)
   */
  context?: DiagramTopic[];
};

/**
 * Area in the Venn diagram that can contain items
 */
export type DiagramArea = {
  /**
   * Key representing the area (A, W, C, O, or any combination like AW, AC, WC, AWC)
   */
  key: string;
  /**
   * Array of item IDs placed in this area
   */
  itemsIds: UID[];
};

/**
 * Outcome type for a guess
 */
export type Outcome = keyof typeof OUTCOME;

/**
 * Player's guess for item placement
 */
export type Guess = {
  /**
   * ID of the item being guessed
   */
  itemId: UID;
  /**
   * ID of the player making the guess
   */
  playerId: UID;
  /**
   * Area suggested by the player
   */
  suggestedArea: string;
  /**
   * Correct area determined by the judge (null if not yet evaluated)
   */
  correctArea: string | null;
  /**
   * Outcome of the guess (CONTINUE, WRONG, WIN, PENDING)
   */
  outcome: Outcome | string;
};

/**
 * Reevaluation props for fixing judge decisions
 */
export type Reevaluation = {
  /**
   * Callback to open the fix modal
   */
  onOpenFixModal: (itemId: string, currentArea: string) => void;
  /**
   * Whether the current user is the judge
   */
  isJudge: boolean;
};

/**
 * State for the JUDGE_SELECTION phase
 * Players select who will be the judge for this round
 */
export type PhaseJudgeSelectionState = {
  /**
   * Dictionary of all items in play
   */
  items: Dictionary<Item>;
  /**
   * Dictionary of diagram areas (attribute, word, context, outside)
   */
  diagrams: Dictionary<DiagramArea>;
  /**
   * Target number of items each player should place
   */
  targetItemsCount: number;
  /**
   * The correct solutions for each diagram circle
   */
  solutions: Solutions;
  /**
   * Example topics for each diagram type
   */
  examples: DiagramExamples;
};

/**
 * State for the ITEM_PLACEMENT phase
 * Players place items into diagram areas
 */
export type PhaseItemPlacementState = {
  /**
   * Dictionary of all items in play
   */
  items: Dictionary<Item>;
  /**
   * Dictionary of diagram areas (attribute, word, context, outside)
   */
  diagrams: Dictionary<DiagramArea>;
  /**
   * Target number of items each player should place
   */
  targetItemsCount: number;
  /**
   * The correct solutions for each diagram circle
   */
  solutions: Solutions;
  /**
   * Example topics for each diagram type
   */
  examples: DiagramExamples;
  /**
   * ID of the player acting as judge
   */
  judgeId: UID;
  /**
   * Order of players for this round
   */
  turnOrder: GameOrder;
  /**
   * ID of the currently active player
   */
  activePlayerId: UID;
  /**
   * The current guess being evaluated
   */
  currentGuess: Guess;
  /**
   * The previous guess (if any)
   */
  previousGuess: Guess | null;
  /**
   * ID of the previous active player
   */
  previousActivePlayerId: UID | null;
};

/**
 * State for the EVALUATION phase
 * Judge evaluates player's item placement
 */
export type PhaseEvaluationState = {
  /**
   * Dictionary of all items in play
   */
  items: Dictionary<Item>;
  /**
   * Dictionary of diagram areas (attribute, word, context, outside)
   */
  diagrams: Dictionary<DiagramArea>;
  /**
   * Target number of items each player should place
   */
  targetItemsCount: number;
  /**
   * The correct solutions for each diagram circle
   */
  solutions: Solutions;
  /**
   * Example topics for each diagram type
   */
  examples: DiagramExamples;
  /**
   * ID of the player acting as judge
   */
  judgeId: UID;
  /**
   * Order of players for this round
   */
  turnOrder: GameOrder;
  /**
   * ID of the currently active player
   */
  activePlayerId: UID;
  /**
   * The current guess being evaluated
   */
  currentGuess: Guess;
  /**
   * The previous guess (if any)
   */
  previousGuess: Guess | null;
  /**
   * ID of the previous active player
   */
  previousActivePlayerId: UID | null;
};

/**
 * State for the GAME_OVER phase
 * Game has ended, showing final results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * Array of earned achievements
   */
  achievements: Achievement[];
  /**
   * Dictionary of all items that were in play
   */
  items: Dictionary<Item>;
  /**
   * Dictionary of final diagram areas with placed items
   */
  diagrams: Dictionary<DiagramArea>;
  /**
   * The correct solutions for each diagram circle
   */
  solutions: Solutions;
  /**
   * ID of the player who was the judge
   */
  judgeId: UID;
  /**
   * Target number of items each player should have placed
   */
  targetItemsCount: number;
  /**
   * The final guess that ended the game
   */
  lastGuess: Guess;
  /**
   * ID of the last active player
   */
  lastActivePlayerId: UID;
};
