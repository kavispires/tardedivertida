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

/**
 * Card tier controlling when a card becomes eligible for round setup.
 */
export type SetupCardTier = 'core' | 'plus' | 'advanced' | 'variant';
/**
 * Whether cards of the same rank are combined or replace one another during setup.
 */
export type SetupSelectionRule = 'COMBINE' | 'SINGLE';

/**
 * Resource definition of a Festa Junina card, including setup rules and card effects.
 */
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
   * The description of the passive effect (if any)
   */
  passiveEffect?: DualLanguageValue;
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
   * Some cards will require the player to take an additional action after playing the card (e.g. selecting a target player)
   */
  requiresEffectInteraction?: boolean;
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
  setupTier: SetupCardTier;
  /**
   * How the deck builder should treat this set.
   * 'COMBINE' = Add all specific quantities together up to the setLimit.
   * 'SINGLE' = Pick exactly 1 card from this set.
   */
  setupRule: SetupSelectionRule;
  /**
   * Whether the card is currently disabled and should not be used in the game
   */
  disabled?: boolean;
};

/**
 * The resource fields retained for a Festa Junina card during gameplay.
 */
export type FestaJuninaCard = Pick<
  FestaJuninaDatabaseEntry,
  | 'id'
  | 'rank'
  | 'imageId'
  | 'quantity'
  | 'keyword'
  | 'requiresEffectInteraction'
  | 'color'
  | 'setupRule'
  | 'setupTier'
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
   * The description of the passive effect (if any)
   */
  passiveEffect?: string;
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
  /**
   * Card definitions indexed by their resource identifier.
   */
  cardsDict: Dictionary<FestaJuninaCard>;
  /**
   * The rotation of plus-tier cards introduced as rounds progress.
   */
  plusRotation: UID[];
  /**
   * The rotation of advanced cards introduced in later rounds.
   */
  advancedRotation: UID[];
};

/**
 * Player selections supplied to resolve a card's targeted or interactive effect.
 */
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
 * Entry for ongoing effect that persist on a full turn or round
 */
export type OngoingEffect = {
  /**
   * Identifier of the player affected by the ongoing effect.
   */
  affectedPlayerId: UID;
  /**
   * The effect keyword used to resolve this ongoing effect.
   */
  effectKeyword: string;
  /**
   * The category used to distinguish this entry during game resolution.
   */
  type: 'TURN' | 'ROUND';
};

/**
 * Results of the current round, including ongoing effects and eliminated players
 */
export type LogEntry = {
  /**
   * Identifier of the player who played the card.
   */
  actorId: UID;
  /**
   * Identifier of the card associated with this entry.
   */
  cardId: UID;
  /**
   * The base card identifier without its copy-specific suffix.
   */
  cardKey: string;
  /**
   * The played card's effect keyword.
   */
  cardKeyword: string;
  // Card Effect Actions
  /**
   * Available card-effect inputs recorded for this play.
   */
  options?: (string | number)[];
  /**
   * Target and effect-input selections supplied for this play.
   */
  selections?: PlaySelections;
  // Resolution Effects
  /**
   * Identifiers of players targeted by the card effect.
   */
  targetPlayersIds: UID[];
  /**
   * The resolved effect outcome, or null before resolution.
   */
  resolutionKeyword: string | null;
  /**
   * The ongoing effect created by this play, or null when none is created.
   */
  newOngoingEffect: OngoingEffect | null;
  /**
   * The additional input selected to resolve an interactive card effect.
   */
  effectInput?: UID | null;
  /**
   * Identifier of the card discarded while resolving the effect.
   */
  discardedCardId?: UID | null;
  /**
   * Identifiers of players eliminated by this play.
   */
  eliminatedPlayersIds: UID[];
  /**
   * Identifier of the player responsible for the elimination.
   */
  eliminatedByPlayerId?: UID | null;
};

/**
 * The actor, card, and submitted selections needed to record a card play.
 */
export type Play = Pick<
  LogEntry,
  'actorId' | 'cardId' | 'cardKey' | 'cardKeyword' | 'options' | 'selections'
>;

/**
 * Game store persisting across phases
 */
export interface CorreioDoAmorStore extends DefaultStore<CorreioDoAmorOptions> {
  // TODO: Add game-specific store properties
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Game state for the current phase
 */
export interface CorreioDoAmorState extends DefaultState {
  // TODO: Add game-specific state properties
  /**
   * Additional game-specific fields populated as the session progresses.
   */
  [key: string]: AnyOrUnknownPlaceholder;
}

/**
 * Initial state structure for new game sessions
 */
export interface CorreioDoAmorInitialState extends InitialState {
  /**
   * The game-specific server-side store initialized for the session.
   */
  store: CorreioDoAmorStore;
  /**
   * The game-specific state exposed to the session.
   */
  state: CorreioDoAmorState;
}

/**
 * Player action submission payload
 */
export interface CorreioDoAmorSubmitAction extends Payload {
  /**
   * The game action identifier used to select the submission handler.
   */
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
