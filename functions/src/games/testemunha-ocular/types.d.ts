// Types
import type { CrimeReasonData, SuspectCardData, TestimonyStatementCardData } from '../../types/tdr';
import type { OUTCOME, TESTEMUNHA_OCULAR_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `testemunha-ocular` session.
 */
export type TestemunhaOcularOptions = {
  /**
   * Allow nsfw traits
   */
  nsfw?: boolean;
  /**
   * Larger pool of suspects
   */
  largePool?: boolean;
  /**
   * Targeted pool of suspects
   */
  targetedPool?: boolean;
  /**
   * Exclusive use of the new batch of suspects
   */
  gbExclusive?: boolean;
} & SuspectCardsOptions;

/**
 * Identifier of a suspect in the witness investigation.
 */
export type SuspectId = UID;

/**
 * The result used to determine the next game step or final resolution.
 */
export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME];

/**
 * A testimony statement with the witness's response and the resulting suspect eliminations.
 */
export type TestemunhaOcularHistoryEntry = {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * The witness's affirmative or negative response to the statement.
   */
  testimony: boolean;
  /**
   * Suspect identifiers eliminated after this testimony.
   */
  eliminated: UID[];
  /**
   * Suspect identifiers still under consideration after the testimony.
   */
  remaining: UID[];
} & TestimonyStatementCardData;

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * The complete card resources available for selection.
   */
  allCards: TestimonyStatementCardData[];
  /**
   * Suspect resources available for investigation setup.
   */
  allSuspects: SuspectCardData[];
  /**
   * Crime-reason resources indexed by identifier.
   */
  allReasons: Dictionary<CrimeReasonData>;
}

/**
 * Progress and outcome information for the current game step.
 */
export type Status = {
  /**
   * The number of questions tracked for the investigation.
   */
  questions: number;
  /**
   * The accumulated time tracked for the investigation.
   */
  totalTime: number;
  /**
   * The number of suspects tracked for the investigation.
   */
  suspects: number;
  /**
   * The number of suspects released from consideration.
   */
  released: number;
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
};

/**
 * Server-side data retained between phases of a `testemunha-ocular` session.
 */
export interface TestemunhaOcularStore extends DefaultStore<TestemunhaOcularOptions> {
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder: UID[];
  /**
   * Player identifiers in the order used for turns.
   */
  turnOrder: UID[];
  /**
   * The current position in the question deck.
   */
  questionIndex?: number;
  /**
   * The current position in the investigator turn order.
   */
  questionerIndex?: number;
}

/**
 * Public game state shared with players during a `testemunha-ocular` session.
 */
export interface TestemunhaOcularState extends DefaultState {
  /**
   * Suspect resources indexed by identifier.
   */
  suspectsDict?: Dictionary<SuspectCardData>;
  /**
   * Identifiers of suspects included in this investigation.
   */
  suspectsIds?: UID[];
  /**
   * Identifier of the hidden perpetrator.
   */
  perpetratorId?: UID;
}

/**
 * The initial metadata, server-side store, and public state for a `testemunha-ocular` session.
 */
export interface TestemunhaOcularInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: TestemunhaOcularStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: TestemunhaOcularState;
}

/**
 * Player action payload accepted by the `testemunha-ocular` engine.
 */
export interface TestemunhaOcularSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof TESTEMUNHA_OCULAR_ACTIONS;
}

/**
 * Firestore document data used when reading the `testemunha-ocular` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & TestemunhaOcularState;
/**
 * Firestore document data used when reading the `testemunha-ocular` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & TestemunhaOcularStore;
