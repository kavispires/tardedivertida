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
  /**
   * How many cards are currently in the round's deck
   */
  count: number;
};

export type SubmitCardPayload = {
  playedCardId: UID;
  keptCardId: UID;
  playedEffect: string;
};

export type PhaseCardPlayState = {
  cardsDict: Dictionary<FestaJuninaCard>;
  deck: UID[];
  gameOrder: GameOrder;
  turnOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  activeEffectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
};
