// Types
import type { Achievement, GamePlayer } from 'types/game';
import type { CrimeReason, SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Internal
import type { OUTCOME } from './constants';

/**
 * Payload for selecting a witness
 */
export type SelectWitnessPayload = {
  /**
   * ID of the selected witness player
   */
  witnessId: UID;
};

/**
 * Payload for selecting a question
 */
export type SelectQuestionPayload = {
  /**
   * ID of the selected question
   */
  questionId: UID;
};

/**
 * Payload for submitting testimony
 */
export type SubmitTestimonyPayload = {
  /**
   * Whether the testimony is true or false
   */
  testimony: boolean;
};

/**
 * Payload for eliminating a suspect
 */
export type EliminatePayload = {
  /**
   * ID of the suspect to eliminate
   */
  suspectId: UID;
  /**
   * Whether to pass on eliminating this round
   */
  pass: boolean;
};

/**
 * Payload for final elimination vote
 */
export type FinalEliminationPayload = {
  /**
   * ID of the suspect to vote for as perpetrator
   */
  suspectId: UID;
};

/**
 * Question card for interrogation
 */
export type Question = {
  /**
   * Unique identifier for the question
   */
  id: UID;
  /**
   * The question text
   */
  question: string;
  /**
   * Difficulty level of the question
   */
  level: number;
};

/**
 * Game outcome status
 */
export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME];

/**
 * History entry for a testimony question and answer
 */
export type THistoryEntry = {
  /**
   * Question ID
   */
  id: UID;
  /**
   * Question text
   */
  question: string;
  /**
   * Answer text
   */
  answer: string;
  /**
   * Whether the statement was true or false
   */
  statement: boolean;
  /**
   * Array of suspect IDs eliminated in this round
   */
  eliminated: UID[];
  /**
   * Array of remaining suspect IDs after this round
   */
  remaining: UID[];
};

/**
 * Game status tracking
 */
export type Status = {
  /**
   * Number of questions asked
   */
  questions: number;
  /**
   * Total time/rounds remaining
   */
  totalTime: number;
  /**
   * Total number of suspects at game start
   */
  suspects: number;
  /**
   * Number of suspects released/eliminated
   */
  released: number;
  /**
   * Current score
   */
  score: number;
};

/**
 * State for the witness selection phase where players choose who will be the witness
 */
export type PhaseWitnessSelectionState = {
  /**
   * History of previous testimonies
   */
  history: THistoryEntry[];
  /**
   * ID of the perpetrator suspect
   */
  perpetratorId: UID;
  /**
   * Current game status
   */
  status: Status;
  /**
   * Dictionary of all suspects
   */
  suspectsDict: Dictionary<SuspectCard>;
  /**
   * Array of all suspect IDs
   */
  suspectsIds: UID[];
};

/**
 * State for the question selection phase where the questioner picks a question
 */
export type PhaseQuestionSelectionState = {
  /**
   * History of previous testimonies
   */
  history: THistoryEntry[];
  /**
   * ID of the perpetrator suspect
   */
  perpetratorId: UID;
  /**
   * Current game status
   */
  status: Status;
  /**
   * Dictionary of all suspects
   */
  suspectsDict: Dictionary<SuspectCard>;
  /**
   * Array of all suspect IDs
   */
  suspectsIds: UID[];
  /**
   * ID of the witness player
   */
  witnessId: UID;
  /**
   * ID of the questioner player
   */
  questionerId: UID;
  /**
   * Array of previously eliminated suspect IDs
   */
  previouslyEliminatedSuspects: UID[];
  /**
   * Available questions to choose from
   */
  questions: Question[];
  /**
   * Current game outcome
   */
  outcome: Outcome;
};

/**
 * State for the questioning phase where the witness answers the selected question
 */
export type PhaseQuestioningState = {
  /**
   * History of previous testimonies
   */
  history: THistoryEntry[];
  /**
   * ID of the perpetrator suspect
   */
  perpetratorId: UID;
  /**
   * Current game status
   */
  status: Status;
  /**
   * Dictionary of all suspects
   */
  suspectsDict: Dictionary<SuspectCard>;
  /**
   * Array of all suspect IDs
   */
  suspectsIds: UID[];
  /**
   * ID of the witness player
   */
  witnessId: UID;
  /**
   * ID of the questioner player
   */
  questionerId: UID;
  /**
   * Array of previously eliminated suspect IDs
   */
  previouslyEliminatedSuspects: UID[];
  /**
   * The selected question card
   */
  question: TestimonyQuestionCard;
  /**
   * Current game outcome
   */
  outcome: Outcome;
};

/**
 * State for the trial phase where players eliminate suspects based on testimony
 */
export type PhaseTrialState = {
  /**
   * History of previous testimonies
   */
  history: THistoryEntry[];
  /**
   * ID of the perpetrator suspect
   */
  perpetratorId: UID;
  /**
   * Current game status
   */
  status: Status;
  /**
   * Dictionary of all suspects
   */
  suspectsDict: Dictionary<SuspectCard>;
  /**
   * Array of all suspect IDs
   */
  suspectsIds: UID[];
  /**
   * ID of the witness player
   */
  witnessId: UID;
  /**
   * ID of the questioner player
   */
  questionerId: UID;
  /**
   * Array of previously eliminated suspect IDs
   */
  previouslyEliminatedSuspects: UID[];
  /**
   * The selected question card
   */
  question: TestimonyQuestionCard;
  /**
   * Whether the testimony was true or false
   */
  testimony: boolean;
  /**
   * Current game outcome
   */
  outcome: Outcome;
  /**
   * Array of suspect IDs eliminated in this round
   */
  eliminatedSuspects: UID[];
};

/**
 * State for the game over phase showing final results
 */
export type PhaseGameOverState = {
  /**
   * Timestamp when the game ended
   */
  gameEndedAt: number;
  /**
   * Final outcome (WIN or LOSE)
   */
  outcome: Outcome;
  /**
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * Achievements earned during the game
   */
  achievements: Achievement[];
  /**
   * Complete history of testimonies
   */
  history: THistoryEntry[];
  /**
   * ID of the perpetrator suspect
   */
  perpetratorId: UID;
  /**
   * Final game status
   */
  status: Status;
  /**
   * Dictionary of all suspects
   */
  suspectsDict: Dictionary<SuspectCard>;
  /**
   * Array of all suspect IDs
   */
  suspectsIds: UID[];
  /**
   * ID of the witness player
   */
  witnessId: UID;
  /**
   * Array of all eliminated suspect IDs throughout the game
   */
  previouslyEliminatedSuspects: UID[];
  /**
   * The crime reason/motive
   */
  reason: CrimeReason;
};
