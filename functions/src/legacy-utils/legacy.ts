import { shuffle } from 'lodash';
// Services
import { throwHttpsError } from '../services/firebase-core';
// Mechanics
import { getListOfPlayers } from '../mechanics/players';

/**
 * Creates and distributes randomized numeric IDs to players as a specified property.
 * @param players - The players object to modify
 * @param startingId - The starting number for the ID range
 * @param endingId - The ending number for the ID range
 * @param propertyName - The property name to assign the ID to on each player
 * @param includeBots - Whether to include bot players in the distribution
 */
export const distributeNumberIds = (
  players: Players,
  startingId: number,
  endingId: number,
  propertyName: string,
  includeBots = false,
) => {
  const ids = shuffle(new Array(startingId + endingId + 1).fill(0).map((e, i) => e + i));
  // Add sheep id
  getListOfPlayers(players, includeBots).forEach((player, index) => {
    player[propertyName] = `${ids[index]}`;
  });
};

/**
 * Distributes items from a list to players in round-robin fashion.
 * @param players - The players object to modify
 * @param list - The array of items to distribute
 * @param quantityPerPlayer - How many items each player should receive
 * @param propertyName - The property name to assign the items to on each player
 */
export const dealItemsToPlayers = (
  players: Players,
  list: unknown[],
  quantityPerPlayer: number,
  propertyName: string,
  doItsBestToEvenlyDistribute = false,
) => {
  const playersList = getListOfPlayers(players);
  if (list.length < playersList.length * quantityPerPlayer && !doItsBestToEvenlyDistribute) {
    throwHttpsError('List has less items the needed', 'deal items to players');
  }

  if (quantityPerPlayer === 1) {
    playersList.forEach((player, index) => {
      player[propertyName] = list[index];
    });
    return players;
  }

  for (let i = 0; i < playersList.length * quantityPerPlayer; i++) {
    const player = playersList[i % playersList.length];
    if (player[propertyName] === undefined) {
      player[propertyName] = [];
    }

    if (list[i] !== undefined) {
      player[propertyName].push(list[i]);
    }
  }
};

/**
 * Deals items from the end of an array, removing them from the original array.
 * WARNING: This modifies the original array by popping items.
 * Game-specific utility for dealing cards/tokens during gameplay.
 * @param list - The array to deal from (will be modified)
 * @param quantity - The number of items to deal
 * @returns An array of dealt items
 */
export const dealItems = <T>(list: T[], quantity: number) => {
  const dealt: T[] = [];
  for (let i = 0; i < quantity; i++) {
    const item = list.pop();
    if (item) {
      dealt.push(item);
    }
  }
  return dealt;
};
