import utils from './index';

/**
 * Sets up the game by distributing cards to players.
 * @param store - The game store object
 * @param players - The object containing player information
 * @param cards - An array of cards
 * @param cardsPerPlayer - The number of cards to distribute per player
 */
export const setup = <T>(store: PlainObject, players: Players, cards: T[], cardsPerPlayer: number) => {
  const shuffledSplitDeck = utils.helpers.sliceIntoChunks(cards, cardsPerPlayer);
  store.decks = {};

  utils.players.getListOfPlayers(players).forEach((player, index) => {
    player.hand = [];
    store.decks[player.id] = {
      deck: shuffledSplitDeck[index],
      discard: [],
    };
  });
};

/**
 * Draws cards from the player's deck and adds them to the player's hand.
 * @param store - The game store object
 * @param players - The object containing player information
 * @param playerId - The ID of the player
 * @param quantity - The number of cards to draw
 */
export const draw = (store: PlainObject, players: Players, playerId: UID, quantity = 1) => {
  if (!store.decks?.[playerId]) {
    return;
  }

  const deck = store.decks[playerId].deck;
  const availableCards = Math.min(quantity, deck.length);

  const cards = Array(availableCards)
    .fill(0)
    .map(() => deck.pop())
    .filter((card) => card !== undefined);

  players[playerId].hand = [...players[playerId].hand, ...cards];
};

/**
 * Deals cards to all players.
 * @param store - The game store object
 * @param players - The object containing player information
 * @param quantity - The number of cards to deal to each player
 * @param forThesePlayers - An optional array of player IDs to specify which players should receive cards
 */
export const deal = (store: PlainObject, players: Players, quantity = 1, forThesePlayers?: UID[]) => {
  const targetPlayers = forThesePlayers
    ? utils.players.getListOfPlayers(players).filter((player) => forThesePlayers.includes(player.id))
    : utils.players.getListOfPlayers(players);

  targetPlayers.forEach((player) => {
    draw(store, players, player.id, quantity);
  });
};

/**
 * Discards a specific card from the player's hand and adds it to the discard pile.
 * @param store - The game store object
 * @param players - The object containing player information
 * @param playerId - The ID of the player
 * @param cardId - The ID of the card to discard
 */
export const discard = (store: PlainObject, players: Players, playerId: UID, cardId: UID) => {
  if (!store.decks?.[playerId]) {
    return;
  }

  players[playerId].hand = players[playerId].hand.filter((card: unknown) => {
    if (typeof card === 'object' && card !== null && 'id' in card) {
      const cardWithId = card as { id: UID };
      if (cardWithId.id === cardId) {
        store.decks[playerId].discard.push(card);
      }
      return cardWithId.id !== cardId;
    }

    if (card === cardId) {
      store.decks[playerId].discard.push(card);
    }
    return card !== cardId;
  });
};

/**
 * Discards multiple cards from the player's hand.
 * @param store - The game store object
 * @param players - The object containing player information
 * @param playerId - The ID of the player
 * @param cardIds - An array of card IDs to discard
 */
export const discardMultiple = (store: PlainObject, players: Players, playerId: UID, cardIds: UID[]) => {
  cardIds.forEach((cardId) => {
    discard(store, players, playerId, cardId);
  });
};

/**
 * Shuffles the discard pile back into the deck.
 * @param store - The game store object
 * @param playerId - The ID of the player
 * @param options - Optional configuration
 */
export const reshuffle = (
  store: PlainObject,
  playerId: UID,
  options?: { keepTopCard?: boolean; shuffleBeforeMerge?: boolean },
) => {
  if (!store.decks?.[playerId]) {
    return;
  }

  const { discard: discardPile, deck } = store.decks[playerId];

  if (discardPile.length === 0) {
    return;
  }

  let cardsToShuffle = [...discardPile];

  // Keep the top card of the discard pile if specified
  if (options?.keepTopCard && discardPile.length > 1) {
    cardsToShuffle = discardPile.slice(0, -1);
    store.decks[playerId].discard = [discardPile[discardPile.length - 1]];
  } else {
    store.decks[playerId].discard = [];
  }

  // Optionally shuffle the discard pile before merging
  if (options?.shuffleBeforeMerge) {
    cardsToShuffle = utils.helpers.shuffle(cardsToShuffle);
  }

  // Add shuffled cards back to the bottom of the deck
  store.decks[playerId].deck = [...cardsToShuffle, ...deck];
};

