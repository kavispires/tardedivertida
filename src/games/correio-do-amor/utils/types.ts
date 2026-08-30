// Types
import type { Achievement, GamePlayer, GameRanking } from 'types/game';

export type CardTier = 'core' | 'plus' | 'advanced' | 'variant';
export type SetSelectionRule = 'COMBINE' | 'SINGLE';

export type FestaJuninaCard = {
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
   * Some cards will require the player to take an additional action after playing the card (e.g. selecting a target player)
   */
  requiresEffectInteraction?: boolean;
  /**
   * Determines when this card is allowed in the deck.
   * 'core' = Always included in the base game.
   * 'advanced' = Adds complexity; recommended for 5+ players.
   * 'variant' = Optional modifiers (like Rank 0).
   */
  setupTier: CardTier;
  /**
   * How the deck builder should treat this set.
   * 'COMBINE' = Add all specific quantities together up to the setLimit.
   * 'SINGLE' = Pick exactly 1 card from this set randomly.
   */
  setupRule: SetSelectionRule;
  /**
   * How many cards are currently in the round's deck
   */
  count: number;
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
export type LogEntry = {
  actorId: UID;
  cardId: UID;
  cardKey: string;
  cardKeyword: string;
  // Card Effect Actions
  options?: (string | number)[];
  selections?: PlaySelections;
  // Resolution Effects
  targetPlayersIds: UID[];
  resolutionKeyword: string | null;
  newOngoingEffect: OngoingEffect | null;
  eliminatedPlayersIds: UID[];
  effectInput?: UID | null;
  discardedCardId?: UID | null;
};

export type Play = Pick<
  LogEntry,
  'actorId' | 'cardId' | 'cardKey' | 'cardKeyword' | 'options' | 'selections'
>;

export type SubmitCardPayload = {
  payload: {
    playedCardId: UID;
    keptCardId: UID;
    playedEffect: string;
  };
};

export type PlaySelections = {
  /**
   * Primary selected target player for target-based effects
   */
  targetPlayerId?: UID | null;
  /**
   * Guess ID, the engine will handle how to use this:
   * - verify rank for GUESS_RANK
   * - verify name for GUESS_NAME
   * - verify 'SWAP' for SWAP_ASIDE
   * - verify the second target player id for FORCE_TRADE
   * - NO_TARGET_AVAILABLE when there is no available target player for the effect
   */
  effectInput?: UID;
};

export type SubmitSelectionsPayload = {
  selections: PlaySelections;
};

export type PhaseCardPlayState = {
  cardsDict: Dictionary<FestaJuninaCard>;
  deck: UID[];
  gameOrder: GameOrder;
  turnOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  ongoingEffects: OngoingEffect[];
  newCardsInDeck: UID[];
};

export type PhaseCardEffectsState = {
  cardsDict: Dictionary<FestaJuninaCard>;
  deck: UID[];
  gameOrder: GameOrder;
  turnOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  ongoingEffects: OngoingEffect[];
  play: Play;
  newCardsInDeck: UID[];
};

export type PhaseCardResolutionState = {
  cardsDict: Dictionary<FestaJuninaCard>;
  deck: UID[];
  gameOrder: GameOrder;
  turnOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  ongoingEffects: OngoingEffect[];
  log: LogEntry[];
  newCardsInDeck: UID[];
};

export type PhaseRoundRankingState = {
  cardsDict: Dictionary<FestaJuninaCard>;
  ongoingEffects: OngoingEffect[];
  ranking: GameRanking;
  cardsSetAside: UID[];
  outcome: string;
  newCardsInDeck: UID[];
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
   * Array of winning players
   */
  winners: GamePlayer[];
  /**
   * List of achievements earned by players
   */
  achievements: Achievement[];
  /**
   * Dictionary of all cards in the game, used for displaying card information in the results
   */
  cardsDict: Dictionary<FestaJuninaCard>;
};
