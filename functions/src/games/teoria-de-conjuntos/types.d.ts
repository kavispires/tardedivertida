// Types
import type { DiagramTopicData, ItemData } from '../../types/tdr';
import type { OUTCOME, TEORIA_DE_CONJUNTOS_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `teoria-de-conjuntos` session.
 */
export type TeoriaDeConjuntosOptions = {
  /**
   * Possibly include nsfw items
   */
  nsfw?: boolean;
  /**
   * Use 2 diagrams instead of 3
   */
  easyGame?: boolean;
};

/**
 * Diagram-topic resources grouped into attribute, word, and optional context categories.
 */
export type TopicsByDiagramType = {
  /**
   * The attribute-based diagram topic or available topic resources.
   */
  attribute: DiagramTopicData[];
  /**
   * The word-based diagram topic or available topic resources.
   */
  word: DiagramTopicData[];
  /**
   * The optional context-based diagram topic or available topic resources.
   */
  context?: DiagramTopicData[];
};

/**
 * Resources loaded or assembled to initialize this game.
 */
export interface ResourceData {
  /**
   * The item resources associated with this game step.
   */
  items: ItemData[];
  /**
   * The diagram topics selected for this game.
   */
  diagrams: {
    /**
     * The attribute-based diagram topic or available topic resources.
     */
    attribute: DiagramTopicData;
    /**
     * The word-based diagram topic or available topic resources.
     */
    word: DiagramTopicData;
    /**
     * The optional context-based diagram topic or available topic resources.
     */
    context?: DiagramTopicData;
  };
  /**
   * Example topic resources grouped by diagram category.
   */
  examples: TopicsByDiagramType;
}

/**
 * A diagram intersection and the item identifiers placed within it.
 */
export type DiagramArea = {
  /**
   * The key used to identify or group this entry.
   */
  key: string; // A | W | C | O and any combination
  /**
   * Identifiers of the items associated with this entry.
   */
  itemsIds: UID[];
};

/**
 * The result used to determine the next game step or final resolution.
 */
export type Outcome = keyof typeof OUTCOME;

/**
 * A submitted guess for the game's hidden answer or target.
 */
export type Guess = {
  /**
   * Identifier of the item selected for this entry.
   */
  itemId: UID;
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID;
  /**
   * The diagram intersection proposed by the player.
   */
  suggestedArea: string;
  /**
   * The correct diagram intersection, or null before evaluation.
   */
  correctArea: string | null;
  /**
   * The result used to resolve this step or advance the game.
   */
  outcome: Outcome | string;
};

/**
 * Server-side data retained between phases of a `teoria-de-conjuntos` session.
 */
export interface TeoriaDeConjuntosStore extends DefaultStore {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `teoria-de-conjuntos` session.
 */
export interface TeoriaDeConjuntosState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `teoria-de-conjuntos` session.
 */
export interface TeoriaDeConjuntosInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: TeoriaDeConjuntosStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: TeoriaDeConjuntosState;
}

/**
 * Player action payload accepted by the `teoria-de-conjuntos` engine.
 */
export interface TeoriaDeConjuntosSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof TEORIA_DE_CONJUNTOS_ACTIONS;
}

/**
 * Firestore document data used when reading the `teoria-de-conjuntos` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | TeoriaDeConjuntosState;
/**
 * Firestore document data used when reading the `teoria-de-conjuntos` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | TeoriaDeConjuntosStore;
