// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Utils
import { SEPARATOR } from '@utils/constants';

/**
 * Creates a glyph reference dictionary where true means positive and false means negative
 * @param positive
 * @param negative
 * @returns
 */
export const prepareGlyphs = (
  positive: Dictionary<boolean>,
  negative: Dictionary<boolean>,
): Dictionary<boolean> => {
  const dict: Dictionary<boolean> = {};
  Object.keys(positive).forEach((key) => {
    dict[key] = true;
  });
  Object.keys(negative).forEach((key) => {
    dict[key] = false;
  });

  return dict;
};

export const parseSelectedGlyphs = (glyphs: Dictionary<boolean>) => {
  const positive: string[] = [];
  const negative: string[] = [];

  Object.keys(glyphs).forEach((id) => {
    if (glyphs[id]) {
      positive.push(id);
    } else {
      negative.push(id);
    }
  });

  while (positive.length < 3) {
    positive.push('');
  }

  while (negative.length < 3) {
    negative.push('');
  }

  return [positive, negative];
};

/**
 * Get list of players on each voted character
 * @param players
 * @param votes
 * @returns
 */
export const getRibbons = (players: GamePlayers, votes: Dictionary<string>): Record<string, GamePlayer[]> => {
  const votesDict: Record<string, GamePlayer[]> = {};

  Object.keys(votes).forEach((playerEntry) => {
    const playerId = playerEntry.split(SEPARATOR)[1];
    const characterId = votes[playerEntry].split(SEPARATOR)[1];

    if (votesDict[characterId] === undefined) {
      votesDict[characterId] = [];
    }

    votesDict[characterId].push(players[playerId]);
  });

  return votesDict;
};

/**
 * Removes prefixes from votes
 * @param votes
 * @returns
 */
export const prepareGuesses = (votes: Dictionary<string>): Dictionary<string> => {
  const result: Dictionary<string> = {};

  Object.keys(votes).forEach((playerEntry) => {
    const playerId = playerEntry.split(SEPARATOR)[1];
    const characterId = votes[playerEntry].split(SEPARATOR)[1];

    result[playerId] = characterId;
  });

  return result;
};
