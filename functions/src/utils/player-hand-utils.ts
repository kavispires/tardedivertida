// Interfaces
import { PlainObject, PlayerId, Players } from './interfaces';
// Utils
import * as gameUtils from './game-utils';

/**
 * Deal cards to players from their own deck
 * @param players players object
 * @param handLimit how many cards a player can have in hand
 * @param [quantity] number of cards to be dealt
 * @param [playerId] if present, only this player will get cards
 * @returns
 */
export const dealPlayersCard = (
  players: Players,
  handLimit: number,
  quantity?: number,
  playerId?: PlayerId
): Players => {
  const toPlayers = playerId ? [playerId] : Object.keys(players);

  toPlayers.forEach((playerId) => {
    const player = players[playerId];
    const currentHand = player?.hand ?? [];
    const newHandLimit = quantity ? currentHand.length + quantity : handLimit;
    let currentDeckIndex = player?.deckIndex ?? -1;
    for (let i = currentHand.length; i < newHandLimit; i++) {
      currentHand.push(player.deck[currentDeckIndex + 1]);
      currentDeckIndex++;
    }

    player.hand = currentHand;
    player.deckIndex = currentDeckIndex;
  });

  return players;
};

/**
 * Deal cards to players from their own deck
 * @param players players object
 * @param quantity number of cards to be dealt
 * @param playerId if present, only this player will get cards
 * @param handLimit how many cards a player can have in hand
 * @returns
 */
export const discardPlayerCard = (
  players: Players,
  cardId: string,
  playerId: PlayerId,
  handLimit: number
): PlainObject => {
  const player = players[playerId];
  const currentHand = gameUtils.removeItem(player?.hand ?? [], cardId);

  let currentDeckIndex = player?.deckIndex ?? -1;
  for (let i = currentHand.length; i < handLimit; i++) {
    const deck = player.deck;
    currentHand.push(deck[currentDeckIndex + 1]);
    currentDeckIndex++;
  }

  player.hand = currentHand;
  player.deckIndex = currentDeckIndex;

  return {
    hand: currentHand,
    deckIndex: currentDeckIndex,
    players,
  };
};
