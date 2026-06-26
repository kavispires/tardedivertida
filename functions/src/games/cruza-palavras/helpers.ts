import { shuffle } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { ClueEntry, CruzaPalavrasOptions, Deck, FirebaseStoreData, GridCell, PastClues } from './types';
// Constants
import { SEPARATOR } from '../../constants/general';
import { CRUZA_PALAVRAS_PHASES } from './constants';
// Mechanics
import { getListOfPlayers, getListOfPlayersIds, getPlayerCount } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game options
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param options - Optional game configuration options
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  options?: CruzaPalavrasOptions,
): string => {
  const { SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER } = CRUZA_PALAVRAS_PHASES;
  const order = [SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === SETUP) {
    return options?.gridType === 'imageCards' ? CLUE_WRITING : WORDS_SELECTION;
  }

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : CLUE_WRITING;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds a grid with coordinates from words or player clues
 * @param words - The deck of available words
 * @param playersClues - The array of clues submitted by players
 * @param wordsPerCoordinate - The number of words per coordinate axis
 * @param shouldUsePlayersClues - Whether to use player clues instead of words
 */
export const buildGrid = (
  words: Deck,
  playersClues: TextCardData[],
  wordsPerCoordinate: number,
  shouldUsePlayersClues: boolean,
): GridCell[] => {
  const playersCluesDeck = shuffle(playersClues);
  const currentDeck =
    shouldUsePlayersClues && playersCluesDeck.length >= wordsPerCoordinate * 2
      ? playersCluesDeck
      : shuffle(words);

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

  const cells: GridCell[] = [];

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
          id: `${xObj.id}${SEPARATOR}${yObj.id}`,
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

/**
 * Distribute the available coordinates among players, returning a list of modified grid
 * @param players - The collection of players in the game (this function modifies players)
 * @param grid - The game grid containing cells
 */
export const distributeCoordinates = (players: Players, grid: GridCell[]): GridCell[] => {
  const available = grid.filter((entry) => entry.available && !entry.playerId);
  const shuffledCoordinates = shuffle(available);

  const distribute = (player: Player, cell: GridCell) => {
    if (cell) {
      // Add to player
      player.coordinates.push({
        coordinate: cell.index,
        x: cell.x,
        y: cell.y,
        used: false,
      });

      // update grid
      grid[cell.index].playerId = player.id;
      grid[cell.index].writable = true;
    }
  };

  const listOfPlayers = getListOfPlayers(players);

  listOfPlayers.forEach((player) => {
    const cell = shuffledCoordinates.pop();
    if (cell) {
      distribute(player, cell);
    }
  });

  // If possible to give players a second card, do so
  if (shuffledCoordinates.length >= listOfPlayers.length) {
    listOfPlayers.forEach((player) => {
      if (player.coordinates.length < 2) {
        const cell = shuffledCoordinates.pop();
        if (cell) {
          distribute(player, cell);
        }
      }
    });
  }

  return grid;
};

/**
 * Update grid with players clues
 * @param players - The collection of players in the game
 * @param grid - The game grid containing cells
 */
export const updateGridWithPlayersClues = (players: Players, grid: GridCell[]): GridCell[] => {
  getListOfPlayers(players).forEach((player) => {
    (player.coordinates ?? []).forEach((coordinate) => {
      if (coordinate.used) {
        grid[coordinate.coordinate].available = false;
        grid[coordinate.coordinate].writable = false;
        grid[coordinate.coordinate].text = player.clue;
      }
    });
  });

  return grid;
};

/**
 * Gets clues and coordinates of each player into an array
 * @param players - The collection of players in the game
 */
export const getPlayerClues = (players: Players): ClueEntry[] => {
  return getListOfPlayers(players).map((player) => {
    const index = player.coordinates.findIndex(
      (coordinate) => coordinate.coordinate === player.currentClueCoordinate,
    );
    player.coordinates[index].used = true;
    const coordinate = player.coordinates[index].coordinate;

    return {
      playerId: player.id,
      clue: player.clue,
      coordinate,
    };
  });
};

/**
 * Builds round ranking by scoring player guesses and clues
 * @param players - The collection of players in the game
 * @param clues - The array of clue entries for the round
 * @param store - The Firebase store data for tracking achievements
 */
export const buildRanking = (players: Players, clues: ClueEntry[], store: FirebaseStoreData) => {
  // Gained Points: [from guesses, one coordinate right, from others, lost points]
  const scores = new Scores(players, [0, 0, 0, 0]);

  const answers = clues.reduce((acc, entry) => {
    acc[entry.playerId] = entry.coordinate;
    return acc;
  }, {});

  const playerCount = getPlayerCount(players);

  const gotPassivePoints: Record<UID, UID[]> = {};

  // Collect points
  getListOfPlayers(players).forEach((player) => {
    // Achievement: Chose randomly
    if (player.choseRandomly) {
      increaseAchievement(store.achievements, player.id, 'chooseForMe', 1);
    }

    Object.entries(player.guesses).forEach(([guessPlayerId, coordinate]) => {
      if (guessPlayerId === player.id) {
        return;
      }

      // Every correct guess gets 2 points
      if (answers[guessPlayerId] === coordinate) {
        scores.add(player.id, 2, 0);
        // Achievement: guesses
        increaseAchievement(store.achievements, player.id, 'guesses', 1);

        // Every player guessing yours correctly gets 1 point
        scores.add(guessPlayerId, 1, 2);
        // Achievement: clues
        increaseAchievement(store.achievements, guessPlayerId, 'clues', 1);

        if (gotPassivePoints[guessPlayerId] === undefined) {
          gotPassivePoints[guessPlayerId] = [];
        }
        gotPassivePoints[guessPlayerId].push(player.id);
      } else if (Object.values(answers).includes(coordinate)) {
        // You still get 1 point if you voted the wrong match, but a correct coordinate
        scores.add(guessPlayerId, 1, 0);
      }
    });
  });

  // 0 correct guesses on your clue gets minus player count in points
  const whoGotNoPoints: UID[] = getListOfPlayersIds(players).filter((playerId) => {
    if (gotPassivePoints[playerId] === undefined || gotPassivePoints[playerId].length === 0) {
      return true;
    }

    // Achievement: Savior
    if (gotPassivePoints[playerId].length === 1) {
      increaseAchievement(store.achievements, gotPassivePoints[playerId][0], 'savior', 1);
    }
    return false;
  });

  whoGotNoPoints.forEach((playerId) => {
    // Achievement: Bad clues
    increaseAchievement(store.achievements, playerId, 'badClues', 1);
    scores.subtract(playerId, playerCount, 3);
  });

  return {
    ranking: scores.rank(players),
    whoGotNoPoints,
  };
};

/**
 * Updates past clues dictionary with new clues from the current round
 * @param grid - The game grid containing cells
 * @param pastClues - The dictionary of past clues
 * @param clues - The array of new clue entries
 */
export const updatePastClues = (grid: GridCell[], pastClues: PastClues, clues: ClueEntry[]) => {
  clues.forEach(({ coordinate, clue }) => {
    const cell = grid[coordinate];
    if (cell && cell.kind === 'cell' && cell.id) {
      const [id1, id2] = cell.id.split(SEPARATOR);

      if (id1 && id1 !== 'undefined') {
        if (pastClues[id1] === undefined) {
          pastClues[id1] = [];
        }
        pastClues[id1].push(clue);
      }

      if (id2 && id2 !== 'undefined') {
        if (pastClues[id2] === undefined) {
          pastClues[id2] = [];
        }
        pastClues[id2].push(clue);
      }
    }
  });

  return pastClues;
};
