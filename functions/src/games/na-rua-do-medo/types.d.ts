// Types
import type { NA_RUA_DO_MEDO_ACTIONS } from './constants';

/**
 * Configuration options used when creating a `na-rua-do-medo` session.
 */
export type NoRuaDoMedoOptions = {
  /**
   * Whether to use the shorter round count.
   */
  shortGame: boolean;
};

/**
 * A candy, horror, or jackpot card revealed while trick-or-treating.
 */
export type HouseCard = {
  /**
   * Unique identifier of this game entry.
   */
  id: string;
  /**
   * The key used to identify or group this entry.
   */
  key: string;
  /**
   * The localized display name of this entry.
   */
  name: DualLanguageValue;
  /**
   * Whether the house reveals candy, a horror, or a jackpot.
   */
  type: 'horror' | 'candy' | 'jackpot';
  /**
   * The display value, score value, or movement amount carried by this entry.
   */
  value: number;
};

/**
 * Candy, horror, and jackpot decks with their horror occurrence counters.
 */
export type Decks = {
  /**
   * Horror cards available for building street decks.
   */
  horrorDeck: HouseCard[];
  /**
   * Jackpot cards unlocked as the game advances.
   */
  jackpotDeck: HouseCard[];
  /**
   * Candy-value cards used to build each street.
   */
  candyDeck: HouseCard[];
  /**
   * The number of revealed occurrences of each horror key.
   */
  horrorCount: Dictionary<number>;
};

/**
 * Candy distributed per player and left unclaimed on the sidewalk.
 */
export type CandyStatus = {
  /**
   * Candy left unclaimed after distributing the card.
   */
  leftover: number;
  /**
   * Candy awarded to each eligible player from this card.
   */
  perPlayer: number;
};

/**
 * The street progression decision and whether another card should be revealed.
 */
export type Outcome = {
  /**
   * The resolution status of the current trick-or-treat decision.
   */
  status: string;
  /**
   * Whether resolving this outcome reveals another street card.
   */
  flipCard: boolean;
  /**
   * Whether all players have finished trick-or-treating on this street.
   */
  isEverybodyHome?: boolean;
};

/**
 * Server-side data retained between phases of a `na-rua-do-medo` session.
 */
export interface NoRuaDoMedoStore extends DefaultStore {
  /**
   * Horror cards available for building street decks.
   */
  horrorDeck: HouseCard[];
  /**
   * Jackpot cards unlocked as the game advances.
   */
  jackpotDeck: HouseCard[];
  /**
   * Candy-value cards used to build each street.
   */
  candyDeck: HouseCard[];
  /**
   * Identifiers of horror cards excluded from later street decks.
   */
  usedHorrorIds: string[];
  /**
   * Identifiers of jackpots already claimed by players.
   */
  claimedJackpotIds: string[];
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Public game state shared with players during a `na-rua-do-medo` session.
 */
export interface NoRuaDoMedoState extends DefaultState {
  /**
   * Cards revealed along the current street.
   */
  street?: HouseCard[];
  /**
   * The card most recently revealed on the street.
   */
  currentCard?: HouseCard;
  /**
   * Per-card candy shares and unclaimed candy left on the street.
   */
  candySidewalk?: CandyStatus[];
  /**
   * The total unclaimed candy still available on the sidewalk.
   */
  totalCandyInSidewalk?: number;
  /**
   * Whether all players have finished trick-or-treating on this street.
   */
  isEverybodyHome?: boolean;
  /**
   * Whether the street ended because a horror appeared a second time.
   */
  isDoubleHorror?: boolean;
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * The initial metadata, server-side store, and public state for a `na-rua-do-medo` session.
 */
export interface NoRuaDoMedoInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: NoRuaDoMedoStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: NoRuaDoMedoState;
}

/**
 * Player action payload accepted by the `na-rua-do-medo` engine.
 */
export interface NaRuaDoMedoSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
  action: keyof typeof NA_RUA_DO_MEDO_ACTIONS;
}

/**
 * Firestore document data used when reading the `na-rua-do-medo` state.
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData | NoRuaDoMedoState;
/**
 * Firestore document data used when reading the `na-rua-do-medo` server-side store.
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData | NoRuaDoMedoStore;

/**
 * The choices to continue trick-or-treating, return home, or remain at home.
 */
export type Decisions = 'CONTINUE' | 'GO_HOME' | 'HOME';