/**
 * Draws cards from the player's deck, automatically reshuffling the discard pile if needed.
 * @param store - The game store object
 * @param players - The object containing player information
 * @param playerId - The ID of the player
 * @param quantity - The number of cards to draw
 * @param autoReshuffle - Whether to automatically reshuffle when deck is empty
 */
export const drawOrReshuffle = (
  store: PlainObject,
  players: Players,
  playerId: UID,
  quantity = 1,
  autoReshuffle = true,
) => {
  if (!store.decks?.[playerId]) {
    return;
  }

  const deckSize = getDeckSize(store, playerId);

  // Reshuffle if deck doesn't have enough cards
  if (autoReshuffle && deckSize < quantity && getDiscardSize(store, playerId) > 0) {
    reshuffle(store, playerId, { shuffleBeforeMerge: true });
  }

  draw(store, players, playerId, quantity);
};

/**
 * Gets the number of cards remaining in the player's deck.
 * @param store - The game store object
 * @param playerId - The ID of the player
 */
export const getDeckSize = (store: PlainObject, playerId: UID): number => {
  return store.decks?.[playerId]?.deck?.length ?? 0;
};

/**
 * Gets the number of cards in the player's discard pile.
 * @param store - The game store object
 * @param playerId - The ID of the player
 */
export const getDiscardSize = (store: PlainObject, playerId: UID): number => {
  return store.decks?.[playerId]?.discard?.length ?? 0;
};

/**
 * Peeks at the top N cards of the player's deck without removing them.
 * @param store - The game store object
 * @param playerId - The ID of the player
 * @param quantity - The number of cards to peek at
 */
export const peek = <T = unknown>(store: PlainObject, playerId: UID, quantity = 1): T[] => {
  if (!store.decks?.[playerId]) {
    return [];
  }

  const deck = store.decks[playerId].deck;
  const availableCards = Math.min(quantity, deck.length);

  return deck.slice(-availableCards).reverse();
};

/**
 * Shuffles the player's current deck in place.
 * @param store - The game store object
 * @param playerId - The ID of the player
 */
export const shuffleDeck = (store: PlainObject, playerId: UID) => {
  if (!store.decks?.[playerId]) {
    return;
  }

  store.decks[playerId].deck = utils.helpers.shuffle(store.decks[playerId].deck);
};

/**
 * Checks if the player's deck is empty.
 * @param store - The game store object
 * @param playerId - The ID of the player
 * @param includeDiscard - Whether to also consider the discard pile
 */
export const isEmpty = (store: PlainObject, playerId: UID, includeDiscard = false): boolean => {
  if (!store.decks?.[playerId]) {
    return true;
  }

  const deckEmpty = getDeckSize(store, playerId) === 0;

  if (includeDiscard) {
    return deckEmpty && getDiscardSize(store, playerId) === 0;
  }

  return deckEmpty;
};

/**
 * Checks if the player has enough cards available to draw.
 * @param store - The game store object
 * @param playerId - The ID of the player
 * @param quantity - The number of cards needed
 * @param includeDiscard - Whether to also consider the discard pile
 */
export const hasEnoughCards = (
  store: PlainObject,
  playerId: UID,
  quantity: number,
  includeDiscard = false,
): boolean => {
  if (!store.decks?.[playerId]) {
    return false;
  }

  const available = getDeckSize(store, playerId) + (includeDiscard ? getDiscardSize(store, playerId) : 0);

  return available >= quantity;
};
