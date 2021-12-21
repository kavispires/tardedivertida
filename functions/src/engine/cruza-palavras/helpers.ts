// Interfaces
import { AllWords, ClueEntry, Deck, GridCell, NewScores, RankingEntry } from './types';
import { PlayerId, Players, Round } from '../../utils/types';
// Constants
import { WORDS_PER_PLAYER_COUNT, CRUZA_PALAVRAS_PHASES } from './constants';
// Utils
import * as gameUtils from '../../utils/game-utils';
import { SEPARATOR } from '../../utils/constants';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param pointsToVictory
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER } = CRUZA_PALAVRAS_PHASES;
  const order = [RULES, SETUP, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.current > 0 && round.current === round.total ? GAME_OVER : CLUE_WRITING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return CLUE_WRITING;
};

/**
 * Gets the correct number of word cards based on player count
 * @param words
 * @param playerCount
 * @returns
 */
export const buildDeck = (words: AllWords, playerCount: number): Deck => {
  return gameUtils.getRandomItems(Object.values(words), WORDS_PER_PLAYER_COUNT[playerCount]);
};

export const buildGrid = (
  words: Deck,
  playersClues: string[],
  wordsPerCoordinate: number,
  currentRound: number
): GridCell[] => {
  const playersCluesDeck = gameUtils.shuffle(playersClues);
  const currentDeck = currentRound === 4 ? playersCluesDeck : words;

  const x: Deck = [
    {
      id: '',
      text: '',
    },
  ];
  const y: Deck = [
    {
      id: '',
      text: '',
    },
  ];

  for (let i = 0; i < wordsPerCoordinate * 2; i++) {
    if (x.length <= wordsPerCoordinate) {
      x.push(currentDeck[i]);
    } else {
      y.push(currentDeck[i]);
    }
  }

  const cells: any[] = [];

  x.forEach((xObj, xIndex) => {
    y.forEach((yObj, yIndex) => {
      // If corner
      if (xIndex === 0 && yIndex === 0) {
        cells.push({
          index: cells.length,
          kind: 'x',
          text: '',
          available: false,
        });
      }

      // If y headers
      else if (xIndex === 0 && yIndex !== 0) {
        cells.push({
          index: cells.length,
          id: yObj.id ?? `_${yObj}`,
          kind: 'header',
          text: yObj.text ?? yObj,
          available: false,
        });
      }

      // If x headers
      else if (yIndex === 0 && xIndex !== 0) {
        cells.push({
          index: cells.length,
          id: xObj.id ?? `_${xObj}`,
          kind: 'header',
          text: xObj.text ?? xObj,
          available: false,
        });
      } else {
        cells.push({
          index: cells.length,
          kind: 'cell',
          text: '',
          available: true,
          x: xIndex,
          y: yIndex,
          xText: xObj.text ?? xObj,
          yText: yObj.text ?? yObj,
          writable: false,
          playerId: null,
        });
      }
    });
  });

  return cells;
};

// const parseCoordinates = (coord: string): number[] => coord.split(SEPARATOR).map(Number);

const writeCoordinates = (x: number, y: number): string => `${x}${SEPARATOR}${y}`;

/**
 *
 * @param coordinatesLength
 * @returns
 */
export const buildCoordinates = (coordinatesLength: number): string[] => {
  const availableCoordinates: string[] = [];
  for (let x = 0; x < coordinatesLength; x++) {
    for (let y = 0; y < coordinatesLength; y++) {
      availableCoordinates.push(writeCoordinates(x, y));
    }
  }
  return availableCoordinates;
};

/**
 * Distribute the available coordinates among players, returning a list of modified grid
 * @param players - this function modifies players
 * @param grid
 * @returns modified grid cell
 */
export const distributeCoordinates = (
  players: Players,
  grid: GridCell[],
  currentRound: number
): GridCell[] => {
  // Write previous clues
  if (currentRound !== 1 && currentRound !== 4) {
    Object.values(players).forEach((player) => {
      grid[player.coordinate].available = false;
      grid[player.coordinate].writable = false;
      grid[player.coordinate].text = player.clue;
    });
  }

  const available = grid.filter((entry: GridCell) => entry.available);
  const shuffledCoordinates = gameUtils.shuffle(available);

  Object.values(players).forEach((player) => {
    const cell = shuffledCoordinates.pop();
    // Add to player
    player.coordinate = cell.index;
    player.x = cell.x;
    player.y = cell.y;
    // update grid
    grid[cell.index].playerId = player.id;
    grid[cell.index].writable = true;
  });

  return grid;
};

/**
 * Get clues and coordinates of each player into an array
 * @param players
 * @returns
 */
export const getPlayerClues = (players: Players): ClueEntry[] => {
  return Object.values(players).map((player) => ({
    playerId: player.id,
    clue: player.clue,
    coordinate: player.coordinate,
  }));
};

/**
 * Build round ranking
 * @param players - it modifies players
 * @param gallery
 * @returns
 */
export const buildRanking = (players: Players, clues: ClueEntry[]) => {
  // Format <player>: [<old score>, <addition points>, <new score>]
  const newScores: NewScores = {};

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = {
      previousScore: player.score,
      gainedPoints: [0, 0, 0], // from guesses, from others, lost points
      newScore: player.score,
    };
  });

  const answers = clues.reduce((acc, entry) => {
    acc[entry.playerId] = entry.coordinate;
    return acc;
  }, {});

  const playerCount = Object.keys(players).length;

  const gotPassivePoints = {};

  // Collect points
  Object.values(players).map((player) => {
    Object.entries(player.guesses).forEach(([guessPlayerId, coordinate]) => {
      if (guessPlayerId === player.id) {
        return;
      }

      // Every correct guess gets 2 points
      if (answers[guessPlayerId] === coordinate) {
        newScores[player.id].gainedPoints[0] += 2;
        newScores[player.id].newScore += 2;

        // Every player guessing yours correctly gets 1 point
        newScores[guessPlayerId].gainedPoints[1] += 1;
        newScores[guessPlayerId].newScore += 1;
        gotPassivePoints[guessPlayerId] = true;
      } else if (Object.values(answers).includes(coordinate)) {
        // You still get 1 point if you voted the wrong match, but a correct coordinate
        newScores[player.id].gainedPoints[0] += 1;
        newScores[player.id].newScore += 1;
      }
    });
  });

  // 0 correct guesses on your clue gets minus player count in points
  const whoGotNoPoints: PlayerId[] = Object.keys(players).filter((playerId) => !gotPassivePoints[playerId]);
  whoGotNoPoints.forEach((playerId) => {
    newScores[playerId].gainedPoints[2] -= playerCount;
    newScores[playerId].newScore -= playerCount;
  });

  const ranking: RankingEntry[] = Object.entries(newScores)
    .map(([playerId, scores]) => {
      // Update player score
      players[playerId].score = scores.newScore;

      return {
        playerId,
        name: players[playerId].name,
        previousScore: scores.previousScore,
        gainedPoints: scores.gainedPoints,
        newScore: scores.newScore,
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  return {
    ranking,
    whoGotNoPoints,
  };
};
