// Types
import type { CORREIO_DO_AMOR_ACTIONS } from './constants';

/**
 * Game options for CorreioDoAmor
 */
export type CorreioDoAmorOptions = {
  /**
   * How the deck should be built (chaotic means more random special cards)
   */
  chaoticDeck: boolean;
};

export type CardTier = 'core' | 'plus' | 'advanced' | 'variant';
export type SetSelectionRule = 'COMBINE' | 'SINGLE';

export type FestaJuninaDatabaseEntry = {
  /**
   * Unique identifier for the card
   */
  id: UID;
  /**
   * Rank of the card (0-11)
   */
  rank: number;
  /**
   * The id of the image associated with the card
   */
  imageId: string;
  /**
   * The name of the card
   */
  name: DualLanguageValue;
  /**
   * The description of the power
   */
  effect: DualLanguageValue;
  /**
   * A short flavor text describing the card within the theme
   */
  flavorText: DualLanguageValue;
  /**
   * The number of cards in the deck
   */
  quantity: number;
  /**
   * Keyword corresponding to the card's effect (e.g 'SWAP', 'PEEK', etc)
   */
  keyword: string;
  /**
   * The color of the card for UI purposes
   */
  color: string;
  /**
   * Determines when this card is allowed in the deck.
   * 'core' = Always included in the base game.
   * 'advanced' = Adds complexity; recommended for 5+ players.
   * 'variant' = Optional modifiers (like Rank 0).
   */
  tier: CardTier;
  /**
   * Name of the group the card belongs to like gender pairs
   */
  setName: string;
  /**
   * How the deck builder should treat this set.
   * 'COMBINE' = Add all specific quantities together up to the setLimit.
   * 'RANDOM_SINGLE' = Pick exactly 1 card from this set randomly.
   */
  setRule: SetSelectionRule;
};

export type FestaJuninaCard = Pick<
  FestaJuninaDatabaseEntry,
  'id' | 'rank' | 'imageId' | 'quantity' | 'keyword' | 'color' | 'setName' | 'setRule' | 'tier'
> & {
  /**
   * The name of the card
   */
  name: string;
  /**
   * The description of the power
   */
  effect: string;
  /**
   * A short flavor text describing the card within the theme
   */
  flavorText: string;
  /**
   * How many cards are currently in the round's deck
   */
  count: number;
};

/**
 * Resource data loaded from TDR resources
 */
export type ResourceData = {
  cardsDict: Dictionary<FestaJuninaCard>;
  plusRotation: UID[];
  advancedRotation: UID[];
};

export type PlaySelections = {
  /**
   * Primary selected target player for target-based effects
   */
  targetPlayerId?: UID | null;
  /**
   * The engine will handle how to use this:
   * - verify rank for GUESS_RANK
   * - verify name for GUESS_NAME
   * - verify 'SWAP' for SWAP_ASIDE
   * - verify the second target player id for FORCE_TRADE
   */
  effectInput?: UID;
};

/**
 * Current play information for the current turn
 */
export type Play = {
  activeCardId: UID | null;
  effectKeyword: string | null;
  options?: (string | number)[];
  selections?: PlaySelections;
};

/**
 * Entry for ongoing effect that persist on a full turn or round
 */
export type OngoingEffect = {
  affectedPlayerId: UID;
  effectKeyword: string;
  type: 'TURN' | 'ROUND';
};

/**
 * Results of the current round, including ongoing effects and eliminated players
 */
export type ResolutionLog = {
  playedCardId: UID;
  actorPlayerId: UID;
  targetPlayersIds: UID[];
  ongoingEffect: OngoingEffect | null;
  eliminatedPlayersIds: UID[];
  resolutionKeyword: string | null;
  effectInput?: UID | null;
};

/**
 * Game store persisting across phases
 */
export interface CorreioDoAmorStore extends DefaultStore<CorreioDoAmorOptions> {
  // TODO: Add game-specific store properties
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Game state for the current phase
 */
export interface CorreioDoAmorState extends DefaultState {
  // TODO: Add game-specific state properties
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Initial state structure for new game sessions
 */
export interface CorreioDoAmorInitialState extends InitialState {
  store: CorreioDoAmorStore;
  state: CorreioDoAmorState;
}

/**
 * Player action submission payload
 */
export interface CorreioDoAmorSubmitAction extends Payload {
  action: keyof typeof CORREIO_DO_AMOR_ACTIONS;
}

/**
 * Firebase-compatible state type
 */
export type FirebaseStateData = FirebaseFirestore.DocumentData & CorreioDoAmorState;

/**
 * Firebase-compatible store type
 */
export type FirebaseStoreData = FirebaseFirestore.DocumentData & CorreioDoAmorStore;
