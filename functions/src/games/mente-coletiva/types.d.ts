// Types
import type { GroupQuestionCardData } from '../../types/tdr';
import type { MENTE_COLETIVA_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `mente-coletiva` session.
 */
export type MenteColetivaOptions = {
  /**
   * Whether the shorter pasture victory threshold is used.
   */
  shortPasture: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Question resources available for selection.
   */
  allQuestions: {
    /**
     * Question resources indexed by their identifier.
     */
    [key: string]: GroupQuestionCardData;
  };
}

/**
 * Question resources indexed by their identifier.
 */
export interface AllQuestions {
  /**
   * Question resources indexed by their identifier.
   */
  [key: string]: GroupQuestionCardData;
}

/**
 * A previously used question and the answers submitted for it.
 */
export interface PastQuestions {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Player answers retained for this completed question.
   */
  answers: string[];
}

/**
 * The ordered collection of cards available for this game.
 */
export type Deck = GroupQuestionCardData[];

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * The question associated with these answers.
   */
  question: GroupQuestionCardData;
  /**
   * The leading answer groups with their matching player identifiers.
   */
  answers: {
    /**
     * Identifiers of the players associated with this entry.
     */
    playerIds: UID[];
    /**
     * The submitted answer or recorded response.
     */
    answer: string;
  }[];
};

/**
 * Server-side data retained between phases of a `mente-coletiva` session.
 */
export interface MenteColetivaStore extends DefaultStore {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: Deck;
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder: UID[];
  /**
   * Previously played questions and their submitted answers.
   */
  pastQuestions: PastQuestions[];
  /**
   * The question currently selected for the round.
   */
  currentQuestion?: GroupQuestionCardData;
  /**
   * Resolved entries retained for gallery presentation.
   */
  gallery?: GalleryEntry[];
}

/**
 * Public game state shared with players during a `mente-coletiva` session.
 */
export interface MenteColetivaState extends DefaultState {
  /**
   * Player identifiers in the session's established game order.
   */
  gameOrder?: UID[];
  /**
   * The resource category or rule variant used for this round.
   */
  roundType?: string;
  /**
   * Identifier of the player currently expected to act.
   */
  activePlayerId?: UID;
}

/**
 * The initial metadata, server-side store, and public state for a `mente-coletiva` session.
 */
export interface MenteColetivaInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: MenteColetivaStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: MenteColetivaState;
}

/**
 * A player answer with normalized text, locking state, and score.
 */
export interface AnswerEntry {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The submitted answer or recorded response.
   */
  answer: string;
  /**
   * Normalized answer text used to compare equivalent submissions.
   */
  parsedAnswer: string;
  /**
   * Whether this answer has been locked against further changes.
   */
  isLocked: boolean;
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
}

/**
 * Equivalent normalized answers grouped with their player submissions.
 */
export interface AnswerGroupEntry {
  /**
   * The submitted answer or recorded response.
   */
  answer: string;
  /**
   * Normalized answer text used to compare equivalent submissions.
   */
  parsedAnswer: string;
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
  /**
   * Player submissions belonging to this normalized-answer group.
   */
  entries: AnswerEntry[];
}

/**
 * A normalized player answer annotated with its locking state and score.
 */
export type ExtendedPlayerAnswerEntry = {
  /**
   * The submitted answer or recorded response.
   */
  answer: string;
  /**
   * Normalized answer text used to compare equivalent submissions.
   */
  parsedAnswer: string;
  /**
   * Whether this answer has been locked against further changes.
   */
  isLocked: boolean;
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
};

/**
 * Player action payload accepted by the `mente-coletiva` engine.
 */
export interface MenteColetivaSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof MENTE_COLETIVA_ACTIONS;
}

/**
 * Firestore document data used when reading the `mente-coletiva` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | MenteColetivaState;
/**
 * Firestore document data used when reading the `mente-coletiva` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | MenteColetivaStore;

/**
 * Directional animation flags for moving a sheep in the pasture.
 */
export type SheepAnimation = {
  /**
   * Whether to animate the sheep moving to the right.
   */
  animateRight?: boolean;
  /**
   * Whether to animate the sheep moving to the left.
   */
  animateLeft?: boolean;
};

/**
 * A player's pasture position and identity data used to animate level changes.
 */
export interface PastureChangeEntry extends SheepAnimation {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * The player's display name shown with the sheep.
   */
  name: string;
  /**
   * Identifier of the player avatar shown during the pasture change.
   */
  avatarId: string;
  /**
   * The sheep's pasture position for this animation snapshot.
   */
  level: number;
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}
