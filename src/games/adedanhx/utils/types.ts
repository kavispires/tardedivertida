// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';
import type { TopicCardData } from 'types/tdr';

/**
 * Payload for submitting grid answers
 */
export type SubmitGridAnswersPayload = {
  /**
   * Dictionary of answers keyed by cell ID
   */
  answers: Dictionary<string>;
  /**
   * Optional player ID who called stop
   */
  stop?: UID;
};

/**
 * Payload for submitting answer evaluations
 */
export type SubmitEvaluationsPayload = {
  /**
   * Dictionary of evaluation results (true = accepted, false = rejected)
   */
  evaluations: Dictionary<boolean>;
};

/**
 * Letter constraint for a grid row
 */
export type LetterEntry = {
  /**
   * Type of letter constraint
   */
  type: 'starts-with' | 'ends-with' | 'includes';
  /**
   * The letter(s) to match
   */
  letters: string;
  /**
   * Difficulty level
   */
  level: number;
};

/**
 * Game grid configuration with topics and letter constraints
 */
export type AdedanhxGrid = {
  /**
   * Topic cards for column headers
   */
  xHeaders: TopicCardData[];
  /**
   * Letter entries for row headers
   */
  yHeaders: LetterEntry[];
};

/**
 * Player's answer for a grid cell
 */
export type Answer = {
  /**
   * Cell identifier (x-y coordinates)
   */
  id: string;
  /**
   * The answer text
   */
  answer: string;
  /**
   * Timestamp when the answer was submitted
   */
  timestamp: number;
};

/**
 * Answer entry with evaluation results
 */
export type AnswerEvaluationEntry = {
  /**
   * Unique identifier for the entry
   */
  id: string;
  /**
   * ID of the player who submitted the answer
   */
  playerId: string;
  /**
   * The answer text
   */
  answer: string;
  /**
   * Timestamp when the answer was submitted
   */
  timestamp: number;
  /**
   * Points awarded for this answer
   */
  points: number;
  /**
   * Whether the answer was automatically rejected
   */
  autoRejected: boolean;
  /**
   * Whether the answer was rejected by players
   */
  rejected: boolean;
};

/**
 * Grouped answers for a specific grid cell
 */
export type GroupAnswerEvaluationEntry = {
  /**
   * Cell identifier
   */
  id: string;
  /**
   * Topic card for this cell
   */
  topic: TopicCardData;
  /**
   * Letter constraint for this cell
   */
  letter: LetterEntry;
  /**
   * All answers submitted for this cell
   */
  answers: AnswerEvaluationEntry[];
  /**
   * Total points for this cell
   */
  points: number;
};

/**
 * Grid entry showing the top answer and score for a cell
 */
export type AnswerGridEntry = {
  /**
   * Cell identifier
   */
  id: string;
  /**
   * The highest scoring answer for this cell
   */
  main: {
    /**
     * ID of the player with the top answer
     */
    playerId: UID;
    /**
     * Score for this answer
     */
    score: number;
    /**
     * The answer text
     */
    answer: string;
  };
  /**
   * IDs of all players who submitted answers for this cell
   */
  playerIds: UID[];
  /**
   * Total score for this cell
   */
  score: number;
};

/**
 * Gallery entry showing a cell's information and top answer
 */
export type AdedanhxGalleryEntry = {
  /**
   * Cell identifier
   */
  id: string;
  /**
   * Topic card for this cell
   */
  topic: TopicCardData;
  /**
   * Letter constraint for this cell
   */
  letter: LetterEntry;
  /**
   * The top answer for this cell (if any)
   */
  topAnswer?: AnswerGridEntry['main'];
};

// Phase State Types

/**
 * State for the Answering phase
 */
export type PhaseAnsweringState = {
  /**
   * The current grid with topics and letters
   */
  grid: AdedanhxGrid;
  /**
   * Whether a player has called stop
   */
  stop?: UID | false;
};

/**
 * State for the Evaluation phase
 */
export type PhaseEvaluationState = {
  /**
   * The current grid with topics and letters
   */
  grid: AdedanhxGrid;
  /**
   * Whether a player has called stop
   */
  stop: boolean;
  /**
   * Grouped answers by cell for evaluation
   */
  answersGroups: GroupAnswerEvaluationEntry[];
};

/**
 * State for the Results phase
 */
export type PhaseResultsState = {
  /**
   * The current grid with topics and letters
   */
  grid: AdedanhxGrid;
  /**
   * Whether a player has called stop
   */
  stop: boolean;
  /**
   * Grouped answers by cell for evaluation
   */
  answersGroups: GroupAnswerEvaluationEntry[];
  /**
   * Player ranking for this round
   */
  ranking: GameRanking;
  /**
   * Grid of answers with scores
   */
  answersGrid: Dictionary<AnswerGridEntry>;
};

/**
 * State for the Game Over phase
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Winners of the game
   */
  winners: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Top answers from all rounds
   */
  topAnswers: AdedanhxGalleryEntry[];
  /**
   * Cells with no answers from all rounds
   */
  noAnswers: AdedanhxGalleryEntry[];
};
