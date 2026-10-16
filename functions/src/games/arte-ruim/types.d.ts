// Types
import type { ArteRuimCardData, ArteRuimGroupData, ArteRuimPairData } from '../../types/tdr';
import type { ARTE_RUIM_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `arte-ruim` session.
 */
export type ArteRuimGameOptions = {
  /**
   * Use all cards, not just unused ones
   */
  useAllCards: boolean;
  /**
   * Use only basic levels (1-2-3)
   */
  basicLevelsOnly: boolean;
  /**
   * Make game with variant number of levels by having a score goal (max 10 rounds)
   */
  forPoints: boolean;
  /**
   * Randomize levels
   */
  randomize: boolean;
  /**
   * Use special surprise twist for level 4
   */
  specialLevels: boolean;
};

/**
 * Card collections grouped by difficulty level.
 */
export type CardsByLevel = Record<string, ArteRuimCardData[]>;

/**
 * Supported resource-library variants for level-four drawing rounds.
 */
export type Level4Type = 'pairs' | 'contenders' | 'movies' | 'adjectives';

/**
 * Resources loaded or assembled to initialize this game.
 */
export type ResourceData = {
  /**
   * The complete card resources available for selection.
   */
  allCards: Dictionary<ArteRuimCardData>;
  /**
   * Cards still available after filtering previously used resources.
   */
  availableCards: CardsByLevel;
  /**
   * Pair-card resources used for paired drawing rounds.
   */
  cardsPairs: ArteRuimPairData[];
  /**
   * Grouped-card resources used for related drawing prompts.
   */
  cardsGroups: ArteRuimGroupData[];
  /**
   * Optional special-level cards and the selected resource-library variants.
   */
  specialLevels: {
    /**
     * The card resources or identifiers associated with this entry.
     */
    cards: ArteRuimCardData[];
    /**
     * The resource-library variants selected for the special levels.
     */
    types: Level4Type[];
  } | null;
};

/**
 * A `arte-ruim` drawing card annotated with its artist, submission, and matching success.
 */
export interface ArteRuimDrawing extends ArteRuimCardData {
  /**
   * Identifier of the player associated with this entry.
   */
  playerId: UID | null;
  /**
   * The serialized drawing submitted by the player, or null before submission.
   */
  drawing: string | null;
  /**
   * The matching success rate calculated for this drawing.
   */
  successRate: number;
}

/**
 * Server-side data retained between phases of a `arte-ruim` session.
 */
export interface ArteRuimStore extends DefaultStore {
  /**
   * The card collection retained for dealing or selecting game content.
   */
  deck: ArteRuimCardData[];
  /**
   * Cards assigned to the current round.
   */
  currentCards: ArteRuimCardData[] | ArteRuimDrawing[];
  /**
   * Drawings retained from completed rounds.
   */
  pastDrawings: ArteRuimDrawing[];
}

/**
 * Public game state shared with players during a `arte-ruim` session.
 */
export interface ArteRuimState extends DefaultState {
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Player data extended with `arte-ruim` submissions and progress.
 */
export interface ArteRuimPlayer extends Player {
  /**
   * Selected card identifiers indexed by the drawing being matched.
   */
  votes: any;
}

/**
 * Player records indexed by player identifier for `arte-ruim`.
 */
export type ArteRuimPlayers = Record<UID, ArteRuimPlayer>;

/**
 * The initial metadata, server-side store, and public state for a `arte-ruim` session.
 */
export interface ArteRuimInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: ArteRuimStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: ArteRuimState;
}

/**
 * Player action payload accepted by the `arte-ruim` engine.
 */
export interface ArteRuimSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof ARTE_RUIM_ACTIONS;
}

/**
 * Firestore document data used when reading the `arte-ruim` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & ArteRuimState;
/**
 * Firestore document data used when reading the `arte-ruim` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & ArteRuimStore;
/**
 * Firestore document data used when reading `arte-ruim` player records.
 */
export type FirebasePlayersData = FirebaseFirestore.DocumentData & ArteRuimPlayers;
