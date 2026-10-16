// Types
import type { TextCardData } from '../../types/tdr';
import type { SINAIS_DE_ALERTA_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `sinais-de-alerta` session.
 */
export type SinaisDeAlertaOptions = {
  /**
   * Longer timer
   */
  longerTimer: boolean;
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * Descriptor-card resources available for prompt creation.
   */
  allDescriptors: TextCardData[];
  /**
   * Subject-card resources available for drawing prompts.
   */
  allSubjects: TextCardData[];
};

/**
 * A player drawing associated with its subject and descriptor cards.
 */
export type DrawingEntryData = {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * Identifier of the subject card associated with the drawing.
   */
  subjectId: UID;
  /**
   * Identifier of the descriptor card associated with the drawing.
   */
  descriptorId: UID;
  /**
   * The serialized drawing submitted by the player, or null before submission.
   */
  drawing: string;
};

/**
 * Players grouped by their selected subject and descriptor combination.
 */
export type PlayersSay = {
  /**
   * Identifiers of the players associated with this entry.
   */
  playersIds: UID[];
  /**
   * Identifier of the subject card associated with the drawing.
   */
  subjectId: UID;
  /**
   * Identifier of the descriptor card associated with the drawing.
   */
  descriptorId: UID;
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
};

/**
 * A resolved game entry prepared for the results gallery.
 */
export type GalleryEntry = {
  /**
   * Composite identifier linking the drawing, prompt cards, and artist.
   */
  id: string;
  /**
   * The title displayed for this entry.
   */
  title: string;
  /**
   * Identifier of the subject card associated with the drawing.
   */
  subjectId: UID;
  /**
   * Identifier of the descriptor card associated with the drawing.
   */
  descriptorId: UID;
  /**
   * Identifier of the player who created the drawing.
   */
  artistId: UID;
  /**
   * Points awarded to the drawing's artist.
   */
  artistScore: number;
  /**
   * The serialized drawing submitted by the player, or null before submission.
   */
  drawing: string;
  /**
   * Player identifiers grouped by their selected answer.
   */
  playersSay: PlayersSay[];
  /**
   * The calculated accuracy of guesses for this drawing.
   */
  accuracy: number;
  /**
   * The correctness measure used to evaluate this drawing.
   */
  correctness: number;
};

/**
 * A completed drawing and its final accuracy for the game-over gallery.
 */
export type FinalGalleryEntry = {
  /**
   * Composite identifier linking the drawing, prompt cards, and artist.
   */
  id: string;
  /**
   * The title displayed for this entry.
   */
  title: string;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: string;
  /**
   * The serialized drawing submitted by the player, or null before submission.
   */
  drawing: string;
  /**
   * The calculated accuracy of guesses for this drawing.
   */
  accuracy: number;
};

/**
 * Server-side data retained between phases of a `sinais-de-alerta` session.
 */
export interface SinaisDeAlertaStore extends DefaultStore {
  /**
   * Subject cards retained for drawing prompts.
   */
  subjectsDeck: TextCardData[];
  /**
   * Descriptor cards retained for drawing prompts.
   */
  descriptorsDeck: TextCardData[];
}

/**
 * Public game state shared with players during a `sinais-de-alerta` session.
 */
export interface SinaisDeAlertaState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `sinais-de-alerta` session.
 */
export interface SinaisDeAlertaInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: SinaisDeAlertaStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: SinaisDeAlertaState;
}

/**
 * Player action payload accepted by the `sinais-de-alerta` engine.
 */
export interface SinaisDeAlertaSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof SINAIS_DE_ALERTA_ACTIONS;
}

/**
 * Firestore document data used when reading the `sinais-de-alerta` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & SinaisDeAlertaState;
/**
 * Firestore document data used when reading the `sinais-de-alerta` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & SinaisDeAlertaStore;
