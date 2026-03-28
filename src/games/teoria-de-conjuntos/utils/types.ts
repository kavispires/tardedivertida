// Types
import type { Achievement, GamePlayer } from 'types/game';
import type { DiagramTopic, Item } from 'types/tdr';
// Internal
import type { OUTCOME } from './constants';

export type SubmitJudgePayload = {
  judgeId: UID;
};

export type SubmitItemPlacementPayload = {
  itemId: UID;
  position: string;
};

export type SubmitEvaluationPayload = {
  evaluation: string;
};

export type SubmitEvaluationFixPayload = {
  itemId: UID;
  currentArea: string;
  newEvaluation: string;
};

export type Solutions = {
  attribute: DiagramTopic;
  word: DiagramTopic;
  context?: DiagramTopic;
};

export type DiagramExamples = {
  attribute: DiagramTopic[];
  word: DiagramTopic[];
  context?: DiagramTopic[];
};

export type DiagramArea = {
  key: string; // A | W | C | O and any combination
  itemsIds: UID[];
};

export type Outcome = keyof typeof OUTCOME;

export type Guess = {
  itemId: UID;
  playerId: UID;
  suggestedArea: string;
  correctArea: string | null;
  outcome: Outcome | string;
};

export type Reevaluation = {
  onOpenFixModal: (itemId: string, currentArea: string) => void;
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
