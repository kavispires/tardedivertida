import utils from './index';

/**
 * Sets up the game by distributing cards to players.
 * @template T - The type of the cards array.
 * @param store - The game store object.
 * @param players - The object containing player information.
 * @param cards - An array of cards.
 * @param cardsPerPlayer - The number of cards to distribute per player.
 * @returns - it modifies store and players
 */
export const setup = <T>(store: PlainObject, players: Players, cards: T[], cardsPerPlayer: number) => {
  const shuffledSplitDeck = utils.game.sliceIntoChunks(cards, cardsPerPlayer);
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
 * @param store - The game store object.
 * @param players - The object containing player information.
 * @param playerId - The ID of the player.
 * @param [quantity=1] - The number of cards to draw.
 * @returns - it modifies store and players
 */
export const draw = (store: PlainObject, players: Players, playerId: PlayerId, quantity = 1) => {
  const cards = Array(quantity)
    .fill(0)
    .map(() => store.decks[playerId].deck.pop());

  players[playerId].hand = [...players[playerId].hand, ...cards];
};

/**
 * Deals cards to all players.
 * @param store - The game store object.
 * @param players - The object containing player information.
 * @param [quantity=1] - The number of cards to deal to each player.
 * @returns - it modifies store and players
 */
export const deal = (store: PlainObject, players: Players, quantity = 1) => {
  utils.players.getListOfPlayers(players).forEach((player) => {
    draw(store, players, player.id, quantity);
  });
};

/**
 * Discards a specific card from the player's hand.
 * @param store - The game store object.
 * @param players - The object containing player information.
 * @param playerId - The ID of the player.
 * @param cardId - The ID of the card to discard.
 * @returns - it modifies store and players
 */
export const discard = (store: PlainObject, players: Players, playerId: PlayerId, cardId: CardId) => {
  players[playerId].hand = players[playerId].hand.filter((card: any) => {
    if (typeof card === 'object' && card?.id) {
      if (card.id === cardId) {
        store.decks[playerId].discard = card;
      }
      return card.id !== cardId;
    }

    if (card === cardId) {
      store.decks[playerId].discard = card;
    }
    return card !== cardId;
  });
};
