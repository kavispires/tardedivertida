// functions/src/engine/na-fila-do-banco/helpers.ts
import { CARD_COLORS, CHARACTER_TYPES, NA_FILA_DO_BANCO_PHASES, OUTCOME, TELLERS } from './constants';
import type { ClientCard, Teller } from './types';
import { shuffle } from 'lodash';
// Utils
import utils from '../../utils_LEGACY';
import { AVATARS_COLORS } from '../../constants/avatars';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the round
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: string): string => {
  const { SETUP, CARD_PLAY, ROUND_RESOLUTION, GAME_OVER } = NA_FILA_DO_BANCO_PHASES;
  const order = [SETUP, CARD_PLAY, ROUND_RESOLUTION, GAME_OVER];

  if (currentPhase === CARD_PLAY) {
    return outcome === OUTCOME.END_ROUND ? ROUND_RESOLUTION : CARD_PLAY;
  }

  if (currentPhase === ROUND_RESOLUTION) {
    if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
      return GAME_OVER;
    }

    return CARD_PLAY;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds the deck of client cards for all players
 * @param players - The collection of players in the game
 */
export const buildDeck = (players: Players): ClientCard[] => {
  const deck: ClientCard[] = [];
  let decksCount = -1;
  const playerCount = Object.keys(players).length;

  const orderedCharacterTypes = [
    CHARACTER_TYPES.KID,
    CHARACTER_TYPES.RETIREE,
    CHARACTER_TYPES.VETERAN,
    CHARACTER_TYPES.MOTHER,
    CHARACTER_TYPES.BUSINESSMAN,
    CHARACTER_TYPES.STUDENT,
    CHARACTER_TYPES.MOTOBOY,
  ];

  utils.players.getListOfPlayers(players).forEach((player) => {
    decksCount++;
    let color = CARD_COLORS[decksCount];
    player.deckColors = [color];
    player.deckColor = color;
    player.onlineTriggerCount = 0;

    orderedCharacterTypes.forEach((type, index) => {
      deck.push({
        id: `${player.id}-${type}-${color}`,
        type,
        playerId: player.id,
        color,
        imageId: `nfdb-${color}-${index}`,
      });
    });

    if (playerCount === 2) {
      decksCount++;
      color = CARD_COLORS[decksCount];
      player.deckColors.push(color);
      orderedCharacterTypes.forEach((type, index) => {
        // For 2 players, add an extra card of each type for each player to make the game more dynamic
        deck.push({
          id: `${player.id}-${type}-${color}-2`,
          type,
          playerId: player.id,
          color,
          imageId: `nfdb-${color}-${index}`,
        });
      });
    }
  });

  // Add additional deck of neutral color
  orderedCharacterTypes.forEach((type, index) => {
    const color = 'neutral';
    deck.push({
      id: `neutral-${type}`,
      type,
      playerId: 'neutral',
      color,
      imageId: `nfdb-${color}-${index}`,
    });
  });

  return shuffle(deck);
};

/**
 * Gets available colors for bots and neutral decks that are distant enough from player colors and from each other
 * @param players - The players object
 * @param minDistance - Minimum hue distance required between colors (default: 2)
 * @returns Array of available avatar IDs that are well-separated
 */
export const getDistantColors = (players: Players, minDistance = 2): string[] => {
  // Get hue values of colors used by players
  const usedHues = utils.players
    .getListOfPlayers(players)
    .map((player) => AVATARS_COLORS[player.avatarId]?.hue)
    .filter((hue): hue is number => hue !== undefined);

  // Helper function to check if a hue is distant enough from a list of hues
  const isDistantFrom = (hue: number, targetHues: number[]): boolean => {
    return targetHues.every((targetHue) => {
      const diff = Math.abs(hue - targetHue);
      const wrappedDiff = Math.min(diff, 360 - diff);
      return wrappedDiff >= minDistance;
    });
  };

  // Filter colors that are distant enough from player colors
  const candidateIds = Object.keys(AVATARS_COLORS).filter((id) => {
    const colorHue = AVATARS_COLORS[id].hue;
    return isDistantFrom(colorHue, usedHues);
  });

  // Sort candidates by hue for consistent selection
  candidateIds.sort((a, b) => AVATARS_COLORS[a].hue - AVATARS_COLORS[b].hue);

  // Select colors that are also distant from each other
  const selectedIds: string[] = [];
  const selectedHues: number[] = [];

  for (const id of candidateIds) {
    const hue = AVATARS_COLORS[id].hue;
    if (isDistantFrom(hue, selectedHues)) {
      selectedIds.push(id);
      selectedHues.push(hue);
    }
  }

  return selectedIds;
};

/**
 * Builds tellers with capacities adjusted for player count and current round
 * @param playerCount - The number of players in the game
 * @param currentRound - The current round number
 */
export const buildTellers = (playerCount: number, currentRound: number): Dictionary<Teller> => {
  const tellers: Dictionary<Teller> = {};
  const cuttingCapacity = [0, 0, 3, 3, 4, 4][playerCount]; // The number of capacities to remove from the end of the array based on player count, to adjust the game difficulty. For example, with 3 players, it removes the last 3 capacities, which are the higher ones, to make the game easier with less players
  TELLERS.forEach((teller, index) => {
    tellers[teller.id] = {
      id: teller.id,
      imageId: `nfdb-teller-${teller.id}`,
      type: teller.type,
      doublers: teller.doublers,
      capacity: teller.capacitiesPerRound[currentRound].slice(
        0,
        Math.max(3, cuttingCapacity) + (index === currentRound ? 1 : 0),
      ), // It removes the end of the array, which has the higher capacities, to adjust to the player count, Each round one teller has an extra capacity.
      queue: [],
      lastEvent: null, // Initialize lastEvent as null, it will be updated with the snapshot of the queue before the event when a card is played in this teller
    };
  });
  return tellers;
};
