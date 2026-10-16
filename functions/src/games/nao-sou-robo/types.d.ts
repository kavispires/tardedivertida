// Types
import type { TextCardData } from '../../types/tdr';
import type { NAO_SOU_ROBO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `nao-sou-robo` session.
 */
export interface NaoSouRoboOptions {
  /**
   * Game-option flags indexed by option name.
   */
  [key: string]: boolean;
}

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * Image-card identifiers available for selection.
   */
  images: UID[];
  /**
   * Card identifiers available for the robot's captcha selections.
   */
  botCards: UID[];
  /**
   * Emoji sprite indices available for selection.
   */
  emojis: number[];
  /**
   * Word resources or text associated with this entry.
   */
  words: TextCardData[];
  /**
   * Color resources available for captcha rounds.
   */
  colors: TextCardData[];
  /**
   * Emotion resources available for captcha rounds.
   */
  emotions: TextCardData[];
  /**
   * Glyph sprite indices available for selection.
   */
  glyphs: number[];
}

/**
 * The robot opponent's points, victory goal, progress state, and round performance.
 */
export interface Robot {
  /**
   * The robot opponent's accumulated points.
   */
  points: number;
  /**
   * The target required to complete the game or objective.
   */
  goal: number;
  /**
   * The robot's current progress-state value.
   */
  state: number;
  /**
   * The robot's current beat value used for round evaluation.
   */
  beat: number;
}

/**
 * A round challenge with its resource category and displayed values.
 */
export interface Captcha {
  /**
   * The round associated with this entry.
   */
  round: number;
  /**
   * The resource category or rule variant used for this round.
   */
  roundType: string;
  /**
   * The displayed resource values defining this captcha.
   */
  values: TextCardData | number | number[];
}

/**
 * A captcha option associated with selecting players or the robot.
 */
export interface CaptchaCard {
  /**
   * Unique identifier of this game entry.
   */
  id: UID;
  /**
   * Identifiers of players who selected this captcha card.
   */
  players: UID[];
  /**
   * Whether this captcha card was selected by the robot.
   */
  bot: boolean;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId?: UID;
}

/**
 * A resolved game entry prepared for the results gallery.
 */
export interface GalleryEntry extends Captcha {
  /**
   * The captcha-card choices presented for this round.
   */
  options: CaptchaCard[];
  /**
   * The result used to resolve this step or advance the game.
   */
  outcome: string;
  /**
   * Identifiers of players whose answers beat the robot.
   */
  beaters: UID[];
  /**
   * The score associated with this player, entry, or resolved result.
   */
  score: number;
  /**
   * Suspicion assigned to this captcha result.
   */
  suspicion: number;
}

/**
 * Server-side data retained between phases of a `nao-sou-robo` session.
 */
export interface NaoSouRoboStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `nao-sou-robo` session.
 */
export interface NaoSouRoboState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `nao-sou-robo` session.
 */
export interface NaoSouRoboInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: NaoSouRoboStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: NaoSouRoboState;
}

/**
 * Player action payload accepted by the `nao-sou-robo` engine.
 */
export interface NaoSouRoboSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof NAO_SOU_ROBO_ACTIONS;
}

/**
 * Firestore document data used when reading the `nao-sou-robo` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & NaoSouRoboState;
/**
 * Firestore document data used when reading the `nao-sou-robo` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & NaoSouRoboStore;
