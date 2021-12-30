// Types
import { PlainObject, Players } from '../../utils/types';
import { Results, Table } from './types';
// Constants
import { SEPARATOR } from '../../utils/constants';
import { SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  isGameOver?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, TELL_DREAM, MATCH, RESOLUTION, LAST_CHANCE, GAME_OVER } = SONHOS_PESADELOS_PHASES;
  const order = [RULES, SETUP, TELL_DREAM, MATCH, RESOLUTION];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    if (triggerLastRound) {
      return GAME_OVER;
    }
    if (currentRound < TOTAL_ROUNDS) {
      return TELL_DREAM;
    }
    if (currentRound === TOTAL_ROUNDS) {
      return LAST_CHANCE;
    }
    return GAME_OVER;
  }

  if (currentPhase === LAST_CHANCE) {
    return RESOLUTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TELL_DREAM;
};

export const determineGameOver = (results: PlainObject) => {
  return Object.values(results ?? {}).some((result) => result.win);
};

export const buildTable = (images: string[]): Table => {
  return images.map((cardId) => ({
    cardId,
    dreamer: null,
    nightmares: [],
  }));
};

/**
 * Determine dreams for each player and dreamer for each card
 * @param players
 * @param table
 * @param dreamsCount
 */
export const determineDreams = (players: Players, table: Table, dreamsCount: number) => {
  const shuffledTableIndexes = gameUtils.shuffle(
    Array(table.length)
      .fill(0)
      .map((e, i) => e + i)
  );
  let currentIndex = 0;

  Object.values(players).forEach((player) => {
    for (let d = 0; d < dreamsCount; d++) {
      if (!player.dreams) {
        player.dreams = {};
      }
      player.dreams[table[shuffledTableIndexes[currentIndex]].cardId] = [];
      table[shuffledTableIndexes[currentIndex]].dreamer = player.id;

      currentIndex++;
    }
  });
};

/**
 * Determine nightmares for each player and players for each card nightmares
 * @param players
 * @param table
 * @param nightmareCount
 */
export const determineNightmares = (players: Players, table: Table, nightmareCount: number) => {
  const cardIndexDict = table.reduce((acc, entry, index) => {
    acc[entry.cardId] = index;
    return acc;
  }, {});

  const cardIds = Object.keys(cardIndexDict);

  Object.values(players).forEach((player) => {
    const filteredNightmares = gameUtils.shuffle(
      cardIds.filter((cardId) => !Object.keys(player.dreams).includes(cardId))
    );

    for (let n = 0; n < nightmareCount; n++) {
      if (!player.nightmares) {
        player.nightmares = [];
      }
      const cardId = filteredNightmares[n];
      player.nightmares.push(cardId);
      table[cardIndexDict[cardId]].nightmares.push(player.id);
    }
  });
};

export const gatherClues = (players: Players): PlainObject[] => {
  const clues = Object.values(players).reduce((acc: PlainObject[], player) => {
    Object.keys(player.dreams).forEach((cardId) => {
      acc.push({
        cardId,
        playerId: player.id,
        clue: player.dreams[cardId].reverse(),
      });
    });

    return acc;
  }, []);

  return gameUtils.shuffle(clues);
};

const parseVote = (voteId: string): string => voteId.split(SEPARATOR)[1];

export const tallyScore = (players: Players, previousScore: PlainObject, goal: number): Results => {
  const results: Results = {};
  // Build nightmares dict count to add players who voted to user's nightmare
  const nightmareCount = Object.values(players).reduce((acc, player) => {
    player.nightmares.forEach((nightmareId: string) => {
      acc[nightmareId] = {};
    });
    return acc;
  }, {});

  // Build nightmares dictionary cardId: nightmareId[]
  const dreamNightmaresDict = Object.values(players).reduce((acc, player) => {
    Object.keys(player.dreams).forEach((dreamId: string) => {
      acc[dreamId] = player.nightmares;
    });
    return acc;
  }, {});

  // Tally correct votes
  Object.values(players).forEach((player) => {
    results[player.id] = {
      playerId: player.id,
      dreamGuesses: {},
      correct: 0,
      nightmareHits: [],
      win: false,
      previousScore: previousScore?.[player.id]?.correct ?? 0,
    };

    Object.keys(player.votes).forEach((clueEntryId) => {
      const clueVoteId = parseVote(clueEntryId);
      const cardVoteId = parseVote(player.votes[clueEntryId]);

      // Check if its their own card
      if (player.dreams[cardVoteId]) {
        return;
      }

      // Add if correct vote
      if (cardVoteId === clueVoteId) {
        results[player.id].dreamGuesses[cardVoteId] = true;
      } else if (
        // Add if nightmare and not player's own
        dreamNightmaresDict[clueVoteId].includes(cardVoteId)
      ) {
        nightmareCount[cardVoteId][player.id] = clueVoteId;
      }
    });
  });

  // Finish counts
  Object.values(results).forEach((result) => {
    const entry = results[result.playerId];
    // Add correct count
    results[result.playerId].correct = Object.keys(entry.dreamGuesses).length;
    // Add nightmareHits
    players[result.playerId].nightmares.forEach((nightmareId) => {
      if (Object.keys(nightmareCount[nightmareId]).length) {
        results[result.playerId].nightmareHits.push(nightmareCount[nightmareId]);
      }
    });
    // Determine win
    results[result.playerId].win =
      results[result.playerId].correct === goal && results[result.playerId].nightmareHits.length === 0;
    // Add player score
    players[result.playerId].score = results[result.playerId].correct;
  });

  return results;
};
